
import { Billboard, BillboardType, Client, Contract, Invoice, Expense, User, PrintingJob, OutsourcedBillboard, AuditLogEntry } from '../types';

export const ZIM_TOWNS = [
  "Harare", "Bulawayo", "Mutare", "Gweru", "Kwekwe", 
  "Masvingo", "Chinhoyi", "Marondera", "Kadoma", "Victoria Falls", "Beitbridge", "Zvishavane", "Bindura", "Chitungwiza"
];

const INITIAL_BILLBOARDS: Billboard[] = [
    {
        id: "1", name: "Airport Rd H-Frame", location: "Airport Rd", town: "Harare", type: BillboardType.Static,
        width: 12, height: 4, sideARate: 550, sideBRate: 550, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.892, lng: 31.105 }, 
        imageUrl: "https://images.unsplash.com/photo-1622675363311-ac97f3a9a6c1?auto=format&fit=crop&q=80&w=800",
        visibility: "High-traffic route to R.G. Mugabe International Airport. Captures business travelers, tourists, and executive decision-makers."
    },
    {
        id: "2", name: "Airport & George Rd", location: "Airport Rd & George Rd", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 550, sideBRate: 550, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.885, lng: 31.098 }, 
        imageUrl: "https://images.unsplash.com/photo-1562512684-25cb974cb30b?auto=format&fit=crop&q=80&w=800",
        visibility: "Strategic intersection capturing traffic heading towards the industrial sites and airport. High dwell time during peak hours."
    },
    {
        id: "3", name: "S. Mazorodze (Above)", location: "S. Mazorodze Rd", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.910, lng: 31.020 }, 
        imageUrl: "https://images.unsplash.com/photo-1542289437-08051783e49e?auto=format&fit=crop&q=80&w=800",
        visibility: "Main arterial route connecting Harare to South Africa. Extremely high volume of freight and commuter traffic."
    },
    {
        id: "4", name: "S. Mazorodze (Willowvale)", location: "Near Willowvale Rd", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.900, lng: 31.015 }, 
        imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=800",
        visibility: "Located near the heavy industrial area. Ideal for B2B advertising, automotive, and industrial supplies."
    },
    {
        id: "5", name: "Kirkman Rd Tynwald", location: "Kirkman Rd Tynwald", town: "Harare", type: BillboardType.Static,
        width: 12, height: 4, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.810, lng: 30.980 }, 
        imageUrl: "https://images.unsplash.com/photo-1572916120286-633005a76906?auto=format&fit=crop&q=80&w=800",
        visibility: "Serves the growing residential areas of Tynwald and Westgate. Good for FMCG and household goods."
    },
    {
        id: "6", name: "Bindura Tollgate", location: "Bindura Tollgate", town: "Bindura", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.300, lng: 31.320 }, 
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
        visibility: "Compulsory stop for all traffic entering/leaving Bindura mining town. Guaranteed 100% visibility."
    },
    {
        id: "7", name: "R. Mugabe Rd", location: "Near Gelnara Ave", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.830, lng: 31.070 }, 
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
        visibility: "Busy commuter route into the CBD from eastern suburbs. High foot and vehicular traffic."
    },
    {
        id: "8", name: "Bulawayo Rd", location: "Near N. Richards Tynwald", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.820, lng: 30.950 },
        visibility: "Located on the main highway to Bulawayo. High volume of intercity buses and haulage trucks."
    },
    {
        id: "9", name: "Domboshava Rd", location: "Near Winchdon Shops", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.760, lng: 31.120 },
        visibility: "Prime location serving the affluent Borrowdale area and Domboshava peri-urban traffic."
    },
    {
        id: "10", name: "Lomagundi Rd", location: "Harare Drive Intersection", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.780, lng: 31.000 },
        visibility: "Major intersection connecting northern suburbs to the CBD and Westgate."
    },
    {
        id: "11", name: "Mutare Rd", location: "Near Electrosales Msasa", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.840, lng: 31.100 },
        visibility: "Heart of the Msasa industrial and retail hub. Targets shoppers and industrial workers."
    },
    {
        id: "12", name: "Enterprise Rd", location: "Near Newlands Shops", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 550, sideBRate: 550, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.815, lng: 31.080 },
        visibility: "Premium location in Newlands. Targets high-net-worth individuals and corporate traffic."
    },
    {
        id: "13", name: "Harare/Chinhoyi Rd", location: "100m from Tollgate", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.750, lng: 30.900 },
        visibility: "Captures traffic heading to Chinhoyi and Kariba. High visibility at tollgate slowdown."
    },
    {
        id: "14", name: "Chitungwiza Rd", location: "Near Irvines", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.950, lng: 31.050 },
        visibility: "Mass market reach. Extremely high commuter traffic between Chitungwiza and Harare."
    },
    {
        id: "15", name: "Seke Rd", location: "Chitungwiza", town: "Chitungwiza", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 450, sideBRate: 450, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -18.000, lng: 31.080 },
        visibility: "Located in the heart of Chitungwiza. Ideal for mass market consumer goods."
    },
    {
        id: "16", name: "Harare/Mutare Rd", location: "100m from Tollgate", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.850, lng: 31.200 },
        visibility: "Gateway to the Eastern Highlands and Mozambique. High freight and tourist traffic."
    },
    {
        id: "17", name: "Mabvuku Turn-off", location: "100m from Turn off", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.845, lng: 31.150 },
        visibility: "High density commuter route serving Mabvuku and Tafara."
    },
    {
        id: "18", name: "ED Mnangagwa Rd", location: "Near Chishawasha Turn-off", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.780, lng: 31.180 },
        visibility: "Growing residential corridor. Captures traffic from Highlands and Chisipite."
    },
    {
        id: "19", name: "Borrowdale Rd", location: "Helensvale", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.720, lng: 31.090 },
        visibility: "Elite demographic. Route to Borrowdale Brooke and Glen Lorne."
    },
    {
        id: "20", name: "Harare Drive", location: "Cnr 2nd Street Northwood", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.760, lng: 31.060 },
        visibility: "Key intersection in the northern suburbs. High dwell time."
    },
    {
        id: "21", name: "Cork Rd", location: "Avondale", town: "Harare", type: BillboardType.Static,
        width: 6, height: 7, sideARate: 500, sideBRate: 500, sideAStatus: 'Available', sideBStatus: 'Available',
        coordinates: { lat: -17.800, lng: 31.040 },
        visibility: "Busy commercial and diplomatic hub. Targets NGOs and embassies."
    },
    {
        id: "23", name: "Oldlock LED Digital", location: "Borrowdale", town: "Harare", type: BillboardType.LED,
        width: 3, height: 2, ratePerSlot: 650, totalSlots: 10, rentedSlots: 0,
        coordinates: { lat: -17.750, lng: 31.085 }, 
        imageUrl: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=80&w=800",
        visibility: "Premium digital screen in the affluent Borrowdale area. Targets high-net-worth individuals and shoppers."
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
    LOGO: 'bs_logo'
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.error(`Error loading ${key}`, e);
        return defaultValue;
    }
};

