const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
const row = db.prepare("SELECT value FROM store WHERE key = 'erp_rates'").get();
if (row) {
    db.prepare("INSERT OR REPLACE INTO store (key, value) VALUES ('erp_exchange_rates', ?)").run(row.value);
    db.prepare("DELETE FROM store WHERE key = 'erp_rates'").run();
    console.log("Migrated erp_rates to erp_exchange_rates");
} else {
    console.log("No erp_rates found");
}
