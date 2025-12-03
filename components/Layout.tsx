
import React, { useState } from 'react';
import { 
  LayoutDashboard, Map, Users, FileText, CreditCard, Receipt, Settings as SettingsIcon,
  Menu, X, Bell, LogOut, Printer, Globe, PieChart, Wallet, Radio
} from 'lucide-react';
import { getCurrentUser, logout } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void; // New Prop
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getCurrentUser();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Profit & Analytics', icon: PieChart },
    { id: 'billboards', label: 'Billboards', icon: Map },
    { id: 'rentals', label: 'Rentals', icon: FileText },
    { id: 'outsourced', label: 'Outsourced', icon: Globe },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'financials', label: 'Invoices & Quotes', icon: CreditCard },
    { id: 'receipts', label: 'Receipts', icon: Receipt },
    { id: 'expenses', label: 'Expenses', icon: Printer },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
      logout();
      onLogout();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">S</div>
             <span className="font-bold text-lg tracking-tight">Billboard Suite</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800 bg-slate-900">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold border border-slate-600">
                  {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-white truncate">{user?.firstName || 'User'}</p>
                 <p className="text-xs text-slate-500 truncate">{user?.role || 'Guest'}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white" title="Logout">
                 <LogOut size={18} />
              </button>
           </div>
           
           {/* Deployment Version Indicator */}
           <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-800/50 py-1.5 px-3 rounded-full border border-slate-800">
              <span className="flex items-center gap-1.5"><Radio size={10} className="text-green-500 animate-pulse"/> Live System</span>
              <span className="font-mono">v1.1.0</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900">
               <Menu size={24} />
             </button>
             <h1 className="text-xl font-semibold text-slate-800 capitalize hidden sm:block">
               {currentPage.replace('-', ' ')}
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};
