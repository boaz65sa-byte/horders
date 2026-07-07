// ===========================
// Web Push config
// ===========================
// Public VAPID key (safe to expose). The matching private key lives only in
// the Vercel env var VAPID_PRIVATE_KEY. Real closed-app push also requires a
// Vercel KV store — see SETUP_PUSH.md. If push isn't configured yet, the app
// still works and falls back to the in-app reminder banner.
const VAPID_PUBLIC_KEY = 'BJHKK8cXG8aunkKsJe8KyjR4xbgFkWJDVWWfwkc2wSnF01iLk-wHDob9APbY1YMAdh4m1iNDx31d9ns3bpA6Qxo';

// ===========================
// Product catalog (single source of truth for default products + images)
// ===========================
// md  = clean TheMealDB ingredient image (verified). en = loremflickr keyword (fallback).
// kw  = Hebrew root used to auto-match images for typed/imported product names.
// sup = supplier id (1 ירקות/פירות · 2 בשר/עוף/דגים · 3 ביצים · 4 תנובה · 5 גבינות גד · 9 מאפים).
function lfImage(keyword) {
    let lock = 0;
    for (let i = 0; i < keyword.length; i++) lock = (lock * 31 + keyword.charCodeAt(i)) >>> 0;
    return 'https://loremflickr.com/320/240/' + encodeURIComponent(keyword) + '?lock=' + (lock % 100000);
}
function catalogImage(entry) {
    if (!entry) return '';
    return entry.md
        ? 'https://www.themealdb.com/images/ingredients/' + encodeURIComponent(entry.md) + '-Small.png'
        : lfImage(entry.en || entry.he);
}

const PRODUCT_CATALOG = [
    // ---- ירקות (sup 1) ----
    { he: 'עגבניות', kw: 'עגבני', md: 'Tomato', sup: '1', price: 10, unit: 'ק״ג' },
    { he: 'עגבניות שרי', kw: 'שרי', en: 'cherry tomato', sup: '1', price: 14, unit: 'ק״ג' },
    { he: 'מלפפונים', kw: 'מלפפ', md: 'Cucumber', sup: '1', price: 9, unit: 'ק״ג' },
    { he: 'חסה', kw: 'חסה', md: 'Lettuce', sup: '1', price: 8, unit: 'יחידה' },
    { he: 'בצל', kw: 'בצל', md: 'Onion', sup: '1', price: 6, unit: 'ק״ג' },
    { he: 'בצל סגול', kw: 'בצל סגול', md: 'Red Onion', sup: '1', price: 8, unit: 'ק״ג' },
    { he: 'בצל ירוק', kw: 'בצל ירוק', md: 'Spring Onions', sup: '1', price: 5, unit: 'יחידה' },
    { he: 'שום', kw: 'שום', md: 'Garlic', sup: '1', price: 25, unit: 'ק״ג' },
    { he: 'גזר', kw: 'גזר', md: 'Carrots', sup: '1', price: 6, unit: 'ק״ג' },
    { he: 'תפוחי אדמה', kw: 'תפוחי אדמ', md: 'Potatoes', sup: '1', price: 5, unit: 'ק״ג' },
    { he: 'בטטה', kw: 'בטטה', en: 'sweet potato', sup: '1', price: 9, unit: 'ק״ג' },
    { he: 'פלפל אדום', kw: 'פלפל אדום', md: 'Red Pepper', sup: '1', price: 12, unit: 'ק״ג' },
    { he: 'פלפל ירוק', kw: 'פלפל ירוק', md: 'Green Pepper', sup: '1', price: 11, unit: 'ק״ג' },
    { he: 'פלפל צהוב', kw: 'פלפל צהוב', en: 'yellow bell pepper', sup: '1', price: 13, unit: 'ק״ג' },
    { he: 'חציל', kw: 'חציל', md: 'Aubergine', sup: '1', price: 7, unit: 'ק״ג' },
    { he: 'קישוא', kw: 'קישוא', md: 'Courgettes', sup: '1', price: 7, unit: 'ק״ג' },
    { he: 'כרוב', kw: 'כרוב', md: 'Cabbage', sup: '1', price: 5, unit: 'ק״ג' },
    { he: 'כרובית', kw: 'כרובית', en: 'cauliflower', sup: '1', price: 8, unit: 'ק״ג' },
    { he: 'ברוקולי', kw: 'ברוקולי', md: 'Broccoli', sup: '1', price: 12, unit: 'ק״ג' },
    { he: 'תירס', kw: 'תירס', md: 'Sweetcorn', sup: '1', price: 6, unit: 'יחידה' },
    { he: 'אפונה', kw: 'אפונה', md: 'Peas', sup: '1', price: 10, unit: 'ק״ג' },
    { he: 'שעועית ירוקה', kw: 'שעועית', md: 'Green Beans', sup: '1', price: 12, unit: 'ק״ג' },
    { he: 'פטריות', kw: 'פטריות', md: 'Mushrooms', sup: '1', price: 18, unit: 'ק״ג' },
    { he: 'סלק', kw: 'סלק', md: 'Beetroot', sup: '1', price: 6, unit: 'ק״ג' },
    { he: 'צנון', kw: 'צנון', md: 'Radish', sup: '1', price: 7, unit: 'יחידה' },
    { he: 'דלעת', kw: 'דלעת', md: 'Pumpkin', sup: '1', price: 6, unit: 'ק״ג' },
    { he: 'תרד', kw: 'תרד', md: 'Spinach', sup: '1', price: 10, unit: 'יחידה' },
    { he: 'פטרוזיליה', kw: 'פטרוז', md: 'Parsley', sup: '1', price: 3, unit: 'יחידה' },
    { he: 'כוסברה', kw: 'כוסבר', md: 'Coriander', sup: '1', price: 3, unit: 'יחידה' },
    { he: 'שמיר', kw: 'שמיר', md: 'Dill', sup: '1', price: 3, unit: 'יחידה' },
    { he: 'סלרי', kw: 'סלרי', md: 'Celery', sup: '1', price: 7, unit: 'יחידה' },
    { he: 'במיה', kw: 'במיה', en: 'okra', sup: '1', price: 16, unit: 'ק״ג' },
    { he: 'קולורבי', kw: 'קולורבי', en: 'kohlrabi', sup: '1', price: 7, unit: 'ק״ג' },
    { he: 'לימון', kw: 'לימון', md: 'Lemon', sup: '1', price: 9, unit: 'ק״ג' },
    // ---- פירות (sup 1) ----
    { he: 'תפוחים', kw: 'תפוח', md: 'Apple', sup: '1', price: 9, unit: 'ק״ג' },
    { he: 'בננות', kw: 'בננ', md: 'Banana', sup: '1', price: 8, unit: 'ק״ג' },
    { he: 'תפוזים', kw: 'תפוז', md: 'Orange', sup: '1', price: 7, unit: 'ק״ג' },
    { he: 'אגסים', kw: 'אגס', en: 'pear', sup: '1', price: 10, unit: 'ק״ג' },
    { he: 'ענבים', kw: 'ענב', en: 'grapes', sup: '1', price: 14, unit: 'ק״ג' },
    { he: 'אבטיח', kw: 'אבטיח', en: 'watermelon', sup: '1', price: 4, unit: 'ק״ג' },
    { he: 'מלון', kw: 'מלון', en: 'cantaloupe melon', sup: '1', price: 6, unit: 'ק״ג' },
    { he: 'תות שדה', kw: 'תות', md: 'Strawberries', sup: '1', price: 18, unit: 'ק״ג' },
    { he: 'אפרסקים', kw: 'אפרסק', en: 'peach', sup: '1', price: 12, unit: 'ק״ג' },
    { he: 'נקטרינות', kw: 'נקטר', en: 'nectarine', sup: '1', price: 12, unit: 'ק״ג' },
    { he: 'שזיפים', kw: 'שזיף', en: 'plum', sup: '1', price: 11, unit: 'ק״ג' },
    { he: 'משמש', kw: 'משמש', md: 'Apricot', sup: '1', price: 13, unit: 'ק״ג' },
    { he: 'קיווי', kw: 'קיווי', md: 'Kiwi', sup: '1', price: 14, unit: 'ק״ג' },
    { he: 'מנגו', kw: 'מנגו', md: 'Mango', sup: '1', price: 15, unit: 'ק״ג' },
    { he: 'אבוקדו', kw: 'אבוקדו', md: 'Avocado', sup: '1', price: 16, unit: 'ק״ג' },
    { he: 'אננס', kw: 'אננס', md: 'Pineapple', sup: '1', price: 12, unit: 'יחידה' },
    { he: 'רימונים', kw: 'רימון', md: 'Pomegranate', sup: '1', price: 13, unit: 'ק״ג' },
    { he: 'אשכוליות', kw: 'אשכול', md: 'Grapefruit', sup: '1', price: 7, unit: 'ק״ג' },
    { he: 'קלמנטינות', kw: 'קלמנט', en: 'mandarin orange', sup: '1', price: 8, unit: 'ק״ג' },
    { he: 'דובדבנים', kw: 'דובדבן', en: 'cherries', sup: '1', price: 30, unit: 'ק״ג' },
    { he: 'תאנים', kw: 'תאנ', en: 'fig fruit', sup: '1', price: 20, unit: 'ק״ג' },
    { he: 'תמרים', kw: 'תמר', en: 'dates fruit', sup: '1', price: 25, unit: 'ק״ג' },
    // ---- בשר / עוף / דגים (sup 2) ----
    { he: 'עוף שלם', kw: 'עוף', md: 'Chicken', sup: '2', price: 18, unit: 'ק״ג' },
    { he: 'חזה עוף', kw: 'חזה עוף', md: 'Chicken Breast', sup: '2', price: 35, unit: 'ק״ג' },
    { he: 'שוקיים עוף', kw: 'שוק', md: 'Chicken Thighs', sup: '2', price: 20, unit: 'ק״ג' },
    { he: 'כנפי עוף', kw: 'כנפ', md: 'Chicken Wings', sup: '2', price: 16, unit: 'ק״ג' },
    { he: 'פרגיות', kw: 'פרגי', en: 'chicken thigh meat', sup: '2', price: 28, unit: 'ק״ג' },
    { he: 'בשר טחון', kw: 'טחון', md: 'Minced Beef', sup: '2', price: 42, unit: 'ק״ג' },
    { he: 'אנטריקוט', kw: 'אנטריק', en: 'ribeye steak', sup: '2', price: 120, unit: 'ק״ג' },
    { he: 'סטייק', kw: 'סטייק', en: 'beef steak', sup: '2', price: 90, unit: 'ק״ג' },
    { he: 'צלעות בקר', kw: 'צלעות', en: 'beef ribs', sup: '2', price: 60, unit: 'ק״ג' },
    { he: 'בשר כבש', kw: 'כבש', md: 'Lamb', sup: '2', price: 90, unit: 'ק״ג' },
    { he: 'הודו', kw: 'הודו', md: 'Turkey', sup: '2', price: 30, unit: 'ק״ג' },
    { he: 'כבד עוף', kw: 'כבד', en: 'chicken liver', sup: '2', price: 15, unit: 'ק״ג' },
    { he: 'נקניקיות', kw: 'נקניק', md: 'Sausages', sup: '2', price: 28, unit: 'ק״ג' },
    { he: 'דגי סלמון', kw: 'סלמון', md: 'Salmon', sup: '2', price: 70, unit: 'ק״ג' },
    { he: 'טונה', kw: 'טונה', md: 'Tuna', sup: '2', price: 65, unit: 'ק״ג' },
    { he: 'דניס', kw: 'דניס', en: 'sea bream fish', sup: '2', price: 45, unit: 'ק״ג' },
    { he: 'מושט', kw: 'מושט', en: 'tilapia fish', sup: '2', price: 35, unit: 'ק״ג' },
    { he: 'בקלה', kw: 'בקלה', md: 'Cod', sup: '2', price: 55, unit: 'ק״ג' },
    { he: 'שרימפס', kw: 'שרימפ', md: 'Prawns', sup: '2', price: 80, unit: 'ק״ג' },
    // ---- ביצים (sup 3) ----
    { he: 'ביצים L', kw: 'ביצים', md: 'Egg', sup: '3', price: 18, unit: 'יחידה' },
    { he: 'ביצים M', kw: 'ביצים M', md: 'Egg', sup: '3', price: 16, unit: 'יחידה' },
    { he: 'ביצים XL', kw: 'ביצים XL', md: 'Egg', sup: '3', price: 20, unit: 'יחידה' },
    { he: 'ביצים אורגניות', kw: 'אורגני', md: 'Egg', sup: '3', price: 28, unit: 'יחידה' },
    { he: 'ביצי שליו', kw: 'שליו', en: 'quail eggs', sup: '3', price: 22, unit: 'יחידה' },
    // ---- חלב ומוצריו (sup 4) ----
    { he: 'חלב 3%', kw: 'חלב', md: 'Milk', sup: '4', price: 6, unit: 'יחידה' },
    { he: 'חלב 1%', kw: 'חלב 1', md: 'Milk', sup: '4', price: 6, unit: 'יחידה' },
    { he: 'יוגורט', kw: 'יוגורט', md: 'Yogurt', sup: '4', price: 5, unit: 'יחידה' },
    { he: 'חמאה', kw: 'חמאה', md: 'Butter', sup: '4', price: 8, unit: 'יחידה' },
    { he: 'שמנת', kw: 'שמנת', md: 'Cream', sup: '4', price: 7, unit: 'יחידה' },
    { he: 'שמנת חמוצה', kw: 'חמוצה', en: 'sour cream', sup: '4', price: 6, unit: 'יחידה' },
    { he: 'לבן', kw: 'לבן', en: 'kefir', sup: '4', price: 6, unit: 'יחידה' },
    // ---- גבינות (sup 5) ----
    { he: 'גבינה צהובה', kw: 'צהובה', md: 'Cheese', sup: '5', price: 25, unit: 'ק״ג' },
    { he: 'גבינה לבנה', kw: 'גבינה לבנה', en: 'cream cheese', sup: '5', price: 12, unit: 'יחידה' },
    { he: 'גבינה בולגרית', kw: 'בולגרית', md: 'Feta', sup: '5', price: 18, unit: 'ק״ג' },
    { he: 'גבינת פטה', kw: 'פטה', md: 'Feta', sup: '5', price: 20, unit: 'ק״ג' },
    { he: 'גבינת עיזים', kw: 'עיזים', md: 'Goats Cheese', sup: '5', price: 35, unit: 'ק״ג' },
    { he: 'מוצרלה', kw: 'מוצרל', md: 'Mozzarella', sup: '5', price: 30, unit: 'ק״ג' },
    { he: 'פרמזן', kw: 'פרמז', md: 'Parmesan', sup: '5', price: 60, unit: 'ק״ג' },
    { he: 'גאודה', kw: 'גאודה', en: 'gouda cheese', sup: '5', price: 38, unit: 'ק״ג' },
    { he: 'קוטג׳', kw: 'קוטג', en: 'cottage cheese', sup: '5', price: 10, unit: 'יחידה' },
    { he: 'ריקוטה', kw: 'ריקוט', md: 'Ricotta', sup: '5', price: 22, unit: 'יחידה' },
    { he: 'מסקרפונה', kw: 'מסקרפ', md: 'Mascarpone', sup: '5', price: 28, unit: 'יחידה' },
    // ---- מאפים (sup 9) ----
    { he: 'לחם פרוס', kw: 'לחם', en: 'sliced bread', sup: '9', price: 8, unit: 'יחידה' },
    { he: 'חלה', kw: 'חלה', en: 'challah bread', sup: '9', price: 12, unit: 'יחידה' },
    { he: 'לחמניות', kw: 'לחמני', en: 'bread rolls', sup: '9', price: 10, unit: 'יחידה' },
    { he: 'פיתות', kw: 'פיתה', en: 'pita bread', sup: '9', price: 8, unit: 'יחידה' },
    { he: 'באגט', kw: 'באגט', en: 'baguette', sup: '9', price: 9, unit: 'יחידה' },
    { he: 'בורקס', kw: 'בורקס', en: 'borek pastry', sup: '9', price: 6, unit: 'יחידה' }
];

// ===========================
// Staff (named identities picked at login)
// ===========================
const DEFAULT_STAFF = ['שף ראשי', 'סגן שף', 'שף חלבי', 'שף בשרי', 'מחסנאי', 'עובד מטבח'];

// Reads the staff list from localStorage, or returns sensible defaults (not persisted)
function loadStaff() {
    try {
        const s = JSON.parse(localStorage.getItem('staff'));
        if (Array.isArray(s) && s.length) return s;
    } catch (_) { /* ignore */ }
    return DEFAULT_STAFF.map((n, i) => ({ id: String(i + 1), name: n }));
}

// ===========================
// Users (per-person accounts: name + password + role) — managed by the chef
// ===========================
const DEFAULT_USERS = [
    { id: 'u1', name: 'שף ראשי', password: '123456', role: 'admin' },
    { id: 'u2', name: 'סגן שף', password: '654321', role: 'employee' },
    { id: 'u3', name: 'שף חלבי', password: '654321', role: 'employee' },
    { id: 'u4', name: 'שף בשרי', password: '654321', role: 'employee' },
    { id: 'u5', name: 'מחסנאי', password: '654321', role: 'employee' },
    { id: 'u6', name: 'עובד מטבח', password: '654321', role: 'employee' }
];

// Reads the users list from localStorage, or returns sensible defaults (not persisted)
function loadUsers() {
    try {
        const u = JSON.parse(localStorage.getItem('users'));
        if (Array.isArray(u) && u.length) return u;
    } catch (_) { /* ignore */ }
    return DEFAULT_USERS.map(x => ({ ...x }));
}

// Array collections mirrored to the shared (KV) bank across devices
const SHARED_KEYS = ['products', 'suppliers', 'staff', 'users', 'pendingOrders', 'history', 'needs'];
// Config objects mirrored to the shared bank (phones, procurement email)
const SHARED_OBJECT_KEYS = ['approvalSettings'];

// ===========================
// Authentication System
// ===========================

class AuthSystem {
    constructor() {
        this.defaultAdminCode = '123456'; // קוד מנהל ברירת מחדל
        this.defaultEmployeeCode = '654321'; // קוד עובד ברירת מחדל
        this.adminCode = this.loadData('adminCode') || this.defaultAdminCode;
        this.employeeCode = this.loadData('employeeCode') || this.defaultEmployeeCode;
        this.currentUser = this.loadData('currentUser') || null;
        this.ownerName = this.loadData('ownerName') || 'בועז סעדה - פתרונות יצירתיים';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupAuthListeners();
        this.updateOwnerNameDisplay();
    }

