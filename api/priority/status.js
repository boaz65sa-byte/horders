const priority = require('../../priority-client');
const { checkApiKey } = require('../auth');

module.exports = async (req, res) => {
    if (!checkApiKey(req, res)) return;
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'method not allowed' });
        return;
    }

    const { serviceRoot } = priority.config();
    if (!priority.configured()) {
        res.status(200).json({
            configured: false,
            connectionOk: false,
            serviceRootPreview: '',
            hint: 'הגדר ב-Vercel: PRIORITY_SERVICE_ROOT, PRIORITY_API_USER, PRIORITY_API_PASS'
        });
        return;
    }

    try {
        await priority.odataGet('SUPPLIERS', { $top: '1', $select: 'SUPNAME' });
        res.status(200).json({
            configured: true,
            connectionOk: true,
            serviceRootPreview: priority.maskServiceRoot(serviceRoot)
        });
    } catch (e) {
        res.status(200).json({
            configured: true,
            connectionOk: false,
            serviceRootPreview: priority.maskServiceRoot(serviceRoot),
            error: String(e.message || e)
        });
    }
};
