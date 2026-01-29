import React from 'react';
import { Home, FileText, Bell, Search, LogOut, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { openAlertBox } from '../../utils/toast';
import { postData } from '../../utils/apiUtils';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'My Issues', path: '/issues' },
    { icon: Bell, label: 'Announcements', path: '/announcements' },
    { icon: Search, label: 'Lost & Found', path: '/lost-found' },
  ];

  const handleLogout = async () => {
    try {
      // 1. Tell Backend to invalidate session
      await postData('/auth/logout', {}); 
    } catch (error) {
      console.warn("Server logout failed, clearing local session anyway.");
    } finally {
      // 2. Clear Local Storage
      localStorage.clear(); 
      
      // 3. Redirect
      openAlertBox('Success', 'Signed out successfully');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">SH</div>
            SmartHostel
          </h1>
          {/* Close button for mobile only */}
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose} // Close menu when link clicked on mobile
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${location.pathname.startsWith(item.path) ? 'text-blue-700' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};