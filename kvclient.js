// Minimal Upstash Redis REST client.
// Works regardless of which env var names the Vercel/Upstash integration injected.
function creds() {
    const url =
        process.env.KV_REST_API_URL ||
        process.env.UPSTASH_REDIS_REST_URL ||
        process.env.STORAGE_KV_REST_API_URL ||
        process.env.REDIS_REST_API_URL;
    const token =
        process.env.KV_REST_API_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN ||
        process.env.STORAGE_KV_REST_API_TOKEN ||
        process.env.REDIS_REST_API_TOKEN;
    return { url, token };
}

function configured() {
    const { url, token } = creds();
    return !!(url && token);
}

// Names only (no values) of env vars that look storage-related — for debugging
function envHints() {
    return Object.keys(process.env).filter((k) => /KV|UPSTASH|REDIS|STORAGE/i.test(k));
}

async function cmd(args) {
    const { url, token } = creds();
    if (!url || !token) throw new Error('KV not configured');
    const r = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
    });
    const j = await r.json();
    if (j && j.error) throw new Error(j.error);
    return j ? j.result : null;
}

module.exports = {
    configured,
    envHints,
    async get(key) {
        const v = await cmd(['GET', key]);
        if (v === null || v === undefined) return null;
        try { return JSON.parse(v); } catch (_) { return v; }
    },
    async set(key, val) {
        return cmd(['SET', key, JSON.stringify(val)]);
    },
    async hset(key, field, val) {
        return cmd(['HSET', key, field, JSON.stringify(val)]);
    },
    async hgetall(key) {
        const arr = await cmd(['HGETALL', key]);
        const out = {};
        if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; i += 2) {
                try { out[arr[i]] = JSON.parse(arr[i + 1]); } catch (_) { out[arr[i]] = arr[i + 1]; }
            }
        }
        return out;
    },
    async hdel(key, field) {
        return cmd(['HDEL', key, field]);
    }
};
