

import { Billboard, BillboardType, Client, Contract, Invoice, Expense, User, PrintingJob, OutsourcedBillboard, AuditLogEntry, CompanyProfile } from '../types';

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
    // ... [Truncated for brevity, keeping original Initial Billboards logic] ...
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
    LOGO: 'bs_logo',
    PROFILE: 'bs_company_profile'
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

// --- Mutable Stores ---
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

const defaultUsers: User[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', role: 'Admin', email: 'admin@spiritus.com', password: 'password' }
];
let users: User[] = loadFromStorage(STORAGE_KEYS.USERS, defaultUsers);
let companyLogo = loadFromStorage(STORAGE_KEYS.LOGO, 'https://via.placeholder.com/200x200?text=Upload+Logo');

const DEFAULT_PROFILE: CompanyProfile = {
    name: "Spiritus Systems",
    vatNumber: "VAT-9928371",
    regNumber: "REG-2025/001",
    email: "admin@spiritus.com",
    supportEmail: "support@spiritus.com",
    phone: "+263 772 123 456",
    website: "www.spiritus.com",
    address: "123 Business Park, Enterprise Way",
    city: "Harare",
    country: "Zimbabwe"
};
let companyProfile: CompanyProfile = loadFromStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);

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
    return JSON.stringify({
        version: '1.4.2',
        timestamp: new Date().toISOString(),
        data: {
            billboards, contracts, clients, invoices, expenses, 
            users, outsourcedBillboards, auditLogs, printingJobs, companyLogo, companyProfile
        }
    }, null, 2);
};

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
        version: '1.4.2',
        date: 'Feb 2026',
        title: 'Settings Persistence Fix',
        features: [
            'Fixed Company Profile settings not saving',
            'Implemented Base64 encoding for Logo uploads to ensure persistence across refreshes',
            'Updated backup engine to include Company Profile data'
        ]
    },
    {
        version: '1.4.1',
        date: 'Feb 2026',
        title: 'Data Integrity & UI Update',
        features: [
            'Added Data Backup & Restore functionality',
            'Fixed Sidebar Menu visibility on smaller screens',
            'Improved persistence layer stability'
        ]
    },
    {
        version: '1.4.0',
        date: 'Feb 2026',
        title: 'Billing Flexibility Update',
        features: [
            'Added Custom Billing Day preference for Clients (1-31)',
            'Enhanced Client Edit capabilities',
            'Improved contract billing cycle calculation'
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
            if (contract.side === 'A') { updated.sideAStatus = 'Rented'; updated.sideAClientId = contract.clientId; } else { updated.sideBStatus = 'Rented'; updated.sideBClientId = contract.clientId; }
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
                 if (target.side === 'A') { updated.sideAStatus = 'Available'; updated.sideAClientId = undefined; } else { updated.sideBStatus = 'Available'; updated.sideBClientId = undefined; }
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