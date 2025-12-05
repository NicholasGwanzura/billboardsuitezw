
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BillboardList } from './components/BillboardList';
import { ClientList } from './components/ClientList';
import { Rentals } from './components/Rentals';
import { Financials } from './components/Financials';
import { Expenses } from './components/Expenses';
import { Settings } from './components/Settings';
import { OutsourcedList } from './components/OutsourcedList';
import { Analytics } from './components/Analytics';
import { Payments } from './components/Payments';
import { Maintenance } from './components/Maintenance';
import { Auth } from './components/Auth';
import { getCurrentUser } from './services/authService';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-sans">
           <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md border border-slate-100">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
             </div>
             <h1 className="text-2xl font-black mb-2 text-slate-900">System Error</h1>
             <p className="text-slate-500 mb-8 font-medium">The application encountered an unexpected issue. Please reload to try again.</p>
             <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl w-full">
                Reload Application
             </button>
           </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      try {
          const user = getCurrentUser();
          setIsAuthenticated(!!user);
      } catch (e) {
          console.error("Auth check failed", e);
      } finally {
          setIsLoading(false);
      }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'analytics': return <Analytics />;
      case 'billboards': return <BillboardList />;
      case 'outsourced': return <OutsourcedList />;
      case 'payments': return <Payments />;
      case 'clients': return <ClientList />;
      case 'rentals': return <Rentals />;
      case 'maintenance': return <Maintenance />;
      case 'financials': return <Financials initialTab="Invoices" />;
      case 'receipts': return <Financials initialTab="Receipts" />;
      case 'expenses': return <Expenses />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  if (isLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>;
  }

  if (!isAuthenticated) {
      return (
        <ErrorBoundary>
            <Auth onLogin={() => setIsAuthenticated(true)} />
        </ErrorBoundary>
      );
  }

  return (
    <ErrorBoundary>
        <Layout 
            currentPage={currentPage} 
            onNavigate={setCurrentPage}
            onLogout={() => setIsAuthenticated(false)}
        >
          {renderPage()}
        </Layout>
    </ErrorBoundary>
  );
};

export default App;