const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving ${key}`, e);
    }
};

// --- Mutable Stores (Initialized from Storage or Empty) ---

// Force Initialize Billboards if empty
let billboards: Billboard[] = loadFromStorage(STORAGE_KEYS.BILLBOARDS, []);
if (billboards.length === 0) {
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

// Default Admin User if storage is empty
const defaultUsers: User[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', role: 'Admin', email: 'admin@spiritus.com', password: 'password' }
];
let users: User[] = loadFromStorage(STORAGE_KEYS.USERS, defaultUsers);

// Settings State
let companyLogo = loadFromStorage(STORAGE_KEYS.LOGO, 'https://via.placeholder.com/200x200?text=Upload+Logo');

export const RELEASE_NOTES = [
    {
        version: '1.2.0',
        date: 'Jan 2026',
        title: 'Production Ready Update',
        features: [
            'Removed mock data for fresh installation',
            'Implemented LocalStorage persistence',
            'Data now survives page refreshes',
            'Restored Full DreamBox Billboard Inventory'
        ]
    },
    {
        version: '1.1.0',
        date: 'Dec 2025',
        title: 'Premium Suite Update',
        features: [
            'Implemented Premium Authentication with animated background',
            'Added Map Client View with Shareable Links',
            'Integrated AI Strategic Insights on Dashboard',
            'Enhanced Receipt & Payment Workflows',
            'Added "Forgot Password" functionality',
            'UI Overhaul: Gradients, Animations, and Glassmorphism'
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

export const setCompanyLogo = (url: string) => { 
    companyLogo = url; 
    saveToStorage(STORAGE_KEYS.LOGO, companyLogo);
};

export const resetSystemData = () => {
    localStorage.clear();
    window.location.reload();
};

// Find user by email for Auth
export const findUserByEmail = (email: string) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Financial Helpers for Statements
export const getPendingInvoices = () => {
    return invoices.filter(inv => inv.status === 'Pending' && inv.type === 'Invoice');
}

export const getClientFinancials = (clientId: string) => {
    const clientInvoices = invoices.filter(i => i.clientId === clientId && i.type === 'Invoice');
    const clientReceipts = invoices.filter(i => i.clientId === clientId && i.type === 'Receipt');
    
    const totalBilled = clientInvoices.reduce((acc, curr) => acc + curr.total, 0);
    const totalPaid = clientReceipts.reduce((acc, curr) => acc + curr.total, 0);
    const balance = totalBilled - totalPaid;

    return { totalBilled, totalPaid, balance };
};

export const getTransactions = (clientId: string) => {
    return invoices
        .filter(i => i.clientId === clientId && (i.type === 'Invoice' || i.type === 'Receipt'))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Notification Helpers
export const getExpiringContracts = () => {
    const today = new Date();
    const thirtyDaysOut = new Date();
    thirtyDaysOut.setDate(today.getDate() + 30);

    return contracts.filter(c => {
        const endDate = new Date(c.endDate);
        return endDate >= today && endDate <= thirtyDaysOut && c.status === 'Active';
    });
};

export const getOverdueInvoices = () => {
    return invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
};

export const logAction = (action: string, details: string) => {
    const log: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action,
        details,
        user: 'Current User' // Enhanced in real app with context
    };
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
    
    // Auto-Update Billboard Status Logic
    const billboard = billboards.find(b => b.id === contract.billboardId);
    if (billboard) {
        let updated = { ...billboard };
        if (billboard.type === BillboardType.Static && contract.side) {
            if (contract.side === 'A') {
                updated.sideAStatus = 'Rented';
                updated.sideAClientId = contract.clientId;
            } else {
                updated.sideBStatus = 'Rented';
                updated.sideBClientId = contract.clientId;
            }
        } else if (billboard.type === BillboardType.LED) {
            updated.rentedSlots = (updated.rentedSlots || 0) + 1;
        }
        updateBillboard(updated); 
    }
    
    logAction('Create Contract', `New contract ${contract.id} for ${contract.details}`);
};

export const deleteContract = (id: string) => {
    const target = contracts.find(c => c.id === id);
    if (target) {
        contracts = contracts.filter(c => c.id !== id);
        saveToStorage(STORAGE_KEYS.CONTRACTS, contracts);
        
        // Reverse Billboard Status
        const billboard = billboards.find(b => b.id === target.billboardId);
        if (billboard) {
             let updated = { ...billboard };
             if (billboard.type === BillboardType.Static && target.side) {
                 if (target.side === 'A') {
                     updated.sideAStatus = 'Available';
                     updated.sideAClientId = undefined;
                 } else {
                     updated.sideBStatus = 'Available';
                     updated.sideBClientId = undefined;
                 }
             } else if (billboard.type === BillboardType.LED) {
                 updated.rentedSlots = Math.max(0, (updated.rentedSlots || 0) - 1);
             }
             updateBillboard(updated);
        }

        logAction('Delete Contract', `Removed contract ${id}`);
    }
}

export const addInvoice = (invoice: Invoice) => {
    if (!invoice.id) invoice.id = `INV-${Date.now()}`;
    invoices = [...invoices, invoice];
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    logAction('Generate Financial', `Created ${invoice.type} #${invoice.id} for $${invoice.total}`);
};

