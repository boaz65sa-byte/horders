const priority = require('../../priority-client');
const { checkApiKey } = require('../auth');

const SUPPLIER_FORM = process.env.PRIORITY_SUPPLIERS_FORM || 'SUPPLIERS';
const PARTS_FORM = process.env.PRIORITY_PARTS_FORM || 'LOGPART';
const SYNC_TOP = String(process.env.PRIORITY_SYNC_TOP || '500');

function mapSupplier(row) {
    const supname = String(row.SUPNAME || row.SUPNUM || '').trim();
    if (!supname) return null;
    return {
        prioritySupname: supname,
        name: String(row.SUPDES || row.SUPNAME || supname).trim(),
        email: String(row.EMAIL || row.EMAILA || '').trim(),
        phone: String(row.PHONE || row.CELLPHONE || '').trim(),
        category: String(row.SUPTYPECODE || row.SUPTYPE || 'ספק').trim()
    };
}

function mapPart(row) {
    const partname = String(row.PARTNAME || row.PART || '').trim();
    if (!partname) return null;
    const inactive = String(row.STATDES || row.INACTIVE || '').trim();
    if (/לא פעיל|inactive|לא בשימוש/i.test(inactive)) return null;
    return {
        priorityPartName: partname,
        sku: partname,
        name: String(row.PARTDES || row.PARTNAME || partname).trim(),
        unit: String(row.UNITNAME || row.UNIT || 'יחידה').trim(),
        price: Number(row.PRICE || row.COST || 0) || 0
    };
}

module.exports = async (req, res) => {
    if (!checkApiKey(req, res)) return;
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
        const [supData, partData] = await Promise.all([
            priority.odataGet(SUPPLIER_FORM, {
                $top: SYNC_TOP,
                $select: 'SUPNAME,SUPDES,EMAIL,PHONE'
            }),
            priority.odataGet(PARTS_FORM, {
                $top: SYNC_TOP,
                $select: 'PARTNAME,PARTDES,STATDES,UNITNAME'
            })
        ]);

        const suppliers = priority.rows(supData).map(mapSupplier).filter(Boolean);
        const products = priority.rows(partData).map(mapPart).filter(Boolean);

        res.status(200).json({
            ok: true,
            syncedAt: new Date().toISOString(),
            suppliers,
            products,
            counts: { suppliers: suppliers.length, products: products.length }
        });
    } catch (e) {
        res.status(e.status && e.status >= 400 ? e.status : 500).json({
            error: String(e.message || e),
            hint: 'ודא שטפסי SUPPLIERS ו-LOGPART פתוחים ל-API ב-Priority'
        });
    }
};
