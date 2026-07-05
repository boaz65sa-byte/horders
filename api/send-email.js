// POST /api/send-email — sends order emails via SMTP (Gmail etc.) or Resend.
//
// Option A — Gmail / SMTP (recommended for quick setup):
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_USER=your@gmail.com
//   SMTP_PASS=app-password   (Google → App passwords)
//   EMAIL_FROM=your@gmail.com
//
// Option B — Resend (requires verified domain for real recipients):
//   RESEND_API_KEY=re_...
//   EMAIL_FROM=orders@your-verified-domain.com

const PLACEHOLDER_DOMAINS = ['example.com', 'example.org', 'example.net', 'test.com', 'localhost', 'invalid'];

function parseBody(req) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function isPlaceholderEmail(email) {
    const domain = String(email || '').split('@')[1]?.toLowerCase();
    return !domain || PLACEHOLDER_DOMAINS.includes(domain);
}

function normalizeList(value) {
    if (!value) return [];
    const list = Array.isArray(value) ? value : [value];
    return list.map(v => String(v).trim()).filter(Boolean);
}

function getFromAddress() {
    const raw = (process.env.EMAIL_FROM || process.env.SMTP_USER || '').trim();
    if (!raw) return null;
    if (raw.includes('<')) return raw;
    return `מערכת הזמנות <${raw}>`;
}

function buildHtml(text) {
    const escaped = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222;white-space:pre-wrap">${escaped.replace(/\n/g, '<br>')}</div>`;
}

function emailProvider() {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp';
    if (process.env.RESEND_API_KEY) return 'resend';
    return null;
}

function resendSandboxBlocked(from, toList) {
    const fromAddr = String(from).toLowerCase();
    if (!fromAddr.includes('@resend.dev')) return null;
    return {
        error: 'כתובת השולח onboarding@resend.dev מיועדת לבדיקות בלבד — אי אפשר לשלוח לספקים אמיתיים. הגדר דומיין מאומת ב-Resend או השתמש ב-SMTP (Gmail).',
        hint: 'הוסף ב-Vercel: SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM — או אמת דומיין ב-resend.com/domains'
    };
}

async function sendViaSmtp({ from, to, bcc, subject, text, html, replyTo }) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const info = await transporter.sendMail({
        from,
        to: to.join(', '),
        bcc: bcc.length ? bcc.join(', ') : undefined,
        replyTo: replyTo || undefined,
        subject,
        text,
        html
    });

    return { id: info.messageId, provider: 'smtp' };
}

async function sendViaResend({ from, to, bcc, subject, text, html, replyTo }) {
    const payload = {
        from,
        to,
        subject,
        text,
        html
    };
    if (bcc.length) payload.bcc = bcc;
    if (replyTo) payload.reply_to = replyTo;

    const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
        const err = new Error(data.message || data.error || 'Resend send failed');
        err.status = r.status;
        err.details = data;
        throw err;
    }

    return { id: data.id, provider: 'resend' };
}

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const from = getFromAddress();
        const provider = emailProvider();
        res.status(200).json({
            ok: true,
            configured: !!provider,
            provider: provider || 'none',
            from: from || null,
            resendSandbox: !!(from && String(from).toLowerCase().includes('@resend.dev'))
        });
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method not allowed' });
        return;
    }

    const provider = emailProvider();
    if (!provider) {
        res.status(503).json({
            error: 'שירות המייל לא מוגדר בשרת',
            hint: 'הגדר SMTP (Gmail) או RESEND_API_KEY ב-Vercel → Environment Variables'
        });
        return;
    }

    try {
        const body = parseBody(req);
        const { to, cc, bcc, subject, text, replyTo, test } = body;

        const toList = normalizeList(to);
        const ccList = normalizeList(cc);
        const bccList = normalizeList(bcc);

        // CC goes to BCC so procurement gets a copy without exposing to supplier
        ccList.forEach(addr => {
            if (!toList.includes(addr) && !bccList.includes(addr)) bccList.push(addr);
        });

        if (!toList.length || !subject || !text) {
            res.status(400).json({ error: 'חסרים נמען, נושא או תוכן ההודעה' });
            return;
        }

        for (const addr of [...toList, ...bccList]) {
            if (!isValidEmail(addr)) {
                res.status(400).json({ error: `כתובת מייל לא תקינה: ${addr}` });
                return;
            }
        }

        if (!test) {
            for (const addr of toList) {
                if (isPlaceholderEmail(addr)) {
                    res.status(400).json({
                        error: `כתובת המייל של הספק (${addr}) היא כתובת דוגמה ולא מקבלת מיילים אמיתיים`,
                        hint: 'עדכן את מייל הספק בטאב "ספקים" לכתובת אמיתית'
                    });
                    return;
                }
            }
        }

        const from = getFromAddress();
        if (!from) {
            res.status(503).json({ error: 'חסר EMAIL_FROM בהגדרות השרת' });
            return;
        }

        const sandboxErr = resendSandboxBlocked(from, toList);
        if (sandboxErr && provider === 'resend') {
            res.status(403).json(sandboxErr);
            return;
        }

        const html = buildHtml(text);
        const cleanSubject = String(subject).replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();

        const sendOpts = {
            from,
            to: toList,
            bcc: bccList,
            subject: cleanSubject,
            text,
            html,
            replyTo: replyTo || process.env.EMAIL_REPLY_TO || process.env.SMTP_USER || undefined
        };

        const result = provider === 'smtp'
            ? await sendViaSmtp(sendOpts)
            : await sendViaResend(sendOpts);

        res.status(200).json({
            ok: true,
            id: result.id,
            provider: result.provider,
            to: toList,
            bcc: bccList.length ? bccList : undefined,
            test: !!test
        });
    } catch (e) {
        const status = e.status || 500;
        let message = String((e && e.message) || e);

        if (status === 403 || /verify a domain|resend\.dev/i.test(message)) {
            message = 'לא ניתן לשלוח לספקים עם כתובת השולח הנוכחית. אמת דומיין ב-Resend או הגדר SMTP (Gmail) ב-Vercel.';
        } else if (/auth|credentials|username and password/i.test(message)) {
            message = 'שגיאת התחברות לשרת המייל (SMTP). בדוק SMTP_USER ו-SMTP_PASS (סיסמת אפליקציה ב-Gmail).';
        }

        res.status(status >= 400 && status < 600 ? status : 500).json({
            error: message,
            details: e.details || undefined
        });
    }
};
