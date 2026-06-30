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
const DEFAULT_STAFF = ['שף ראשי', 'סגן שף', 'שף חלבי', 'שף בשרי', 'עובד מטבח'];

// Reads the staff list from localStorage, or returns sensible defaults (not persisted)
function loadStaff() {
    try {
        const s = JSON.parse(localStorage.getItem('staff'));
        if (Array.isArray(s) && s.length) return s;
    } catch (_) { /* ignore */ }
    return DEFAULT_STAFF.map((n, i) => ({ id: String(i + 1), name: n }));
}

// Keys mirrored to the shared (KV) bank across devices
const SHARED_KEYS = ['products', 'suppliers', 'staff', 'pendingOrders', 'history'];

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

        const code = codeInput.value.trim();
        const nameSelect = document.getElementById('login-name');
        const name = nameSelect ? nameSelect.value.trim() : '';

        if (code.length !== 6 || !/^\d+$/.test(code)) {
            this.showError('הקוד חייב להיות 6 ספרות');
            return;
        }

        if (!name) {
            this.showError('בחר מי אתה');
            return;
        }

        if (code === this.adminCode) {
            this.currentUser = { role: 'admin', code: code, name: name };
            this.saveData('currentUser', this.currentUser);
            this.showApp();
        } else if (code === this.employeeCode) {
            this.currentUser = { role: 'employee', code: code, name: name };
            this.saveData('currentUser', this.currentUser);
            this.showApp();
        } else {
            if (errorDiv) {
                errorDiv.style.display = 'block';
            }
            codeInput.value = '';
            setTimeout(() => {
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
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

    // Fill the "who are you" dropdown from the staff list
    populateLoginNames() {
        const select = document.getElementById('login-name');
        if (!select) return;
        const prev = select.value;
        const staff = loadStaff();
        select.innerHTML = '<option value="">-- בחר מי אתה --</option>';
        staff.forEach(member => {
            const opt = document.createElement('option');
            opt.value = member.name;
            opt.textContent = member.name;
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

                // Show order-day reminder once logged in
                if (typeof orderSystem !== 'undefined' && orderSystem) {
                    orderSystem.checkOrderReminders();
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
        this.products = this.loadData('products') || this.getDefaultProducts();
        this.history = this.loadData('history') || [];
        this.pendingOrders = this.loadData('pendingOrders') || [];
        this.staff = this.loadData('staff') || loadStaff();
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
        this.sharedBankActive = false; // becomes true once the KV-backed shared bank is reachable
        this._sharedSaveTimer = null;
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
        // Persist default staff on first run so it syncs to other devices
        if (!this.loadData('staff')) this.saveData('staff', this.staff);
        this.renderStaff();
        this.loadHistory();
        this.loadPreferences();
        this.loadApprovalSettings();
        this.setDefaultDeliveryDate();
        this.updateApprovalsBadge();
        this.renderWeekdayPicker('supplier-order-days', []);
        this.checkOrderReminders();
        this.setupPush();
        this.initSharedBank();
    }

    // ===========================
    // Default Data
    // ===========================

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
        // Mirror shared keys (products/suppliers/staff/orders/history) to the KV bank
        if (SHARED_KEYS.includes(key)) this.scheduleSharedSave();
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

            // Adopt whichever shared collections the server already has (server = source of truth)
            SHARED_KEYS.forEach(k => {
                if (Array.isArray(data[k])) {
                    this[k] = data[k];
                    this.saveLocal(k, data[k]);
                }
            });
            this.rerenderAll();

            // Seed only the collections the server doesn't have yet (don't clobber existing)
            const missing = SHARED_KEYS.filter(k => !Array.isArray(data[k]));
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
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.renderAllProducts();
        this.renderStaff();
        this.loadHistory();
        this.renderApprovals();
        this.updateApprovalsBadge();
        if (typeof authSystem !== 'undefined' && authSystem) authSystem.populateLoginNames();
        // Re-render the order products only if the user hasn't started an order (don't wipe quantities)
        const sid = document.getElementById('supplier-select').value;
        if (sid && this.currentOrder.length === 0 && this.manualItems.length === 0) {
            this.loadProducts(sid);
        }
    }

    scheduleSharedSave() {
        if (!this.sharedBankActive) return;
        clearTimeout(this._sharedSaveTimer);
        this._sharedSaveTimer = setTimeout(() => this.saveSharedBank(), 800);
    }

    saveSharedBank() {
        if (!this.sharedBankActive) return;
        const payload = {};
        SHARED_KEYS.forEach(k => { payload[k] = this[k]; });
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
        if (sendOrderBtn) sendOrderBtn.addEventListener('click', () => this.submitForApproval());
        if (clearOrderBtn) clearOrderBtn.addEventListener('click', () => this.clearOrder());
        
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

        // Products tab
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) addProductBtn.addEventListener('click', () => this.addProduct());

        const autofillImagesBtn = document.getElementById('autofill-images-btn');
        if (autofillImagesBtn) autofillImagesBtn.addEventListener('click', () => this.autoFillImages(false));

        const seedCatalogBtn = document.getElementById('seed-catalog-btn');
        if (seedCatalogBtn) seedCatalogBtn.addEventListener('click', () => this.seedCatalog(false));

        const addStaffBtn = document.getElementById('add-staff-btn');
        if (addStaffBtn) addStaffBtn.addEventListener('click', () => this.addStaff());
        
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
            document.getElementById('excel-supplier-select')
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
                <div class="supplier-info">📞 ${supplier.phone}</div>
                <div class="supplier-info">📧 ${supplier.email}</div>
                <div class="supplier-info">🏷️ ${supplier.category}</div>
                ${supplier.orderDays && supplier.orderDays.length ? `<div class="supplier-info">📅 ימי הזמנה: ${this.formatOrderDays(supplier.orderDays)}</div>` : ''}
            `;
            container.appendChild(card);
        });
    }

    addSupplier() {
        const name = document.getElementById('supplier-name').value.trim();
        const phone = document.getElementById('supplier-phone').value.trim();
        const email = document.getElementById('supplier-email').value.trim();
        const category = document.getElementById('supplier-category').value.trim();

        if (!name || !phone) {
            alert('נא למלא לפחות שם וטלפון');
            return;
        }

        const newSupplier = {
            id: Date.now().toString(),
            name,
            phone,
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
        document.getElementById('edit-supplier-phone').value = supplier.phone;
        document.getElementById('edit-supplier-email').value = supplier.email;
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
        supplier.email = document.getElementById('edit-supplier-email').value.trim();
        supplier.category = document.getElementById('edit-supplier-category').value.trim();
        supplier.orderDays = this.getSelectedWeekdays('edit-supplier-order-days');

        this.saveData('suppliers', this.suppliers);
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.closeEditModal();
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

        if (!supplierId || !name || !price) {
            alert('נא למלא את כל השדות');
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            supplierId,
            name,
            price,
            unit
        };

        this.products.push(newProduct);
        this.saveData('products', this.products);

        // Clear form
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';

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
        // Reset ad-hoc manual items whenever the supplier changes
        this.manualItems = [];
        this.renderManualItems();

        // Reset the search box
        const searchInput = document.getElementById('product-search');
        if (searchInput) searchInput.value = '';
        const searchEmpty = document.getElementById('search-empty');
        if (searchEmpty) searchEmpty.style.display = 'none';

        if (!supplierId) {
            document.getElementById('products-list').innerHTML = '';
            document.getElementById('delivery-date-section').style.display = 'none';
            document.getElementById('product-search-section').style.display = 'none';
            document.getElementById('manual-item-section').style.display = 'none';
            document.getElementById('shipping-settings').style.display = 'none';
            return;
        }

        document.getElementById('delivery-date-section').style.display = 'block';
        document.getElementById('manual-item-section').style.display = 'block';
        this.loadProducts(supplierId);
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

            const imageArea = product.image
                ? `<div class="product-card-img has-img" data-image-id="${product.id}" style="background-image:url('${product.image}')">
                       <button class="img-edit-btn" data-image-id="${product.id}" title="החלף תמונה">📷</button>
                   </div>`
                : `<div class="product-card-img no-img" data-image-id="${product.id}">
                       <span class="img-placeholder">📷<br>הוסף תמונה</span>
                   </div>`;

            card.innerHTML = `
                ${imageArea}
                <div class="product-card-body">
                    <div class="product-card-name">${product.name}</div>
                    <div class="product-card-price">₪${Number(product.price).toFixed(2)} / ${product.unit}</div>
                    <div class="qty-stepper">
                        <button class="qty-btn qty-minus" data-product-id="${product.id}" type="button">−</button>
                        <input type="number" class="quantity-input" data-product-id="${product.id}" min="0" value="0" inputmode="decimal">
                        <button class="qty-btn qty-plus" data-product-id="${product.id}" type="button">+</button>
                    </div>
                    <select class="unit-select" data-product-id="${product.id}">
                        <option value="ק״ג" ${product.unit === 'ק״ג' ? 'selected' : ''}>ק״ג</option>
                        <option value="יחידה" ${product.unit === 'יחידה' ? 'selected' : ''}>יחידה</option>
                        <option value="ארגז" ${product.unit === 'ארגז' ? 'selected' : ''}>ארגז</option>
                        <option value="קרטון" ${product.unit === 'קרטון' ? 'selected' : ''}>קרטון</option>
                    </select>
                </div>
            `;
            grid.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(grid);

        // Quantity input + unit listeners
        grid.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('input', () => this.updateOrderSummary());
        });
        grid.querySelectorAll('.unit-select').forEach(select => {
            select.addEventListener('change', () => this.updateOrderSummary());
        });

        // Quantity stepper buttons (+ / −)
        grid.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => this.stepQuantity(btn.dataset.productId, 1));
        });
        grid.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => this.stepQuantity(btn.dataset.productId, -1));
        });

        // Image add / change (tap the image area)
        grid.querySelectorAll('.product-card-img').forEach(area => {
            area.addEventListener('click', () => this.openImagePicker(area.dataset.imageId));
        });

        document.getElementById('shipping-settings').style.display = 'block';
        this.updateOrderSummary();
    }

    stepQuantity(productId, delta) {
        const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
        if (!input) return;
        const current = parseFloat(input.value) || 0;
        const next = Math.max(0, current + delta);
        input.value = next;
        this.updateOrderSummary();
    }

    // ===========================
    // Product Images
    // ===========================

    openImagePicker(productId) {
        this.pendingImageProductId = productId;
        const input = document.getElementById('product-image-input');
        if (input) {
            input.value = '';
            input.click();
        }
    }

    handleProductImage(event) {
        const file = event.target.files[0];
        const productId = this.pendingImageProductId;
        if (!file || !productId) return;

        if (!file.type.startsWith('image/')) {
            alert('נא לבחור קובץ תמונה');
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
            .finally(() => { this.pendingImageProductId = null; });
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
        const quantities = document.querySelectorAll('.quantity-input');
        
        this.currentOrder = [];
        let total = 0;

        quantities.forEach(input => {
            const qty = parseFloat(input.value) || 0;

            // Visually mark the card as selected when a quantity is chosen
            const card = input.closest('.product-card');
            if (card) card.classList.toggle('selected', qty > 0);

            if (qty > 0) {
                const productId = input.dataset.productId;
                const product = this.products.find(p => p.id === productId);
                const unitSelect = document.querySelector(`.unit-select[data-product-id="${productId}"]`);
                const selectedUnit = unitSelect.value;

                if (product) {
                    const itemTotal = product.price * qty;
                    total += itemTotal;
                    this.currentOrder.push({
                        product: product.name,
                        quantity: qty,
                        unit: selectedUnit,
                        price: product.price,
                        total: itemTotal
                    });
                }
            }
        });

        // Include ad-hoc manual items
        this.manualItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            this.currentOrder.push({
                product: item.name,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                total: itemTotal,
                manual: true
            });
        });

        if (this.currentOrder.length === 0) {
            container.innerHTML = '<p>לא נבחרו מוצרים</p>';
            return;
        }

        let html = '<h4>סיכום הזמנה:</h4>';
        this.currentOrder.forEach(item => {
            html += `<div>• ${item.product}: ${item.quantity} ${item.unit}`;
            if (this.preferences.showPrices) {
                html += ` = ₪${item.total.toFixed(2)}`;
            }
            html += '</div>';
        });
        
        if (this.preferences.showPrices) {
            html += `<div style="margin-top: 10px; font-weight: bold; font-size: 18px;">סה"כ: ₪${total.toFixed(2)}</div>`;
        }

        container.innerHTML = html;
    }

    generateOrderMessage() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        const deliveryDate = document.getElementById('delivery-date').value;
        
        if (!supplier || this.currentOrder.length === 0) return '';

        const now = new Date();
        const dateStr = now.toLocaleDateString('he-IL');
        const timeStr = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        
        const deliveryDateFormatted = new Date(deliveryDate).toLocaleDateString('he-IL');

        let message = `היי ${supplier.name}! 🛒\n\n`;
        message += `הזמנה חדשה - ${dateStr} ${timeStr}\n`;
        message += `📅 תאריך אספקה מבוקש: ${deliveryDateFormatted}\n\n`;
        message += `📦 פריטים:\n`;

        let total = 0;
        this.currentOrder.forEach(item => {
            message += `• ${item.product}: ${item.quantity} ${item.unit}`;
            if (this.preferences.showPrices) {
                message += ` = ₪${item.total.toFixed(2)}`;
            }
            message += '\n';
            total += item.total;
        });

        if (this.preferences.showPrices) {
            message += `\n━━━━━━━━━━━━━━━\n`;
            message += `סה"כ: ₪${total.toFixed(2)}\n`;
        }

        message += `\nתודה! 😊`;

        return message;
    }

    // Step 1: Employee submits the order for the chef's approval
    submitForApproval() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);

        if (!supplier || this.currentOrder.length === 0) {
            alert('נא לבחור ספק ולהזין מוצרים');
            return;
        }

        const message = this.generateOrderMessage();
        const deliveryDate = document.getElementById('delivery-date').value;

        const pendingOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            supplierId: supplier.id,
            supplierSnapshot: { name: supplier.name, phone: supplier.phone, email: supplier.email },
            items: this.currentOrder.slice(),
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
    }

    // Step 2: Chef approves -> send to supplier + orders manager
    approveOrder(orderId) {
        const order = this.pendingOrders.find(o => o.id === orderId);
        if (!order) return;

        if (!confirm(`לאשר ולשלוח את ההזמנה לספק "${order.supplierSnapshot.name}"?`)) return;

        const supplier = order.supplierSnapshot;
        const message = order.message;
        const procurementEmail = this.approvalSettings.procurementEmail;

        // Send to supplier by the chosen method (procurement gets a CC on email)
        if (order.sendMethod === 'whatsapp') {
            this.openWhatsApp(supplier.phone, message);
        } else if (order.sendMethod === 'email') {
            this.sendEmail(supplier.email, message, procurementEmail);
        } else if (order.sendMethod === 'both') {
            this.openWhatsApp(supplier.phone, message);
            setTimeout(() => this.sendEmail(supplier.email, message, procurementEmail), 800);
        }

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

    sendEmail(email, message, cc) {
        if (!email) {
            alert('אין כתובת אימייל לספק זה');
            return;
        }
        const dateStr = new Date().toLocaleDateString('he-IL');
        const subject = encodeURIComponent(`🛒 הזמנה חדשה מ-${dateStr}`);
        const body = encodeURIComponent(message);
        let url = `mailto:${email}?subject=${subject}&body=${body}`;
        if (cc) {
            url += `&cc=${encodeURIComponent(cc)}`;
        }
        window.location.href = url;
    }

    clearOrder() {
        document.querySelectorAll('.quantity-input').forEach(input => input.value = 0);
        this.manualItems = [];
        this.renderManualItems();
        this.currentOrder = [];
        this.updateOrderSummary();
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

    loadHistory() {
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
            const deliveryDateStr = new Date(item.deliveryDate).toLocaleDateString('he-IL');

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
        document.getElementById('show-prices').checked = this.preferences.showPrices;
        document.querySelector(`input[name="send-method"][value="${this.preferences.sendMethod}"]`).checked = true;
    }

    updatePreference(key, value) {
        this.preferences[key] = value;
        this.saveData('preferences', this.preferences);

        if (key === 'showPrices') {
            this.updateOrderSummary();
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
