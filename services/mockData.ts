
import { Billboard, BillboardType, Client, Contract, Invoice, Expense, User, PrintingJob, OutsourcedBillboard, AuditLogEntry, CompanyProfile, VAT_RATE } from '../types';

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

const INITIAL_CLIENTS: Client[] = [
    { id: 'c1', companyName: 'Delta Beverages', contactPerson: 'T. Moyo', email: 'marketing@delta.co.zw', phone: '+263 772 111 222', status: 'Active', billingDay: 25 },
    { id: 'c2', companyName: 'Econet Wireless', contactPerson: 'S. Dube', email: 'ads@econet.co.zw', phone: '+263 774 333 444', status: 'Active', billingDay: 1 },
];

const INITIAL_CONTRACTS: Contract[] = [
    { 
        id: 'C-2025-001', clientId: 'c1', billboardId: '1', startDate: '2025-01-01', endDate: '2025-12-31', 
        monthlyRate: 550, installationCost: 200, printingCost: 150, hasVat: true, totalContractValue: 7850, 
        status: 'Active', details: 'Side A' 
    },
    { 
        id: 'C-2025-002', clientId: 'c2', billboardId: '23', startDate: '2025-02-01', endDate: '2026-01-31', 
        monthlyRate: 650, installationCost: 0, printingCost: 0, hasVat: true, totalContractValue: 8970, 
        status: 'Active', details: 'Slot 1' 
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
    AUTO_BACKUP: 'bs_auto_backup_data',
    DATA_VERSION: 'bs_data_version'
};

const loadFromStorage = <T>(key: string, defaultValue: T | null): T | null => {
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
            console.warn("Data save failed.");
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

// --- Mutable Stores & Initialization ---

// 1. Billboards
export let billboards: Billboard[] = loadFromStorage(STORAGE_KEYS.BILLBOARDS, null) || INITIAL_BILLBOARDS;
if (!loadFromStorage(STORAGE_KEYS.BILLBOARDS, null)) {
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
}

// 2. Clients
export let clients: Client[] = loadFromStorage(STORAGE_KEYS.CLIENTS, null) || INITIAL_CLIENTS;
if (!loadFromStorage(STORAGE_KEYS.CLIENTS, null)) {
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
}

// 3. Contracts
export let contracts: Contract[] = loadFromStorage(STORAGE_KEYS.CONTRACTS, null) || INITIAL_CONTRACTS;
if (!loadFromStorage(STORAGE_KEYS.CONTRACTS, null)) {
    saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
}

// Auto-Migration for New Catalogue Items
const currentDataVersion = '1.5.3'; 
const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);

if (storedVersion !== currentDataVersion) {
    let migrated = false;

    // Merge new billboards from catalogue if they don't exist
    const currentBoardIds = new Set((billboards || []).map(b => b.id));
    INITIAL_BILLBOARDS.forEach(def => {
        if (!currentBoardIds.has(def.id)) {
            billboards.push(def);
            migrated = true;
        }
    });

    if (migrated) {
        saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
        console.log(`Auto-Migration (v${currentDataVersion}): Catalogue merged.`);
    }
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, currentDataVersion);
}

// Load other entities
export let invoices: Invoice[] = loadFromStorage(STORAGE_KEYS.INVOICES, []) || [];
export let expenses: Expense[] = loadFromStorage(STORAGE_KEYS.EXPENSES, []) || [];
export let auditLogs: AuditLogEntry[] = loadFromStorage(STORAGE_KEYS.LOGS, [
    { id: 'log-init', timestamp: new Date().toLocaleString(), action: 'System Init', details: 'System started', user: 'System' }
]) || [];
export let outsourcedBillboards: OutsourcedBillboard[] = loadFromStorage(STORAGE_KEYS.OUTSOURCED, []) || [];
export let printingJobs: PrintingJob[] = loadFromStorage(STORAGE_KEYS.PRINTING, []) || [];

const defaultUsers: User[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', role: 'Admin', email: 'admin@spiritus.com', password: 'password' }
];
export let users: User[] = loadFromStorage(STORAGE_KEYS.USERS, null) || defaultUsers;
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, users);
}

let companyLogo = loadFromStorage(STORAGE_KEYS.LOGO, null) || 'https://via.placeholder.com/200x200?text=Upload+Logo';

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
let companyProfile: CompanyProfile = loadFromStorage(STORAGE_KEYS.PROFILE, null) || DEFAULT_PROFILE;

let lastBackupDate = loadFromStorage(STORAGE_KEYS.LAST_BACKUP, null) || 'Never';

// --- Setters ---

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
        version: currentDataVersion,
        timestamp: new Date().toISOString(),
        data: {
            billboards, contracts, clients, invoices, expenses, 
            users, outsourcedBillboards, auditLogs, printingJobs, companyLogo, companyProfile
        }
    }, null, 2);
};

