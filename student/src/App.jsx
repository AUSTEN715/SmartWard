import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- 1. Import Toaster

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

const App = () => {
  return (
    <Router>
      {/* 2. Add Toaster here. This renders the popups globally. */}
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
  );
};

export default App;