# הפעלת התראות Push אמיתיות (גם כשהאפליקציה סגורה)

הקוד כבר מוכן ומותקן. כדי שהתזכורת היומית תישלח לטלפון **גם כשהאפליקציה סגורה**,
צריך להשלים 3 שלבים חד-פעמיים בלוח הבקרה של Vercel. עד שתעשה אותם — האפליקציה
עובדת רגיל, והתזכורת מופיעה כשפותחים אותה (באנר + התראה).

## איך זה עובד
1. בדפדפן/טלפון: לחיצה על **"🔔 הפעל התראות"** רושמת את המכשיר (Service Worker + מנוי Push)
   ושולחת לשרת את לוח ימי ההזמנה של הספקים (`/api/subscribe` → נשמר ב-Vercel KV).
2. כל יום ב-07:00 (שעון ישראל) ה-Cron של Vercel מריץ את `/api/cron/remind`, בודק לאילו
   ספקים היום הוא יום הזמנה, ושולח Push לכל המכשירים הרשומים — גם אם האפליקציה סגורה.

## שלב 1 — ליצור מאגר KV (לאחסון המנויים)
ב-Vercel: **Storage → Create Database → KV (Upstash Redis) → Connect to project `horders`**.
החיבור מזריק אוטומטית את משתני הסביבה `KV_REST_API_URL` ו-`KV_REST_API_TOKEN`.
> אם האינטגרציה החדשה מזריקה שמות אחרים (למשל `UPSTASH_REDIS_REST_URL`), הוסף ידנית
> את שני המשתנים בשמות `KV_REST_API_URL` / `KV_REST_API_TOKEN` עם אותם ערכים.

## שלב 2 — להוסיף את מפתחות ה-VAPID
ב-Vercel: **Settings → Environment Variables**, הוסף (לכל הסביבות):

| שם | ערך |
|---|---|
| `VAPID_PUBLIC_KEY` | `BJHKK8cXG8aunkKsJe8KyjR4xbgFkWJDVWWfwkc2wSnF01iLk-wHDob9APbY1YMAdh4m1iNDx31d9ns3bpA6Qxo` |
| `VAPID_PRIVATE_KEY` | `XugWRNtfVdbwwv3AUvjxGCtqD7R6cfaeyOtGs3OI3jI` |
| `VAPID_SUBJECT` | `mailto:boaz65sa@gmail.com` |

> המפתח הציבורי כבר מוטמע ב-`app.js` (זה תקין — הוא ציבורי). המפתח הפרטי חייב להישאר
> רק כאן ב-Vercel ולא להתפרסם בשום מקום אחר.

## שלב 3 — לפרסם מחדש
כל `git push` מפרסם אוטומטית. אחרי שהוספת KV + משתני הסביבה, עשה Redeploy
(או דחוף שינוי קטן) כדי שהם ייכנסו לתוקף.

## בדיקה
- היכנס ל-`https://horders.vercel.app` בטלפון → "🔔 הפעל התראות" → אשר.
- בדיקה ידנית של ה-Cron: פתח `https://horders.vercel.app/api/cron/remind` (אם הגדרת
  `CRON_SECRET` תצטרך כותרת Authorization) — אמור להחזיר JSON עם `sent`/`skipped`.

## הערות
- **Cron בתוכנית Hobby** רץ פעם ביום — מתאים לתזכורת היומית.
- אם תרצה לאבטח את ה-Cron, הוסף משתנה `CRON_SECRET`; הקוד יאכוף אותו אוטומטית.
- חסר קובץ אייקון `icon-192.png`? ההתראה עדיין תעבוד, פשוט בלי אייקון מותאם.
