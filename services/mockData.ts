
import { Billboard, BillboardType, Client, Contract, Invoice, Expense, User, PrintingJob, OutsourcedBillboard, AuditLogEntry, CompanyProfile, VAT_RATE, MaintenanceRecord } from '../types';

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
    MAINTENANCE: 'bs_maintenance',
    LOGO: 'bs_logo',
    PROFILE: 'bs_company_profile',
    LAST_BACKUP: 'bs_last_backup_meta',
    AUTO_BACKUP: 'bs_auto_backup_data',
    DATA_VERSION: 'bs_data_version'
};

// Removed generic T to prevent JSX parser confusion
function loadFromStorage(key: string, defaultValue: any): any {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Error loading ${key}`, e);
        return defaultValue;
    }
}

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
    try {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith('bs_')) {
                total += (localStorage[key].length * 2);
            }
        }
        return (total / 1024).toFixed(2); // KB
    } catch (e) {
        return "0.00";
    }
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
const storedVersion = loadFromStorage(STORAGE_KEYS.DATA_VERSION, null);

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
    saveToStorage(STORAGE_KEYS.DATA_VERSION, currentDataVersion);
}

// Load other entities
export let invoices: Invoice[] = loadFromStorage(STORAGE_KEYS.INVOICES, []) || [];
export let expenses: Expense[] = loadFromStorage(STORAGE_KEYS.EXPENSES, []) || [];
export let auditLogs: AuditLogEntry[] = loadFromStorage(STORAGE_KEYS.LOGS, [
    { id: 'log-init', timestamp: new Date().toLocaleString(), action: 'System Init', details: 'System started', user: 'System' }
]) || [];
export let outsourcedBillboards: OutsourcedBillboard[] = loadFromStorage(STORAGE_KEYS.OUTSOURCED, []) || [];
export let printingJobs: PrintingJob[] = loadFromStorage(STORAGE_KEYS.PRINTING, []) || [];
export let maintenanceRecords: MaintenanceRecord[] = loadFromStorage(STORAGE_KEYS.MAINTENANCE, []) || [];

const defaultUsers: User[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', role: 'Admin', email: 'admin@spiritus.com', password: 'password' }
];
export let users: User[] = loadFromStorage(STORAGE_KEYS.USERS, null) || defaultUsers;
if (!loadFromStorage(STORAGE_KEYS.USERS, null)) {
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

// Helper to log actions
export const logAction = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleString(),
        action,
        details,
        user: 'System' // In a real app, get current user
    };
    auditLogs.unshift(newLog);
    saveToStorage(STORAGE_KEYS.LOGS, auditLogs);
};

export const setCompanyLogo = (url: string) => { 
    companyLogo = url; 
    saveToStorage(STORAGE_KEYS.LOGO, companyLogo);
};

export const updateCompanyProfile = (profile: CompanyProfile) => {
    companyProfile = profile;
    saveToStorage(STORAGE_KEYS.PROFILE, companyProfile);
    logAction('Settings Update', 'Updated company profile details');
};

// --- CRUD Operations ---

// Billboards CRUD
export const addBillboard = (billboard: Billboard) => {
    billboards.push(billboard);
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
    logAction('Create Asset', `Added billboard: ${billboard.name}`);
};

export const updateBillboard = (updated: Billboard) => {
    billboards = billboards.map(b => b.id === updated.id ? updated : b);
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
    logAction('Update Asset', `Updated billboard: ${updated.name}`);
};

export const deleteBillboard = (id: string) => {
    const target = billboards.find(b => b.id === id);
    billboards = billboards.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BILLBOARDS, billboards);
    logAction('Delete Asset', `Deleted billboard: ${target?.name}`);
};

// Clients CRUD
export const addClient = (client: Client) => {
    clients.push(client);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    logAction('Create Client', `Added client: ${client.companyName}`);
};

export const updateClient = (updated: Client) => {
    clients = clients.map(c => c.id === updated.id ? updated : c);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    logAction('Update Client', `Updated client: ${updated.companyName}`);
};

export const deleteClient = (id: string) => {
    const target = clients.find(c => c.id === id);
    clients = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    logAction('Delete Client', `Deleted client: ${target?.companyName}`);
};

// Contracts CRUD
export const addContract = (contract: Contract) => {
    contracts.push(contract);
    saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
    
    // Update Billboard Status
    const billboard = billboards.find(b => b.id === contract.billboardId);
    if (billboard) {
        if (billboard.type === BillboardType.Static) {
            if (contract.side === 'A' || contract.side === 'Both') {
                billboard.sideAStatus = 'Rented';
                billboard.sideAClientId = contract.clientId;
            }
            if (contract.side === 'B' || contract.side === 'Both') {
                billboard.sideBStatus = 'Rented';
                billboard.sideBClientId = contract.clientId;
            }
        } else {
            billboard.rentedSlots = (billboard.rentedSlots || 0) + 1;
        }
        updateBillboard(billboard);
    }
    
    logAction('Create Contract', `New contract for ${contract.details}`);
};

export const deleteContract = (id: string) => {
    const target = contracts.find(c => c.id === id);
    if(target) {
        // Reset Billboard Status
        const billboard = billboards.find(b => b.id === target.billboardId);
        if(billboard) {
            if (billboard.type === BillboardType.Static) {
                if (target.side === 'A' || target.side === 'Both') {
                    billboard.sideAStatus = 'Available';
                    billboard.sideAClientId = undefined;
                }
                if (target.side === 'B' || target.side === 'Both') {
                    billboard.sideBStatus = 'Available';
                    billboard.sideBClientId = undefined;
                }
            } else {
                billboard.rentedSlots = Math.max(0, (billboard.rentedSlots || 0) - 1);
            }
            updateBillboard(billboard);
        }
    }
    contracts = contracts.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
    logAction('Delete Contract', `Removed contract ${id}`);
};

// Invoices CRUD
export const addInvoice = (invoice: Invoice) => {
    invoices.unshift(invoice);
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    logAction('Generate Invoice', `Created ${invoice.type} #${invoice.id}`);
};

