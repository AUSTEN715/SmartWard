import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // 🟢 REMOVED 'Toaster' import, kept 'toast'
import io from 'socket.io-client';
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
import { Settings } from './pages/student/Settings';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { DeleteAccount } from './pages/student/DeleteAccount';

// Initialize Socket Connection
const socket = io("http://localhost:5000"); 

const App = () => {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("⚡ Connected to Socket Server:", socket.id);
    });

    socket.on("receive_notification", (data) => {
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

    return () => {
      socket.off("connect");
      socket.off("receive_notification");
    };
  }, []);

  return (
    <NotificationProvider>
      <Router>
        {/* 🟢 REMOVED <Toaster /> from here to prevent double popups */}

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/settings/delete-account" element={<DeleteAccount />} />
          
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