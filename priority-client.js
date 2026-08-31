// Priority OData REST client (server-side only — credentials from env vars).
function config() {
    const serviceRoot = String(process.env.PRIORITY_SERVICE_ROOT || '').replace(/\/$/, '');
    const user = String(process.env.PRIORITY_API_USER || '').trim();
    const pass = String(process.env.PRIORITY_API_PASS || 'PAT').trim();
    return { serviceRoot, user, pass };
}

function configured() {
    const { serviceRoot, user, pass } = config();
    return !!(serviceRoot && user && pass);
}

function authHeader() {
    const { user, pass } = config();
    return 'Basic ' + Buffer.from(`${user}:${pass}`, 'utf8').toString('base64');
}

function extraHeaders() {
    const h = {};
    if (process.env.PRIORITY_APP_ID) h['X-App-Id'] = process.env.PRIORITY_APP_ID;
    if (process.env.PRIORITY_APP_KEY) h['X-App-Key'] = process.env.PRIORITY_APP_KEY;
    return h;
}

function buildUrl(path, query) {
    const { serviceRoot } = config();
    const cleanPath = String(path || '').replace(/^\//, '');
    const qs = query && Object.keys(query).length
        ? '?' + new URLSearchParams(query).toString()
        : '';
    return `${serviceRoot}/${cleanPath}${qs}`;
}

async function parseError(r, method, path) {
    const text = await r.text();
    let message = text;
    try {
        const j = JSON.parse(text);
        message = j.error?.message || j.error || j.FORM?.InterfaceErrors?.text || text;
    } catch (_) { /* keep text */ }
    const err = new Error(`Priority ${method} ${path} → ${r.status}: ${String(message).slice(0, 600)}`);
    err.status = r.status;
    throw err;
}

async function odataGet(path, query) {
    const url = buildUrl(path, query);
    const r = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: authHeader(),
            Accept: 'application/json',
            ...extraHeaders()
        }
    });
    if (!r.ok) await parseError(r, 'GET', path);
    return r.json();
}

async function odataPost(path, body) {
    const url = buildUrl(path);
    const r = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: authHeader(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...extraHeaders()
        },
        body: JSON.stringify(body || {})
    });
    if (!r.ok) await parseError(r, 'POST', path);
    const ct = r.headers.get('content-type') || '';
    if (ct.includes('application/json')) return r.json();
    return { ok: true };
}

function maskServiceRoot(root) {
    if (!root) return '';
    try {
        const u = new URL(root);
        return `${u.origin}/…/${u.pathname.split('/').pop() || ''}`;
    } catch (_) {
        return root.slice(0, 24) + '…';
    }
}

function rows(data) {
    if (!data) return [];
    if (Array.isArray(data.value)) return data.value;
    if (Array.isArray(data)) return data;
    return [];
}

module.exports = {
    configured,
    config,
    odataGet,
    odataPost,
    maskServiceRoot,
    rows
};
