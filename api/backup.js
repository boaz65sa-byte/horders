// GET  /api/backup — full export of shared bank (download snapshot)
// POST /api/backup — save snapshot copy inside KV (backup:latest + backup:history:ISO)
const kv = require('../kvclient');
const { checkApiKey } = require('./auth');

const ARRAY_KEYS = ['products', 'suppliers', 'staff', 'users', 'pendingOrders', 'history', 'needs'];
const OBJECT_KEYS = ['approvalSettings'];

async function readAll() {
    const out = {};
    for (const k of ARRAY_KEYS) out[k] = (await kv.get('data:' + k)) || null;
    for (const k of OBJECT_KEYS) out[k] = (await kv.get('data:' + k)) || null;
    return out;
}

module.exports = async (req, res) => {
    if (!checkApiKey(req, res)) return;

    if (!kv.configured()) {
        res.status(503).json({ error: 'KV not configured', envHints: kv.envHints() });
        return;
    }

    try {
        if (req.method === 'GET') {
            const data = await readAll();
            const payload = {
                version: '3.2',
                timestamp: new Date().toISOString(),
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
            res.status(200).json(payload);
            return;
        }

        if (req.method === 'POST') {
            const data = await readAll();
            const ts = new Date().toISOString();
            const snapshot = { version: '3.2', timestamp: ts, data };
            await kv.set('backup:latest', snapshot);
            await kv.set('backup:history:' + ts.replace(/[:.]/g, '-'), snapshot);
            res.status(200).json({
                ok: true,
                timestamp: ts,
                counts: {
                    suppliers: Array.isArray(data.suppliers) ? data.suppliers.length : 0,
                    products: Array.isArray(data.products) ? data.products.length : 0
                }
            });
            return;
        }

        res.status(405).json({ error: 'method not allowed' });
    } catch (e) {
        res.status(500).json({ error: String((e && e.message) || e) });
    }
};
