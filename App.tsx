import React, { useState, useCallback } from 'react';
import { View, Brand, Transaction } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';
import Campaigns from './components/views/Campaigns';
import Wallet from './components/views/Wallet';
import Analytics from './components/views/Analytics';
import Auth from './components/views/Auth';
import Account from './components/views/Account';
import BiddingPlatform from './components/views/BiddingPlatform';
import Invoice from './components/views/Invoice';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Brand | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Transaction | null>(null);

  const renderView = useCallback(() => {
    if (!currentUser) return null;

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard currentUser={currentUser} />;
      case View.CAMPAIGNS:
        return <Campaigns currentUser={currentUser} />;
      case View.WALLET:
        return <Wallet currentUser={currentUser} setCurrentUser={setCurrentUser} setViewingInvoice={setViewingInvoice} />;
      case View.ANALYTICS:
        return <Analytics currentUser={currentUser} />;
       case View.ACCOUNT:
        return <Account currentUser={currentUser} setCurrentUser={setCurrentUser} />;
       case View.BIDDING:
        return <BiddingPlatform currentUser={currentUser} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  }, [currentView, currentUser]);

  const handleLoginSuccess = (user: Brand) => {
    setCurrentUser(user);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (viewingInvoice) {
    return <Invoice transaction={viewingInvoice} brand={currentUser} onClose={() => setViewingInvoice(null)} />
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;