export const markInvoiceAsPaid = (id: string) => {
    invoices = invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv);
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    logAction('Payment Received', `Marked Invoice #${id} as Paid`);
};

export const updateInvoiceStatus = (id: string, status: 'Paid' | 'Pending' | 'Overdue') => {
    invoices = invoices.map(inv => inv.id === id ? { ...inv, status } : inv);
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
};

export const addUser = (user: User) => {
    users = [...users, user];
    saveToStorage(STORAGE_KEYS.USERS, users);
    logAction('User Management', `Added new user: ${user.firstName} ${user.lastName}`);
};

export const updateUser = (updatedUser: User) => {
    users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveToStorage(STORAGE_KEYS.USERS, users);
    logAction('User Management', `Updated user details: ${updatedUser.firstName} ${updatedUser.lastName}`);
};

export const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    if (target) {
        users = users.filter(u => u.id !== id);
        saveToStorage(STORAGE_KEYS.USERS, users);
        logAction('User Management', `Deleted user: ${target.firstName} ${target.lastName}`);
    }
};

export const addClient = (client: Client) => {
    clients = [...clients, client];
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    logAction('Client Management', `Registered client: ${client.companyName}`);
};

export const deleteClient = (id: string) => {
    const target = clients.find(c => c.id === id);
    if(target) {
        clients = clients.filter(c => c.id !== id);
        saveToStorage(STORAGE_KEYS.CLIENTS, clients);
        logAction('Client Management', `Deleted client: ${target.companyName}`);
    }
};

export const addExpense = (expense: Expense) => {
    expenses = [...expenses, expense];
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    logAction('Expense Tracking', `Recorded ${expense.category} expense: $${expense.amount}`);
}

export const addOutsourcedBillboard = (billboard: OutsourcedBillboard) => {
    outsourcedBillboards = [...outsourcedBillboards, billboard];
    saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards);
    logAction('Outsourced', `Assigned outsourced billboard: ${billboard.id}`);
};

export const updateOutsourcedBillboard = (updated: OutsourcedBillboard) => {
    outsourcedBillboards = outsourcedBillboards.map(b => b.id === updated.id ? updated : b);
    saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards);
    logAction('Outsourced', `Updated outsourced billboard: ${updated.id}`);
};

export const deleteOutsourcedBillboard = (id: string) => {
    const target = outsourcedBillboards.find(b => b.id === id);
    if(target) {
        outsourcedBillboards = outsourcedBillboards.filter(b => b.id !== id);
        saveToStorage(STORAGE_KEYS.OUTSOURCED, outsourcedBillboards);
        logAction('Outsourced', `Deleted outsourced assignment: ${id}`);
    }
};

// Mock Printing jobs need to be persisted if editable, for now we will assume they are part of expenses logic or separate
export let mockPrintingJobs: PrintingJob[] = printingJobs;

// Exports for backward compatibility
export { billboards as mockBillboards, contracts as mockContracts, invoices as mockInvoices, expenses as mockExpenses, clients as mockClients, users as mockUsers, outsourcedBillboards as mockOutsourcedBillboards };
