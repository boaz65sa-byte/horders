// POST /api/subscribe
// Stores a browser's push subscription + its per-supplier order-day schedule.
const { kv } = require('@vercel/kv');
const crypto = require('crypto');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method not allowed' });
        return;
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { subscription, schedule } = body;

        if (!subscription || !subscription.endpoint) {
            res.status(400).json({ error: 'missing subscription' });
            return;
        }

        // Stable id per browser endpoint
        const id = crypto.createHash('sha256').update(subscription.endpoint).digest('hex').slice(0, 32);

        await kv.hset('subscriptions', {
            [id]: {
                subscription,
                schedule: Array.isArray(schedule) ? schedule : [],
                updatedAt: Date.now()
            }
        });

        res.status(200).json({ ok: true, id });
    } catch (e) {
        res.status(500).json({ error: String((e && e.message) || e) });
    }
};
