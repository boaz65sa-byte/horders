const priority = require('../../priority-client');

const ORDERS_FORM = process.env.PRIORITY_ORDERS_FORM || 'PORDERS';
const LINES_SUBFORM = process.env.PRIORITY_ORDER_LINES_SUBFORM || 'PORDERITEMS_SUBFORM';

function parseBody(req) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
}

function formatDueDate(deliveryDate) {
    if (!deliveryDate) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    }
    return String(deliveryDate).slice(0, 10);
}

function resolvePartName(item) {
    return String(
        item.priorityPartName || item.sku || item.PARTNAME || ''
    ).trim();
}

function resolveSupname(supplier) {
    return String(
        supplier.prioritySupname || supplier.SUPNAME || supplier.supname || ''
    ).trim();
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method not allowed' });
        return;
    }
    if (!priority.configured()) {
        res.status(503).json({
            error: 'Priority לא מוגדר בשרת',
            hint: 'PRIORITY_SERVICE_ROOT, PRIORITY_API_USER, PRIORITY_API_PASS ב-Vercel'
        });
        return;
    }

    try {
        const body = parseBody(req);
        const supplier = body.supplier || {};
        const items = Array.isArray(body.items) ? body.items : [];
        const supname = resolveSupname(supplier);

        if (!supname) {
            res.status(400).json({
                error: 'לספק אין קוד Priority (prioritySupname). הרץ סנכרון מ-Priority או עדכן ידנית.',
                hint: 'הרץ "סנכרן מ-Priority" בהגדרות'
            });
            return;
        }

        const lines = [];
        const skipped = [];
        items.forEach((item) => {
            const qty = Number(item.quantity);
            if (!qty || qty <= 0) return;
            const partname = resolvePartName(item);
            if (!partname) {
                skipped.push({ product: item.product || item.name, reason: 'חסר מק״ט Priority' });
                return;
            }
            const line = {
                PARTNAME: partname,
                TQUANT: qty
            };
            const unit = String(item.unit || '').trim();
            if (unit) line.UNITNAME = unit;
            lines.push(line);
        });

        if (!lines.length) {
            res.status(400).json({
                error: 'אין שורות עם מק״ט Priority תקין',
                skipped
            });
            return;
        }

        const payload = {
            SUPNAME: supname,
            DUEDATE: formatDueDate(body.deliveryDate),
            PORDERITEMS_SUBFORM: lines
        };

        const details = String(body.note || body.message || '').trim();
        if (details) payload.DETAILS = details.slice(0, 500);

        const created = await priority.odataPost(ORDERS_FORM, payload);

        res.status(200).json({
            ok: true,
            supname,
            lineCount: lines.length,
            skipped,
            priority: created
        });
    } catch (e) {
        res.status(e.status && e.status >= 400 ? e.status : 500).json({
            error: String(e.message || e),
            hint: 'ודא שטופס PORDERS פתוח ל-API ושמק״טים קיימים ב-Priority'
        });
    }
};