export const restoreDefaultBillboards = () => {
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

export const runAutoBilling = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let generatedCount = 0;

    if (!contracts) return 0;

    contracts.forEach(contract => {
        if (contract.status !== 'Active') return;

        const client = clients.find(c => c.id === contract.clientId);
        // Default to 28th if no specific billing day set
        const billDay = client?.billingDay || 28;

        // If today is before the billing day, do not bill yet
        if (today.getDate() < billDay) return;

        // Check if an invoice for this contract ALREADY exists for this month/year
        // We look for type 'Invoice' linked to this contract
        const alreadyBilled = invoices.some(inv => {
            if (inv.contractId !== contract.id) return false;
            if (inv.type !== 'Invoice') return false; 
            
            const invDate = new Date(inv.date);
            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        });

        if (!alreadyBilled) {
            const billboard = billboards.find(b => b.id === contract.billboardId);
            const subtotal = contract.monthlyRate;
            const vat = contract.hasVat ? subtotal * VAT_RATE : 0;
            
            const newInvoice: Invoice = {
                id: `INV-AUTO-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
                contractId: contract.id,
                clientId: contract.clientId,
                date: today.toISOString().split('T')[0],
                items: [
                    { 
                        description: `Auto-Billing: ${billboard?.name || 'Billboard Rental'} (${contract.details}) - ${today.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`, 
                        amount: subtotal 
                    }
                ],
                subtotal: subtotal,
                vatAmount: vat,
                total: subtotal + vat,
                status: 'Pending',
                type: 'Invoice'
            };

            // Add to invoices array (in-memory)
            invoices = [newInvoice, ...invoices];
            generatedCount++;
        }
    });

    if (generatedCount > 0) {
        // Persist
        saveToStorage(STORAGE_KEYS.INVOICES, invoices);
        logAction('Auto-Billing', `Generated ${generatedCount} invoices for ${today.toLocaleDateString('default', { month: 'long' })} cycle.`);
        console.log(`Auto-Billing: Generated ${generatedCount} invoices.`);
    }
    
    return generatedCount;
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
        version: '1.5.5',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        title: 'Automated Billing Engine',
        features: [
            'Automated Invoice Generation: The system now automatically generates monthly rental invoices for active contracts.',
            'Smart Billing Dates: Invoices are created on the 28th by default, or on the client\'s specific preferred billing day.',
            'Duplicate Protection: Prevents double-billing for the same contract within the same month.'
        ]
    },
    {
        version: '1.5.4',
        date: '2/22/2026 04:00 PM',
        title: 'Auto-Billing & Mobile Optimization',
        features: [
            'Added Automatic Invoice Generation for active contracts (triggers on 28th or client billing day).',
            'Implemented "Catch-up" logic to bill immediately if the system was offline on the billing day.',
            'Fixed sidebar alignment issues on mobile devices.',
            'Enhanced responsiveness for modal dialogs and data tables.'
        ]
    },
    {
        version: '1.5.3',
        date: '2/22/2026 03:30 PM',
        title: 'Persistence Engine & Mobile Fixes',
        features: [
            'Fixed critical persistence bug: Created Rentals/Clients now persist reliably even after updates.',
            'Refined Sidebar Layout: Fixed overlapping issues on mobile devices.',
            'Improved "New Rental" form responsiveness for easier data entry on phones.',
            'Auto-Merge Logic: Catalogue updates are now additive and do not overwrite your existing data.'
        ]
    }
];

// --- Helpers to simulate Database Logic ---
export const getBillboards = () => billboards || [];
export const getContracts = () => contracts || [];
export const getInvoices = () => invoices || [];
export const getExpenses = () => expenses || [];
export const getAuditLogs = () => auditLogs || [];
export const getUsers = () => users || [];
export const getClients = () => clients || [];
export const getOutsourcedBillboards = () => outsourcedBillboards || [];
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
    return results.sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime());
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
        .filter(c => c.status === 'Active').reduce((acc, c) => acc + c.monthlyRate, 0);
    
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

export const addBillboard = (billboard: Billboard) => { 
    billboards = [...billboards, billboard]; 
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards); 
    logAction('Create Billboard', `Added ${billboard.name} (${billboard.type})`); 
};
export const updateBillboard = (updated: Billboard) => { 
    billboards = billboards.map(b => b.id === updated.id ? updated : b); 
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards); 
    logAction('Update Billboard', `Updated details for ${updated.name}`); 
};
export const deleteBillboard = (id: string) => { 
    const target = billboards.find(b => b.id === id); 
    if (target) { 
        billboards = billboards.filter(b => b.id !== id); 
        saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards); 
        logAction('Delete Billboard', `Removed ${target.name} from inventory`);
    }
};

export const addContract = (contract: Contract) => { 
    contracts = [...contracts, contract]; 
    saveToStorage(STORAGE_KEYS.CONTRACTS, contracts); 
    
    // Update Billboard Status if Static
    const billboard = billboards.find(b => b.id === contract.billboardId);
    if(billboard) {
        if(billboard.type === BillboardType.Static) {
            if(contract.side === 'A' || contract.details.includes('Side A')) billboard.sideAStatus = 'Rented';
            if(contract.side === 'B' || contract.details.includes('Side B')) billboard.sideBStatus = 'Rented';
            if(contract.side === 'Both') { billboard.sideAStatus = 'Rented'; billboard.sideBStatus = 'Rented'; }
            if(contract.details.includes('Side A') && contract.clientId) billboard.sideAClientId = contract.clientId;
            if(contract.details.includes('Side B') && contract.clientId) billboard.sideBClientId = contract.clientId;
        } else if (billboard.type === BillboardType.LED) {
            billboard.rentedSlots = (billboard.rentedSlots || 0) + 1;
        }
        updateBillboard(billboard);
    }
    logAction('Create Contract', `New contract for ${contract.billboardId}`); 
};

export const deleteContract = (id: string) => {
    const contract = contracts.find(c => c.id === id);
    if(contract) {
        contracts = contracts.filter(c => c.id !== id);
        saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
        
        // Free up the billboard
        const billboard = billboards.find(b => b.id === contract.billboardId);
        if(billboard) {
            if(billboard.type === BillboardType.Static) {
                if(contract.side === 'A' || contract.details.includes('Side A')) { billboard.sideAStatus = 'Available'; billboard.sideAClientId = undefined; }
                if(contract.side === 'B' || contract.details.includes('Side B')) { billboard.sideBStatus = 'Available'; billboard.sideBClientId = undefined; }
                if(contract.side === 'Both') { 
                    billboard.sideAStatus = 'Available'; billboard.sideBStatus = 'Available'; 
                    billboard.sideAClientId = undefined; billboard.sideBClientId = undefined;
                }
            } else if(billboard.type === BillboardType.LED) {
                billboard.rentedSlots = Math.max(0, (billboard.rentedSlots || 0) - 1);
            }
            updateBillboard(billboard);
        }
        logAction('Delete Contract', `Removed contract ${id}`);
    }
};

export const addInvoice = (invoice: Invoice) => { invoices = [invoice, ...invoices]; saveToStorage(STORAGE_KEYS.INVOICES, invoices); logAction('Create Invoice', `Created ${invoice.type} #${invoice.id} ($${invoice.total})`); };
export const markInvoiceAsPaid = (id: string) => { invoices = invoices.map(i => i.id === id ? { ...i, status: 'Paid' } : i); saveToStorage(STORAGE_KEYS.INVOICES, invoices); logAction('Payment', `Marked Invoice #${id} as Paid`); };
export const addExpense = (expense: Expense) => { expenses = [expense, ...expenses]; saveToStorage(STORAGE_KEYS.EXPENSES, expenses); logAction('Expense', `Recorded expense: ${expense.description} ($${expense.amount})`); };
export const addClient = (client: Client) => { 
    clients = [...clients, client]; 
    saveToStorage(STORAGE_KEYS.CLIENTS, clients); 
    logAction('Create Client', `Added ${client.companyName}`); 
};
export const updateClient = (updated: Client) => {
    clients = clients.map(c => c.id === updated.id ? updated : c);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    logAction('Update Client', `Updated info for ${updated.companyName}`);
};
export const deleteClient = (id: string) => { 
    const target = clients.find(c => c.id === id); 
    if (target) { 
        clients = clients.filter(c => c.id !== id); 
        saveToStorage(STORAGE_KEYS.CLIENTS, clients); 
        logAction('Delete Client', `Removed ${target.companyName}`); 
    }
};
export const addUser = (user: User) => { users = [...users, user]; saveToStorage(STORAGE_KEYS.USERS, users); logAction('User Mgmt', `Added user ${user.email}`); };
export const updateUser = (updated: User) => { users = users.map(u => u.id === updated.id ? updated : u); saveToStorage(STORAGE_KEYS.USERS, users); logAction('User Mgmt', `Updated user ${updated.email}`); };
export const deleteUser = (id: string) => { users = users.filter(u => u.id !== id); saveToStorage(STORAGE_KEYS.USERS, users); logAction('User Mgmt', `Deleted user ID ${id}`); };
export const addOutsourcedBillboard = (b: OutsourcedBillboard) => { outsourcedBillboards = [...outsourcedBillboards, b]; saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards); logAction('Outsourcing', `Added outsourced unit ${b.billboardId}`); };
export const updateOutsourcedBillboard = (updated: OutsourcedBillboard) => { outsourcedBillboards = outsourcedBillboards.map(b => b.id === updated.id ? updated : b); saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards); };
export const deleteOutsourcedBillboard = (id: string) => { outsourcedBillboards = outsourcedBillboards.filter(b => b.id !== id); saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards); };

// Aliases for compatibility
export { 
  billboards as mockBillboards,
  clients as mockClients,
  contracts as mockContracts,
  invoices as mockInvoices,
  expenses as mockExpenses,
  printingJobs as mockPrintingJobs,
  outsourcedBillboards as mockOutsourcedBillboards
};
