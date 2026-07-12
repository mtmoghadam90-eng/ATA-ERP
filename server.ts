import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";

// We need to import seed data. 
// Since esbuild bundles server.ts, we can import from src/seedData.ts
// Wait, we can't easily import from .ts dynamically without esbuild knowing. 
// But esbuild will statically resolve it!
import { 
  SEED_CUSTOMERS, SEED_PRODUCTS, SEED_PROJECTS, SEED_PROFORMAS, 
  SEED_SUPPLIERS, SEED_PURCHASE_ORDERS, SEED_TRANSACTIONS, 
  SEED_TASKS, DEFAULT_SETTINGS, SEED_EXCHANGE_RATES 
} from "./src/seedData";
// We need SEED_USERS and SEED_PROJECT_CATEGORY_GROUPS from useERPStore
import { SEED_USERS, SEED_PROJECT_CATEGORY_GROUPS } from "./src/useERPStore";

const db = new Database('database.sqlite');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const insertStmt = db.prepare('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)');
const getStmt = db.prepare('SELECT value FROM store WHERE key = ?');

// Seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM store').get() as {count: number};
if (count.count === 0) {
  console.log("Database is empty, seeding data...");
  
  const seedUsers = SEED_USERS.map(u => ({
    ...u,
    password: bcrypt.hashSync(u.password || '123', 10)
  }));

  const initialData = {
    'erp_settings': DEFAULT_SETTINGS,
    'erp_exchange_rates': SEED_EXCHANGE_RATES,
    'erp_customers': SEED_CUSTOMERS,
    'erp_products': SEED_PRODUCTS,
    'erp_suppliers': SEED_SUPPLIERS,
    'erp_projects': SEED_PROJECTS,
    'erp_proformas': SEED_PROFORMAS,
    'erp_purchase_orders': SEED_PURCHASE_ORDERS,
    'erp_transactions': SEED_TRANSACTIONS,
    'erp_tasks': SEED_TASKS,
    'erp_project_category_groups': SEED_PROJECT_CATEGORY_GROUPS,
    'erp_users': seedUsers,
    'erp_supplier_inquiries': [],
    'erp_packaging_deliveries': [],
    'erp_after_sales_services': []
  };

  const insertMany = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) {
      insertStmt.run(key, JSON.stringify(value));
    }
  });

  insertMany(initialData);
  console.log("Database seeded successfully.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  const UPLOADS_DIR = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Serve static files from uploads folder
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Parse JSON bodies
  app.use(express.json({ limit: "50mb" }));

  // Multer config for file upload
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 20 * 1024 * 1024 // 20 MB max overall limit
    }
  });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "فایلی بارگذاری نشده است." });
      }

      const { originalname, mimetype, buffer } = req.file;
      const ext = path.extname(originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}${ext}`;
      const targetPath = path.join(UPLOADS_DIR, uniqueName);

      if (mimetype.startsWith("image/")) {
        if (buffer.length > 10 * 1024 * 1024) {
          return res.status(400).json({ success: false, error: "حجم عکس نباید بیشتر از ۱۰ مگابایت باشد." });
        }

        let pipeline = sharp(buffer);
        const metadata = await pipeline.metadata();

        if (metadata.width && metadata.height && (metadata.width > 1200 || metadata.height > 1200)) {
          pipeline = pipeline.resize({
            width: metadata.width > metadata.height ? 1200 : undefined,
            height: metadata.height >= metadata.width ? 1200 : undefined,
            fit: "inside",
            withoutEnlargement: true
          });
        }

        if (metadata.format === "png") {
          pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
        } else {
          pipeline = pipeline.jpeg({ quality: 80, progressive: true });
        }

        await pipeline.toFile(targetPath);
      } else {
        if (buffer.length > 20 * 1024 * 1024) {
          return res.status(400).json({ success: false, error: "حجم فایل نباید بیشتر از ۲۰ مگابایت باشد." });
        }
        await fs.promises.writeFile(targetPath, buffer);
      }

      const fileUrl = `/uploads/${uniqueName}`;
      res.json({ success: true, url: fileUrl });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ success: false, error: "خطا در بارگذاری فایل در سرور" });
    }
  });

  // Existing rates API
  app.get("/api/rates", async (req, res) => {
    const fallbacks = {
      USD: 625000,
      EUR: 678000,
      AED: 171000,
      CNY: 86000
    };
    const urls = {
      USD: 'https://www.tgju.org/profile/price_dollar_rl',
      EUR: 'https://www.tgju.org/profile/price_eur',
      AED: 'https://www.tgju.org/profile/price_aed',
      CNY: 'https://www.tgju.org/profile/price_cny'
    };

    const rates: Record<string, number> = {};
    const failedCurrencies: string[] = [];

    await Promise.all(
      Object.entries(urls).map(async ([key, url]) => {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(10000)
          });
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          const html = await response.text();
          
          const regex = /data-col="info\.last_trade\.PDrCotVal"[^>]*>([\d,]+)<\/span>/;
          const match = html.match(regex);
          if (match && match[1]) {
            const val = parseInt(match[1].replace(/,/g, ''), 10);
            if (!isNaN(val) && val > 0) {
              rates[key] = val;
              return;
            }
          }
          
          const altRegex = /class="price"[^>]*>([\d,]+)<\/span>/;
          const altMatch = html.match(altRegex);
          if (altMatch && altMatch[1]) {
            const val = parseInt(altMatch[1].replace(/,/g, ''), 10);
            if (!isNaN(val) && val > 0) {
              rates[key] = val;
              return;
            }
          }
          throw new Error("Could not parse price from HTML");
        } catch (err: any) {
          console.warn(`Failed to fetch rate for ${key}:`, err.message || err);
          failedCurrencies.push(key);
        }
      })
    );

    res.json({
      success: true,
      rates,
      failedCurrencies,
      timestamp: new Date().toISOString()
    });
  });

  // KV Store APIs
  app.get("/api/data/:key", (req, res) => {
    const row = getStmt.get(req.params.key) as {value: string} | undefined;
    if (row) {
      res.json(JSON.parse(row.value));
    } else {
      res.json(null);
    }
  });

  app.post("/api/data/:key", (req, res) => {
    const key = req.params.key;
    let data = req.body;
    
    // If saving users, ensure passwords are hashed if they changed
    if (key === 'erp_users') {
      const existingRow = getStmt.get(key) as {value: string} | undefined;
      const existingUsers = existingRow ? JSON.parse(existingRow.value) : [];
      
      data = data.map((user: any) => {
        const existingUser = existingUsers.find((u: any) => u.id === user.id);
        // If password is new or changed (and not already a hash starting with $2b$), hash it
        if (user.password && !user.password.startsWith('$2b$')) {
          user.password = bcrypt.hashSync(user.password, 10);
        } else if (!user.password && existingUser) {
          user.password = existingUser.password;
        }
        return user;
      });
    }

    insertStmt.run(key, JSON.stringify(data));
    res.json({ success: true });
  });

  // Login API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const row = getStmt.get('erp_users') as {value: string} | undefined;
    if (!row) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    const users = JSON.parse(row.value);
    const foundUser = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());
    
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      // Don't send the password hash back to the client
      const { password: _, ...safeUser } = foundUser;
      res.json({ success: true, user: safeUser });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Vite middleware for development, serving index.html / dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
