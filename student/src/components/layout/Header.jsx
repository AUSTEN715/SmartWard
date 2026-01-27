import React from 'react';
import { Bell, Menu } from 'lucide-react';

// 1. Accept the onMenuClick prop here
export const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white h-16 border-b border-gray-200 sticky top-0 z-20 px-6 flex items-center justify-between">
      
      {/* 2. Changed div to button and added onClick handler */}
      <button 
        className="md:hidden p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-gray-800">Welcome, John Doe</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          JD
        </div>
      </div>
    </header>
  );
};