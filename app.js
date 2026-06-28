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

        if (code.length !== 6 || !/^\d+$/.test(code)) {
            this.showError('הקוד חייב להיות 6 ספרות');
            return;
        }

        if (code === this.adminCode) {
            this.currentUser = { role: 'admin', code: code };
            this.saveData('currentUser', this.currentUser);
            this.showApp();
        } else if (code === this.employeeCode) {
            this.currentUser = { role: 'employee', code: code };
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
            
            if (roleBadge && this.currentUser) {
                if (this.currentUser.role === 'admin') {
                    roleBadge.textContent = '👑 מנהל';
                    // Show settings tab for admin
                    if (settingsTab) {
                        settingsTab.style.display = 'block';
                    }
                } else {
                    roleBadge.textContent = '👤 עובד';
                    // Hide settings tab for employee
                    if (settingsTab) {
                        settingsTab.style.display = 'none';
                    }
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
        this.preferences = this.loadData('preferences') || {
            showPrices: true,
            sendMethod: 'whatsapp'
        };
        this.currentOrder = [];
        this.excelPreviewData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.loadHistory();
        this.loadPreferences();
        this.setDefaultDeliveryDate();
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
        return [
            // Vegetables & Fruits
            { id: '1', supplierId: '1', name: 'חסה', price: 8, unit: 'ק״ג' },
            { id: '2', supplierId: '1', name: 'עגבניות', price: 12, unit: 'ק״ג' },
            { id: '3', supplierId: '1', name: 'מלפפונים', price: 10, unit: 'ק״ג' },
            { id: '4', supplierId: '1', name: 'תפוחי אדמה', price: 5, unit: 'ק״ג' },
            { id: '5', supplierId: '1', name: 'בצל', price: 6, unit: 'ק״ג' },
            { id: '6', supplierId: '1', name: 'גזר', price: 7, unit: 'ק״ג' },
            { id: '7', supplierId: '1', name: 'תפוחים', price: 15, unit: 'ק״ג' },
            // Meat & Poultry
            { id: '8', supplierId: '2', name: 'עוף שלם', price: 25, unit: 'ק״ג' },
            { id: '9', supplierId: '2', name: 'חזה עוף', price: 35, unit: 'ק״ג' },
            { id: '10', supplierId: '2', name: 'בשר טחון', price: 40, unit: 'ק״ג' },
            { id: '11', supplierId: '2', name: 'סטייק', price: 80, unit: 'ק״ג' },
            { id: '12', supplierId: '2', name: 'דגי סלמון', price: 60, unit: 'ק״ג' },
            // Eggs
            { id: '13', supplierId: '3', name: 'ביצים L', price: 18, unit: 'יחידה' },
            { id: '14', supplierId: '3', name: 'ביצים M', price: 16, unit: 'יחידה' },
            { id: '15', supplierId: '3', name: 'ביצים XL', price: 20, unit: 'יחידה' },
            // Tnuva
            { id: '16', supplierId: '4', name: 'חלב 3%', price: 6, unit: 'יחידה' },
            { id: '17', supplierId: '4', name: 'יוגורט', price: 5, unit: 'יחידה' },
            { id: '18', supplierId: '4', name: 'גבינה לבנה', price: 12, unit: 'יחידה' },
            { id: '19', supplierId: '4', name: 'חמאה', price: 8, unit: 'יחידה' },
            { id: '20', supplierId: '4', name: 'גבינה צהובה', price: 25, unit: 'ק״ג' },
            // Gad
            { id: '21', supplierId: '5', name: 'קוטג׳', price: 10, unit: 'יחידה' },
            { id: '22', supplierId: '5', name: 'שמנת', price: 7, unit: 'יחידה' },
            { id: '23', supplierId: '5', name: 'גבינת עיזים', price: 30, unit: 'יחידה' },
            { id: '24', supplierId: '5', name: 'גבינה בולגרית', price: 15, unit: 'יחידה' },
            // More products...
            { id: '25', supplierId: '9', name: 'לחם פרוס', price: 8, unit: 'יחידה' },
            { id: '26', supplierId: '9', name: 'חלה', price: 12, unit: 'יחידה' },
            { id: '27', supplierId: '9', name: 'בורקס', price: 5, unit: 'יחידה' },
        ];
    }

    // ===========================
    // Storage
    // ===========================

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
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
        if (sendOrderBtn) sendOrderBtn.addEventListener('click', () => this.sendOrder());
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

        // Products tab
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) addProductBtn.addEventListener('click', () => this.addProduct());
        
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
    }

    // ===========================
    // Supplier Management
    // ===========================

    loadSupplierSelects() {
        const selects = [
            document.getElementById('supplier-select'),
            document.getElementById('product-supplier-select'),
            document.getElementById('excel-supplier-select')
        ];

        selects.forEach(select => {
            select.innerHTML = '<option value="">-- בחר ספק --</option>';
            this.suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                select.appendChild(option);
            });
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
            category
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

        this.saveData('suppliers', this.suppliers);
        this.loadSupplierSelects();
        this.loadSuppliersDisplay();
        this.closeEditModal();

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
        
        // Refresh products list if current supplier is selected
        const currentSupplierId = document.getElementById('supplier-select').value;
        if (currentSupplierId === supplierId) {
            this.loadProducts(supplierId);
        }
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
        if (!supplierId) {
            document.getElementById('products-list').innerHTML = '';
            document.getElementById('delivery-date-section').style.display = 'none';
            document.getElementById('shipping-settings').style.display = 'none';
            return;
        }

        document.getElementById('delivery-date-section').style.display = 'block';
        this.loadProducts(supplierId);
    }

    loadProducts(supplierId) {
        const container = document.getElementById('products-list');
        const products = this.products.filter(p => p.supplierId === supplierId);

        if (products.length === 0) {
            container.innerHTML = '<p class="alert alert-info">אין מוצרים לספק זה. הוסף מוצרים בטאב "מוצרים"</p>';
            return;
        }

        container.innerHTML = '';
        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'product-item';
            item.innerHTML = `
                <div class="product-name">${product.name}</div>
                <div class="product-price">₪${product.price.toFixed(2)}</div>
                <input type="number" class="quantity-input" data-product-id="${product.id}" min="0" value="0" placeholder="0">
                <select class="unit-select" data-product-id="${product.id}">
                    <option value="ק״ג" ${product.unit === 'ק״ג' ? 'selected' : ''}>ק״ג</option>
                    <option value="יחידה" ${product.unit === 'יחידה' ? 'selected' : ''}>יחידה</option>
                    <option value="ארגז" ${product.unit === 'ארגז' ? 'selected' : ''}>ארגז</option>
                    <option value="קרטון" ${product.unit === 'קרטון' ? 'selected' : ''}>קרטון</option>
                </select>
            `;
            container.appendChild(item);
        });

        // Add event listeners for quantity changes
        container.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('input', () => this.updateOrderSummary());
        });

        container.querySelectorAll('.unit-select').forEach(select => {
            select.addEventListener('change', () => this.updateOrderSummary());
        });

        document.getElementById('shipping-settings').style.display = 'block';
        this.updateOrderSummary();
    }

    updateOrderSummary() {
        const container = document.getElementById('order-summary');
        const quantities = document.querySelectorAll('.quantity-input');
        
        this.currentOrder = [];
        let total = 0;

        quantities.forEach(input => {
            const qty = parseFloat(input.value) || 0;
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

    sendOrder() {
        const supplierId = document.getElementById('supplier-select').value;
        const supplier = this.suppliers.find(s => s.id === supplierId);
        
        if (!supplier || this.currentOrder.length === 0) {
            alert('נא לבחור ספק ולהזין מוצרים');
            return;
        }

        const message = this.generateOrderMessage();
        const sendMethod = this.preferences.sendMethod;

        // Save to history
        this.saveToHistory(supplier, message);

        // Send based on selected method
        if (sendMethod === 'whatsapp') {
            this.sendViaWhatsApp(supplier, message);
        } else if (sendMethod === 'email') {
            this.sendViaEmail(supplier, message);
        } else if (sendMethod === 'both') {
            this.sendViaWhatsApp(supplier, message);
            setTimeout(() => this.sendViaEmail(supplier, message), 500);
        }
    }

    sendViaWhatsApp(supplier, message) {
        const phone = supplier.phone.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/972${phone.substring(1)}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    sendViaEmail(supplier, message) {
        if (!supplier.email) {
            alert('אין כתובת אימייל לספק זה');
            return;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('he-IL');
        const subject = encodeURIComponent(`🛒 הזמנה חדשה מ-${dateStr}`);
        const body = encodeURIComponent(message);
        
        const mailtoUrl = `mailto:${supplier.email}?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
    }

    clearOrder() {
        document.querySelectorAll('.quantity-input').forEach(input => input.value = 0);
        this.currentOrder = [];
        this.updateOrderSummary();
    }

    saveToHistory(supplier, message) {
        const deliveryDate = document.getElementById('delivery-date').value;
        
        const historyItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            supplier: supplier.name,
            items: this.currentOrder,
            message: message,
            deliveryDate: deliveryDate,
            sendMethod: this.preferences.sendMethod,
            showedPrices: this.preferences.showPrices
        };

        this.history.unshift(historyItem);
        this.saveData('history', this.history);
        this.loadHistory();
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
