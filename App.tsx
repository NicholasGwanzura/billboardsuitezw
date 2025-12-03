import React, { useState, useEffect, Component, ReactNode } from 'react';
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
import { Auth } from './components/Auth';
import { getCurrentUser } from './services/authService';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-900">
           <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
             <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
             <p className="text-slate-500 mb-4">Please refresh the page or contact support.</p>
             <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-slate-800">Refresh Page</button>
           </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getCurrentUser());

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'analytics': return <Analytics />;
      case 'billboards': return <BillboardList />;
      case 'outsourced': return <OutsourcedList />;
      case 'payments': return <Payments />;
      case 'clients': return <ClientList />;
      case 'rentals': return <Rentals />;
      case 'financials': return <Financials initialTab="Invoices" />;
      case 'receipts': return <Financials initialTab="Receipts" />;
      case 'expenses': return <Expenses />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

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