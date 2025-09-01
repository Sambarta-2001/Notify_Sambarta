import React from 'react';
import { Brand } from '../../types';

interface HeaderProps {
  currentUser: Brand;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, setSidebarOpen, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 focus:outline-none lg:hidden"
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-4 lg:ml-0">{currentUser.companyName}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600 hidden sm:block">Welcome!</span>
        <img className="h-10 w-10 rounded-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.companyName)}&background=0052FF&color=fff`} alt="Brand Logo" />
        <button onClick={onLogout} className="flex items-center text-gray-500 hover:text-primary-600 focus:outline-none transition-colors" aria-label="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-2 text-sm font-medium hidden md:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