    setupAuthListeners() {
        // Login
        const loginBtn = document.getElementById('login-btn');
        const loginInput = document.getElementById('login-code');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.login();
            });
        }
        
        if (loginInput) {
            loginInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.login();
                }
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Settings - Change Employee Code
        const changeEmployeeCodeBtn = document.getElementById('change-employee-code-btn');
        if (changeEmployeeCodeBtn) {
            changeEmployeeCodeBtn.addEventListener('click', () => this.changeEmployeeCode());
        }

        // Settings - Change Admin Code
        const changeAdminCodeBtn = document.getElementById('change-admin-code-btn');
        if (changeAdminCodeBtn) {
            changeAdminCodeBtn.addEventListener('click', () => this.changeAdminCode());
        }

        // Settings - Update Owner Name
        const updateOwnerNameBtn = document.getElementById('update-owner-name-btn');
        if (updateOwnerNameBtn) {
            updateOwnerNameBtn.addEventListener('click', () => this.updateOwnerName());
        }
    }

    checkAuth() {
        if (this.currentUser) {
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    login() {
        const codeInput = document.getElementById('login-code');
        const errorDiv = document.getElementById('login-error');
        
        if (!codeInput) {
            return;
        }

        const password = codeInput.value.trim();
        const nameSelect = document.getElementById('login-name');
        const name = nameSelect ? nameSelect.value.trim() : '';

        if (!name) {
            this.showError('בחר מי אתה');
            return;
        }
        if (!password) {
            this.showError('הזן סיסמה');
            return;
        }

        // Authenticate against the per-user list (name + personal password)
        const user = loadUsers().find(u => u.name === name);
        if (user && String(user.password) === password) {
            this.currentUser = { id: user.id, role: user.role, name: user.name };
            this.saveData('currentUser', this.currentUser);
            this.showApp();
        } else {
            if (errorDiv) {
                errorDiv.textContent = '❌ סיסמה שגויה';
                errorDiv.style.display = 'block';
            }
            codeInput.value = '';
            setTimeout(() => {
                if (errorDiv) errorDiv.style.display = 'none';
            }, 3000);
        }
    }

    logout() {
        if (confirm('האם אתה בטוח שברצונך לצאת מהמערכת?')) {
            this.currentUser = null;
            this.saveData('currentUser', null);
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-code').value = '';
        document.getElementById('login-error').style.display = 'none';
        this.populateLoginNames();
    }

    // Fill the "who are you" dropdown from the users list
    populateLoginNames() {
        const select = document.getElementById('login-name');
        if (!select) return;
        const prev = select.value;
        const users = loadUsers();
        select.innerHTML = '<option value="">-- בחר מי אתה --</option>';
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name;
            opt.textContent = u.name;
            select.appendChild(opt);
        });
        if (prev) select.value = prev;
    }

    showApp() {
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loginScreen && mainApp) {
            loginScreen.style.display = 'none';
            mainApp.style.display = 'block';
            
            // Update user role badge
            const roleBadge = document.getElementById('user-role-badge');
            const settingsTab = document.getElementById('settings-tab-btn');
            const approvalsTab = document.getElementById('approvals-tab-btn');

            if (roleBadge && this.currentUser) {
                const isAdmin = this.currentUser.role === 'admin';
                const roleLabel = isAdmin ? '👑 מנהל' : '👤 עובד';
                roleBadge.textContent = this.currentUser.name ? `${this.currentUser.name} · ${roleLabel}` : roleLabel;
                // Settings + Approvals (chef) tabs are admin-only
                if (settingsTab) settingsTab.style.display = isAdmin ? 'block' : 'none';
                if (approvalsTab) approvalsTab.style.display = isAdmin ? 'block' : 'none';

                // Refresh the pending-approvals badge once the order system exists
                if (isAdmin && typeof orderSystem !== 'undefined' && orderSystem) {
                    orderSystem.updateApprovalsBadge();
                }

                // Show order-day reminder + dashboard once logged in
                if (typeof orderSystem !== 'undefined' && orderSystem) {
                    orderSystem.checkOrderReminders();
                    orderSystem.renderDashboard();
                    orderSystem.updateSendButtonLabel();
                }
            }
        }
    }

    changeEmployeeCode() {
        if (this.currentUser.role !== 'admin') {
            alert('רק מנהל יכול לשנות קוד עובד');
            return;
        }

        const newCode = document.getElementById('new-employee-code').value.trim();
        const confirmCode = document.getElementById('confirm-employee-code').value.trim();

        if (!newCode || !confirmCode) {
            alert('נא למלא את כל השדות');
            return;
        }

        if (newCode.length !== 6 || !/^\d+$/.test(newCode)) {
            alert('הקוד חייב להיות 6 ספרות');
            return;
        }

        if (newCode !== confirmCode) {
            alert('הקודים אינם תואמים');
            return;
        }

        if (newCode === this.adminCode) {
            alert('קוד העובד לא יכול להיות זהה לקוד המנהל');
            return;
        }

        this.employeeCode = newCode;
        this.saveData('employeeCode', this.employeeCode);

        // Clear inputs
        document.getElementById('new-employee-code').value = '';
        document.getElementById('confirm-employee-code').value = '';

        alert('✅ קוד העובד שונה בהצלחה!');
    }

    changeAdminCode() {
        if (this.currentUser.role !== 'admin') {
            alert('רק מנהל יכול לשנות קוד מנהל');
            return;
        }

        const currentCode = document.getElementById('current-admin-code').value.trim();
        const newCode = document.getElementById('new-admin-code').value.trim();
        const confirmCode = document.getElementById('confirm-admin-code').value.trim();

        if (!currentCode || !newCode || !confirmCode) {
            alert('נא למלא את כל השדות');
            return;
        }

        if (currentCode !== this.adminCode) {
            alert('קוד המנהל הנוכחי שגוי');
            return;
        }

        if (newCode.length !== 6 || !/^\d+$/.test(newCode)) {
            alert('הקוד החדש חייב להיות 6 ספרות');
            return;
        }

        if (newCode !== confirmCode) {
            alert('הקודים אינם תואמים');
            return;
        }

        if (newCode === this.employeeCode) {
            alert('קוד המנהל לא יכול להיות זהה לקוד העובד');
            return;
        }

        this.adminCode = newCode;
        this.saveData('adminCode', this.adminCode);

        // Clear inputs
        document.getElementById('current-admin-code').value = '';
        document.getElementById('new-admin-code').value = '';
        document.getElementById('confirm-admin-code').value = '';

        alert('✅ קוד המנהל שונה בהצלחה! אתה תנותק כעת.');
        
        // Logout after changing admin code
        setTimeout(() => {
            this.logout();
        }, 1000);
    }

    updateOwnerName() {
        if (this.currentUser.role !== 'admin') {
            alert('רק מנהל יכול לעדכן שם בעל הזכויות');
            return;
        }

        const newName = document.getElementById('owner-name-input').value.trim();
        
        if (!newName) {
            alert('נא להזין שם');
            return;
        }

        this.ownerName = newName;
        this.saveData('ownerName', this.ownerName);
        this.updateOwnerNameDisplay();

        document.getElementById('owner-name-input').value = '';
        alert('✅ שם בעל הזכויות עודכן בהצלחה!');
    }

    updateOwnerNameDisplay() {
        // Update in settings tab
        const ownerDisplay = document.getElementById('owner-name-display');
        if (ownerDisplay) {
            ownerDisplay.textContent = this.ownerName;
        }

        // Update in login screen
        const ownerNameElements = document.querySelectorAll('.owner-name');
        ownerNameElements.forEach(el => {
            el.textContent = this.ownerName;
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = '❌ ' + message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

// ===========================
// Data Management
// ===========================

class OrderSystem {
    constructor() {
        this.suppliers = this.loadData('suppliers') || this.getDefaultSuppliers();
        this.normalizeSuppliers();
        this.products = this.loadData('products') || this.getDefaultProducts();
        this.history = this.loadData('history') || [];
        this.pendingOrders = this.loadData('pendingOrders') || [];
        this.staff = this.loadData('staff') || loadStaff();
        this.users = this.loadData('users') || loadUsers(); // per-person accounts (name+password+role)
        this.needs = this.loadData('needs') || []; // reported shortages (flagged by role-holders)
        this.approvalSettings = this.loadData('approvalSettings') || {
            chefPhone: '',
            managerPhone: '',
            procurementEmail: ''
        };
        // Back-fill new field for previously-saved settings
        if (this.approvalSettings.procurementEmail === undefined) {
            this.approvalSettings.procurementEmail = '';
        }
        this.preferences = this.loadData('preferences') || {
            showPrices: true,
            sendMethod: 'whatsapp'
        };
        this.currentOrder = [];
        this.manualItems = [];
        this.excelPreviewData = null;
        this.pendingImageProductId = null;
        this.pendingImageMode = 'existing';
        this.pendingNewProductImage = '';
        this.sharedBankActive = false; // becomes true once the KV-backed shared bank is reachable
        this._sharedSaveTimer = null;
        this._dirtyKeys = new Set(); // which collections changed since the last shared save
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        // One-time: add the full product catalog to an existing bank
        if (!this.loadData('catalogSeededV1')) {
            this.seedCatalog(true);
            this.saveData('catalogSeededV1', true);
        }
        this.autoFillImages(true); // fill missing product images from the web (silent)
        this.renderAllProducts();
        // Persist default staff/users on first run so they sync to other devices
        if (!this.loadData('staff')) this.saveData('staff', this.staff);
        if (!this.loadData('users')) this.saveData('users', this.users);
        this.renderStaff();
        this.renderUsers();
        this.loadHistory();
        this.loadPreferences();
        this.loadApprovalSettings();
        this.setDefaultDeliveryDate();
        this.updateApprovalsBadge();
        this.updateNeedsBadge();
        this.renderDashboard();
        this.renderWeekdayPicker('supplier-order-days', []);
        this.checkOrderReminders();
        this.setupPush();
        this.initSharedBank();
    }

    // ===========================
    // Default Data
    // ===========================

    normalizeSuppliers() {
        this.suppliers.forEach(s => {
            if (s.agentPhone === undefined) s.agentPhone = '';
        });
    }

    getDefaultSuppliers() {
        return [
            { id: '1', name: 'ירקות ופירות', phone: '052-1234567', email: 'veggies@example.com', category: 'ירקות' },
            { id: '2', name: 'בשר עופות דגים', phone: '052-2345678', email: 'meat@example.com', category: 'בשר' },
            { id: '3', name: 'ביצים', phone: '052-3456789', email: 'eggs@example.com', category: 'ביצים' },
            { id: '4', name: 'תנובה', phone: '052-4567890', email: 'tnuva@example.com', category: 'חלב' },
            { id: '5', name: 'מחלבות גד', phone: '052-5678901', email: 'gad@example.com', category: 'חלב' },
            { id: '6', name: 'שטראוס', phone: '052-6789012', email: 'strauss@example.com', category: 'מזון' },
            { id: '7', name: 'כהן', phone: '052-7890123', email: 'cohen@example.com', category: 'שמן' },
            { id: '8', name: 'עופר סוכנויות', phone: '052-8901234', email: 'ofer@example.com', category: 'מזון' },
            { id: '9', name: 'לחם ומאפים', phone: '052-9012345', email: 'bread@example.com', category: 'מאפים' },
            { id: '10', name: 'דגים', phone: '052-0123456', email: 'fish@example.com', category: 'דגים' }
        ];
    }

    getDefaultProducts() {
        // Built from the full PRODUCT_CATALOG (vegetables, fruits, meat, fish, eggs, dairy, cheese, bakery)
        return PRODUCT_CATALOG.map((e, i) => ({
            id: String(i + 1),
            supplierId: e.sup,
            name: e.he,
            price: e.price,
            unit: e.unit,
            image: catalogImage(e)
        }));
    }

    // ===========================
    // Storage
    // ===========================

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        // Mirror shared collections + config objects to the KV bank (only the key that changed)
        if (SHARED_KEYS.includes(key) || SHARED_OBJECT_KEYS.includes(key)) this.scheduleSharedSave(key);
    }

    // localStorage-only write (used when adopting server data, to avoid an echo POST)
    saveLocal(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // ===========================
    // Shared bank (KV-backed, cross-device) — falls back to localStorage if not configured
    // ===========================

    async initSharedBank() {
        try {
            const r = await fetch('/api/data');
            if (!r.ok) return; // KV not configured → stay local-only
            const data = await r.json();
            this.sharedBankActive = true;

            // If an order is mid-build, don't swap products/suppliers under it (would break the DOM rows)
            const orderInProgress = this.currentOrder.length > 0 || this.manualItems.length > 0;
            // Adopt whichever shared collections the server already has (server = source of truth)
            SHARED_KEYS.forEach(k => {
                if (orderInProgress && (k === 'products' || k === 'suppliers')) return;
                if (Array.isArray(data[k])) {
                    this[k] = data[k];
                    this.saveLocal(k, data[k]);
                }
            });
            // Adopt shared config objects (e.g. approvalSettings)
            SHARED_OBJECT_KEYS.forEach(k => {
                if (data[k] && typeof data[k] === 'object' && !Array.isArray(data[k])) {
                    this[k] = data[k];
                    this.saveLocal(k, data[k]);
                }
            });
            this.rerenderAll();

            // Seed only what the server doesn't have yet (don't clobber existing)
            const missing = SHARED_KEYS.filter(k => !Array.isArray(data[k]))
                .concat(SHARED_OBJECT_KEYS.filter(k => !(data[k] && typeof data[k] === 'object' && !Array.isArray(data[k]))));
            if (missing.length) {
                const payload = {};
                missing.forEach(k => { payload[k] = this[k]; });
                fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(() => {});
            }
        } catch (e) {
            // Offline or no server → localStorage only
        }
    }

    // Re-render all views after adopting shared data
    rerenderAll() {
        this.normalizeSuppliers();
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.renderAllProducts();
        this.renderStaff();
        this.loadHistory();
        this.renderApprovals();
        this.updateApprovalsBadge();
        this.renderNeeds();
        this.updateNeedsBadge();
        this.renderUsers();
        this.renderDashboard();
        this.loadApprovalSettings(); // repopulate phone/procurement inputs from adopted settings
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        // Re-render the order products only if the user hasn't started an order (don't wipe quantities)
        const sid = document.getElementById('supplier-select').value;
        if (sid && this.currentOrder.length === 0 && this.manualItems.length === 0) {
            this.loadProducts(sid);
        }
    }

    scheduleSharedSave(key) {
        if (!this.sharedBankActive) return;
        if (key) this._dirtyKeys.add(key);
        clearTimeout(this._sharedSaveTimer);
        this._sharedSaveTimer = setTimeout(() => this.saveSharedBank(), 800);
    }

    // POST only the collections that actually changed — never clobber untouched keys on the server
    saveSharedBank() {
        if (!this.sharedBankActive || this._dirtyKeys.size === 0) return;
        const payload = {};
        this._dirtyKeys.forEach(k => { payload[k] = this[k]; });
        this._dirtyKeys.clear();
        fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => { /* ignore transient errors */ });
    }

    // Pull the latest pending orders from the shared bank (used when opening Approvals)
    async refreshPendingFromServer() {
        if (!this.sharedBankActive) return;
        try {
            const r = await fetch('/api/data');
            if (!r.ok) return;
            const data = await r.json();
            if (Array.isArray(data.pendingOrders)) {
                this.pendingOrders = data.pendingOrders;
                this.saveLocal('pendingOrders', this.pendingOrders);
                this.renderApprovals();
                this.updateApprovalsBadge();
            }
        } catch (e) { /* ignore */ }
    }

    // ===========================
    // Event Listeners
    // ===========================

    setupEventListeners() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
            });
        }

        // Order tab
        const supplierSelect = document.getElementById('supplier-select');
        const sendOrderBtn = document.getElementById('send-order-btn');
        const clearOrderBtn = document.getElementById('clear-order-btn');
        
        if (supplierSelect) supplierSelect.addEventListener('change', (e) => this.onSupplierChange(e.target.value));
        if (sendOrderBtn) sendOrderBtn.addEventListener('click', () => this.submitOrder());
        if (clearOrderBtn) clearOrderBtn.addEventListener('click', () => this.clearOrder());

        const printOrderBtn = document.getElementById('print-order-btn');
        if (printOrderBtn) printOrderBtn.addEventListener('click', () => this.printCurrentOrder());

        const repeatLastOrderBtn = document.getElementById('repeat-last-order-btn');
        if (repeatLastOrderBtn) repeatLastOrderBtn.addEventListener('click', () => this.repeatLastOrder());
        
        // Preferences
        const showPricesCheck = document.getElementById('show-prices');
        if (showPricesCheck) {
            showPricesCheck.addEventListener('change', (e) => this.updatePreference('showPrices', e.target.checked));
        }
        
        const sendMethodRadios = document.querySelectorAll('input[name="send-method"]');
        if (sendMethodRadios.length > 0) {
            sendMethodRadios.forEach(radio => {
                radio.addEventListener('change', (e) => this.updatePreference('sendMethod', e.target.value));
            });
        }

        // Manual item (ad-hoc) in order
        const addManualItemBtn = document.getElementById('add-manual-item-btn');
        if (addManualItemBtn) addManualItemBtn.addEventListener('click', () => this.addManualItem());

        // Product image picker (shared hidden input)
        const productImageInput = document.getElementById('product-image-input');
        if (productImageInput) productImageInput.addEventListener('change', (e) => this.handleProductImage(e));

        // Product search (order screen)
        const productSearch = document.getElementById('product-search');
        if (productSearch) productSearch.addEventListener('input', (e) => this.filterProducts(e.target.value));

        // Approval flow phone numbers (settings)
        const saveApprovalPhonesBtn = document.getElementById('save-approval-phones-btn');
        if (saveApprovalPhonesBtn) saveApprovalPhonesBtn.addEventListener('click', () => this.saveApprovalSettings());

        const testEmailBtn = document.getElementById('test-email-btn');
        if (testEmailBtn) testEmailBtn.addEventListener('click', () => this.sendTestEmail());

        // Inventory tab
        const inventorySupplierSelect = document.getElementById('inventory-supplier-select');
        if (inventorySupplierSelect) inventorySupplierSelect.addEventListener('change', (e) => this.renderInventory(e.target.value));

        const inventorySearch = document.getElementById('inventory-search');
        if (inventorySearch) inventorySearch.addEventListener('input', (e) => this.filterInventory(e.target.value));

        const saveInventoryBtn = document.getElementById('save-inventory-btn');
        if (saveInventoryBtn) saveInventoryBtn.addEventListener('click', () => this.saveInventory());

        const createOrderFromShortageBtn = document.getElementById('create-order-from-shortage-btn');
        if (createOrderFromShortageBtn) createOrderFromShortageBtn.addEventListener('click', () => this.createOrderFromShortage());

        // Products tab
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) addProductBtn.addEventListener('click', () => this.addProduct());
        const scanProductBtn = document.getElementById('scan-product-btn');
        if (scanProductBtn) scanProductBtn.addEventListener('click', () => this.startScanNewProduct());

        const autofillImagesBtn = document.getElementById('autofill-images-btn');
        if (autofillImagesBtn) autofillImagesBtn.addEventListener('click', () => this.autoFillImages(false));

        const seedCatalogBtn = document.getElementById('seed-catalog-btn');
        if (seedCatalogBtn) seedCatalogBtn.addEventListener('click', () => this.seedCatalog(false));

        const saveProductBtn = document.getElementById('save-product-btn');
        if (saveProductBtn) saveProductBtn.addEventListener('click', () => this.saveProductEdit());
        const cancelProductEditBtn = document.getElementById('cancel-product-edit-btn');
        if (cancelProductEditBtn) cancelProductEditBtn.addEventListener('click', () => this.closeProductEditModal());

        const addStaffBtn = document.getElementById('add-staff-btn');
        if (addStaffBtn) addStaffBtn.addEventListener('click', () => this.addStaff());

        // User management
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) addUserBtn.addEventListener('click', () => this.addUser());
        const saveUserBtn = document.getElementById('save-user-btn');
        if (saveUserBtn) saveUserBtn.addEventListener('click', () => this.saveUserEdit());
        const cancelUserEditBtn = document.getElementById('cancel-user-edit-btn');
        if (cancelUserEditBtn) cancelUserEditBtn.addEventListener('click', () => this.closeUserEditModal());

        // Excel import
        const excelFile = document.getElementById('excel-file');
        const importProductsBtn = document.getElementById('import-products-btn');
        
        if (excelFile) excelFile.addEventListener('change', (e) => this.handleExcelFile(e));
        if (importProductsBtn) importProductsBtn.addEventListener('click', () => this.importExcelProducts());

        // Suppliers tab
        const addSupplierBtn = document.getElementById('add-supplier-btn');
        if (addSupplierBtn) addSupplierBtn.addEventListener('click', () => this.addSupplier());
        
        // Edit supplier modal
        const saveSupplierBtn = document.getElementById('save-supplier-btn');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        
        if (saveSupplierBtn) saveSupplierBtn.addEventListener('click', () => this.saveSupplierEdit());
        if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => this.closeEditModal());

        // History
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Excel export
        const exportHistoryBtn = document.getElementById('export-history-btn');
        if (exportHistoryBtn) exportHistoryBtn.addEventListener('click', () => this.exportHistoryExcel());
        const exportInventoryBtn = document.getElementById('export-inventory-btn');
        if (exportInventoryBtn) exportInventoryBtn.addEventListener('click', () => this.exportInventoryExcel());

        // Batch (FIFO) modal
        const addBatchBtn = document.getElementById('add-batch-btn');
        if (addBatchBtn) addBatchBtn.addEventListener('click', () => this.addBatch());
        const closeBatchBtn = document.getElementById('close-batch-btn');
        if (closeBatchBtn) closeBatchBtn.addEventListener('click', () => this.closeBatchManager());

        // Receiving modal
        const confirmReceiveBtn = document.getElementById('confirm-receive-btn');
        if (confirmReceiveBtn) confirmReceiveBtn.addEventListener('click', () => this.confirmReceiveOrder());
        const cancelReceiveBtn = document.getElementById('cancel-receive-btn');
        if (cancelReceiveBtn) cancelReceiveBtn.addEventListener('click', () => this.closeReceiveModal());

        // Reminder banner
        const enableNotifBtn = document.getElementById('enable-notifications-btn');
        if (enableNotifBtn) enableNotifBtn.addEventListener('click', () => this.enableNotifications());
        const dismissReminderBtn = document.getElementById('dismiss-reminder-btn');
        if (dismissReminderBtn) dismissReminderBtn.addEventListener('click', () => this.dismissReminder());
    }

    // ===========================
    // Tab Management
    // ===========================

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Refresh dynamic tabs on entry
        if (tabName === 'approvals') {
            this.renderApprovals();
            this.refreshPendingFromServer(); // pull latest pending orders from other devices
        }
        if (tabName === 'products') this.renderAllProducts();
        if (tabName === 'inventory') {
            this.loadSupplierSelects(); // keep the inventory supplier list in sync
            const invSel = document.getElementById('inventory-supplier-select');
            if (invSel && invSel.value) this.renderInventory(invSel.value);
        }
        if (tabName === 'needs') this.renderNeeds();
        if (tabName === 'dashboard') this.renderDashboard();
    }

    // ===========================
    // Dashboard (home screen)
    // ===========================

    goToOrder(supplierId) {
        this.switchTab('order');
        const sel = document.getElementById('supplier-select');
        if (sel) { sel.value = supplierId; this.onSupplierChange(supplierId); }
    }

    // Global product search (across all suppliers) from the dashboard
    globalSearch(query) {
        const el = document.getElementById('global-search-results');
        if (!el) return;
        const q = (query || '').trim().toLowerCase();
        if (q.length < 2) { el.innerHTML = ''; return; }

        const supName = {};
        this.suppliers.forEach(s => { supName[s.id] = s.name; });
        const results = this.products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 40);

        if (!results.length) { el.innerHTML = '<p class="dash-empty">לא נמצאו מוצרים</p>'; return; }
        el.innerHTML = results.map(p =>
            `<div class="gsearch-row" onclick="orderSystem.goToOrderForProduct('${p.id}')">
                <span class="gsearch-name">${p.name}</span>
                <span class="gsearch-sup">${supName[p.supplierId] || 'ללא ספק'}</span>
            </div>`
        ).join('');
    }

    // Jump to the order screen for a product's supplier, filtered to that product
    goToOrderForProduct(productId) {
        const p = this.products.find(x => x.id === productId);
        if (!p) return;
        this.goToOrder(p.supplierId);
        const ps = document.getElementById('product-search');
        if (ps) { ps.value = p.name; this.filterProducts(p.name); }
    }

    renderDashboard() {
        const el = document.getElementById('dashboard-content');
        if (!el) return;

        const isAdmin = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.role === 'admin');
        const userName = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '';
        const today = new Date().getDay();
        const dayName = this.getWeekdays()[today].name;

        const dueSuppliers = this.suppliers.filter(s => Array.isArray(s.orderDays) && s.orderDays.includes(today));
        const dueHtml = dueSuppliers.length === 0
            ? '<p class="dash-empty">אין ספקים מתוזמנים להיום</p>'
            : dueSuppliers.map(s => `<button class="dash-supplier" onclick="orderSystem.goToOrder('${s.id}')">🛒 ${s.name}</button>`).join('');

        const recentHtml = this.history.length === 0
            ? '<p class="dash-empty">אין הזמנות עדיין</p>'
            : this.history.slice(0, 4).map(h => {
                const d = new Date(h.date).toLocaleDateString('he-IL');
                return `<div class="dash-recent"><span>🛒 ${h.supplier}</span><span>${d} · ${h.items.length} פריטים</span></div>`;
            }).join('');

        const approvalsStat = isAdmin
            ? `<div class="dash-stat" onclick="orderSystem.switchTab('approvals')"><div class="dash-stat-num">${this.pendingOrders.length}</div><div class="dash-stat-label">✅ אישורים ממתינים</div></div>`
            : `<div class="dash-stat dash-stat-static"><div class="dash-stat-num">${this.pendingOrders.length}</div><div class="dash-stat-label">✅ ממתינים לאישור</div></div>`;

        // Low stock: items with a par level set whose current stock is below it
        const supName = {};
        this.suppliers.forEach(s => { supName[s.id] = s.name; });
        const lowStock = this.products
            .filter(p => (Number(p.parLevel) || 0) > 0 && this.productShortage(p) > 0)
            .sort((a, b) => this.productShortage(b) - this.productShortage(a));
        const lowStockHtml = lowStock.length === 0
            ? '<p class="dash-empty">אין מוצרים מתחת ליעד המלאי 👍</p>'
            : lowStock.slice(0, 15).map(p =>
                `<div class="dash-recent lowstock-row" onclick="orderSystem.goToOrderForProduct('${p.id}')">
                    <span>⚠️ ${p.name} <span class="lowstock-sup">(${supName[p.supplierId] || ''})</span></span>
                    <span>קיים ${Number(p.stockQty) || 0} / יעד ${Number(p.parLevel) || 0} · חסר ${this.productShortage(p)}</span>
                </div>`).join('');

        // Expiry / FIFO: one entry per batch (or per product's single date), earliest first
        const expiryEntries = [];
        this.products.forEach(p => {
            if (p.batches && p.batches.length) {
                p.batches.forEach(b => {
                    if (!b.expiryDate) return;
                    const days = this.expiryDays(b.expiryDate);
                    if (days !== null) expiryEntries.push({ p, expiryDate: b.expiryDate, qty: b.qty, days });
                });
            } else if (p.expiryDate) {
                const days = this.expiryDays(p.expiryDate);
                if (days !== null) expiryEntries.push({ p, expiryDate: p.expiryDate, qty: Number(p.stockQty) || 0, days });
            }
        });
        expiryEntries.sort((a, b) => a.days - b.days);
        const expirySoon = expiryEntries.filter(x => x.days <= 7);
        const expiryHtml = expirySoon.length === 0
            ? '<p class="dash-empty">אין מוצרים בסמוך לתפוגה 👍</p>'
            : expirySoon.slice(0, 15).map(({ p, expiryDate, qty, days }) => {
                const cls = days < 0 ? 'exp-expired' : 'exp-soon';
                const label = days < 0 ? `פג לפני ${-days} ימים` : (days === 0 ? 'פג היום' : `בעוד ${days} ימים`);
                return `<div class="dash-recent lowstock-row" onclick="orderSystem.goToOrderForProduct('${p.id}')">
                    <span>${days < 0 ? '⛔' : '⏳'} ${p.name} <span class="lowstock-sup">(${supName[p.supplierId] || ''})</span></span>
                    <span class="${cls}">${new Date(expiryDate).toLocaleDateString('he-IL')} · כמות ${qty} · ${label}</span>
                </div>`;
            }).join('');

        el.innerHTML = `
            <h2>🏠 שלום${userName ? ' ' + userName : ''}!</h2>
            <p class="help-text">יום ${dayName} · ${new Date().toLocaleDateString('he-IL')}</p>

            <div class="dash-block">
                <h3>🔍 חיפוש מהיר בכל הספקים</h3>
                <input type="text" id="global-search" class="input-field" placeholder="הקלד שם מוצר..." autocomplete="off" oninput="orderSystem.globalSearch(this.value)">
                <div id="global-search-results"></div>
            </div>

            <div class="dash-stats">
                ${approvalsStat}
                <div class="dash-stat" onclick="orderSystem.switchTab('needs')">
                    <div class="dash-stat-num">${this.needs.length}</div>
                    <div class="dash-stat-label">🚩 חוסרים פתוחים</div>
                </div>
                <div class="dash-stat${lowStock.length ? '' : ' dash-stat-static'}" onclick="orderSystem.switchTab('inventory')" style="${lowStock.length ? 'background:linear-gradient(135deg,#FF9800,#F57C00)' : ''}">
                    <div class="dash-stat-num">${lowStock.length}</div>
                    <div class="dash-stat-label">⚠️ מלאי נמוך</div>
                </div>
            </div>

            <div class="dash-block">
                <h3>📅 להזמין היום</h3>
                <div class="dash-due">${dueHtml}</div>
            </div>

            <div class="dash-block">
                <h3>⚠️ מלאי מתחת ליעד</h3>
                ${lowStockHtml}
            </div>

            <div class="dash-block">
                <h3>⏳ תוקף / FIFO — להשתמש קודם</h3>
                ${expiryHtml}
            </div>

            <div class="dash-block">
                <h3>📋 הזמנות אחרונות</h3>
                ${recentHtml}
            </div>
        `;
    }

    // ===========================
    // Supplier Management
    // ===========================

    // Weekday helpers (0=Sunday ... 6=Saturday)
    getWeekdays() {
        return [
            { num: 0, short: 'א', name: 'ראשון' },
            { num: 1, short: 'ב', name: 'שני' },
            { num: 2, short: 'ג', name: 'שלישי' },
            { num: 3, short: 'ד', name: 'רביעי' },
            { num: 4, short: 'ה', name: 'חמישי' },
            { num: 5, short: 'ו', name: 'שישי' },
            { num: 6, short: 'ש', name: 'שבת' }
        ];
    }

    renderWeekdayPicker(containerId, selectedDays) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const selected = selectedDays || [];
        container.innerHTML = '';
        this.getWeekdays().forEach(day => {
            const isOn = selected.includes(day.num);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'weekday-btn' + (isOn ? ' on' : '');
            btn.dataset.day = day.num;
            btn.textContent = day.short;
            btn.title = day.name;
            btn.addEventListener('click', () => btn.classList.toggle('on'));
            container.appendChild(btn);
        });
    }

    getSelectedWeekdays(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        return [...container.querySelectorAll('.weekday-btn.on')]
            .map(b => parseInt(b.dataset.day, 10))
            .sort((a, b) => a - b);
    }

    formatOrderDays(orderDays) {
        if (!orderDays || orderDays.length === 0) return '';
        const names = this.getWeekdays().filter(d => orderDays.includes(d.num)).map(d => d.name);
        return names.join(', ');
    }

    loadSupplierSelects() {
        const selects = [
            document.getElementById('supplier-select'),
            document.getElementById('product-supplier-select'),
            document.getElementById('excel-supplier-select'),
            document.getElementById('inventory-supplier-select')
        ];

        selects.forEach(select => {
            if (!select) return;
            const prev = select.value; // preserve the current selection across a rebuild
            select.innerHTML = '<option value="">-- בחר ספק --</option>';
            this.suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                select.appendChild(option);
            });
            if (prev) select.value = prev; // restore if the supplier still exists
        });
    }

    loadSuppliersDisplay() {
        const container = document.getElementById('suppliers-display');
        container.innerHTML = '';

        if (this.suppliers.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין ספקים במערכת</p>';
            return;
        }

        this.suppliers.forEach(supplier => {
            const card = document.createElement('div');
            card.className = 'supplier-card';
            card.innerHTML = `
                <div class="supplier-header">
                    <div class="supplier-name">🥬 ${supplier.name}</div>
                    <div class="supplier-actions">
                        <button class="btn btn-primary btn-small" onclick="orderSystem.editSupplier('${supplier.id}')">✏️ ערוך</button>
                        <button class="btn btn-secondary btn-small" onclick="orderSystem.deleteSupplier('${supplier.id}')">🗑️ מחק</button>
                    </div>
                </div>
                <div class="supplier-info">📞 טלפון ראשי: ${supplier.phone || '—'}</div>
                <div class="supplier-info">👤 טלפון סוכן: ${supplier.agentPhone || '—'}</div>
                <div class="supplier-info">📧 ${supplier.email || '—'}${this.isPlaceholderEmail(supplier.email) ? ' <span style="color:#e65100;font-weight:700">⚠️ עדכן למייל אמיתי</span>' : ''}</div>
                <div class="supplier-info">🏷️ ${supplier.category}</div>
                ${supplier.orderDays && supplier.orderDays.length ? `<div class="supplier-info">📅 ימי הזמנה: ${this.formatOrderDays(supplier.orderDays)}</div>` : ''}
            `;
            container.appendChild(card);
        });
    }

    getSupplierWhatsAppPhone(supplier) {
        if (!supplier) return '';
        const agent = String(supplier.agentPhone || '').trim();
        const main = String(supplier.phone || '').trim();
        return agent || main;
    }

    addSupplier() {
        const name = document.getElementById('supplier-name').value.trim();
        const phone = document.getElementById('supplier-phone').value.trim();
        const agentPhone = document.getElementById('supplier-agent-phone').value.trim();
        const email = document.getElementById('supplier-email').value.trim();
        const category = document.getElementById('supplier-category').value.trim();

        if (!name) {
            alert('נא למלא שם ספק');
            return;
        }
        if (!phone && !agentPhone && !email) {
            alert('נא למלא לפחות טלפון, טלפון סוכן או מייל');
            return;
        }

        const newSupplier = {
            id: Date.now().toString(),
            name,
            phone,
            agentPhone,
            email,
            category,
            orderDays: this.getSelectedWeekdays('supplier-order-days')
        };

        this.suppliers.push(newSupplier);
        this.saveData('suppliers', this.suppliers);
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();

        // Clear form
        document.getElementById('supplier-name').value = '';
        document.getElementById('supplier-phone').value = '';
        document.getElementById('supplier-agent-phone').value = '';
        document.getElementById('supplier-email').value = '';
        document.getElementById('supplier-category').value = '';
        this.renderWeekdayPicker('supplier-order-days', []);
        this.refreshPushSchedule();

        this.showAlert('הספק נוסף בהצלחה! ✅', 'success');
    }

    editSupplier(supplierId) {
        const supplier = this.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        document.getElementById('edit-supplier-id').value = supplier.id;
        document.getElementById('edit-supplier-name').value = supplier.name;
        document.getElementById('edit-supplier-phone').value = supplier.phone || '';
        document.getElementById('edit-supplier-agent-phone').value = supplier.agentPhone || '';
        document.getElementById('edit-supplier-email').value = supplier.email || '';
        document.getElementById('edit-supplier-category').value = supplier.category;
        this.renderWeekdayPicker('edit-supplier-order-days', supplier.orderDays || []);

        document.getElementById('edit-supplier-modal').classList.add('active');
    }

    saveSupplierEdit() {
        const supplierId = document.getElementById('edit-supplier-id').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        
        if (!supplier) return;

        supplier.name = document.getElementById('edit-supplier-name').value.trim();
        supplier.phone = document.getElementById('edit-supplier-phone').value.trim();
        supplier.agentPhone = document.getElementById('edit-supplier-agent-phone').value.trim();
        supplier.email = document.getElementById('edit-supplier-email').value.trim();
        supplier.category = document.getElementById('edit-supplier-category').value.trim();
        supplier.orderDays = this.getSelectedWeekdays('edit-supplier-order-days');

        this.saveData('suppliers', this.suppliers);
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.closeEditModal();
        this.updateSupplierEmailWarning();
        this.refreshPushSchedule();

        this.showAlert('הספק עודכן בהצלחה! ✅', 'success');
    }

    closeEditModal() {
        document.getElementById('edit-supplier-modal').classList.remove('active');
    }

    deleteSupplier(supplierId) {
        if (!confirm('האם אתה בטוח שברצונך למחוק את הספק?')) return;

        this.suppliers = this.suppliers.filter(s => s.id !== supplierId);
        this.products = this.products.filter(p => p.supplierId !== supplierId);
        
        this.saveData('suppliers', this.suppliers);
        this.saveData('products', this.products);
        
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.renderAllProducts();
        this.refreshPushSchedule();

        this.showAlert('הספק נמחק בהצלחה', 'success');
    }

    // ===========================
    // Product Management
    // ===========================

    addProduct() {
        const supplierId = document.getElementById('product-supplier-select').value;
        const name = document.getElementById('product-name').value.trim();
        const price = parseFloat(document.getElementById('product-price').value);
        const unit = document.getElementById('product-unit').value;

        if (!supplierId || !name || isNaN(price) || price < 0) {
            alert('נא למלא ספק, שם ומחיר תקין (0 ומעלה)');
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            supplierId,
            name,
            price,
            unit,
            image: this.pendingNewProductImage || ''
        };

        this.products.push(newProduct);
        this.saveData('products', this.products);

        // Clear form
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        this.pendingNewProductImage = '';

        this.showAlert('המוצר נוסף בהצלחה! ✅', 'success');

        // Refresh the management list
        this.renderAllProducts();

        // Refresh products list if current supplier is selected
        const currentSupplierId = document.getElementById('supplier-select').value;
        if (currentSupplierId === supplierId) {
            this.loadProducts(supplierId);
        }
    }

    renderAllProducts() {
        const container = document.getElementById('all-products-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.products.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין מוצרים במערכת</p>';
            return;
        }

        // Group products by supplier
        this.suppliers.forEach(supplier => {
            const supplierProducts = this.products.filter(p => p.supplierId === supplier.id);
            if (supplierProducts.length === 0) return;

            const group = document.createElement('div');
            group.className = 'product-group';

            let html = `<h4 class="product-group-title">${supplier.name} <span class="product-group-count">(${supplierProducts.length})</span></h4>`;
            supplierProducts.forEach(product => {
                html += `
                    <div class="managed-product">
                        <span class="managed-product-thumb ${product.image ? 'has-img' : ''}" onclick="orderSystem.openImagePicker('${product.id}')" ${product.image ? `style="background-image:url('${product.image}')"` : ''} title="${product.image ? 'החלף תמונה' : 'הוסף תמונה'}">${product.image ? '' : '📷'}</span>
                        <span class="managed-product-name">${product.name}</span>
                        <span class="managed-product-price">₪${Number(product.price).toFixed(2)} / ${product.unit}</span>
                        <button class="btn btn-primary btn-small" onclick="orderSystem.editProduct('${product.id}')">✏️</button>
                        <button class="btn btn-secondary btn-small" onclick="orderSystem.deleteProduct('${product.id}')">🗑️</button>
                    </div>
                `;
            });

            group.innerHTML = html;
            container.appendChild(group);
        });

        // Products belonging to a deleted/unknown supplier
        const orphanProducts = this.products.filter(p => !this.suppliers.some(s => s.id === p.supplierId));
        if (orphanProducts.length > 0) {
            const group = document.createElement('div');
            group.className = 'product-group';
            let html = `<h4 class="product-group-title">ללא ספק <span class="product-group-count">(${orphanProducts.length})</span></h4>`;
            orphanProducts.forEach(product => {
                html += `
                    <div class="managed-product">
                        <span class="managed-product-thumb ${product.image ? 'has-img' : ''}" onclick="orderSystem.openImagePicker('${product.id}')" ${product.image ? `style="background-image:url('${product.image}')"` : ''} title="${product.image ? 'החלף תמונה' : 'הוסף תמונה'}">${product.image ? '' : '📷'}</span>
                        <span class="managed-product-name">${product.name}</span>
                        <span class="managed-product-price">₪${Number(product.price).toFixed(2)} / ${product.unit}</span>
                        <button class="btn btn-primary btn-small" onclick="orderSystem.editProduct('${product.id}')">✏️</button>
                        <button class="btn btn-secondary btn-small" onclick="orderSystem.deleteProduct('${product.id}')">🗑️</button>
                    </div>
                `;
            });
            group.innerHTML = html;
            container.appendChild(group);
        }
    }

    deleteProduct(productId) {
        if (!confirm('האם אתה בטוח שברצונך למחוק את המוצר?')) return;

        this.products = this.products.filter(p => p.id !== productId);
        this.saveData('products', this.products);
        this.renderAllProducts();

        // Refresh order list if the deleted product's supplier is selected
        const currentSupplierId = document.getElementById('supplier-select').value;
        if (currentSupplierId) {
            this.loadProducts(currentSupplierId);
        }

        this.showAlert('המוצר נמחק', 'success');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-unit').value = product.unit || 'ק״ג';

        // Populate the supplier dropdown and select the current one
        const supSelect = document.getElementById('edit-product-supplier');
        supSelect.innerHTML = '';
        this.suppliers.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            supSelect.appendChild(opt);
        });
        supSelect.value = product.supplierId;

        document.getElementById('edit-product-modal').classList.add('active');
    }

    saveProductEdit() {
        const id = document.getElementById('edit-product-id').value;
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const name = document.getElementById('edit-product-name').value.trim();
        const price = parseFloat(document.getElementById('edit-product-price').value);
        if (!name) { alert('נא להזין שם מוצר'); return; }

        product.name = name;
        product.price = isNaN(price) ? 0 : price;
        product.unit = document.getElementById('edit-product-unit').value;
        product.supplierId = document.getElementById('edit-product-supplier').value;

        this.saveData('products', this.products);
        this.closeProductEditModal();
        this.renderAllProducts();
        const sid = document.getElementById('supplier-select').value;
        if (sid) this.loadProducts(sid);

        this.showAlert('✅ המוצר עודכן', 'success');
    }

    closeProductEditModal() {
        document.getElementById('edit-product-modal').classList.remove('active');
    }

    // ===========================
    // Inventory Management (מלאי)
    // ===========================

    // Shortage for a product = max(0, parLevel - stockQty). Missing fields treated as 0.
    productShortage(product) {
        const stock = Number(product.stockQty) || 0;
        const par = Number(product.parLevel) || 0;
        return Math.max(0, par - stock);
    }

    // Render the inventory rows for a single supplier (never all 1800 products at once).
    renderInventory(supplierId) {
        const container = document.getElementById('inventory-list');
        const controls = document.getElementById('inventory-controls');
        if (!container) return;

        if (!supplierId) {
            container.innerHTML = '';
            if (controls) controls.style.display = 'none';
            return;
        }

        const isAdmin = typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.role === 'admin';
        const products = this.products.filter(p => p.supplierId === supplierId);

        if (controls) controls.style.display = products.length ? 'block' : 'none';

        if (products.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין מוצרים לספק זה. הוסף מוצרים בטאב "מוצרים"</p>';
            return;
        }

        let html = `
            <div class="inventory-row inventory-head">
                <span class="inv-name">מוצר</span>
                <span class="inv-col">כמות קיים</span>
                <span class="inv-col">מלאי פתיחה</span>
                <span class="inv-col">כמות להזמנה</span>
            </div>
        `;
        products.forEach(product => {
            if (product.batches && product.batches.length) this.recomputeStock(product);
            const stock = Number(product.stockQty) || 0;
            const par = Number(product.parLevel) || 0;
            const shortage = Math.max(0, par - stock);
            const parAttrs = isAdmin ? '' : 'disabled';
            const hasBatches = !!(product.batches && product.batches.length);
            const batchBtn = `<button class="inv-flag-btn" onclick="orderSystem.openBatchManager('${product.id}')" type="button" title="אצוות / FIFO">📦${hasBatches ? ' ' + product.batches.length : ''}</button>`;
            const expiryControl = hasBatches
                ? '<span class="inv-batch-note">אצוות ⬅ 📦</span>'
                : `<input type="date" class="inv-expiry ${this.expiryClass(product.expiryDate)}" data-product-id="${product.id}" value="${product.expiryDate || ''}" onchange="orderSystem.setInventoryExpiry('${product.id}', this.value)" title="תאריך תפוגה (FIFO)">`;
            html += `
                <div class="inventory-row" data-name="${product.name.toLowerCase()}">
                    <span class="inv-name">
                        <span class="inv-name-top">${product.name} <button class="inv-flag-btn" onclick="orderSystem.markShortage('${product.id}')" type="button" title="סמן חסר">🚩</button>${batchBtn}</span>
                        ${expiryControl}
                    </span>
                    <span class="inv-col">
                        <input type="number" class="input-field inv-input inv-stock" data-product-id="${product.id}" min="0" step="0.5" value="${stock}" inputmode="decimal" ${hasBatches ? 'readonly title="מנוהל דרך אצוות (📦)"' : ''}
                               onchange="orderSystem.updateInventoryRow('${product.id}')" oninput="orderSystem.updateInventoryRow('${product.id}')">
                    </span>
                    <span class="inv-col">
                        <input type="number" class="input-field inv-input inv-par" data-product-id="${product.id}" min="0" step="0.5" value="${par}" inputmode="decimal" ${parAttrs}
                               onchange="orderSystem.updateInventoryRow('${product.id}')" oninput="orderSystem.updateInventoryRow('${product.id}')">
                    </span>
                    <span class="inv-col inv-shortage ${shortage > 0 ? 'has-shortage' : ''}" data-shortage-id="${product.id}">${shortage}</span>
                </div>
            `;
        });
        container.innerHTML = html;

        // Reset search filter for the newly selected supplier
        const search = document.getElementById('inventory-search');
        if (search) search.value = '';
        this.updateInventorySummary(supplierId);
    }

    // Recompute a single row's shortage highlight as the user types (no save yet).
    updateInventoryRow(productId) {
        const stockInput = document.querySelector(`.inv-stock[data-product-id="${productId}"]`);
        const parInput = document.querySelector(`.inv-par[data-product-id="${productId}"]`);
        const shortageCell = document.querySelector(`[data-shortage-id="${productId}"]`);
        if (!stockInput || !parInput || !shortageCell) return;

        const stock = Math.max(0, parseFloat(stockInput.value) || 0);
        const par = Math.max(0, parseFloat(parInput.value) || 0);
        const shortage = Math.max(0, par - stock);
        shortageCell.textContent = shortage;
        shortageCell.classList.toggle('has-shortage', shortage > 0);

        const supplierId = document.getElementById('inventory-supplier-select').value;
        this.updateInventorySummary(supplierId);
    }

    // Filter the visible inventory rows by product name.
    filterInventory(term) {
        const query = (term || '').trim().toLowerCase();
        document.querySelectorAll('#inventory-list .inventory-row:not(.inventory-head)').forEach(row => {
            const name = row.dataset.name || '';
            row.style.display = (!query || name.includes(query)) ? '' : 'none';
        });
    }

    // "X פריטים בחוסר" summary for the selected supplier (reads live input values).
    updateInventorySummary(supplierId) {
        const el = document.getElementById('inventory-shortage-summary');
        if (!el) return;
        let shortItems = 0;
        this.products.filter(p => p.supplierId === supplierId).forEach(product => {
            const stockInput = document.querySelector(`.inv-stock[data-product-id="${product.id}"]`);
            const parInput = document.querySelector(`.inv-par[data-product-id="${product.id}"]`);
            const stock = stockInput ? (parseFloat(stockInput.value) || 0) : (Number(product.stockQty) || 0);
            const par = parInput ? (parseFloat(parInput.value) || 0) : (Number(product.parLevel) || 0);
            if (Math.max(0, par - stock) > 0) shortItems++;
        });
        el.textContent = `${shortItems} פריטים בחוסר`;
        el.classList.toggle('has-shortage', shortItems > 0);
    }

    // Persist every inventory input into products, then sync to the shared bank.
    // Non-admins cannot change par level (their inputs are disabled, so they're read-only anyway).
    saveInventory() {
        const isAdmin = typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.role === 'admin';
        document.querySelectorAll('#inventory-list .inv-stock').forEach(input => {
            const product = this.products.find(p => p.id === input.dataset.productId);
            if (product) product.stockQty = Math.max(0, parseFloat(input.value) || 0);
        });
        if (isAdmin) {
            document.querySelectorAll('#inventory-list .inv-par').forEach(input => {
                const product = this.products.find(p => p.id === input.dataset.productId);
                if (product) product.parLevel = Math.max(0, parseFloat(input.value) || 0);
            });
        }

        this.saveData('products', this.products);

        // Auto-report shortages to the chef: any product below par is added/updated in the needs list
        const supplierId = document.getElementById('inventory-supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        const reportedBy = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '';
        let reported = 0;
        this.products
            .filter(p => p.supplierId === supplierId && this.productShortage(p) > 0)
            .forEach(p => {
                const shortage = this.productShortage(p);
                const existing = this.needs.find(n => n.productId === p.id);
                if (existing) {
                    existing.qty = shortage;
                    existing.reportedBy = reportedBy;
                    existing.date = new Date().toISOString();
                } else {
                    this.needs.push({
                        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
                        productId: p.id, name: p.name, supplierId: p.supplierId,
                        supplierName: supplier ? supplier.name : '', qty: shortage,
                        reportedBy, date: new Date().toISOString(), auto: true
                    });
                }
                reported++;
            });

        if (reported > 0) {
            this.saveData('needs', this.needs);
            this.updateNeedsBadge();
            this.renderNeeds();
            this.renderDashboard();
        }

        this.showAlert(reported > 0 ? `✅ המלאי נשמר · ${reported} חוסרים נשלחו לשף` : '✅ המלאי נשמר', 'success');
    }

    // Days until expiry (negative = already expired), or null if no date
    expiryDays(dateStr) {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d)) return null;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return Math.round((d - today) / 86400000);
    }

    expiryClass(dateStr) {
        const days = this.expiryDays(dateStr);
        if (days === null) return '';
        if (days < 0) return 'exp-expired';
        if (days <= 7) return 'exp-soon';
        return 'exp-ok';
    }

    setInventoryExpiry(productId, value) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        product.expiryDate = value || '';
        this.saveData('products', this.products);
        const input = document.querySelector(`.inv-expiry[data-product-id="${productId}"]`);
        if (input) { input.className = `inv-expiry ${this.expiryClass(value)}`; }
        this.renderDashboard();
    }

    // ===========================
    // Batches (FIFO — multiple stock lots per product, each with its own expiry)
    // ===========================

    sortedBatches(product) {
        const b = (product.batches || []).slice();
        b.sort((x, y) => {
            const dx = x.expiryDate ? new Date(x.expiryDate).getTime() : Infinity;
            const dy = y.expiryDate ? new Date(y.expiryDate).getTime() : Infinity;
            return dx - dy;
        });
        return b;
    }

    // When a product uses batches, its total stock = sum of batch quantities
    recomputeStock(product) {
        if (product.batches && product.batches.length) {
            product.stockQty = product.batches.reduce((s, x) => s + (Number(x.qty) || 0), 0);
        }
    }

    addBatchToProduct(product, qty, expiryDate) {
        if (!product.batches) product.batches = [];
        product.batches.push({
            id: 'b' + Date.now() + Math.random().toString(36).slice(2, 5),
            qty: Number(qty) || 0,
            expiryDate: expiryDate || '',
            receivedDate: new Date().toISOString()
        });
        this.recomputeStock(product);
    }

    openBatchManager(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        document.getElementById('batch-product-id').value = productId;
        document.getElementById('batch-product-info').textContent = product.name;
        document.getElementById('batch-qty').value = '';
        document.getElementById('batch-expiry').value = '';
        this.renderBatches();
        document.getElementById('batch-modal').classList.add('active');
    }

    renderBatches() {
        const productId = document.getElementById('batch-product-id').value;
        const product = this.products.find(p => p.id === productId);
        const el = document.getElementById('batch-list');
        if (!product || !el) return;
        const batches = this.sortedBatches(product);
        if (!batches.length) {
            el.innerHTML = '<p class="dash-empty">אין אצוות למוצר זה עדיין.</p>';
            return;
        }
        const total = product.batches.reduce((s, x) => s + (Number(x.qty) || 0), 0);
        el.innerHTML = batches.map((b, i) => {
            const cls = this.expiryClass(b.expiryDate);
            const dstr = b.expiryDate ? new Date(b.expiryDate).toLocaleDateString('he-IL') : 'ללא תאריך';
            const days = this.expiryDays(b.expiryDate);
            const dlabel = days === null ? '' : (days < 0 ? ` · פג לפני ${-days} ימים` : (days === 0 ? ' · פג היום' : ` · בעוד ${days} ימים`));
            return `<div class="batch-row ${cls}">
                <span class="batch-order">${i === 0 ? '⬅ ראשון' : '#' + (i + 1)}</span>
                <span class="batch-qty">${b.qty}</span>
                <span class="batch-exp">${dstr}${dlabel}</span>
                <button class="btn btn-secondary btn-small" onclick="orderSystem.consumeBatch('${b.id}')" title="נוצל / הסר">✔</button>
            </div>`;
        }).join('') + `<div class="batch-total">סה"כ מלאי: ${total}</div>`;
    }

    addBatch() {
        const productId = document.getElementById('batch-product-id').value;
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        const qty = parseFloat(document.getElementById('batch-qty').value);
        const expiry = document.getElementById('batch-expiry').value;
        if (isNaN(qty) || qty <= 0) { alert('נא להזין כמות'); return; }

        this.addBatchToProduct(product, qty, expiry);
        this.saveData('products', this.products);
        document.getElementById('batch-qty').value = '';
        document.getElementById('batch-expiry').value = '';
        this.renderBatches();
        const sid = document.getElementById('inventory-supplier-select').value;
        if (sid) this.renderInventory(sid);
        this.renderDashboard();
    }

    consumeBatch(batchId) {
        const productId = document.getElementById('batch-product-id').value;
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.batches) return;
        if (!confirm('לסמן את האצווה כנוצלה ולהסיר אותה?')) return;
        product.batches = product.batches.filter(b => b.id !== batchId);
        this.recomputeStock(product);
        this.saveData('products', this.products);
        this.renderBatches();
        const sid = document.getElementById('inventory-supplier-select').value;
        if (sid) this.renderInventory(sid);
        this.renderDashboard();
    }

    closeBatchManager() {
        document.getElementById('batch-modal').classList.remove('active');
    }

    // Collect shortages for the selected supplier and pre-fill an order with those amounts.
    createOrderFromShortage() {
        const supplierId = document.getElementById('inventory-supplier-select').value;
        if (!supplierId) { alert('נא לבחור ספק'); return; }

        // Save first so shortages reflect the latest edited values
        this.saveInventory();

        const shortages = this.products
            .filter(p => p.supplierId === supplierId)
            .map(p => ({ id: p.id, shortage: this.productShortage(p) }))
            .filter(x => x.shortage > 0);

        if (shortages.length === 0) {
            this.showAlert('אין מוצרים בחוסר לספק זה 👍', 'info');
            return;
        }

        // Switch to the order screen and select this supplier
        this.switchTab('order');
        const orderSelect = document.getElementById('supplier-select');
        orderSelect.value = supplierId;
        this.onSupplierChange(supplierId);

        // Pre-fill the cart with the shortage amounts
        shortages.forEach(({ id, shortage }) => {
            this.addProductToCart(id, shortage);
        });
        this.updateOrderSummary();

        this.showAlert(`🛒 מולאו ${shortages.length} פריטים בחוסר. בדוק ושלח לאישור.`, 'success');
    }

    // ===========================
    // Shortage reporting (🚩 חסר) — role-holders flag needs → consolidated list → order
    // ===========================

    // Flag a product as missing/needed. qty is optional (prompt allows empty).
    markShortage(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const ans = prompt(`כמה חסר מ"${product.name}"? (אפשר להשאיר ריק)`, '');
        if (ans === null) return; // cancelled
        const qty = ans.trim() === '' ? null : (parseFloat(ans) || null);

        const supplier = this.suppliers.find(s => s.id === product.supplierId);
        const reportedBy = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '';

        // If already reported, update the quantity instead of duplicating
        const existing = this.needs.find(n => n.productId === productId);
        if (existing) {
            existing.qty = qty;
            existing.reportedBy = reportedBy;
            existing.date = new Date().toISOString();
        } else {
            this.needs.push({
                id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
                productId,
                name: product.name,
                supplierId: product.supplierId,
                supplierName: supplier ? supplier.name : 'ללא ספק',
                qty,
                reportedBy,
                date: new Date().toISOString()
            });
        }

        this.saveData('needs', this.needs);
        this.updateNeedsBadge();
        this.showAlert(`🚩 "${product.name}" סומן כחסר`, 'success');
    }

    updateNeedsBadge() {
        const badge = document.getElementById('needs-badge');
        if (!badge) return;
        const count = this.needs.length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    renderNeeds() {
        const container = document.getElementById('needs-list');
        if (!container) return;

        if (this.needs.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין חוסרים מדווחים כרגע 👍</p>';
            return;
        }

        // Group by supplier
        const groups = {};
        this.needs.forEach(n => {
            if (!groups[n.supplierId]) groups[n.supplierId] = { name: n.supplierName, items: [] };
            groups[n.supplierId].items.push(n);
        });

        let html = '';
        Object.keys(groups).forEach(supId => {
            const g = groups[supId];
            let rows = '';
            g.items.forEach(n => {
                const qtyStr = (n.qty !== null && n.qty !== undefined) ? `${n.qty}` : '—';
                const by = n.reportedBy ? ` · דווח ע"י ${n.reportedBy}` : '';
                rows += `
                    <div class="need-row">
                        <span class="need-name">${n.name}</span>
                        <span class="need-qty">כמות: ${qtyStr}</span>
                        <span class="need-by">${by}</span>
                        <button class="btn btn-secondary btn-small" onclick="orderSystem.removeNeed('${n.id}')">✖</button>
                    </div>`;
            });
            html += `
                <div class="need-group">
                    <div class="need-group-head">
                        <span>🛒 ${g.name} <span class="need-count">(${g.items.length})</span></span>
                    </div>
                    ${rows}
                    <div class="need-group-actions">
                        <button class="btn btn-primary btn-small" onclick="orderSystem.createOrderFromNeeds('${supId}')">🛒 צור הזמנה</button>
                        <button class="btn btn-secondary btn-small" onclick="orderSystem.clearSupplierNeeds('${supId}')">🗑️ נקה ספק</button>
                    </div>
                </div>`;
        });
        container.innerHTML = html;
    }

    removeNeed(needId) {
        this.needs = this.needs.filter(n => n.id !== needId);
        this.saveData('needs', this.needs);
        this.renderNeeds();
        this.updateNeedsBadge();
    }

    clearSupplierNeeds(supplierId) {
        if (!confirm('לנקות את כל החוסרים של הספק?')) return;
        this.needs = this.needs.filter(n => n.supplierId !== supplierId);
        this.saveData('needs', this.needs);
        this.renderNeeds();
        this.updateNeedsBadge();
    }

    // Merge a supplier's reported needs into an order (qty defaults to 1 when unspecified)
    createOrderFromNeeds(supplierId) {
        const items = this.needs.filter(n => n.supplierId === supplierId);
        if (items.length === 0) return;

        this.switchTab('order');
        const orderSelect = document.getElementById('supplier-select');
        orderSelect.value = supplierId;
        this.onSupplierChange(supplierId);

        let filled = 0;
        items.forEach(n => {
            const qty = (n.qty !== null && n.qty !== undefined) ? n.qty : 1;
            if (this.addProductToCart(n.productId, qty)) filled++;
        });
        this.updateOrderSummary();

        this.showAlert(`🛒 מולאו ${filled} פריטים מרשימת החוסרים. בדוק, השלם כמויות, ושלח לאישור.`, 'success');
    }

    // ===========================
    // Auto image matching (from the web, by product name)
    // ===========================

    // Maps a Hebrew product name to a real photo URL.
    // Clean ingredient photos from TheMealDB; loremflickr keyword photos as fallback.
    // Order matters — more specific Hebrew phrases must come before generic ones.
    getProductImageUrl(name) {
        if (!name) return '';
        // Match against the catalog, longest keyword first so specific items win
        // (e.g. "חזה עוף" before "עוף", "תפוח אדמ" before "תפוח").
        const entries = PRODUCT_CATALOG.slice().sort((a, b) => b.kw.length - a.kw.length);
        for (const e of entries) {
            if (name.indexOf(e.kw) !== -1) return catalogImage(e);
        }
        return '';
    }

    autoFillImages(silent) {
        let count = 0;
        this.products.forEach(p => {
            if (!p.image) {
                const url = this.getProductImageUrl(p.name);
                if (url) { p.image = url; count++; }
            }
        });

        if (count > 0) {
            this.saveData('products', this.products);
            this.renderAllProducts();
            const sid = document.getElementById('supplier-select').value;
            if (sid) this.loadProducts(sid);
        }

        if (!silent) {
            this.showAlert(
                count > 0 ? `✅ נוספו תמונות ל-${count} מוצרים מהאינטרנט` : 'כל המוצרים כבר עם תמונה (או שאין התאמה אוטומטית)',
                count > 0 ? 'success' : 'info'
            );
        }
        return count;
    }

    // Add every catalog product that isn't already in the bank (idempotent).
    seedCatalog(silent) {
        const existing = new Set(this.products.map(p => p.supplierId + '|' + p.name));
        let added = 0;

        PRODUCT_CATALOG.forEach(e => {
            const key = e.sup + '|' + e.he;
            if (!existing.has(key)) {
                this.products.push({
                    id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
                    supplierId: e.sup,
                    name: e.he,
                    price: e.price,
                    unit: e.unit,
                    image: catalogImage(e)
                });
                existing.add(key);
                added++;
            }
        });

        if (added > 0) {
            this.saveData('products', this.products);
            this.renderAllProducts();
            const sid = document.getElementById('supplier-select').value;
            if (sid) this.loadProducts(sid);
        }

        if (!silent) {
            this.showAlert(
                added > 0 ? `✅ נוספו ${added} מוצרים מהקטלוג` : 'כל מוצרי הקטלוג כבר קיימים',
                'success'
            );
        }
        return added;
    }

    // ===========================
    // Staff management
    // ===========================

    renderStaff() {
        const container = document.getElementById('staff-list');
        if (!container) return;
        if (!this.staff.length) {
            container.innerHTML = '<p class="alert alert-info">אין אנשי צוות</p>';
            return;
        }
        container.innerHTML = '';
        this.staff.forEach(member => {
            const row = document.createElement('div');
            row.className = 'managed-product';
            row.innerHTML = `
                <span class="managed-product-name">👤 ${member.name}</span>
                <button class="btn btn-secondary btn-small" onclick="orderSystem.deleteStaff('${member.id}')">🗑️</button>
            `;
            container.appendChild(row);
        });
    }

    addStaff() {
        const input = document.getElementById('staff-name-input');
        const name = input.value.trim();
        if (!name) { alert('נא להזין שם/תפקיד'); return; }

        this.staff.push({ id: Date.now().toString(), name });
        this.saveData('staff', this.staff);
        input.value = '';
        this.renderStaff();
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        this.showAlert('✅ נוסף לצוות', 'success');
    }

    deleteStaff(id) {
        if (!confirm('למחוק איש צוות זה?')) return;
        this.staff = this.staff.filter(s => s.id !== id);
        this.saveData('staff', this.staff);
        this.renderStaff();
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        this.showAlert('נמחק מהצוות', 'success');
    }

    // ===========================
    // User management (name + password + role) — chef-controlled login accounts
    // ===========================

    roleLabel(role) {
        return role === 'admin' ? '👑 מנהל (שף)' : '👤 עובד';
    }

    renderUsers() {
        const container = document.getElementById('users-list');
        if (!container) return;
        if (!this.users.length) {
            container.innerHTML = '<p class="alert alert-info">אין משתמשים</p>';
            return;
        }
        container.innerHTML = '';
        this.users.forEach(u => {
            const row = document.createElement('div');
            row.className = 'user-row';
            row.innerHTML = `
                <span class="user-row-name">${u.name}</span>
                <span class="user-row-role">${this.roleLabel(u.role)}</span>
                <button class="btn btn-primary btn-small" onclick="orderSystem.editUser('${u.id}')">✏️</button>
                <button class="btn btn-secondary btn-small" onclick="orderSystem.deleteUser('${u.id}')">🗑️</button>
            `;
            container.appendChild(row);
        });
    }

    addUser() {
        const nameEl = document.getElementById('user-name-input');
        const passEl = document.getElementById('user-password-input');
        const roleEl = document.getElementById('user-role-input');
        const name = nameEl.value.trim();
        const password = passEl.value.trim();
        const role = roleEl.value;

        if (!name || !password) { alert('נא למלא שם וסיסמה'); return; }
        if (this.users.some(u => u.name === name)) { alert('כבר קיים משתמש עם השם הזה'); return; }

        this.users.push({ id: 'u' + Date.now(), name, password, role });
        this.saveData('users', this.users);
        nameEl.value = ''; passEl.value = '';
        this.renderUsers();
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        this.showAlert('✅ המשתמש נוסף', 'success');
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) return;
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.name;
        document.getElementById('edit-user-password').value = user.password;
        document.getElementById('edit-user-role').value = user.role;
        document.getElementById('edit-user-modal').classList.add('active');
    }

    saveUserEdit() {
        const id = document.getElementById('edit-user-id').value;
        const user = this.users.find(u => u.id === id);
        if (!user) return;
        const name = document.getElementById('edit-user-name').value.trim();
        const password = document.getElementById('edit-user-password').value.trim();
        if (!name || !password) { alert('נא למלא שם וסיסמה'); return; }
        if (this.users.some(u => u.id !== id && u.name === name)) { alert('כבר קיים משתמש אחר עם השם הזה'); return; }

        user.name = name;
        user.password = password;
        user.role = document.getElementById('edit-user-role').value;
        this.saveData('users', this.users);
        this.closeUserEditModal();
        this.renderUsers();
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        this.showAlert('✅ המשתמש עודכן', 'success');
    }

    closeUserEditModal() {
        document.getElementById('edit-user-modal').classList.remove('active');
    }

    deleteUser(id) {
        const admins = this.users.filter(u => u.role === 'admin');
        const target = this.users.find(u => u.id === id);
        if (target && target.role === 'admin' && admins.length <= 1) {
            alert('לא ניתן למחוק את המנהל האחרון');
            return;
        }
        if (!confirm('למחוק את המשתמש?')) return;
        this.users = this.users.filter(u => u.id !== id);
        this.saveData('users', this.users);
        this.renderUsers();
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        this.showAlert('המשתמש נמחק', 'success');
    }

    // ===========================
    // Excel Import
    // ===========================

    handleExcelFile(event) {
        const file = event.target.files[0];
        if (!file) {
            // Clear everything if no file
            this.clearExcelPreview();
            return;
        }

        const supplierId = document.getElementById('excel-supplier-select').value;
        if (!supplierId) {
            alert('נא לבחור ספק לפני העלאת הקובץ');
            event.target.value = '';
            this.clearExcelPreview();
            return;
        }

        document.getElementById('file-name').textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                this.processExcelData(jsonData, supplierId);
            } catch (error) {
                alert('שגיאה בקריאת הקובץ: ' + error.message);
                this.clearExcelPreview();
            }
        };

        reader.readAsArrayBuffer(file);
    }

    processExcelData(data, supplierId) {
        const products = [];
        let startRow = 0;

        // Filter out empty rows first
        const filteredData = data.filter(row => {
            if (!row || row.length === 0) return false;
            // Check if row has at least one non-empty cell
            return row.some(cell => cell !== null && cell !== undefined && cell !== '');
        });

        if (filteredData.length === 0) {
            alert('הקובץ ריק או לא מכיל נתונים');
            this.clearExcelPreview();
            return;
        }

        // Check if first row is header
        const firstRow = filteredData[0];
        if (firstRow && firstRow[0]) {
            const firstCell = String(firstRow[0]).trim().toLowerCase();
            const secondCell = firstRow[1] ? String(firstRow[1]).trim().toLowerCase() : '';
            
            // If first row contains header words or second cell is not a number
            if (firstCell.includes('שם') || firstCell.includes('מוצר') || 
                firstCell.includes('name') || firstCell.includes('product') ||
                (secondCell && (secondCell.includes('מחיר') || secondCell.includes('price') || isNaN(parseFloat(firstRow[1]))))) {
                startRow = 1; // Skip header
            }
        }

        // Process data
        for (let i = startRow; i < filteredData.length; i++) {
            const row = filteredData[i];
            if (!row || row.length < 2) continue;

            // Get name from first column
            const nameCell = row[0];
            if (nameCell === null || nameCell === undefined || nameCell === '') continue;
            
            const name = String(nameCell).trim();
            if (!name || name.length < 1) continue;

            // Get price from second column
            const priceCell = row[1];
            let price = parseFloat(priceCell);
            
            // Handle price with commas (e.g., "10,50")
            if (isNaN(price) && typeof priceCell === 'string') {
                price = parseFloat(priceCell.replace(',', '.'));
            }
            
            if (isNaN(price) || price < 0) continue;

            // Get unit from third column (default to ק״ג)
            let unit = 'ק״ג';
            if (row[2]) {
                const unitCell = String(row[2]).trim();
                if (unitCell && unitCell !== '') {
                    unit = unitCell;
                }
            }

            products.push({ name, price, unit });
        }

        if (products.length === 0) {
            alert('לא נמצאו מוצרים תקינים בקובץ.\n\nוודא שהפורמט נכון:\nעמודה A: שם מוצר\nעמודה B: מחיר (מספר)\nעמודה C: יחידה (אופציונלי)');
            this.clearExcelPreview();
            return;
        }

        this.excelPreviewData = { supplierId, products };
        this.showExcelPreview();
    }

    showExcelPreview() {
        const preview = document.getElementById('excel-preview');
        const content = document.getElementById('preview-content');
        
        const { products } = this.excelPreviewData;

        let html = '<table class="preview-table"><thead><tr><th>שם מוצר</th><th>מחיר</th><th>יחידה</th></tr></thead><tbody>';
        
        products.forEach(p => {
            html += `<tr><td>${p.name}</td><td>₪${p.price.toFixed(2)}</td><td>${p.unit}</td></tr>`;
        });
        
        html += '</tbody></table>';
        html += `<p class="alert alert-info">נמצאו ${products.length} מוצרים</p>`;

        content.innerHTML = html;
        preview.style.display = 'block';
    }

    importExcelProducts() {
        if (!this.excelPreviewData) return;

        const { supplierId, products } = this.excelPreviewData;
        const count = products.length;

        products.forEach(p => {
            const newProduct = {
                id: Date.now().toString() + Math.random(),
                supplierId,
                name: p.name,
                price: p.price,
                unit: p.unit
            };
            this.products.push(newProduct);
        });

        this.saveData('products', this.products);

        // Clear everything
        this.clearExcelPreview();
        
        // Refresh products list
        this.renderAllProducts();

        this.showAlert(`✅ יובאו ${count} מוצרים בהצלחה!`, 'success');
    }

    clearExcelPreview() {
        // Clear preview display
        const preview = document.getElementById('excel-preview');
        if (preview) {
            preview.style.display = 'none';
        }
        
        const content = document.getElementById('preview-content');
        if (content) {
            content.innerHTML = '';
        }
        
        // Clear file input
        const fileInput = document.getElementById('excel-file');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clear file name display
        const fileName = document.getElementById('file-name');
        if (fileName) {
            fileName.textContent = '';
        }
        
        // Clear supplier selection
        const supplierSelect = document.getElementById('excel-supplier-select');
        if (supplierSelect) {
            supplierSelect.value = '';
        }
        
        // Clear data
        this.excelPreviewData = null;
    }

    // ===========================
    // Order Management
    // ===========================

    setDefaultDeliveryDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        document.getElementById('delivery-date').value = dateStr;
    }

    onSupplierChange(supplierId) {
        // Reset cart and ad-hoc manual items whenever the supplier changes
        this.currentOrder = [];
        this.manualItems = [];
        this.renderManualItems();
        this.updateOrderSummary();
        this.updateSendButtonLabel();

        // Reset the search box
        const searchInput = document.getElementById('product-search');
        if (searchInput) searchInput.value = '';
        const searchEmpty = document.getElementById('search-empty');
        if (searchEmpty) searchEmpty.style.display = 'none';

        const repeatBtn = document.getElementById('repeat-last-order-btn');

        if (!supplierId) {
            document.getElementById('products-list').innerHTML = '';
            document.getElementById('delivery-date-section').style.display = 'none';
            document.getElementById('product-search-section').style.display = 'none';
            document.getElementById('manual-item-section').style.display = 'none';
            document.getElementById('shipping-settings').style.display = 'none';
            if (repeatBtn) repeatBtn.style.display = 'none';
            return;
        }

        document.getElementById('delivery-date-section').style.display = 'block';
        document.getElementById('manual-item-section').style.display = 'block';
        this.loadProducts(supplierId);

        // Show "repeat last order" only if this supplier has a prior order in history
        if (repeatBtn) {
            const supplier = this.suppliers.find(s => s.id === supplierId);
            const hasPrev = supplier && this.history.some(h => h.supplier === supplier.name);
            repeatBtn.style.display = hasPrev ? 'block' : 'none';
        }

        this.updateSupplierEmailWarning();
    }

    updateSupplierEmailWarning() {
        const box = document.getElementById('supplier-email-warning');
        if (!box) return;

        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        if (!supplier) {
            box.style.display = 'none';
            return;
        }

        const wantsEmail = this.preferences.sendMethod === 'email' || this.preferences.sendMethod === 'both';
        const wantsWhatsApp = this.preferences.sendMethod === 'whatsapp' || this.preferences.sendMethod === 'both';
        const lines = [];
        let hasError = false;

        if (wantsWhatsApp) {
            const waPhone = this.getSupplierWhatsAppPhone(supplier);
            if (!waPhone) {
                lines.push('⚠️ חסר טלפון לשליחת WhatsApp — הזן טלפון סוכן או טלפון ראשי');
                hasError = true;
            } else {
                const label = supplier.agentPhone ? 'סוכן' : 'ראשי';
                lines.push(`📱 WhatsApp יישלח ל: ${waPhone} (${label})`);
            }
        }

        if (wantsEmail) {
            const err = this.validateSupplierEmail(supplier.email);
            if (err) {
                lines.push(`⚠️ ${err}`);
                hasError = true;
            } else {
                lines.push(`📧 מייל יישלח ל: ${supplier.email}`);
            }
        }

        if (!wantsEmail && !wantsWhatsApp) {
            box.style.display = 'none';
            return;
        }

        box.className = 'alert alert-info';
        box.style.display = 'block';
        box.style.borderColor = hasError ? '#e65100' : '';
        box.style.background = hasError ? '#fff3e0' : '';
        box.innerHTML = lines.join('<br>') + (hasError
            ? `<br><button type="button" class="btn btn-primary btn-small" style="margin-top:8px" onclick="orderSystem.editSupplier('${supplier.id}')">✏️ עדכן פרטי ספק</button>`
            : '');
    }

    // Pre-fill the order with the quantities from this supplier's most recent order
    repeatLastOrder() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        const last = this.history.find(h => h.supplier === supplier.name);
        if (!last || !Array.isArray(last.items) || last.items.length === 0) {
            this.showAlert('אין הזמנה קודמת לספק זה', 'info');
            return;
        }

        this.clearOrder(); // reset cart + manual items first

        last.items.forEach(it => {
            if (it.manual) {
                this.manualItems.push({ name: it.product, quantity: it.quantity, unit: it.unit, price: it.price || 0 });
                return;
            }
            const prod = this.products.find(p => p.supplierId === supplierId && p.name === it.product);
            if (prod) {
                this.addProductToCart(prod.id, it.quantity, it.unit);
            } else {
                this.manualItems.push({ name: it.product, quantity: it.quantity, unit: it.unit, price: it.price || 0 });
            }
        });

        this.renderManualItems();
        this.updateOrderSummary();
        this.showAlert(`🔁 נטענה ההזמנה האחרונה (${last.items.length} פריטים). בדוק את הסל ושלח.`, 'success');
    }

    filterProducts(term) {
        const query = (term || '').trim().toLowerCase();
        const cards = document.querySelectorAll('#products-list .product-card');
        let visible = 0;

        cards.forEach(card => {
            const nameEl = card.querySelector('.product-card-name');
            const name = nameEl ? nameEl.textContent.toLowerCase() : '';
            const match = !query || name.includes(query);
            card.classList.toggle('filtered-out', !match);
            if (match) visible++;
        });

        const empty = document.getElementById('search-empty');
        if (empty) empty.style.display = (visible === 0 && cards.length > 0) ? 'block' : 'none';
    }

    addManualItem() {
        const nameEl = document.getElementById('manual-item-name');
        const qtyEl = document.getElementById('manual-item-qty');
        const unitEl = document.getElementById('manual-item-unit');
        const priceEl = document.getElementById('manual-item-price');

        const name = nameEl.value.trim();
        const quantity = parseFloat(qtyEl.value);
        const unit = unitEl.value;
        const price = parseFloat(priceEl.value) || 0;

        if (!name) {
            alert('נא להזין שם פריט');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            alert('נא להזין כמות תקינה');
            return;
        }

        this.manualItems.push({ name, quantity, unit, price });

        // Clear form
        nameEl.value = '';
        qtyEl.value = '';
        priceEl.value = '';
        nameEl.focus();

        this.renderManualItems();
        this.updateOrderSummary();
    }

    removeManualItem(index) {
        this.manualItems.splice(index, 1);
        this.renderManualItems();
        this.updateOrderSummary();
    }

    renderManualItems() {
        const container = document.getElementById('manual-items-list');
        if (!container) return;

        if (this.manualItems.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        this.manualItems.forEach((item, index) => {
            const priceStr = item.price > 0 ? ` — ₪${item.price.toFixed(2)}` : '';
            html += `
                <div class="manual-item-row">
                    <span class="manual-item-text">✍️ ${item.name}: ${item.quantity} ${item.unit}${priceStr}</span>
                    <button class="btn btn-secondary btn-small" onclick="orderSystem.removeManualItem(${index})">✖</button>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    loadProducts(supplierId) {
        const container = document.getElementById('products-list');
        const products = this.products.filter(p => p.supplierId === supplierId);

        if (products.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין מוצרים לספק זה. הוסף מוצרים בטאב "מוצרים"</p>';
            document.getElementById('product-search-section').style.display = 'none';
            return;
        }

        document.getElementById('product-search-section').style.display = 'block';

        const grid = document.createElement('div');
        grid.className = 'product-grid';

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const inCart = this.getCartItemForProduct(product.id);

            const imageArea = product.image
                ? `<div class="product-card-img has-img" data-image-id="${product.id}" style="background-image:url('${product.image}')">
                       <button class="img-edit-btn" data-image-id="${product.id}" title="החלף תמונה">📷</button>
                   </div>`
                : `<div class="product-card-img no-img" data-image-id="${product.id}">
                       <span class="img-placeholder">📷<br>הוסף תמונה</span>
                   </div>`;

            const unitOptions = ['ק״ג', 'יחידה', 'ארגז', 'קרטון'].map(u =>
                `<option value="${u}" ${(inCart ? inCart.unit : product.unit) === u ? 'selected' : ''}>${u}</option>`
            ).join('');

            card.innerHTML = `
                ${imageArea}
                <div class="product-card-body">
                    <div class="product-card-name">${product.name}</div>
                    <div class="product-card-price">₪${Number(product.price).toFixed(2)} / ${product.unit}</div>
                    <div class="shortage-block">
                        <label class="shortage-label">חוסר:</label>
                        <div class="shortage-row">
                            <input type="number" class="shortage-input" data-product-id="${product.id}" min="0" step="0.5" placeholder="כמות" inputmode="decimal">
                            <select class="unit-select" data-product-id="${product.id}">${unitOptions}</select>
                            <button class="update-shortage-btn" data-product-id="${product.id}" type="button">עדכן</button>
                        </div>
                    </div>
                    ${inCart ? `<div class="in-cart-badge">✔ ברשימה: ${inCart.quantity} ${inCart.unit}</div>` : ''}
                    <button class="flag-shortage-btn" onclick="orderSystem.markShortage('${product.id}')" type="button">🚩 דווח חוסר למחסנאי</button>
                </div>
            `;
            if (inCart) card.classList.add('selected');
            grid.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(grid);

        grid.querySelectorAll('.update-shortage-btn').forEach(btn => {
            btn.addEventListener('click', () => this.updateProductShortage(btn.dataset.productId));
        });

        grid.querySelectorAll('.shortage-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.updateProductShortage(input.dataset.productId);
                }
            });
        });

        // Image add / change (tap the image area)
        grid.querySelectorAll('.product-card-img').forEach(area => {
            area.addEventListener('click', () => this.openImagePicker(area.dataset.imageId));
        });

        document.getElementById('shipping-settings').style.display = 'block';
        this.updateOrderSummary();
        this.updateSendButtonLabel();
    }

    getCartItemForProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return null;
        return this.currentOrder.find(
            o => o.productId === productId || (o.product === product.name && !o.manual)
        ) || null;
    }

    setProductInCart(productId, qty, unitOverride) {
        const quantity = parseFloat(qty);
        const product = this.products.find(p => p.id === productId);
        if (!product) return false;

        const unitSelect = document.querySelector(`.unit-select[data-product-id="${productId}"]`);
        const selectedUnit = unitOverride || (unitSelect ? unitSelect.value : product.unit);

        this.currentOrder = this.currentOrder.filter(
            o => o.productId !== productId && !(o.product === product.name && !o.manual)
        );

        if (!quantity || quantity <= 0) {
            this.syncProductCardFromCart(productId);
            this.updateOrderSummary();
            this.updateSendButtonLabel();
            return false;
        }

        this.currentOrder.push({
            productId: product.id,
            product: product.name,
            sku: product.sku || product.id,
            quantity: quantity,
            unit: selectedUnit,
            price: product.price,
            total: product.price * quantity,
            stockQty: Number(product.stockQty) || 0,
            parLevel: Number(product.parLevel) || 0
        });

        this.syncProductCardFromCart(productId);
        return true;
    }

    updateProductShortage(productId) {
        const input = document.querySelector(`.shortage-input[data-product-id="${productId}"]`);
        const raw = input ? input.value.trim() : '';
        const qty = raw === '' ? 0 : parseFloat(raw);
        const unitSelect = document.querySelector(`.unit-select[data-product-id="${productId}"]`);
        const unit = unitSelect ? unitSelect.value : undefined;
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        if (raw !== '' && (isNaN(qty) || qty < 0)) {
            this.showAlert('נא להזין כמות תקינה', 'info');
            return;
        }

        const hadItem = !!this.getCartItemForProduct(productId);
        this.setProductInCart(productId, qty, unit);
        this.updateOrderSummary();
        this.updateSendButtonLabel();

        if (qty > 0) {
            this.showAlert(`✅ ${product.name}: ${qty} ${unit} — עודכן ברשימה`, 'success');
            if (input) input.value = '';
        } else if (hadItem) {
            this.showAlert(`${product.name} הוסר מרשימת הקניות`, 'info');
        }
    }

    syncProductCardFromCart(productId) {
        const input = document.querySelector(`.shortage-input[data-product-id="${productId}"]`);
        const card = input ? input.closest('.product-card') : null;
        if (!card) return;

        const item = this.getCartItemForProduct(productId);
        card.classList.toggle('selected', !!item);

        let badge = card.querySelector('.in-cart-badge');
        if (item) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'in-cart-badge';
                const block = card.querySelector('.shortage-block');
                if (block) block.insertAdjacentElement('afterend', badge);
            }
            badge.textContent = `✔ ברשימה: ${item.quantity} ${item.unit}`;
        } else if (badge) {
            badge.remove();
        }
    }

    // Bulk pre-fill: set quantity in cart (inventory / needs / repeat order)
    addProductToCart(productId, qty, unitOverride) {
        return this.setProductInCart(productId, qty, unitOverride);
    }

    removeCartItem(index) {
        const item = this.currentOrder[index];
        this.currentOrder.splice(index, 1);
        if (item && item.productId) {
            this.syncProductCardFromCart(item.productId);
        } else if (item) {
            const prod = this.products.find(p => p.name === item.product);
            if (prod) this.syncProductCardFromCart(prod.id);
        }
        this.updateOrderSummary();
        this.updateSendButtonLabel();
    }

    updateSendButtonLabel() {
        const btn = document.getElementById('send-order-btn');
        if (!btn) return;
        const isAdmin = typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.role === 'admin';
        const count = this.currentOrder.length + this.manualItems.length;
        btn.textContent = count > 0 ? `📤 שלח לאישור השף (${count})` : '📤 שלח לאישור השף';
    }

    // ===========================
    // Product Images
    // ===========================

    openImagePicker(productId) {
        this.pendingImageProductId = productId;
        this.pendingImageMode = 'existing';
        const input = document.getElementById('product-image-input');
        if (input) {
            input.value = '';
            input.click();
        }
    }

    startScanNewProduct() {
        const input = document.getElementById('product-image-input');
        if (!input) return;
        this.pendingImageProductId = '__new_product__';
        this.pendingImageMode = 'newProduct';
        input.value = '';
        input.click();
    }

    handleProductImage(event) {
        const file = event.target.files[0];
        const productId = this.pendingImageProductId;
        if (!file || !productId) return;

        if (!file.type.startsWith('image/')) {
            alert('נא לבחור קובץ תמונה');
            return;
        }

        if (this.pendingImageMode === 'newProduct') {
            this.handleNewProductFromImage(file).finally(() => {
                this.pendingImageProductId = null;
                this.pendingImageMode = 'existing';
            });
            return;
        }

        this.compressImage(file, 256, 0.7)
            .then(dataUrl => {
                const product = this.products.find(p => p.id === productId);
                if (!product) return;
                product.image = dataUrl;
                try {
                    this.saveData('products', this.products);
                } catch (e) {
                    delete product.image;
                    alert('אין מספיק מקום לאחסון התמונה. נסה תמונה קטנה יותר או מחק תמונות ישנות.');
                    return;
                }
                // Refresh wherever the product is shown
                const currentSupplierId = document.getElementById('supplier-select').value;
                if (currentSupplierId) this.loadProducts(currentSupplierId);
                this.renderAllProducts();
            })
            .catch(() => alert('שגיאה בעיבוד התמונה'))
            .finally(() => {
                this.pendingImageProductId = null;
                this.pendingImageMode = 'existing';
            });
    }

    async handleNewProductFromImage(file) {
        try {
            const [dataUrl, detected] = await Promise.all([
                this.compressImage(file, 320, 0.8),
                this.detectProductFromImage(file)
            ]);
            this.pendingNewProductImage = dataUrl;

            const supplierSelect = document.getElementById('product-supplier-select');
            const nameInput = document.getElementById('product-name');
            const unitSelect = document.getElementById('product-unit');
            const priceInput = document.getElementById('product-price');

            if (supplierSelect && detected.supplierId) supplierSelect.value = detected.supplierId;
            if (nameInput) nameInput.value = detected.name || 'מוצר חדש';
            if (unitSelect && detected.unit) unitSelect.value = detected.unit;
            if (priceInput && Number.isFinite(detected.price)) priceInput.value = detected.price;

            const confidenceText = Math.round((detected.confidence || 0) * 100);
            this.showAlert(`📷 זוהה: ${detected.name || 'מוצר חדש'} (${confidenceText}% ביטחון). בדוק ולחץ "הוסף מוצר".`, 'success');
        } catch (_) {
            this.showAlert('לא הצלחתי לזהות מוצר מהצילום. הוספתי את התמונה, מלא את השדות ידנית.', 'info');
        }
    }

    async detectProductFromImage(file) {
        const rawName = (file.name || '').replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim();
        const normalized = rawName.toLowerCase();
        const barcode = await this.detectBarcodeFromFile(file);

        let best = null;
        if (normalized) {
            const ranked = PRODUCT_CATALOG.slice().sort((a, b) => b.kw.length - a.kw.length);
            best = ranked.find(e => normalized.includes(String(e.kw || '').toLowerCase()) || normalized.includes(String(e.he || '').toLowerCase())) || null;
        }

        if (!best && barcode) {
            // Placeholder for future barcode catalog mapping
            best = null;
        }

        if (best) {
            return {
                name: best.he,
                supplierId: best.sup,
                unit: best.unit || 'יחידה',
                price: best.price,
                confidence: normalized ? 0.78 : 0.65
            };
        }

        return {
            name: rawName || 'מוצר חדש',
            supplierId: document.getElementById('product-supplier-select')?.value || '',
            unit: 'יחידה',
            price: '',
            confidence: rawName ? 0.45 : 0.25
        };
    }

    async detectBarcodeFromFile(file) {
        if (!('BarcodeDetector' in window)) return '';
        try {
            const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
            const bitmap = await createImageBitmap(file);
            const codes = await detector.detect(bitmap);
            return (codes[0] && codes[0].rawValue) ? codes[0].rawValue : '';
        } catch (_) {
            return '';
        }
    }

    // Resize + compress an image file to a small JPEG data URL (fits localStorage)
    compressImage(file, maxSize, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let { width, height } = img;
                    if (width > height && width > maxSize) {
                        height = Math.round(height * (maxSize / width));
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = Math.round(width * (maxSize / height));
                        height = maxSize;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    updateOrderSummary() {
        const container = document.getElementById('order-summary');
        let total = 0;

        if (this.currentOrder.length === 0 && this.manualItems.length === 0) {
            container.innerHTML = '<p class="cart-empty-hint">הרשימה ריקה — הזן חוסר ליד כל מוצר ולחץ "עדכן"</p>';
            this.updateSendButtonLabel();
            return;
        }

        let html = '';
        this.currentOrder.forEach((item, index) => {
            total += item.total;
            html += `<div class="cart-item-row">
                <span>• ${item.product}: ${item.quantity} ${item.unit}`;
            if (this.preferences.showPrices) {
                html += ` = ₪${item.total.toFixed(2)}`;
            }
            html += `</span>
                <button class="btn btn-secondary btn-small" onclick="orderSystem.removeCartItem(${index})">✖</button>
            </div>`;
        });

        this.manualItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `<div class="cart-item-row">
                <span>✍️ ${item.name}: ${item.quantity} ${item.unit}`;
            if (this.preferences.showPrices && item.price > 0) {
                html += ` = ₪${itemTotal.toFixed(2)}`;
            }
            html += `</span></div>`;
        });

        if (this.preferences.showPrices) {
            html += `<div style="margin-top: 10px; font-weight: bold; font-size: 18px;">סה"כ: ₪${total.toFixed(2)}</div>`;
        }

        container.innerHTML = html;
        this.updateSendButtonLabel();
    }

    getOrderItems() {
        const items = this.currentOrder.map(o => ({ ...o }));
        this.manualItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            items.push({
                product: item.name,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                total: itemTotal,
                manual: true
            });
        });
        return items;
    }

    enrichOrderItem(item) {
        if (item.manual) {
            return {
                ...item,
                sku: item.sku || '—',
                stockQty: item.stockQty != null ? item.stockQty : '—',
                parLevel: item.parLevel != null ? item.parLevel : '—'
            };
        }
        const product = this.products.find(
            p => p.id === item.productId || p.name === item.product
        );
        return {
            ...item,
            sku: item.sku || (product && (product.sku || product.id)) || '—',
            stockQty: item.stockQty != null ? item.stockQty : (product ? (Number(product.stockQty) || 0) : '—'),
            parLevel: item.parLevel != null ? item.parLevel : (product ? (Number(product.parLevel) || 0) : '—')
        };
    }

    escapeHtml(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Structured market-list email: plain text + HTML table
    buildOrderEmailContent(opts) {
        const {
            supplierName,
            deliveryDate,
            orderDate,
            items,
            showPrices,
            orderedBy,
            approvedBy,
            note
        } = opts;

        const orderDateStr = orderDate
            ? new Date(orderDate).toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : new Date().toLocaleDateString('he-IL');
        const orderTimeStr = orderDate
            ? new Date(orderDate).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        const deliveryStr = deliveryDate
            ? new Date(deliveryDate).toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : '—';

        const enriched = items.map(it => this.enrichOrderItem(it));
        let total = 0;

        // —— Plain text (fallback / WhatsApp-style) ——
        let text = `רשימת הזמנה — ${supplierName}\n`;
        text += `${'='.repeat(42)}\n`;
        text += `תאריך הזמנה: ${orderDateStr} ${orderTimeStr}\n`;
        text += `תאריך אספקה מבוקש: ${deliveryStr}\n`;
        if (orderedBy) text += `הוזמן ע"י: ${orderedBy}\n`;
        if (approvedBy) text += `אושר ע"י: ${approvedBy}\n`;
        if (note) text += `📝 הערה: ${note}\n`;
        text += `\n`;
        text += '#  | מק"ט    | שם פריט              | כמות | יחידה  | מלאי | פתיחה';
        if (showPrices) text += ' | מחיר   | סה"כ';
        text += '\n';
        text += '-'.repeat(showPrices ? 78 : 62) + '\n';

        enriched.forEach((it, i) => {
            const lineTotal = it.total != null ? it.total : (it.price || 0) * it.quantity;
            total += lineTotal;
            const name = String(it.product).slice(0, 20).padEnd(20);
            const sku = String(it.sku).slice(0, 7).padEnd(7);
            text += `${String(i + 1).padStart(2)} | ${sku} | ${name} | ${String(it.quantity).padStart(4)} | ${String(it.unit).padEnd(6)} | ${String(it.stockQty).padStart(4)} | ${String(it.parLevel).padStart(5)}`;
            if (showPrices) {
                text += ` | ${(it.price || 0).toFixed(2).padStart(6)} | ${lineTotal.toFixed(2).padStart(7)}`;
            }
            text += '\n';
        });

        if (showPrices) {
            text += `\nסה"כ להזמנה: ₪${total.toFixed(2)}\n`;
        }
        text += `\nתודה!\n`;

        // —— HTML market list ——
        const priceHeaders = showPrices
            ? '<th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">מחיר יח׳</th><th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">סה״כ</th>'
            : '';
        let rows = '';
        enriched.forEach((it, i) => {
            const lineTotal = it.total != null ? it.total : (it.price || 0) * it.quantity;
            const bg = i % 2 === 0 ? '#ffffff' : '#f1f8e9';
            const priceCells = showPrices
                ? `<td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;background:${bg}">₪${(it.price || 0).toFixed(2)}</td>
                   <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;font-weight:700;background:${bg}">₪${lineTotal.toFixed(2)}</td>`
                : '';
            rows += `<tr>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;background:${bg}">${i + 1}</td>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;font-family:monospace;background:${bg}">${this.escapeHtml(it.sku)}</td>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:right;font-weight:600;background:${bg}">${this.escapeHtml(it.product)}${it.manual ? ' ✍️' : ''}</td>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;font-size:16px;font-weight:700;color:#e65100;background:${bg}">${it.quantity}</td>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;background:${bg}">${this.escapeHtml(it.unit)}</td>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;background:${bg}">${it.stockQty}</td>
                <td style="padding:9px 8px;border:1px solid #e0e0e0;text-align:center;background:${bg}">${it.parLevel}</td>
                ${priceCells}
            </tr>`;
        });

        const totalRow = showPrices
            ? `<tr><td colspan="8" style="padding:12px 8px;border:1px solid #c8e6c9;text-align:left;font-weight:700;font-size:16px;background:#e8f5e9">סה״כ להזמנה</td>
               <td style="padding:12px 8px;border:1px solid #c8e6c9;text-align:center;font-weight:700;font-size:16px;background:#e8f5e9">₪${total.toFixed(2)}</td></tr>`
            : '';

        const metaRows = [
            ['ספק', supplierName],
            ['תאריך הזמנה', `${orderDateStr} · ${orderTimeStr}`],
            ['תאריך אספקה מבוקש', deliveryStr],
            orderedBy ? ['הוזמן ע"י', orderedBy] : null,
            approvedBy ? ['אושר ע"י', approvedBy] : null,
            note ? ['📝 הערה', note] : null
        ].filter(Boolean).map(([k, v]) =>
            `<tr><td style="padding:6px 12px;color:#555;font-weight:600;width:140px">${this.escapeHtml(k)}</td>
             <td style="padding:6px 12px;font-weight:700">${this.escapeHtml(v)}</td></tr>`
        ).join('');

        const html = `<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:720px;margin:0 auto;padding:20px">
  <div style="background:linear-gradient(135deg,#2e7d32,#43a047);color:#fff;border-radius:12px 12px 0 0;padding:20px 24px">
    <div style="font-size:22px;font-weight:700">🛒 רשימת הזמנה לספק</div>
    <div style="font-size:15px;margin-top:6px;opacity:0.95">${this.escapeHtml(supplierName)}</div>
  </div>
  <div style="background:#fff;border:1px solid #e0e0e0;border-top:none;padding:16px 24px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">${metaRows}</table>
  </div>
  <div style="background:#fff;border:1px solid #e0e0e0;border-top:none;padding:0 12px 16px;overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:560px">
      <thead><tr>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">#</th>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">מק״ט</th>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">שם פריט</th>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">כמות</th>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">יחידה</th>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">מלאי קיים</th>
        <th style="padding:10px 8px;border:1px solid #c8e6c9;background:#2e7d32;color:#fff;font-size:13px;">מלאי פתיחה</th>
        ${priceHeaders}
      </tr></thead>
      <tbody>${rows}${totalRow}</tbody>
    </table>
  </div>
  <div style="background:#fafafa;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:14px 24px;color:#888;font-size:12px;text-align:center">
    הודעה אוטומטית ממערכת ההזמנות
  </div>
</div>
</body></html>`;

        const subjectDate = orderDate
            ? new Date(orderDate).toLocaleDateString('he-IL')
            : new Date().toLocaleDateString('he-IL');

        return { text, html, subject: `רשימת הזמנה — ${supplierName} — ${subjectDate}` };
    }

    getCurrentOrderEmailPayload() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        const orderItems = this.getOrderItems();
        if (!supplier || orderItems.length === 0) return null;

        const orderedBy = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name)
            ? authSystem.currentUser.name : '';

        const noteEl = document.getElementById('order-note');
        return this.buildOrderEmailContent({
            supplierName: supplier.name,
            deliveryDate: document.getElementById('delivery-date').value,
            orderDate: new Date().toISOString(),
            items: orderItems,
            showPrices: this.preferences.showPrices,
            orderedBy,
            note: noteEl ? noteEl.value.trim() : ''
        });
    }

    generateOrderMessage() {
        const payload = this.getCurrentOrderEmailPayload();
        return payload ? payload.text : '';
    }

    // Route to approval flow or direct send (chef/admin)
    submitOrder() {
        // Everyone (including the chef) submits to the chef for approval
        this.submitForApproval();
    }

    // Chef/admin: build order and send immediately without pending step
    async submitAndSendDirectly() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        const orderItems = this.getOrderItems();

        if (!supplier || orderItems.length === 0) {
            alert('נא לבחור ספק ולהוסיף מוצרים לסל');
            return;
        }

        if (!confirm(`לאשר ולשלוח את ההזמנה לספק "${supplier.name}"?`)) return;

        const emailPayload = this.getCurrentOrderEmailPayload();
        const message = emailPayload ? emailPayload.text : '';
        const deliveryDate = document.getElementById('delivery-date').value;
        const procurementEmail = this.approvalSettings.procurementEmail;
        const orderId = Date.now().toString();

        await this.dispatchOrder(supplier, message, this.preferences.sendMethod, procurementEmail, emailPayload);

        const managerPhone = this.approvalSettings.managerPhone;
        if (managerPhone) {
            const managerMessage = `📋 הזמנה אושרה ונשלחה לספק\nספק: ${supplier.name}\n\n${message}`;
            setTimeout(() => this.openWhatsApp(managerPhone, managerMessage), 1200);
        }

        this.history.unshift({
            id: orderId,
            date: new Date().toISOString(),
            supplier: supplier.name,
            items: orderItems,
            message: message,
            deliveryDate: deliveryDate,
            sendMethod: this.preferences.sendMethod,
            showedPrices: this.preferences.showPrices,
            createdByName: (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '',
            approvedByName: (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '',
            approved: true
        });
        this.saveData('history', this.history);

        this.clearOrder();
        this.loadHistory();
        this.showAlert('✅ ההזמנה אושרה ונשלחה לספק', 'success');
    }

    // Step 1: Employee submits the order for the chef's approval
    submitForApproval() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        const orderItems = this.getOrderItems();

        if (!supplier || orderItems.length === 0) {
            alert('נא לבחור ספק ולהוסיף מוצרים לסל');
            return null;
        }

        const emailPayload = this.getCurrentOrderEmailPayload();
        const message = emailPayload ? emailPayload.text : '';
        const deliveryDate = document.getElementById('delivery-date').value;

        const pendingOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            supplierId: supplier.id,
            supplierSnapshot: {
                name: supplier.name,
                phone: supplier.phone,
                agentPhone: supplier.agentPhone || '',
                email: supplier.email
            },
            items: orderItems,
            message: message,
            deliveryDate: deliveryDate,
            sendMethod: this.preferences.sendMethod,
            showedPrices: this.preferences.showPrices,
            createdBy: (typeof authSystem !== 'undefined' && authSystem.currentUser) ? authSystem.currentUser.role : 'unknown',
            createdByName: (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '',
            status: 'pending'
        };

        this.pendingOrders.unshift(pendingOrder);
        this.saveData('pendingOrders', this.pendingOrders);

        // Notify the chef via WhatsApp (if configured)
        const chefPhone = this.approvalSettings.chefPhone;
        if (chefPhone) {
            const chefMessage = `🔔 הזמנה חדשה ממתינה לאישור\nספק: ${supplier.name}\n\n${message}`;
            this.openWhatsApp(chefPhone, chefMessage);
        }

        this.clearOrder();
        this.updateApprovalsBadge();

        if (chefPhone) {
            this.showAlert('✅ ההזמנה נשלחה לאישור השף', 'success');
        } else {
            this.showAlert('✅ ההזמנה נשמרה וממתינה לאישור (לא הוגדר מספר WhatsApp לשף בהגדרות)', 'info');
        }
        return pendingOrder.id;
    }

    // Send order to supplier via WhatsApp and/or email
    async dispatchOrder(supplier, message, sendMethod, procurementEmail, emailPayload) {
        const html = emailPayload && emailPayload.html ? emailPayload.html : null;
        const subject = emailPayload && emailPayload.subject ? emailPayload.subject : null;

        if (sendMethod === 'whatsapp') {
            this.openWhatsApp(this.getSupplierWhatsAppPhone(supplier), message);
        } else if (sendMethod === 'email') {
            await this.sendEmail(supplier.email, message, procurementEmail, html, subject);
        } else if (sendMethod === 'both') {
            this.openWhatsApp(this.getSupplierWhatsAppPhone(supplier), message);
            await new Promise(r => setTimeout(r, 800));
            await this.sendEmail(supplier.email, message, procurementEmail, html, subject);
        }
    }

    // Step 2: Chef approves -> send to supplier + orders manager
    async approveOrder(orderId) {
        const order = this.pendingOrders.find(o => o.id === orderId);
        if (!order) return;

        if (!confirm(`לאשר ולשלוח את ההזמנה לספק "${order.supplierSnapshot.name}"?`)) return;

        const supplier = order.supplierSnapshot;
        const message = order.message;
        const procurementEmail = this.approvalSettings.procurementEmail;

        const approvedByName = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name)
            ? authSystem.currentUser.name : '';
        const emailPayload = this.buildOrderEmailContent({
            supplierName: supplier.name,
            deliveryDate: order.deliveryDate,
            orderDate: order.date,
            items: order.items,
            showPrices: order.showedPrices,
            orderedBy: order.createdByName || '',
            approvedBy: approvedByName
        });

        await this.dispatchOrder(supplier, message, order.sendMethod, procurementEmail, emailPayload);

        // Notify the orders manager via WhatsApp
        const managerPhone = this.approvalSettings.managerPhone;
        if (managerPhone) {
            const managerMessage = `📋 הזמנה אושרה ונשלחה לספק\nספק: ${supplier.name}\n\n${message}`;
            setTimeout(() => this.openWhatsApp(managerPhone, managerMessage), 1200);
        }

        // Move to history
        this.history.unshift({
            id: order.id,
            date: new Date().toISOString(),
            supplier: supplier.name,
            items: order.items,
            message: order.message,
            deliveryDate: order.deliveryDate,
            sendMethod: order.sendMethod,
            showedPrices: order.showedPrices,
            createdByName: order.createdByName || '',
            approvedByName: (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '',
            approved: true
        });
        this.saveData('history', this.history);

        // Remove from pending
        this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);
        this.saveData('pendingOrders', this.pendingOrders);

        this.loadHistory();
        this.renderApprovals();
        this.updateApprovalsBadge();

        if (managerPhone) {
            this.showAlert('✅ ההזמנה אושרה ונשלחה לספק ולמנהל ההזמנות', 'success');
        } else {
            this.showAlert('ההזמנה אושרה ונשלחה לספק (לא הוגדר מספר מנהל הזמנות בהגדרות)', 'info');
        }
    }

    rejectOrder(orderId) {
        const order = this.pendingOrders.find(o => o.id === orderId);
        if (!order) return;

        if (!confirm(`לדחות את ההזמנה לספק "${order.supplierSnapshot.name}"? הפעולה תמחק אותה.`)) return;

        this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);
        this.saveData('pendingOrders', this.pendingOrders);
        this.renderApprovals();
        this.updateApprovalsBadge();
        this.showAlert('ההזמנה נדחתה', 'success');
    }

    openWhatsApp(phone, message) {
        const clean = String(phone || '').replace(/[^0-9]/g, '');
        if (!clean) {
            alert('מספר WhatsApp חסר או לא תקין');
            return;
        }
        // Convert local Israeli format (0xx...) to international (972xx...)
        const intl = clean.startsWith('0') ? '972' + clean.substring(1) : clean;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${intl}?text=${encodedMessage}`, '_blank');
    }

    isPlaceholderEmail(email) {
        const domain = String(email || '').split('@')[1]?.toLowerCase();
        const blocked = ['example.com', 'example.org', 'example.net', 'test.com', 'localhost', 'invalid'];
        return !domain || blocked.includes(domain);
    }

    validateSupplierEmail(email) {
        const addr = String(email || '').trim();
        if (!addr) return 'אין כתובת אימייל לספק זה — עדכן בטאב "ספקים"';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return `כתובת מייל לא תקינה: ${addr}`;
        if (this.isPlaceholderEmail(addr)) {
            return `מייל הספק (${addr}) הוא כתובת דוגמה — עדכן לכתובת אמיתית בטאב "ספקים"`;
        }
        return null;
    }

    async sendEmail(email, message, cc, html, subjectOverride) {
        const emailError = this.validateSupplierEmail(email);
        if (emailError) {
            this.showAlert(emailError, 'error');
            return false;
        }

        const dateStr = new Date().toLocaleDateString('he-IL');
        const subject = subjectOverride || `הזמנה חדשה מ-${dateStr}`;
        const procurementEmail = (cc || '').trim();

        try {
            const r = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    bcc: procurementEmail || undefined,
                    subject,
                    text: message,
                    html: html || undefined,
                    replyTo: procurementEmail || undefined
                })
            });

            const data = await r.json().catch(() => ({}));

            if (r.ok) {
                let msg = `📧 המייל נשלח ל-${email}`;
                if (procurementEmail) msg += ` (עותק ל-${procurementEmail})`;
                if (data.provider) msg += ` [${data.provider}]`;
                this.showAlert(msg, 'success');
                return true;
            }

            if (r.status === 503) {
                return this.sendEmailViaMailto(email, message, procurementEmail, subject);
            }

            const hint = data.hint ? `\n${data.hint}` : '';
            this.showAlert((data.error || r.statusText) + hint, 'error');
            return false;
        } catch (e) {
            return this.sendEmailViaMailto(email, message, procurementEmail, subject);
        }
    }

    async sendTestEmail() {
        if (!authSystem || !authSystem.currentUser || authSystem.currentUser.role !== 'admin') {
            alert('רק מנהל יכול לשלוח מייל בדיקה');
            return;
        }

        const to = document.getElementById('procurement-email-input').value.trim();
        if (!to) {
            alert('הזן מייל רכש לפני בדיקה');
            return;
        }
        if (this.isPlaceholderEmail(to)) {
            alert('הזן כתובת מייל אמיתית (לא example.com)');
            return;
        }

        const dateStr = new Date().toLocaleDateString('he-IL');
        const text = `זהו מייל בדיקה ממערכת ההזמנות.\nתאריך: ${dateStr}\n\nאם קיבלת את זה — השרת מוגדר נכון ✅`;

        try {
            const r = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to,
                    subject: `בדיקת מייל — מערכת הזמנות ${dateStr}`,
                    text,
                    test: true
                })
            });
            const data = await r.json().catch(() => ({}));

            if (r.ok) {
                this.showAlert(`✅ מייל בדיקה נשלח ל-${to}. בדוק גם בתיקיית ספאם.`, 'success');
            } else {
                const hint = data.hint ? ` — ${data.hint}` : '';
                this.showAlert((data.error || 'שגיאה בשליחה') + hint, 'error');
            }
        } catch (e) {
            this.showAlert('שגיאת רשת בשליחת מייל בדיקה', 'error');
        }
    }

    sendEmailViaMailto(email, message, cc, subject) {
        const encodedSubject = encodeURIComponent(subject);
        const body = encodeURIComponent(message);
        let url = `mailto:${email}?subject=${encodedSubject}&body=${body}`;
        if (cc) {
            url += `&cc=${encodeURIComponent(cc)}`;
        }
        window.location.href = url;
        this.showAlert('📧 נפתח אפליקציית המייל — אשר שליחה ידנית (שרת מייל לא מוגדר)', 'info');
        return true;
    }

    clearOrder() {
        const productIds = this.currentOrder.map(o => o.productId).filter(Boolean);
        document.querySelectorAll('.shortage-input').forEach(input => { input.value = ''; });
        this.manualItems = [];
        this.renderManualItems();
        this.currentOrder = [];
        const noteEl = document.getElementById('order-note');
        if (noteEl) noteEl.value = '';
        productIds.forEach(id => this.syncProductCardFromCart(id));
        this.updateOrderSummary();
    }

    // ===========================
    // Print / save an order (opens a print-friendly window → print or Save-as-PDF)
    // ===========================

    printCurrentOrder() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        if (!supplier || this.getOrderItems().length === 0) {
            alert('נא לבחור ספק ולהוסיף מוצרים לסל לפני הדפסה');
            return;
        }
        const orderedBy = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '';
        this.openPrintWindow(this.buildOrderPrintHtml({
            supplierName: supplier.name,
            deliveryDate: document.getElementById('delivery-date').value,
            dateStr: new Date().toLocaleDateString('he-IL'),
            items: this.getOrderItems(),
            showPrices: this.preferences.showPrices,
            orderedBy: orderedBy
        }));
    }

    printHistoryOrder(orderId) {
        const item = this.history.find(h => h.id === orderId);
        if (!item) return;
        this.openPrintWindow(this.buildOrderPrintHtml({
            supplierName: item.supplier,
            deliveryDate: item.deliveryDate,
            dateStr: new Date(item.date).toLocaleDateString('he-IL'),
            items: item.items,
            showPrices: item.showedPrices,
            orderedBy: item.createdByName || '',
            approvedBy: item.approvedByName || ''
        }));
    }

    buildOrderPrintHtml(o) {
        const deliveryStr = o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString('he-IL') : '—';
        let total = 0;
        let rows = '';
        o.items.forEach((it, i) => {
            const lineTotal = it.total != null ? it.total : (it.price || 0) * it.quantity;
            total += lineTotal;
            rows += `<tr>
                <td>${i + 1}</td>
                <td class="name">${it.product}${it.manual ? ' ✍️' : ''}</td>
                <td>${it.quantity} ${it.unit}</td>
                ${o.showPrices ? `<td>₪${(it.price || 0).toFixed(2)}</td><td>₪${lineTotal.toFixed(2)}</td>` : ''}
            </tr>`;
        });

        const priceHeaders = o.showPrices ? '<th>מחיר יח׳</th><th>סה״כ</th>' : '';
        const totalRow = o.showPrices
            ? `<tr class="grand"><td colspan="4">סה״כ להזמנה</td><td>₪${total.toFixed(2)}</td></tr>`
            : '';
        const byLine = [
            o.orderedBy ? `הוזמן ע״י: ${o.orderedBy}` : '',
            o.approvedBy ? `אושר ע״י: ${o.approvedBy}` : ''
        ].filter(Boolean).join(' · ');

        return `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">
<title>הזמנה - ${o.supplierName}</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;padding:30px;color:#222;}
  h1{margin:0 0 4px;font-size:24px;}
  .meta{color:#555;font-size:14px;margin-bottom:4px;}
  table{width:100%;border-collapse:collapse;margin-top:18px;}
  th,td{border:1px solid #ccc;padding:8px 10px;text-align:right;font-size:14px;}
  th{background:#f0f0f0;}
  td.name{font-weight:600;}
  tr.grand td{font-weight:700;font-size:16px;background:#e8f5e9;}
  .foot{margin-top:24px;color:#888;font-size:12px;}
  @media print{button{display:none;}}
</style></head><body>
  <h1>🛒 הזמנה - ${o.supplierName}</h1>
  <div class="meta">📅 תאריך הזמנה: ${o.dateStr} · אספקה מבוקשת: ${deliveryStr}</div>
  ${byLine ? `<div class="meta">👤 ${byLine}</div>` : ''}
  <table>
    <thead><tr><th>#</th><th>מוצר</th><th>כמות</th>${priceHeaders}</tr></thead>
    <tbody>${rows}${totalRow}</tbody>
  </table>
  <div class="foot">מערכת הזמנות ספקים · ${o.items.length} פריטים</div>
</body></html>`;
    }

    openPrintWindow(html) {
        const w = window.open('', '_blank');
        if (!w) {
            alert('חלון ההדפסה נחסם. אפשר חלונות קופצים לאתר ונסה שוב.');
            return;
        }
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { try { w.print(); } catch (e) { /* user can print manually */ } }, 350);
    }

    // ===========================
    // Approvals (Chef)
    // ===========================

    renderApprovals() {
        const container = document.getElementById('approvals-list');
        if (!container) return;

        if (this.pendingOrders.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין הזמנות הממתינות לאישור</p>';
            return;
        }

        container.innerHTML = '';
        this.pendingOrders.forEach(order => {
            const date = new Date(order.date);
            const dateStr = date.toLocaleDateString('he-IL');
            const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
            const deliveryStr = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('he-IL') : '—';
            const roleLabel = order.createdBy === 'admin' ? 'מנהל' : (order.createdBy === 'employee' ? 'עובד' : 'לא ידוע');
            const createdByName = order.createdByName ? `${order.createdByName} (${roleLabel})` : roleLabel;

            let itemsHtml = '';
            order.items.forEach(item => {
                const mark = item.manual ? '✍️ ' : '';
                let line = `<div class="approval-item">${mark}${item.product}: ${item.quantity} ${item.unit}`;
                if (order.showedPrices && item.total) {
                    line += ` — ₪${item.total.toFixed(2)}`;
                }
                line += '</div>';
                itemsHtml += line;
            });

            let totalHtml = '';
            if (order.showedPrices) {
                const total = order.items.reduce((sum, i) => sum + (i.total || 0), 0);
                totalHtml = `<div class="approval-total">סה"כ: ₪${total.toFixed(2)}</div>`;
            }

            const card = document.createElement('div');
            card.className = 'approval-item-card';
            card.innerHTML = `
                <div class="approval-header">
                    <span>🛒 ${order.supplierSnapshot.name}</span>
                    <span>${dateStr} ${timeStr}</span>
                </div>
                <div class="approval-meta">📅 אספקה: ${deliveryStr} · 👤 נוצר ע"י: ${createdByName} · 📦 ${order.items.length} פריטים</div>
                <div class="approval-items">${itemsHtml}</div>
                ${totalHtml}
                <div class="approval-actions">
                    <button class="btn btn-primary btn-small" onclick="orderSystem.approveOrder('${order.id}')">✅ אשר ושלח</button>
                    <button class="btn btn-secondary btn-small" onclick="orderSystem.rejectOrder('${order.id}')">🗑️ דחה</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    updateApprovalsBadge() {
        const badge = document.getElementById('approvals-badge');
        if (!badge) return;
        const count = this.pendingOrders.length;
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    // ===========================
    // Order-day Reminders
    // ===========================

    checkOrderReminders() {
        const banner = document.getElementById('order-reminder-banner');
        const text = document.getElementById('reminder-text');
        if (!banner || !text) return;

        const today = new Date().getDay();
        const dueSuppliers = this.suppliers.filter(s => Array.isArray(s.orderDays) && s.orderDays.includes(today));

        if (dueSuppliers.length === 0) {
            banner.style.display = 'none';
            return;
        }

        // Respect a per-day dismissal
        const todayKey = new Date().toISOString().split('T')[0];
        if (this.loadData('reminderDismissed') === todayKey) {
            banner.style.display = 'none';
            return;
        }

        const names = dueSuppliers.map(s => s.name).join(', ');
        text.textContent = `היום (יום ${this.getWeekdays()[today].name}) צריך להזמין מ: ${names}`;
        banner.style.display = 'flex';

        // Show the "enable notifications" button only when permission hasn't been decided
        const enableBtn = document.getElementById('enable-notifications-btn');
        if (enableBtn) {
            const canAsk = ('Notification' in window) && Notification.permission === 'default';
            enableBtn.style.display = canAsk ? 'inline-block' : 'none';
        }

        // Fire a real system notification once per day (only while the app is open)
        this.maybeNotify(names);
    }

    maybeNotify(names) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        const notifyKey = new Date().toISOString().split('T')[0];
        if (this.loadData('lastNotifyDate') === notifyKey) return;
        try {
            new Notification('🔔 תזכורת הזמנות', {
                body: `היום צריך להזמין מ: ${names}`,
                tag: 'order-reminder-' + notifyKey
            });
            this.saveData('lastNotifyDate', notifyKey);
        } catch (e) {
            /* notification construction can fail on some mobile browsers; ignore */
        }
    }

    enableNotifications() {
        if (!('Notification' in window)) {
            alert('הדפדפן לא תומך בהתראות מערכת');
            return;
        }
        Notification.requestPermission().then(perm => {
            const enableBtn = document.getElementById('enable-notifications-btn');
            if (perm === 'granted') {
                if (enableBtn) enableBtn.style.display = 'none';
                this.showAlert('✅ ההתראות הופעלו', 'success');
                this.checkOrderReminders();
                this.setupPush(true); // subscribe for real closed-app push, with on-screen feedback
            } else {
                this.showAlert('ההתראות לא הופעלו', 'info');
            }
        });
    }

    dismissReminder() {
        const todayKey = new Date().toISOString().split('T')[0];
        this.saveData('reminderDismissed', todayKey);
        const banner = document.getElementById('order-reminder-banner');
        if (banner) banner.style.display = 'none';
    }

    // ===========================
    // Web Push (real closed-app notifications via the server)
    // ===========================

    // report=true → show on-screen messages (used when the user taps "הפעל התראות")
    async setupPush(report) {
        if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
            if (report) this.showAlert('המכשיר/דפדפן לא תומך בהתראות. באייפון: הוסף את האתר למסך הבית ופתח משם.', 'error');
            return;
        }
        if (!VAPID_PUBLIC_KEY) return;
        try {
            await navigator.serviceWorker.register('/sw.js');
            // Only subscribe once the user has granted notification permission
            if (Notification.permission !== 'granted') {
                if (report) this.showAlert('צריך לאשר התראות בדפדפן כדי להירשם.', 'info');
                return;
            }

            const ready = await navigator.serviceWorker.ready;
            const sub = (await ready.pushManager.getSubscription()) ||
                (await ready.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                }));
            const resp = await this.syncPushSubscription(sub);

            if (report) {
                if (resp && resp.ok) {
                    this.showAlert('✅ נרשמת להתראות בהצלחה!', 'success');
                } else {
                    this.showAlert('ההרשמה לשרת נכשלה: ' + ((resp && resp.error) || 'שגיאה לא ידועה'), 'error');
                }
            }
        } catch (e) {
            if (report) this.showAlert('שגיאה בהרשמה להתראות: ' + ((e && e.message) || e), 'error');
        }
    }

    // Re-send the current per-supplier schedule to the server; returns the parsed JSON (or null)
    syncPushSubscription(subscription) {
        const schedule = this.suppliers
            .filter(s => Array.isArray(s.orderDays) && s.orderDays.length)
            .map(s => ({ name: s.name, orderDays: s.orderDays }));
        return fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription, schedule })
        }).then(r => r.json()).catch(() => null);
    }

    // Push schedule update without forcing a (re)subscribe — used after supplier edits
    refreshPushSchedule() {
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
            // No active SW yet; setupPush will handle it on next permission grant/load
            return;
        }
        navigator.serviceWorker.ready
            .then(reg => reg.pushManager.getSubscription())
            .then(sub => { if (sub) this.syncPushSubscription(sub); })
            .catch(() => {});
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const raw = atob(base64);
        const output = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
        return output;
    }

    // ===========================
    // History
    // ===========================

    // Total ₪ of a history order (falls back to price×qty when total is missing)
    orderTotal(h) {
        return (h.items || []).reduce((sum, i) => sum + (i.total != null ? i.total : (i.price || 0) * (i.quantity || 0)), 0);
    }

    renderExpenseSummary() {
        const el = document.getElementById('expense-summary');
        if (!el) return;
        if (this.history.length === 0) { el.innerHTML = ''; return; }

        const now = new Date();
        const ym = now.getFullYear() + '-' + now.getMonth();
        let total = 0, month = 0;
        const bySup = {};
        this.history.forEach(h => {
            const t = this.orderTotal(h);
            total += t;
            const d = new Date(h.date);
            if (d.getFullYear() + '-' + d.getMonth() === ym) month += t;
            bySup[h.supplier] = (bySup[h.supplier] || 0) + t;
        });

        const top = Object.entries(bySup).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topHtml = top.length
            ? top.map(([n, v]) => `<div class="dash-recent"><span>${n}</span><span>₪${v.toFixed(0)}</span></div>`).join('')
            : '<p class="dash-empty">אין נתוני מחירים (מלא מחירים במוצרים כדי לראות הוצאות)</p>';

        el.innerHTML = `
            <div class="dash-stats">
                <div class="dash-stat dash-stat-static"><div class="dash-stat-num">₪${month.toFixed(0)}</div><div class="dash-stat-label">💰 הוצאה החודש</div></div>
                <div class="dash-stat dash-stat-static"><div class="dash-stat-num">₪${total.toFixed(0)}</div><div class="dash-stat-label">💰 סה"כ הכל</div></div>
            </div>
            <div class="dash-block"><h3>💰 הוצאה לפי ספק</h3>${topHtml}</div>
        `;
    }

    // ===========================
    // Receiving (mark what arrived → update inventory stock)
    // ===========================

    receiveOrder(orderId) {
        const order = this.history.find(h => h.id === orderId);
        if (!order) return;
        document.getElementById('receive-order-id').value = orderId;
        document.getElementById('receive-order-info').textContent = `ספק: ${order.supplier} · ${new Date(order.date).toLocaleDateString('he-IL')}`;
        const container = document.getElementById('receive-items');
        container.innerHTML = (order.items || []).map((it, idx) => `
            <div class="receive-row">
                <span class="receive-name">${it.product}</span>
                <span class="receive-ordered">הוזמן: ${it.quantity} ${it.unit}</span>
                <input type="number" class="input-field receive-input" data-idx="${idx}" min="0" step="0.5" value="${it.quantity}" inputmode="decimal" title="כמות שהתקבלה">
                <input type="date" class="input-field receive-expiry" data-idx="${idx}" title="תאריך תפוגה (אצווה)">
            </div>
        `).join('');
        document.getElementById('receive-modal').classList.add('active');
    }

    confirmReceiveOrder() {
        const orderId = document.getElementById('receive-order-id').value;
        const order = this.history.find(h => h.id === orderId);
        if (!order) return;

        const supplier = this.suppliers.find(s => s.name === order.supplier);
        let stockUpdated = 0;
        document.querySelectorAll('#receive-items .receive-input').forEach(inp => {
            const idx = parseInt(inp.dataset.idx, 10);
            const received = parseFloat(inp.value) || 0;
            const expInp = document.querySelector(`#receive-items .receive-expiry[data-idx="${idx}"]`);
            const expiry = expInp ? expInp.value : '';
            const it = order.items[idx];
            if (!it) return;
            it.received = received;
            it.receivedExpiry = expiry;
            if (supplier && !it.manual && received > 0) {
                const prod = this.products.find(p => p.supplierId === supplier.id && p.name === it.product);
                if (prod) {
                    // Each received line becomes a FIFO batch (qty + expiry)
                    this.addBatchToProduct(prod, received, expiry);
                    stockUpdated++;
                }
            }
        });

        order.received = true;
        order.receivedDate = new Date().toISOString();
        order.receivedBy = (typeof authSystem !== 'undefined' && authSystem.currentUser && authSystem.currentUser.name) ? authSystem.currentUser.name : '';

        this.saveData('history', this.history);
        if (stockUpdated > 0) this.saveData('products', this.products);

        this.closeReceiveModal();
        this.loadHistory();
        const invSel = document.getElementById('inventory-supplier-select');
        if (invSel && invSel.value) this.renderInventory(invSel.value);
        this.showAlert(`📥 הסחורה התקבלה. עודכן מלאי ל-${stockUpdated} פריטים.`, 'success');
    }

    closeReceiveModal() {
        document.getElementById('receive-modal').classList.remove('active');
    }

    // ===========================
    // Excel export (uses the already-loaded SheetJS / XLSX)
    // ===========================

    exportHistoryExcel() {
        if (typeof XLSX === 'undefined') { alert('רכיב הייצוא לא נטען, נסה לרענן'); return; }
        if (!this.history.length) { alert('אין היסטוריה לייצוא'); return; }

        const rows = [];
        this.history.forEach(h => {
            const dateStr = new Date(h.date).toLocaleDateString('he-IL');
            (h.items || []).forEach(it => {
                rows.push({
                    'תאריך': dateStr,
                    'ספק': h.supplier,
                    'מוצר': it.product,
                    'כמות': it.quantity,
                    'יחידה': it.unit,
                    'מחיר': it.price || 0,
                    'סה"כ': it.total != null ? it.total : (it.price || 0) * it.quantity,
                    'התקבל': (it.received != null ? it.received : ''),
                    'הוזמן ע"י': h.createdByName || '',
                    'סטטוס': h.received ? 'התקבל' : 'נשלח'
                });
            });
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'הזמנות');
        XLSX.writeFile(wb, `הזמנות-${new Date().toISOString().slice(0, 10)}.xlsx`);
        this.showAlert(`📄 יוצאו ${rows.length} שורות לאקסל`, 'success');
    }

    exportInventoryExcel() {
        if (typeof XLSX === 'undefined') { alert('רכיב הייצוא לא נטען, נסה לרענן'); return; }
        const sid = document.getElementById('inventory-supplier-select').value;
        const supName = {};
        this.suppliers.forEach(s => { supName[s.id] = s.name; });
        const products = sid ? this.products.filter(p => p.supplierId === sid) : this.products;
        if (!products.length) { alert('אין מוצרים לייצוא'); return; }

        const rows = products.map(p => ({
            'ספק': supName[p.supplierId] || '',
            'מוצר': p.name,
            'כמות קיים': Number(p.stockQty) || 0,
            'מלאי פתיחה': Number(p.parLevel) || 0,
            'כמות להזמנה': this.productShortage(p),
            'מחיר': p.price || 0
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'מלאי');
        const label = sid ? (supName[sid] || 'ספק') : 'כל-הספקים';
        XLSX.writeFile(wb, `מלאי-${label}-${new Date().toISOString().slice(0, 10)}.xlsx`);
        this.showAlert(`📄 יוצאו ${rows.length} מוצרים לאקסל`, 'success');
    }

    loadHistory() {
        this.renderExpenseSummary();
        const container = document.getElementById('history-list');

        if (this.history.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין היסטוריית הזמנות</p>';
            return;
        }

        container.innerHTML = '';
        this.history.forEach(item => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('he-IL');
            const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
            const deliveryDateStr = item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('he-IL') : '—';

            const historyCard = document.createElement('div');
            historyCard.className = 'history-item';
            
            let html = `
                <div class="history-header">
                    <span>🛒 ${item.supplier}</span>
                    <span>${dateStr} ${timeStr}</span>
                </div>
                <div class="history-items">📅 תאריך אספקה: ${deliveryDateStr}</div>
                <div class="history-items">📦 ${item.items.length} פריטים</div>
            `;

            if (item.showedPrices) {
                const total = item.items.reduce((sum, i) => sum + i.total, 0);
                html += `<div class="history-items">💰 סה"כ: ₪${total.toFixed(2)}</div>`;
            }

            html += `<div class="history-items">📱 נשלח דרך: ${this.getSendMethodName(item.sendMethod)}</div>`;
            if (item.createdByName) {
                html += `<div class="history-items">👤 הוזמן ע"י: ${item.createdByName}${item.approvedByName ? ` · אושר ע"י: ${item.approvedByName}` : ''}</div>`;
            }
            if (item.received) {
                const rDate = item.receivedDate ? new Date(item.receivedDate).toLocaleDateString('he-IL') : '';
                html += `<div class="history-items" style="color:#2e7d32;font-weight:700;">📥 התקבל${rDate ? ' · ' + rDate : ''}${item.receivedBy ? ' · ' + item.receivedBy : ''}</div>`;
            }
            html += `<button class="btn btn-small" style="background:#2196F3;color:#fff;margin-top:8px;" onclick="orderSystem.printHistoryOrder('${item.id}')">🖨️ הדפס / שמור</button>`;
            if (!item.received) {
                html += `<button class="btn btn-small" style="background:#4CAF50;color:#fff;margin-top:8px;" onclick="orderSystem.receiveOrder('${item.id}')">📥 קבל סחורה</button>`;
            }

            historyCard.innerHTML = html;
            container.appendChild(historyCard);
        });
    }

    getSendMethodName(method) {
        const names = {
            'whatsapp': 'WhatsApp',
            'email': 'Email',
            'both': 'WhatsApp + Email'
        };
        return names[method] || method;
    }

    clearHistory() {
        if (!confirm('האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?')) return;
        
        this.history = [];
        this.saveData('history', this.history);
        this.loadHistory();
        this.showAlert('ההיסטוריה נמחקה', 'success');
    }

    // ===========================
    // Preferences
    // ===========================

    loadPreferences() {
        const showPrices = document.getElementById('show-prices');
        if (showPrices) showPrices.checked = this.preferences.showPrices;
        const radio = document.querySelector(`input[name="send-method"][value="${this.preferences.sendMethod}"]`);
        if (radio) radio.checked = true;
    }

    updatePreference(key, value) {
        this.preferences[key] = value;
        this.saveData('preferences', this.preferences);

        if (key === 'showPrices') {
            this.updateOrderSummary();
        }
        if (key === 'sendMethod') {
            this.updateSupplierEmailWarning();
        }
    }

    loadApprovalSettings() {
        const chefInput = document.getElementById('chef-phone-input');
        const managerInput = document.getElementById('manager-phone-input');
        const procurementInput = document.getElementById('procurement-email-input');
        if (chefInput) chefInput.value = this.approvalSettings.chefPhone || '';
        if (managerInput) managerInput.value = this.approvalSettings.managerPhone || '';
        if (procurementInput) procurementInput.value = this.approvalSettings.procurementEmail || '';
    }

    saveApprovalSettings() {
        if (!authSystem || !authSystem.currentUser || authSystem.currentUser.role !== 'admin') {
            alert('רק מנהל יכול לעדכן הגדרות');
            return;
        }
        const chefPhone = document.getElementById('chef-phone-input').value.trim();
        const managerPhone = document.getElementById('manager-phone-input').value.trim();
        const procurementEmail = document.getElementById('procurement-email-input').value.trim();

        this.approvalSettings.chefPhone = chefPhone;
        this.approvalSettings.managerPhone = managerPhone;
        this.approvalSettings.procurementEmail = procurementEmail;
        this.saveData('approvalSettings', this.approvalSettings);

        this.showAlert('✅ ההגדרות נשמרו', 'success');
    }

    // ===========================
    // UI Helpers
    // ===========================

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.tab-content.active .section');
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => alertDiv.remove(), 3000);
    }
}

// ===========================
// Initialize
// ===========================

let authSystem;
let orderSystem;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication first
    authSystem = new AuthSystem();
    
    // Initialize order system
    orderSystem = new OrderSystem();
});
