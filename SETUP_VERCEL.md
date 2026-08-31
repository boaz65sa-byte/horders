# הגדרת Vercel — מדריך מהיר

## שלב 1: משתני סביבה חובה

1. היכנס ל-[Vercel Dashboard](https://vercel.com) → הפרויקט `horders` → **Settings** → **Environment Variables**
2. הוסף את המשתנים מ-`.env.example`

### מינימום לסנכרון בין מכשירים
| משתנה | מאיפה |
|--------|--------|
| `KV_REST_API_URL` | Vercel → Storage → KV → Connect |
| `KV_REST_API_TOKEN` | אותו מקום |

### אבטחה (מומלץ מאוד)
| משתנה | ערך |
|--------|-----|
| `BANK_API_KEY` | מחרוזת אקראית ארוכה (לדוגמה `openssl rand -hex 32`) |

אחרי הגדרה:
1. פרוס מחדש (Redeploy)
2. באפליקציה: **הגדרות** → **אבטחה** → הזן את אותו מפתח → **שמור**

### מייל לספקים
| משתנה | דוגמה (Gmail) |
|--------|----------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your@gmail.com` |
| `SMTP_PASS` | סיסמת אפליקציה מ-Google |
| `EMAIL_FROM` | `your@gmail.com` |

**חשוב:** עדכן מיילים אמיתיים לכל ספק בטאב **ספקים** (לא `@example.com`).

### AI (סריקת מוצרים / קבלות)
| משתנה | ערך |
|--------|-----|
| `ANTHROPIC_API_KEY` | מפתח מ-console.anthropic.com |

### Priority (כשתהיה מוכן)
| משתנה | ערך |
|--------|-----|
| `PRIORITY_SERVICE_ROOT` | כתובת OData של Priority |
| `PRIORITY_API_USER` | משתמש API |
| `PRIORITY_API_PASS` | סיסמה |

---

## שלב 2: בדיקה

1. **הגדרות** → בדוק סטטוס מערכת (סנכרון, מייל, AI)
2. **הגדרות** → **שלח מייל בדיקה**
3. פתח מהטלפון — ודא שהנתונים מסתנכרנים

---

## גיבוי ושחזור

- **הורד גיבוי מלא** — שומר JSON למחשב
- **שחזור מגיבוי** — מייבא JSON (רק שף)
- **שמור גיבוי בשרת** — snapshot ב-KV

מומלץ לגבות לפני שינויים גדולים.
