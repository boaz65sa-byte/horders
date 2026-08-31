// Shared API-key guard. When BANK_API_KEY is set in Vercel env, all protected
// endpoints require header: x-api-key: <same value>
// If BANK_API_KEY is unset, access remains open (backward compatible).

function extractKey(req) {
    const h = req.headers['x-api-key'] || req.headers['X-Api-Key'];
    if (h) return String(h).trim();
    const auth = req.headers['authorization'] || req.headers['Authorization'] || '';
    const m = String(auth).match(/^Bearer\s+(.+)$/i);
    return m ? m[1].trim() : '';
}

function isApiKeyRequired() {
    return !!String(process.env.BANK_API_KEY || '').trim();
}

function checkApiKey(req, res) {
    const expected = String(process.env.BANK_API_KEY || '').trim();
    if (!expected) return true;
    const provided = extractKey(req);
    if (provided && provided === expected) return true;
    res.status(401).json({
        error: 'unauthorized',
        hint: 'Provide header x-api-key matching BANK_API_KEY in Vercel env'
    });
    return false;
}

module.exports = { checkApiKey, isApiKeyRequired, extractKey };
