const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
db.prepare("UPDATE store SET key = 'erp_exchange_rates' WHERE key = 'erp_rates'").run();
console.log("Renamed key successfully.");
