import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json());

  // API to fetch currency rates from tgju.com / tgju.org
  app.get("/api/rates", async (req, res) => {
    const fallbacks = {
      USD: 625000,
      EUR: 678000,
      AED: 171000
    };

    const urls = {
      USD: 'https://www.tgju.org/profile/price_dollar_rl',
      EUR: 'https://www.tgju.org/profile/price_eur',
      AED: 'https://www.tgju.org/profile/price_aed'
    };

    const rates: Record<string, number> = {};

    await Promise.all(
      Object.entries(urls).map(async ([key, url]) => {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(2000) // 2s timeout to prevent hanging
          });
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          const html = await response.text();
          
          // Primary precise regex targeting the TGJU trade value span
          const regex = /data-col="info\.last_trade\.PDrCotVal"[^>]*>([\d,]+)<\/span>/;
          const match = html.match(regex);
          if (match && match[1]) {
            const val = parseInt(match[1].replace(/,/g, ''), 10);
            if (!isNaN(val) && val > 0) {
              rates[key] = val;
              return;
            }
          }
          
          // Secondary fallback regex matching price classes
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
          rates[key] = fallbacks[key as keyof typeof fallbacks];
        }
      })
    );

    res.json({
      success: true,
      rates,
      timestamp: new Date().toISOString()
    });
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
