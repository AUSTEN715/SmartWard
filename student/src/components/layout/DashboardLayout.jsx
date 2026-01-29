import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Bell, Search, LogOut, Menu, X, Check, Trash2, Calendar, User, Settings } from 'lucide-react';
import { openAlertBox } from '../../utils/toast';
import { useNotifications } from '../../context/NotificationContext';
// 1. IMPORT API UTILS
import { postData } from '../../utils/apiUtils';

export const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification Logic
  const { notifications, unreadCount, markAllAsRead, removeNotification, clearAll, addTestNotification } = useNotifications();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // User Data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fullName = user.fullName || 'Student Name';
  const firstName = fullName.split(' ')[0];
  const userInitials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Date & Greeting
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'My Issues', path: '/issues' },
    { icon: Bell, label: 'Announcements', path: '/announcements' },
    { icon: Search, label: 'Lost & Found', path: '/lost-found' },
  ];

  // 2. UPDATED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      // Optional: Tell Backend to invalidate session
      await postData('/auth/logout', {}); 
    } catch (error) {
      console.warn("Server logout failed, clearing local session anyway.");
    } finally {
      // CRITICAL: Wipe all local data
      localStorage.clear(); 
      
      openAlertBox('Success', 'Signed out successfully');
      navigate('/login');
    }
  };

  const toggleNotifications = () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (showNotifDropdown) setShowNotifDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">SH</div>
            SmartHostel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* HEADER */}
        <header className="hidden md:flex flex-col justify-center bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-20">
           <div className="flex items-center justify-between">
              
              {/* LEFT: Greeting */}
              <div>
                <p className="text-lg text-gray-500 font-medium mb-1">Welcome back, {user.role || 'Student'}</p>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-6">
                 
                 {/* Date Badge */}
                 <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {currentDate}
                 </div>

                 {/* Notification Bell */}
                 <div className="relative">
                    <button onClick={toggleNotifications} className="relative p-2.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors outline-none border border-transparent hover:border-gray-200">
                       <Bell className="w-6 h-6" />
                       {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                    </button>

                    {showNotifDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifDropdown(false)} />
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-sm text-gray-700">Notifications</h3>
                            <div className="flex gap-2">
                              {addTestNotification && <button onClick={(e) => {e.stopPropagation(); addTestNotification()}} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 hover:bg-gray-200">Test</button>}
                              {clearAll && notifications.length > 0 && <button onClick={(e) => { e.stopPropagation(); clearAll(); }} className="text-xs text-gray-500 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>}
                              <button onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"><Check className="w-3.5 h-3.5" /> Mark read</button>
                            </div>
                          </div>
                          <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center text-gray-400"><Bell className="w-8 h-8 mx-auto mb-2 opacity-20" /><p className="text-xs">No new notifications</p></div>
                            ) : (
                              notifications.map((notif) => (
                                <div key={notif.id} className={`p-3 border-b border-gray-50 flex gap-3 group relative transition-colors ${notif.read ? 'bg-white opacity-75' : 'bg-blue-50'}`}>
                                  <div className={`mt-1 p-1.5 rounded-full h-fit ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}><Bell className="w-3 h-3" /></div>
                                  <div className="flex-1 pr-6"><p className={`text-sm leading-snug ${notif.read ? 'text-gray-500' : 'text-gray-900 font-semibold'}`}>{notif.message}</p><p className="text-[10px] text-gray-400 mt-1">{notif.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div>
                                  {removeNotification && <button onClick={(e) => {e.stopPropagation(); removeNotification(notif.id);}} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                 </div>
                 
                 {/* PROFILE DROPDOWN */}
                 <div className="relative">
                    <button 
                      onClick={toggleProfile}
                      className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-200 cursor-pointer hover:bg-blue-700 transition-transform active:scale-95 outline-none"
                    >
                      {userInitials}
                    </button>

                    {isProfileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="p-4 border-b border-gray-100 bg-gray-50">
                              <h3 className="font-semibold text-gray-800 text-sm">{fullName}</h3>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email || 'student@example.com'}</p>
                           </div>

                           <div className="p-2 space-y-0.5">
                              <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                <User className="w-4 h-4" /> My Profile
                              </Link>
                              <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                <Settings className="w-4 h-4" /> Settings
                              </Link>
                           </div>

                           <div className="p-2 border-t border-gray-100">
                              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                <LogOut className="w-4 h-4" /> Sign Out
                              </button>
                           </div>
                        </div>
                      </>
                    )}
                 </div>

              </div>
           </div>
        </header>

        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">SH</div>
             <h1 className="text-lg font-bold text-gray-800">SmartHostel</h1>
           </div>
           <div className="flex gap-4">
              <button onClick={toggleNotifications} className="relative text-gray-600">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
           </div>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 absolute top-16 left-0 right-0 z-40 shadow-xl animate-in slide-in-from-top-5">
             <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                   <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
                     <item.icon className="w-5 h-5" />{item.label}
                   </Link>
                ))}
                <div className="h-px bg-gray-100 my-2" />
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 font-medium">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
             </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};