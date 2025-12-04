
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, Users, FileText, CreditCard, Receipt, Settings as SettingsIcon,
  Menu, X, Bell, LogOut, Printer, Globe, PieChart, Wallet, Radio, ChevronRight, Box, Wrench
} from 'lucide-react';
import { getCurrentUser, logout } from '../services/authService';
import { getSystemAlertCount, triggerAutoBackup, runAutoBilling } from '../services/mockData';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const user = getCurrentUser();

  useEffect(() => {
    // Initial checks on mount
    setAlertCount(getSystemAlertCount());
    triggerAutoBackup();
    
    // Trigger auto-billing check on load
    runAutoBilling();

    // Periodic intervals
    const interval = setInterval(() => setAlertCount(getSystemAlertCount()), 10000);
    const backupInterval = setInterval(() => triggerAutoBackup(), 5 * 60 * 1000);
    
    // Check billing every hour (in case app is left open across days)
    const billingInterval = setInterval(() => runAutoBilling(), 60 * 60 * 1000);

    return () => { 
        clearInterval(interval); 
        clearInterval(backupInterval);
        clearInterval(billingInterval);
    };
  }, [currentPage]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Profit & Analytics', icon: PieChart },
    { id: 'billboards', label: 'Billboards', icon: Map },
    { id: 'rentals', label: 'Rentals', icon: FileText },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'outsourced', label: 'Outsourced', icon: Globe },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'financials', label: 'Invoices & Quotes', icon: CreditCard },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'expenses', label: 'Expenses', icon: Printer },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleLogout = () => { logout(); onLogout(); };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] supports-[height:100dvh]:h-[100dvh]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Brand Colors */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[100] w-72 transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] lg:translate-x-0 lg:relative flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-slate-900 shadow-2xl border-r border-white/5 overflow-hidden`}
      >
        {/* Background Gradients for Sidebar */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-96 bg-brand-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full h-96 bg-accent-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        {/* Sidebar Header - Dreambox Logo */}
        <div className="relative z-10 flex items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer">
             <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
                <Box size={20} strokeWidth={3} />
             </div>
             <div>
                <div className="flex items-center">
                    <span className="font-extrabold text-xl tracking-tight text-white block leading-none">Dream</span>
                    <span className="font-extrabold text-xl tracking-tight text-white block leading-none">ox</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">Advertising</span>
             </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`group flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-lg shadow-brand-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-600/90 to-accent-600/90 rounded-xl z-0"></div>
                )}
                <div className="relative z-10 flex items-center w-full">
                    <Icon size={20} className={`mr-3 shrink-0 transition-transform duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-400 group-hover:scale-110'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight size={16} className="text-white/50 animate-pulse" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="relative z-10 p-6 bg-slate-950/30 backdrop-blur-md border-t border-white/5 shrink-0">
           <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold border border-white/10 text-white shadow-inner">
                  {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-white truncate group-hover:text-brand-300 transition-colors">{user?.firstName || 'User'}</p>
                 <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider">{user?.role || 'Guest'}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-2" title="Logout">
                 <LogOut size={18} />
              </button>
           </div>
           
           <div className="flex items-center justify-between text-[10px] text-slate-500 py-1 px-1">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> System Online</span>
              <span className="font-mono opacity-50">v1.7.0</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Background pattern for main area */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {/* Glass Header */}
        <header className="glass sticky top-0 z-40 h-auto min-h-[4rem] sm:min-h-[4.5rem] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 shrink-0 transition-all duration-300 shadow-sm sm:shadow-none">
          <div className="flex items-center gap-3 sm:gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-colors">
               <Menu size={24} />
             </button>
             <h1 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight capitalize truncate max-w-[150px] sm:max-w-none">
               {currentPage.replace('-', ' ')}
             </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/50 border border-slate-200/60 rounded-full text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                <span>Harare, ZW</span>
             </div>
             <button onClick={() => onNavigate('dashboard')} className="relative p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50/50 rounded-full transition-all duration-300 hover:shadow-md" title={`${alertCount} System Alerts`}>
                <Bell size={22} />
                {alertCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                        {alertCount > 9 ? '9+' : alertCount}
                    </span>
                )}
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
           <div className="max-w-7xl mx-auto pb-20">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};
