import React from 'react';
import { View } from '../../types';
import DashboardIcon from '../icons/DashboardIcon';
import CampaignsIcon from '../icons/CampaignsIcon';
import WalletIcon from '../icons/WalletIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';
import AccountIcon from '../icons/AccountIcon';
import BiddingIcon from '../icons/BiddingIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: View.CAMPAIGNS, label: 'Campaigns', icon: <CampaignsIcon className="h-5 w-5" /> },
    { view: View.BIDDING, label: 'Bidding Platform', icon: <BiddingIcon className="h-5 w-5" /> },
    { view: View.WALLET, label: 'Wallet', icon: <WalletIcon className="h-5 w-5" /> },
    { view: View.ANALYTICS, label: 'Analytics', icon: <AnalyticsIcon className="h-5 w-5" /> },
    { view: View.ACCOUNT, label: 'Account', icon: <AccountIcon className="h-5 w-5" /> },
  ];

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 border-b border-gray-700">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h1 className="text-2xl font-bold ml-2">PingRight</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.view}
                onClick={() => handleNavClick(item.view)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;