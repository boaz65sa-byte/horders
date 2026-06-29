// GET /api/cron/remind  — triggered daily by Vercel Cron (see vercel.json).
// Sends a push notification to every subscribed browser whose schedule
// marks today (Israel time) as an order day.
const kv = require('../../kvclient');
const webpush = require('web-push');

const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const SHORT_TO_NUM = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

module.exports = async (req, res) => {
    // Optional protection: if CRON_SECRET is set, require it.
    if (process.env.CRON_SECRET) {
        const auth = req.headers['authorization'] || '';
        if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
            res.status(401).end('unauthorized');
            return;
        }
    }

    if (!kv.configured()) {
        res.status(503).json({ error: 'KV not configured', envHints: kv.envHints() });
        return;
    }

    // VAPID keys: env vars take precedence; embedded defaults let push work out of the box.
    const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || 'BJHKK8cXG8aunkKsJe8KyjR4xbgFkWJDVWWfwkc2wSnF01iLk-wHDob9APbY1YMAdh4m1iNDx31d9ns3bpA6Qxo';
    const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || 'XugWRNtfVdbwwv3AUvjxGCtqD7R6cfaeyOtGs3OI3jI';

    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:boaz65sa@gmail.com',
        VAPID_PUBLIC,
        VAPID_PRIVATE
    );

    const short = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', weekday: 'short' }).format(new Date());
    const today = SHORT_TO_NUM[short];

    const all = (await kv.hgetall('subscriptions')) || {};
    let sent = 0, removed = 0, skipped = 0;

    for (const [id, rec] of Object.entries(all)) {
        const schedule = (rec && rec.schedule) || [];
        const due = schedule
            .filter((s) => Array.isArray(s.orderDays) && s.orderDays.includes(today))
            .map((s) => s.name);

        if (due.length === 0) { skipped++; continue; }

        const payload = JSON.stringify({
            title: '🔔 תזכורת הזמנות',
            body: `היום (יום ${DAY_NAMES[today]}) צריך להזמין מ: ${due.join(', ')}`
        });

        try {
            await webpush.sendNotification(rec.subscription, payload);
            sent++;
        } catch (err) {
            if (err && (err.statusCode === 404 || err.statusCode === 410)) {
                await kv.hdel('subscriptions', id);
                removed++;
            }
        }
    }

    res.status(200).json({ ok: true, today, dayName: DAY_NAMES[today], sent, removed, skipped, total: Object.keys(all).length });
};
