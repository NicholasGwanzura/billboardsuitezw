

import { Billboard, BillboardType, Client, Contract, Invoice, Expense, User, PrintingJob, OutsourcedBillboard, AuditLogEntry, CompanyProfile } from '../types';

export const ZIM_TOWNS = [
  "Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe", 
  "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Victoria Falls", "Beitbridge", "Zvishavane", "Bindura", "Chitungwiza"
];

// FULL 23-ITEM INVENTORY FROM DREAMBOX 2025 CATALOGUE
const INITIAL_BILLBOARDS: Billboard[] = [
  // Page 3
  { 
    id: "1", name: "Airport Rd H-Frame", location: "Airport Rd", town: "Harare", type: BillboardType.Static, 
    width: 12, height: 4, sideARate: 550, sideBRate: 550, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.892, lng: 31.105 }, 
    imageUrl: "https://images.unsplash.com/photo-1617195920950-1145bf9a9c72?auto=format&fit=crop&q=80&w=800", 
    visibility: "Travel like a Pro. High airport traffic." 
  },
  { 
    id: "2", name: "Airport Rd & George Rd", location: "Airport Rd & George Rd Intersection", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 550, sideBRate: 550, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.885, lng: 31.098 }, 
    imageUrl: "https://images.unsplash.com/photo-1562512684-25cb974cb30b?auto=format&fit=crop&q=80&w=800", 
    visibility: "Prime intersection visibility." 
  },
  { 
    id: "3", name: "S. Mazorodze Rd (Eva)", location: "S. Mazorodze Rd", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.855, lng: 31.040 }, 
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", 
    visibility: "Near Ardbennie. High density traffic." 
  },

  // Page 4
  { 
    id: "4", name: "S. Mazorodze (Willowvale)", location: "Near Willowvale Rd", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.865, lng: 31.035 }, 
    imageUrl: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=800", 
    visibility: "Industrial area access route." 
  },
  { 
    id: "5", name: "Kirkman Rd Tynwald", location: "Kirkman Rd Tynwald", town: "Harare", type: BillboardType.Static, 
    width: 12, height: 4, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.795, lng: 30.985 }, 
    imageUrl: "https://images.unsplash.com/photo-1622675363311-ac97f3a9a6c1?auto=format&fit=crop&q=80&w=800", 
    visibility: "Busy commuter route (LiuGong location)." 
  },
  { 
    id: "6", name: "Bindura Tollgate", location: "Bindura Tollgate", town: "Bindura", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.720, lng: 31.150 }, 
    imageUrl: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&q=80&w=800", 
    visibility: "Main highway tollgate visibility." 
  },

  // Page 5
  { 
    id: "7", name: "R. Mugabe Rd", location: "Near Gelnara Ave", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.815, lng: 31.085 }, 
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", 
    visibility: "High CBD approach traffic." 
  },
  { 
    id: "8", name: "Bulawayo Rd", location: "Near N. Richards Tynwald", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.820, lng: 30.990 }, 
    imageUrl: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=80&w=800", 
    visibility: "Major highway to Bulawayo." 
  },
  { 
    id: "9", name: "Domboshava Rd", location: "Near Winchdon Shops", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.730, lng: 31.130 }, 
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800", 
    visibility: "Commuter and peri-urban traffic." 
  },

  // Page 6
  { 
    id: "10", name: "Lomagundi Rd", location: "Harare Drive Intersection", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.760, lng: 31.010 }, 
    imageUrl: "https://images.unsplash.com/photo-1585155967849-91c73652e4d9?auto=format&fit=crop&q=80&w=800", 
    visibility: "Key intersection on major arterial." 
  },
  { 
    id: "11", name: "Mutare Rd", location: "Near Electrosales Msasa", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.835, lng: 31.110 }, 
    imageUrl: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&q=80&w=800", 
    visibility: "Industrial and Msasa traffic." 
  },
  { 
    id: "12", name: "Enterprise Rd", location: "Near Newlands Shops", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 550, sideBRate: 550, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.805, lng: 31.075 }, 
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", 
    visibility: "Premium shopping area visibility." 
  },

  // Page 7
  { 
    id: "13", name: "Harare/Chinhoyi Rd", location: "100m from Tollgate", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.755, lng: 30.950 }, 
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800", 
    visibility: "Highway exit/entry point." 
  },
  { 
    id: "14", name: "Chitungwiza Rd", location: "Near Irvines", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.950, lng: 31.050 }, 
    imageUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80&w=800", 
    visibility: "High density commuter traffic." 
  },
  { 
    id: "15", name: "Seke Rd", location: "Chitungwiza", town: "Chitungwiza", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -18.005, lng: 31.080 }, 
    imageUrl: "https://images.unsplash.com/photo-1552084117-5635e80c8dd0?auto=format&fit=crop&q=80&w=800", 
    visibility: "Main Chitungwiza arterial." 
  },

  // Page 8
  { 
    id: "16", name: "Airport Rd (Dieppe)", location: "Near Dieppe Rd Round-about", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.840, lng: 31.080 }, 
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", 
    visibility: "Strategic roundabout location." 
  },

  // Page 9
  { 
    id: "17", name: "Harare/Mutare Rd", location: "100m from Tollgate", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.850, lng: 31.180 }, 
    imageUrl: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&q=80&w=800", 
    visibility: "Main eastern exit." 
  },
  { 
    id: "18", name: "Mabvuku Turn-off", location: "100m from Turn Off", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.845, lng: 31.150 }, 
    imageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800", 
    visibility: "High density residential turn-off." 
  },
  { 
    id: "19", name: "ED Mnangagwa Rd", location: "Near Chishawasha Turn-off", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.780, lng: 31.200 }, 
    imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800", 
    visibility: "Growing affluent residential corridor." 
  },

  // Page 10
  { 
    id: "20", name: "Borrowdale Road", location: "Helensvale", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.740, lng: 31.110 }, 
    imageUrl: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800", 
    visibility: "Premium Borrowdale traffic." 
  },
  { 
    id: "21", name: "Harare Drive", location: "Cnr 2nd Street Northwood", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.750, lng: 31.080 }, 
    imageUrl: "https://images.unsplash.com/photo-1523966211575-eb4a63459bf1?auto=format&fit=crop&q=80&w=800", 
    visibility: "Major intersection." 
  },
  { 
    id: "22", name: "Cork Rd", location: "Avondale", town: "Harare", type: BillboardType.Static, 
    width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available', 
    coordinates: { lat: -17.795, lng: 31.035 }, 
    imageUrl: "https://images.unsplash.com/photo-1565514020176-db8b0059b023?auto=format&fit=crop&q=80&w=800", 
    visibility: "Leafy suburb, high net worth traffic." 
  },

  // Page 11 - LED
  { 
    id: "23", name: "Oldlock LED Digital", location: "Harare Premier Location", town: "Harare", type: BillboardType.LED, 
    width: 3, height: 6, ratePerSlot: 650, totalSlots: 10, rentedSlots: 0, 
    coordinates: { lat: -17.750, lng: 31.085 }, 
    imageUrl: "https://images.unsplash.com/photo-1562512684-25cb974cb30b?auto=format&fit=crop&q=80&w=800", 
    visibility: "Ultra-high definition LED. 2000px x 3000px. >400 plays/day." 
  }
];

