import React, { useEffect } from 'react'; // <--- 1. Import useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; // <--- 2. Import toast to show popups
import io from 'socket.io-client'; // <--- 3. Import Socket.io
import { NotificationProvider } from './context/NotificationContext';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Dashboard } from './pages/student/Dashboard';
import { MyIssues } from './pages/issues/MyIssues';
import { ReportIssue } from './pages/issues/ReportIssue';
import { AnnouncementList } from './pages/announcements/AnnouncementList';
import { LostFoundList } from './pages/lostfound/LostFoundList';
import { ReportLostFound } from './pages/lostfound/ReportLostFound';
import { Profile } from './pages/student/Profile';
import { Settings } from './pages/student/Settings'; // Import Settings

// 4. Initialize Socket Connection (Backend URL)
// Ensure this matches your backend port (usually 5000)
const socket = io("http://localhost:5000"); 

const App = () => {

  // 5. Setup Global Listener
  useEffect(() => {
    // Listen for "connection" to verify it works
    socket.on("connect", () => {
      console.log("⚡ Connected to Socket Server:", socket.id);
    });

    // Listen for "receive_notification" events from Backend
    socket.on("receive_notification", (data) => {
      // Play a sound (Optional)
      // const audio = new Audio('/notification.mp3');
      // audio.play();

      // Show the Toast Popup
      toast.success(data.message, {
        icon: '🔔',
        duration: 5000,
        style: {
          border: '1px solid #3B82F6',
          padding: '16px',
          color: '#1E3A8A',
        },
      });
    });

    // Cleanup listener when App closes
    return () => {
      socket.off("connect");
      socket.off("receive_notification");
    };
  }, []);

  return (
    <NotificationProvider>
    <Router>
      {/* Toaster renders the popups globally */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Student Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Issue Management */}
        <Route path="/issues" element={<MyIssues />} />
        <Route path="/issues/new" element={<ReportIssue />} />
        
        {/* Features */}
        <Route path="/announcements" element={<AnnouncementList />} />
        <Route path="/lost-found" element={<LostFoundList />} />
        <Route path="/lost-found/new" element={<ReportLostFound />} />
        
        {/* 404 Handler */}
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
    </NotificationProvider>
  );
};

export default App;