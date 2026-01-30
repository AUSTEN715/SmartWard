import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

// 1. Import the Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

// 2. Your Google Client ID (Get this from Google Cloud Console)
// ideally store this in .env as import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap everything with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);