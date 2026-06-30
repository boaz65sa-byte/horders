// /api/data — shared bank stored in Redis (Upstash/Vercel KV).
// GET  -> { products, suppliers, staff, pendingOrders, history }  (null per key if unset)
// POST -> any subset of those arrays; each provided array is saved.
const kv = require('../kvclient');

const ARRAY_KEYS = ['products', 'suppliers', 'staff', 'pendingOrders', 'history'];
const OBJECT_KEYS = ['approvalSettings']; // shared config objects (phones, procurement email)

module.exports = async (req, res) => {
    if (!kv.configured()) {
        res.status(503).json({ error: 'KV not configured', envHints: kv.envHints() });
        return;
    }

    try {
        if (req.method === 'GET') {
            const out = {};
            for (const k of ARRAY_KEYS) out[k] = (await kv.get('data:' + k)) || null;
            for (const k of OBJECT_KEYS) out[k] = (await kv.get('data:' + k)) || null;
            res.status(200).json(out);
            return;
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
            for (const k of ARRAY_KEYS) {
                if (Array.isArray(body[k])) await kv.set('data:' + k, body[k]);
            }
            for (const k of OBJECT_KEYS) {
                if (body[k] && typeof body[k] === 'object' && !Array.isArray(body[k])) {
                    await kv.set('data:' + k, body[k]);
                }
            }
            res.status(200).json({ ok: true });
            return;
        }

        res.status(405).json({ error: 'method not allowed' });
    } catch (e) {
        res.status(500).json({ error: String((e && e.message) || e) });
    }
};
