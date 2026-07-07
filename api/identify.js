// POST /api/identify — identify a grocery/kitchen product from a photo.
// Body: { image: "data:image/jpeg;base64,..." }
// Returns: { name, category } (Hebrew) — the client fuzzy-matches it against the product bank.
// Requires ANTHROPIC_API_KEY in Vercel env; returns 503 with a clear message when missing.
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
        const mediaType = match[1];
        const data = match[2];

        const client = new Anthropic();
        const response = await client.messages.create({
            model: 'claude-opus-4-8',
            max_tokens: 500,
            output_config: {
                format: {
                    type: 'json_schema',
                    schema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'שם המוצר בעברית, קצר ומדויק כפי שמופיע בקטלוג מטבח (למשל: עגבניות, חזה עוף, גבינה צהובה, קמח)' },
                            category: { type: 'string', description: 'קטגוריה בעברית: ירקות / פירות / בשר / דגים / חלב / גבינות / מאפים / יבשים / אחר' }
                        },
                        required: ['name', 'category'],
                        additionalProperties: false
                    }
                }
            },
            messages: [{
                role: 'user',
                content: [
                    { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
                    { type: 'text', text: 'זהה את מוצר המזון שבתמונה עבור מלאי מטבח מקצועי. החזר שם קצר בעברית וקטגוריה.' }
                ]
            }]
        });

        if (response.stop_reason === 'refusal') {
            res.status(422).json({ error: 'לא ניתן לזהות את התמונה' });
            return;
        }

        const text = (response.content || []).find(b => b.type === 'text');
        const result = JSON.parse(text.text);
        res.status(200).json({ name: result.name, category: result.category });
    } catch (e) {
        res.status(500).json({ error: String((e && e.message) || e) });
    }
};
