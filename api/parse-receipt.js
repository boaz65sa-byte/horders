// POST /api/parse-receipt — extract supplier + line items from delivery note / order photo.
// Body: { image: "data:image/jpeg;base64,..." }
// Returns: { supplierName, documentType, items: [{ sku, name, quantity, unit }] }
const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method not allowed' });
        return;
    }
    if (!process.env.ANTHROPIC_API_KEY) {
        res.status(503).json({ error: 'AI not configured', hint: 'set ANTHROPIC_API_KEY in Vercel env' });
        return;
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const image = body.image || '';
        const match = image.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/);
        if (!match) {
            res.status(400).json({ error: 'missing or invalid image (expected data URL)' });
            return;
        }

        const client = new Anthropic();
        const response = await client.messages.create({
            model: 'claude-opus-4-8',
            max_tokens: 4000,
            output_config: {
                format: {
                    type: 'json_schema',
                    schema: {
                        type: 'object',
                        properties: {
                            supplierName: { type: 'string', description: 'שם הספק כפי שמופיע במסמך' },
                            documentType: {
                                type: 'string',
                                enum: ['receipt', 'delivery_note', 'order', 'invoice', 'other']
                            },
                            items: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        sku: { type: 'string', description: 'מק״ט / ברקוד / קוד פריט' },
                                        name: { type: 'string', description: 'שם הפריט בעברית' },
                                        quantity: { type: 'number', description: 'כמות שהתקבלה או שהוזמנה' },
                                        unit: { type: 'string', description: 'יחידת מידה: ק״ג, יחידה, ארגז, קרטון וכו׳' }
                                    },
                                    required: ['name', 'quantity'],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: ['supplierName', 'items'],
                        additionalProperties: false
                    }
                }
            },
            messages: [{
                role: 'user',
                content: [
                    { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } },
                    {
                        type: 'text',
                        text: 'זהו מסמך קבלה, תעודת משלוח או הזמנת ספק למטבח/מסעדה. חלץ את שם הספק ואת כל שורות הפריטים: מק״ט (אם יש), שם, כמות, יחידה. אם אין מק״ט — השאר sku ריק. כמות חייבת להיות מספר.'
                    }
                ]
            }]
        });

        if (response.stop_reason === 'refusal') {
            res.status(422).json({ error: 'לא ניתן לקרוא את המסמך' });
            return;
        }

        const text = (response.content || []).find(b => b.type === 'text');
        const result = JSON.parse(text.text);
        const items = (result.items || []).map((it) => ({
            sku: String(it.sku || '').trim(),
            name: String(it.name || '').trim(),
            quantity: Math.max(0, Number(it.quantity) || 0),
            unit: String(it.unit || 'יחידה').trim() || 'יחידה'
        })).filter((it) => it.name && it.quantity > 0);

        res.status(200).json({
            supplierName: String(result.supplierName || '').trim(),
            documentType: result.documentType || 'delivery_note',
            items
        });
    } catch (e) {
        res.status(500).json({ error: String((e && e.message) || e) });
    }
};