export const markInvoiceAsPaid = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if(inv) {
        inv.status = 'Paid';
        saveToStorage(STORAGE_KEYS.INVOICES, invoices);
        logAction('Payment', `Marked Invoice #${id} as Paid`);
    }
};

// Expenses CRUD
export const addExpense = (expense: Expense) => {
    expenses.unshift(expense);
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    logAction('Log Expense', `Added expense: ${expense.description}`);
};

// Outsourced Billboards CRUD
export const addOutsourcedBillboard = (ob: OutsourcedBillboard) => {
    outsourcedBillboards.push(ob);
    saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards);
    logAction('Outsource', `Assigned ${ob.billboardName} to partner`);
};

export const updateOutsourcedBillboard = (updated: OutsourcedBillboard) => {
    outsourcedBillboards = outsourcedBillboards.map(b => b.id === updated.id ? updated : b);
    saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards);
    logAction('Update Outsource', `Updated outsourcing for ${updated.billboardName}`);
};

export const deleteOutsourcedBillboard = (id: string) => {
    outsourcedBillboards = outsourcedBillboards.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards);
    logAction('Delete Outsource', `Removed outsourcing assignment`);
};

// Users CRUD
export const addUser = (user: User) => {
    users.push(user);
    saveToStorage(STORAGE_KEYS.USERS, users);
    logAction('User Mgmt', `Added user: ${user.firstName} ${user.lastName}`);
};

export const updateUser = (updated: User) => {
    users = users.map(u => u.id === updated.id ? updated : u);
    saveToStorage(STORAGE_KEYS.USERS, users);
    logAction('User Mgmt', `Updated user: ${updated.email}`);
};

export const deleteUser = (id: string) => {
    users = users.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, users);
    logAction('User Mgmt', `Deleted user ID: ${id}`);
};

