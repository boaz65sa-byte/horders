// Pull live shared bank from production and save a timestamped snapshot locally.
// Usage: node scripts/save-live-backup.js [url]
const fs = require('fs');
const path = require('path');

const SOURCE = process.argv[2] || 'https://horders.vercel.app/api/data';
const OUT_DIR = path.join(__dirname, '..', 'snapshots');

async function main() {
    const headers = {};
    const apiKey = process.env.BANK_API_KEY || '';
    if (apiKey) headers['x-api-key'] = apiKey;
    const r = await fetch(SOURCE, { headers });
    if (!r.ok) {
        console.error('Fetch failed:', r.status, await r.text());
        process.exit(1);
    }
    const data = await r.json();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const payload = {
        version: '3.2',
        timestamp: new Date().toISOString(),
        source: SOURCE,
        counts: {
            suppliers: Array.isArray(data.suppliers) ? data.suppliers.length : 0,
            products: Array.isArray(data.products) ? data.products.length : 0,
            history: Array.isArray(data.history) ? data.history.length : 0,
            pendingOrders: Array.isArray(data.pendingOrders) ? data.pendingOrders.length : 0,
            users: Array.isArray(data.users) ? data.users.length : 0,
            needs: Array.isArray(data.needs) ? data.needs.length : 0
        },
        data
    };
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const file = path.join(OUT_DIR, `live-backup-${stamp}.json`);
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
    console.log('Saved:', file);
    console.log('Counts:', payload.counts);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
