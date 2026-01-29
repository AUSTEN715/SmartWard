import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

// Backend URL
const SOCKET_URL = "http://localhost:5000"; 
const socket = io(SOCKET_URL);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Real Socket Listener
    socket.on("receive_notification", (data) => {
      // Create the notification object
      const newNotification = { 
        ...data, 
        id: Date.now(), 
        time: new Date(), 
        read: false 
      };

      // Add to state
      setNotifications((prev) => [newNotification, ...prev]);
      
      // Update badge count
      setUnreadCount((prev) => prev + 1);

      // Show popup
      toast.success(data.message, { icon: '🔔' });
    });

    return () => {
      socket.off("receive_notification");
    };
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);