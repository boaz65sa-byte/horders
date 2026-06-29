// /api/data — shared product/supplier bank stored in Vercel KV.
// GET  -> { products, suppliers } (null if not seeded yet)
// POST -> { products?, suppliers? }  saves whichever arrays are provided
const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const products = await kv.get('data:products');
            const suppliers = await kv.get('data:suppliers');
            res.status(200).json({ products: products || null, suppliers: suppliers || null });
            return;
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
            if (Array.isArray(body.products)) await kv.set('data:products', body.products);
            if (Array.isArray(body.suppliers)) await kv.set('data:suppliers', body.suppliers);
            res.status(200).json({ ok: true });
            return;
        }

        res.status(405).json({ error: 'method not allowed' });
    } catch (e) {
        res.status(500).json({ error: String((e && e.message) || e) });
    }
};