// Maintenance CRUD
export const addMaintenanceRecord = (record: MaintenanceRecord) => {
    maintenanceRecords.unshift(record);
    saveToStorage(STORAGE_KEYS.MAINTENANCE, maintenanceRecords);
    
    // Update last maintenance date on billboard
    const billboard = billboards.find(b => b.id === record.billboardId);
    if(billboard) {
        billboard.lastMaintenanceDate = record.date;
        updateBillboard(billboard);
    }
    
    logAction('Maintenance', `Logged check for ${billboard?.name || 'Unknown'}`);
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
            users, outsourcedBillboards, auditLogs, printingJobs, maintenanceRecords, companyLogo, companyProfile
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
            users, outsourcedBillboards, auditLogs, printingJobs, maintenanceRecords, companyLogo, companyProfile
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
        saveToStorage(STORAGE_KEYS.MAINTENANCE, backup.data.maintenanceRecords || []);
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
        version: '1.7.3',
        date: '2/22/2026 08:30 PM', // Static date string to prevent module execution errors
        title: 'Enhanced Safety Inspections',
        features: [
            'Safety Checklist: Added detailed checklist for bolts, structural integrity, and electrical systems in maintenance module.',
            '3-Month Protocol: Enforced strict 3-month cycle for all physical inspections.',
            'Reporting: Detailed maintenance logs now include specific component checks.'
        ]
    },
    {
        version: '1.7.2',
        date: '2/22/2026 07:15 PM',
        title: 'Tightened Safety Standards',
        features: [
            'Policy Update: Reduced maintenance interval from 4 months to 3 months.',
            'Safety Protocol: Critical alerts now trigger after 90 days of inactivity.',
            'Bolt Check: Prioritized bolt and structural integrity checks in maintenance logs.'
        ]
    },
    {
        version: '1.7.1',
        date: '2/22/2026 07:00 PM',
        title: 'Domain Deployment Verification',
        features: [
            'System Validation: Confirmed deployment pipeline integrity for custom domain mapping.',
            'Cloud Run Integration: Verified secure connection and routing.'
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
export const getMaintenanceRecords = () => maintenanceRecords || [];
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

export const getOverdueMaintenance = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    return billboards.filter(b => {
        // If never checked, it's overdue
        if (!b.lastMaintenanceDate) return true;
        return new Date(b.lastMaintenanceDate) < threeMonthsAgo;
    });
};

export const getOverdueInvoices = () => invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
export const getSystemAlertCount = () => getExpiringContracts().length + getOverdueInvoices().length + getOverdueMaintenance().length;

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

        // Calculate Expenses (Operational + Printing + Outsourced Payouts)
        const monthlyExpenses = expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === monthIndex && expDate.getFullYear() === year;
            })
            .reduce((acc, curr) => acc + curr.amount, 0);
            
        // Add Printing Costs for month (mock data usually has fixed dates, but logic holds)
        const printCosts = printingJobs
            .filter(job => {
                const jobDate = new Date(job.date);
                return jobDate.getMonth() === monthIndex && jobDate.getFullYear() === year;
            })
            .reduce((acc, curr) => acc + curr.totalCost, 0);

        // Add Outsourced Payouts (Fixed monthly)
        const outsourcedCosts = outsourcedBillboards.reduce((acc, curr) => acc + curr.monthlyPayout, 0);

        const totalMonthExpenses = monthlyExpenses + printCosts + outsourcedCosts;

        result.push({
            name: monthName,
            revenue: monthlyRevenue,
            expenses: totalMonthExpenses,
            margin: monthlyRevenue - totalMonthExpenses
        });
    }

    // Add 1 month forecast
    const lastRev = result[result.length - 1].revenue;
    const lastExp = result[result.length - 1].expenses;
    result.push({
        name: 'Proj.',
        revenue: lastRev * 1.1, // +10% growth
        expenses: lastExp * 1.05, // +5% costs
        margin: (lastRev * 1.1) - (lastExp * 1.05)
    });

    return result;
};

// Aliases for backward compatibility with component imports
export const mockClients = clients;
export const mockContracts = contracts;
export const mockBillboards = billboards;
export const mockPrintingJobs = printingJobs;
export const mockOutsourcedBillboards = outsourcedBillboards;