// --- Persistence Helpers ---
const STORAGE_KEYS = {
    BILLBOARDS: 'bs_billboards',
    CONTRACTS: 'bs_contracts',
    INVOICES: 'bs_invoices',
    EXPENSES: 'bs_expenses',
    USERS: 'bs_users',
    CLIENTS: 'bs_clients',
    LOGS: 'bs_logs',
    OUTSOURCED: 'bs_outsourced',
    PRINTING: 'bs_printing',
    LOGO: 'bs_logo',
    PROFILE: 'bs_company_profile',
    LAST_BACKUP: 'bs_last_backup_meta',
    AUTO_BACKUP: 'bs_auto_backup_data'
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Error loading ${key}`, e);
        return defaultValue;
    }
};

const saveToStorage = (key: string, data: any) => {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
    } catch (e: any) {
        console.error(`Error saving ${key}`, e);
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            alert("⚠️ Storage Full! Data cannot be saved. Please Download Backup in Settings > Data and then Reset System to free up space.");
        } else {
            console.warn("Data save failed. You may be in Incognito mode or disk is full.");
        }
    }
};

export const getStorageUsage = () => {
    let total = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('bs_')) {
            total += (localStorage[key].length * 2);
        }
    }
    return (total / 1024).toFixed(2); // KB
};

// --- Mutable Stores ---
let billboards: Billboard[] = loadFromStorage(STORAGE_KEYS.BILLBOARDS, []);
if (billboards.length === 0 && !localStorage.getItem(STORAGE_KEYS.BILLBOARDS)) {
    // Only load defaults if key never existed to prevent overwriting an empty list intentionally created
    billboards = INITIAL_BILLBOARDS;
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
}

let contracts: Contract[] = loadFromStorage(STORAGE_KEYS.CONTRACTS, []);
let invoices: Invoice[] = loadFromStorage(STORAGE_KEYS.INVOICES, []);
let expenses: Expense[] = loadFromStorage(STORAGE_KEYS.EXPENSES, []);
let clients: Client[] = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
let auditLogs: AuditLogEntry[] = loadFromStorage(STORAGE_KEYS.LOGS, [
    { id: 'log-init', timestamp: new Date().toLocaleString(), action: 'System Init', details: 'System started with persistent storage', user: 'System' }
]);
let outsourcedBillboards: OutsourcedBillboard[] = loadFromStorage(STORAGE_KEYS.OUTSOURCED, []);
let printingJobs: PrintingJob[] = loadFromStorage(STORAGE_KEYS.PRINTING, []);

const defaultUsers: User[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', role: 'Admin', email: 'admin@spiritus.com', password: 'password' }
];
let users: User[] = loadFromStorage(STORAGE_KEYS.USERS, defaultUsers);
let companyLogo = loadFromStorage(STORAGE_KEYS.LOGO, 'https://via.placeholder.com/200x200?text=Upload+Logo');

// Updated Default Profile for Dreambox
const DEFAULT_PROFILE: CompanyProfile = {
    name: "Dreambox Advertising",
    vatNumber: "VAT-9928371",
    regNumber: "REG-2025/001",
    email: "info@dreambox.co.zw",
    supportEmail: "support@dreambox.co.zw",
    phone: "+263 772 123 456",
    website: "www.dreambox.co.zw",
    address: "123 Samora Machel Ave",
    city: "Harare",
    country: "Zimbabwe"
};
let companyProfile: CompanyProfile = loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);

let lastBackupDate = loadFromStorage(STORAGE_KEYS.LAST_BACKUP, 'Never');

export const setCompanyLogo = (url: string) => { 
    companyLogo = url; 
    saveToStorage(STORAGE_KEYS.LOGO, companyLogo);
};

export const updateCompanyProfile = (profile: CompanyProfile) => {
    companyProfile = profile;
    saveToStorage(STORAGE_KEYS.PROFILE, companyProfile);
    logAction('Settings Update', 'Updated company profile details');
};

// --- Backup & Restore Logic ---
export const createSystemBackup = () => {
    const now = new Date().toLocaleString();
    lastBackupDate = now;
    saveToStorage(STORAGE_KEYS.LAST_BACKUP, lastBackupDate);
    
    return JSON.stringify({
        version: '1.5.1',
        timestamp: new Date().toISOString(),
        data: {
            billboards, contracts, clients, invoices, expenses, 
            users, outsourcedBillboards, auditLogs, printingJobs, companyLogo, companyProfile
        }
    }, null, 2);
};

export const restoreDefaultBillboards = () => {
    // IMPORTANT: In 1.4.8 this forces a full sync to the new catalogue list
    // It will add missing ones from the new list.
    // It will NOT delete existing ones to prevent data loss on contracts, but 
    // for a fresh cleanup, the user can use "Reset System" then this.
    
    const currentIds = new Set(billboards.map(b => b.id));
    let addedCount = 0;
    
    INITIAL_BILLBOARDS.forEach(def => {
        if (!currentIds.has(def.id)) {
            billboards.push(def);
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
        logAction('Data Restore', `Restored ${addedCount} missing catalogue billboards.`);
    }
    return addedCount;
};

export const triggerAutoBackup = () => {
    const backupData = {
        timestamp: new Date().toISOString(),
        data: {
            billboards, contracts, clients, invoices, expenses, 
            users, outsourcedBillboards, auditLogs, printingJobs, companyLogo, companyProfile
        }
    };
    saveToStorage(STORAGE_KEYS.AUTO_BACKUP, backupData);
    return new Date().toLocaleString();
};

export const getAutoBackupStatus = () => {
    const autoBackup = loadFromStorage(STORAGE_KEYS.AUTO_BACKUP, null);
    return autoBackup ? new Date(autoBackup.timestamp).toLocaleString() : 'None';
};

export const getLastManualBackupDate = () => lastBackupDate;

export const restoreSystemBackup = (jsonString: string): boolean => {
    try {
        const backup = JSON.parse(jsonString);
        if(!backup.data) throw new Error("Invalid Backup Format");
        
        // Restore to LocalStorage
        saveToStorage(STORAGE_KEYS.BILLBOARDS, backup.data.billboards || []);
        saveToStorage(STORAGE_KEYS.CONTRACTS, backup.data.contracts || []);
        saveToStorage(STORAGE_KEYS.CLIENTS, backup.data.clients || []);
        saveToStorage(STORAGE_KEYS.INVOICES, backup.data.invoices || []);
        saveToStorage(STORAGE_KEYS.EXPENSES, backup.data.expenses || []);
        saveToStorage(STORAGE_KEYS.USERS, backup.data.users || []);
        saveToStorage(STORAGE_KEYS.OUTSOURCED, backup.data.outsourcedBillboards || []);
        saveToStorage(STORAGE_KEYS.LOGS, backup.data.auditLogs || []);
        saveToStorage(STORAGE_KEYS.PRINTING, backup.data.printingJobs || []);
        saveToStorage(STORAGE_KEYS.LOGO, backup.data.companyLogo || '');
        saveToStorage(STORAGE_KEYS.PROFILE, backup.data.companyProfile || DEFAULT_PROFILE);

        return true;
    } catch(e) {
        console.error("Restore failed:", e);
        return false;
    }
};

export const RELEASE_NOTES = [
    {
        version: '1.5.1',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        title: 'Responsiveness & Layout Fixes',
        features: [
            'Fixed sidebar z-index issues on mobile devices.',
            'Added horizontal scrolling to data tables for better mobile viewing.',
            'Optimized header layouts to prevent button overlapping on small screens.',
            'Improved grid collapsing for Dashboard and Settings modules on tablets.'
        ]
    },
    {
        version: '1.5.0',
        date: '2/22/2026 02:00 PM',
        title: 'Premium UI Overhaul',
        features: [
            'Complete visual redesign with Glassmorphism aesthetics.',
            'New dark mode gradient sidebar for immersive navigation.',
            'Enhanced dashboard analytics with gradient charts and glowing cards.',
            'Refined button interactions and global backdrop filters.',
            'Improved mobile responsiveness for the new layout.'
        ]
    },
    {
        version: '1.4.8',
        date: '2/22/2026 01:45 PM',
        title: 'Inventory Sync: 2025 Catalogue',
        features: [
            'Updated default inventory to match the 23 locations in the Dreambox 2025 Catalogue.',
            'Added new locations: Bindura Tollgate, Chitungwiza Rd, Seke Rd, etc.',
            'Updated pricing for all static and digital assets.',
            'Added specific "Oldlock LED Digital" specs.'
        ]
    }
];

// --- Helpers to simulate Database Logic ---
export const getBillboards = () => billboards;
export const getContracts = () => contracts;
export const getInvoices = () => invoices;
export const getExpenses = () => expenses;
export const getAuditLogs = () => auditLogs;
export const getUsers = () => users;
export const getClients = () => clients;
export const getOutsourcedBillboards = () => outsourcedBillboards;
export const getCompanyLogo = () => companyLogo;
export const getCompanyProfile = () => companyProfile;

export const resetSystemData = () => {
    localStorage.clear();
    window.location.reload();
};

export const findUserByEmail = (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase());

export const getPendingInvoices = () => invoices.filter(inv => inv.status === 'Pending' && inv.type === 'Invoice');

export const getClientFinancials = (clientId: string) => {
    const clientInvoices = invoices.filter(i => i.clientId === clientId && i.type === 'Invoice');
    const clientReceipts = invoices.filter(i => i.clientId === clientId && i.type === 'Receipt');
    const totalBilled = clientInvoices.reduce((acc, curr) => acc + curr.total, 0);
    const totalPaid = clientReceipts.reduce((acc, curr) => acc + curr.total, 0);
    return { totalBilled, totalPaid, balance: totalBilled - totalPaid };
};

export const getTransactions = (clientId: string) => invoices.filter(i => i.clientId === clientId && (i.type === 'Invoice' || i.type === 'Receipt')).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getNextBillingDetails = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    const activeContracts = contracts.filter(c => c.clientId === clientId && c.status === 'Active');
    const today = new Date();
    let earliestDate: Date | null = null;
    let totalAmount = 0;
    const billDays = new Set<number>();

    if (client && client.billingDay) {
         billDays.add(client.billingDay);
         let targetDate = new Date(today.getFullYear(), today.getMonth(), client.billingDay);
         if (targetDate <= today) targetDate = new Date(today.getFullYear(), today.getMonth() + 1, client.billingDay);
         earliestDate = targetDate;
         totalAmount = activeContracts.reduce((acc, c) => acc + c.monthlyRate, 0);
    } else {
        if (activeContracts.length === 0) return null;
        activeContracts.forEach(c => {
            const start = new Date(c.startDate);
            const day = start.getDate();
            billDays.add(day);
            let targetDate = new Date(today.getFullYear(), today.getMonth(), day);
            if (targetDate <= today) targetDate = new Date(today.getFullYear(), today.getMonth() + 1, day);
            if (!earliestDate || targetDate < earliestDate) earliestDate = targetDate;
            totalAmount += c.monthlyRate;
        });
    }
    if (totalAmount === 0 && activeContracts.length === 0) return null;
    return { date: earliestDate ? earliestDate.toLocaleDateString() : 'N/A', amount: totalAmount, days: Array.from(billDays).sort((a,b) => a-b) };
};

export const getUpcomingBillings = () => {
    const results: { clientName: string; date: string; amount: number; day: string }[] = [];
    clients.forEach(client => {
        const details = getNextBillingDetails(client.id);
        if (details && details.date !== 'N/A') {
            const formattedDays = details.days.map(d => {
                const j = d % 10, k = d % 100;
                if (j === 1 && k !== 11) return d + "st";
                if (j === 2 && k !== 12) return d + "nd";
                if (j === 3 && k !== 13) return d + "rd";
                return d + "th";
            }).join(', ');
            results.push({ clientName: client.companyName, date: details.date, amount: details.amount, day: formattedDays });
        }
    });
    return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getExpiringContracts = () => {
    const today = new Date();
    const thirtyDaysOut = new Date();
    thirtyDaysOut.setDate(today.getDate() + 30);
    return contracts.filter(c => {
        const endDate = new Date(c.endDate);
        return endDate >= today && endDate <= thirtyDaysOut && c.status === 'Active';
    });
};

export const getOverdueInvoices = () => invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
export const getSystemAlertCount = () => getExpiringContracts().length + getOverdueInvoices().length;

// Generate Dynamic Trend Data based on Actual Invoices
export const getFinancialTrends = () => {
    const today = new Date();
    const result = [];
    
    // Look back 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        // Calculate Revenue for this month
        const monthlyRevenue = invoices
            .filter(inv => {
                const invDate = new Date(inv.date);
                return inv.type === 'Invoice' && invDate.getMonth() === monthIndex && invDate.getFullYear() === year;
            })
            .reduce((acc, curr) => acc + curr.total, 0);

        // Calculate Expenses for this month
        const monthlyExpenses = expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === monthIndex && expDate.getFullYear() === year;
            })
            .reduce((acc, curr) => acc + curr.amount, 0);
            
        // Calculate Printing Costs for this month (approx)
        const monthlyPrinting = printingJobs
            .filter(job => {
                const jobDate = new Date(job.date);
                return jobDate.getMonth() === monthIndex && jobDate.getFullYear() === year;
            })
            .reduce((acc, curr) => acc + curr.totalCost, 0);

        const totalExpenses = monthlyExpenses + monthlyPrinting;

        result.push({
            name: monthName,
            revenue: monthlyRevenue,
            expenses: totalExpenses,
            margin: monthlyRevenue - totalExpenses
        });
    }

    // Add a projection for next month based on active contracts
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const activeContractRevenue = contracts
        .filter(c => c.status === 'Active')
        .reduce((acc, c) => acc + c.monthlyRate, 0);
    
    // Estimate expenses based on average of last 3 months
    const avgExpenses = result.slice(-3).reduce((acc, curr) => acc + curr.expenses, 0) / 3 || 0;

    result.push({
        name: nextMonth.toLocaleString('default', { month: 'short' }) + ' (Proj)',
        revenue: activeContractRevenue,
        expenses: Math.round(avgExpenses),
        margin: activeContractRevenue - Math.round(avgExpenses),
        isProjection: true
    });

    return result;
};

export const logAction = (action: string, details: string) => {
    const log: AuditLogEntry = { id: `log-${Date.now()}`, timestamp: new Date().toLocaleString(), action, details, user: 'Current User' };
    auditLogs = [log, ...auditLogs];
    saveToStorage(STORAGE_KEYS.LOGS, auditLogs);
};

export const addBillboard = (billboard: Billboard) => { billboards = [...billboards, billboard]; saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards); logAction('Create Billboard', `Added ${billboard.name} (${billboard.type})`); };
export const updateBillboard = (updated: Billboard) => { billboards = billboards.map(b => b.id === updated.id ? updated : b); saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards); logAction('Update Billboard', `Updated details for ${updated.name}`); };
export const deleteBillboard = (id: string) => { const target = billboards.find(b => b.id === id); if (target) { billboards = billboards.filter(b => b.id !== id); saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards); logAction('Delete Billboard', `Removed ${target.name} from inventory`); } };
export const addContract = (contract: Contract) => {
    contracts = [...contracts, contract];
    saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
    const billboard = billboards.find(b => b.id === contract.billboardId);
    if (billboard) {
        let updated = { ...billboard };
        if (billboard.type === BillboardType.Static && contract.side) {
            if (contract.side === 'Both') {
                updated.sideAStatus = 'Rented'; updated.sideAClientId = contract.clientId;
                updated.sideBStatus = 'Rented'; updated.sideBClientId = contract.clientId;
            } else if (contract.side === 'A') { 
                updated.sideAStatus = 'Rented'; updated.sideAClientId = contract.clientId; 
            } else { 
                updated.sideBStatus = 'Rented'; updated.sideBClientId = contract.clientId; 
            }
        } else if (billboard.type === BillboardType.LED) { updated.rentedSlots = (updated.rentedSlots || 0) + 1; }
        updateBillboard(updated); 
    }
    logAction('Create Contract', `New contract ${contract.id} for ${contract.details}`);
};
export const deleteContract = (id: string) => {
    const target = contracts.find(c => c.id === id);
    if (target) {
        contracts = contracts.filter(c => c.id !== id);
        saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
        const billboard = billboards.find(b => b.id === target.billboardId);
        if (billboard) {
             let updated = { ...billboard };
             if (billboard.type === BillboardType.Static && target.side) {
                 if (target.side === 'Both') {
                    updated.sideAStatus = 'Available'; updated.sideAClientId = undefined;
                    updated.sideBStatus = 'Available'; updated.sideBClientId = undefined;
                 } else if (target.side === 'A') { 
                    updated.sideAStatus = 'Available'; updated.sideAClientId = undefined; 
                 } else { 
                    updated.sideBStatus = 'Available'; updated.sideBClientId = undefined; 
                 }
             } else if (billboard.type === BillboardType.LED) { updated.rentedSlots = Math.max(0, (updated.rentedSlots || 0) - 1); }
             updateBillboard(updated);
        }
        logAction('Delete Contract', `Removed contract ${id}`);
    }
}
export const addInvoice = (invoice: Invoice) => { if (!invoice.id) invoice.id = `INV-${Date.now()}`; invoices = [...invoices, invoice]; saveToStorage(STORAGE_KEYS.INVOICES, invoices); logAction('Generate Financial', `Created ${invoice.type} #${invoice.id} for $${invoice.total}`); };
export const markInvoiceAsPaid = (id: string) => { invoices = invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv); saveToStorage(STORAGE_KEYS.INVOICES, invoices); logAction('Payment Received', `Marked Invoice #${id} as Paid`); };
export const updateInvoiceStatus = (id: string, status: 'Paid' | 'Pending' | 'Overdue') => { invoices = invoices.map(inv => inv.id === id ? { ...inv, status } : inv); saveToStorage(STORAGE_KEYS.INVOICES, invoices); };
export const addUser = (user: User) => { users = [...users, user]; saveToStorage(STORAGE_KEYS.USERS, users); logAction('User Management', `Added new user: ${user.firstName} ${user.lastName}`); };
export const updateUser = (updatedUser: User) => { users = users.map(u => u.id === updatedUser.id ? updatedUser : u); saveToStorage(STORAGE_KEYS.USERS, users); logAction('User Management', `Updated user details: ${updatedUser.firstName} ${updatedUser.lastName}`); };
export const deleteUser = (id: string) => { const target = users.find(u => u.id === id); if (target) { users = users.filter(u => u.id !== id); saveToStorage(STORAGE_KEYS.USERS, users); logAction('User Management', `Deleted user: ${target.firstName} ${target.lastName}`); } };
export const addClient = (client: Client) => { clients = [...clients, client]; saveToStorage(STORAGE_KEYS.CLIENTS, clients); logAction('Client Management', `Registered client: ${client.companyName}`); };
export const updateClient = (updated: Client) => { clients = clients.map(c => c.id === updated.id ? updated : c); saveToStorage(STORAGE_KEYS.CLIENTS, clients); logAction('Client Management', `Updated client details: ${updated.companyName}`); };
export const deleteClient = (id: string) => { const target = clients.find(c => c.id === id); if(target) { clients = clients.filter(c => c.id !== id); saveToStorage(STORAGE_KEYS.CLIENTS, clients); logAction('Client Management', `Deleted client: ${target.companyName}`); } };
export const addExpense = (expense: Expense) => { expenses = [...expenses, expense]; saveToStorage(STORAGE_KEYS.EXPENSES, expenses); logAction('Expense Tracking', `Recorded ${expense.category} expense: $${expense.amount}`); }
export const addOutsourcedBillboard = (billboard: OutsourcedBillboard) => { outsourcedBillboards = [...outsourcedBillboards, billboard]; saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards); logAction('Outsourced', `Assigned outsourced billboard: ${billboard.id}`); };
export const updateOutsourcedBillboard = (updated: OutsourcedBillboard) => { outsourcedBillboards = outsourcedBillboards.map(b => b.id === updated.id ? updated : b); saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards); logAction('Outsourced', `Updated outsourced billboard: ${updated.id}`); };
export const deleteOutsourcedBillboard = (id: string) => { const target = outsourcedBillboards.find(b => b.id === id); if(target) { outsourcedBillboards = outsourcedBillboards.filter(b => b.id !== id); saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards); logAction('Outsourced', `Deleted outsourced assignment: ${id}`); } };
export let mockPrintingJobs: PrintingJob[] = printingJobs;
export { billboards as mockBillboards, contracts as mockContracts, invoices as mockInvoices, expenses as mockExpenses, clients as mockClients, users as mockUsers, outsourcedBillboards as mockOutsourcedBillboards };
