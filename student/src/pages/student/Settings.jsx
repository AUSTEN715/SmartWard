import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Bell, Globe, Shield, Loader, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchDataFromApi, editData } from '../../utils/apiUtils';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Flat state to manage UI
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    issueUpdates: true,
    announcements: true,
    darkMode: false,
    language: 'en',
    twoFactorAuth: false,
  });

  // 1. Fetch Settings from Backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetchDataFromApi('/users/settings');
        if (response.success && response.settings) {
          const s = response.settings;
          setSettings({
            // Map nested backend object to flat UI state
            emailNotifications: s.notifications?.emailNotifications ?? true,
            pushNotifications: s.notifications?.pushNotifications ?? false,
            issueUpdates: s.notifications?.issueUpdates ?? true,
            announcements: s.notifications?.announcements ?? true,
            
            darkMode: s.preferences?.darkMode ?? false,
            language: s.preferences?.language || 'en',
            twoFactorAuth: false, 
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. Handle Toggles & Updates
  const handleUpdate = async (key, value) => {
    // 1. Optimistic UI Update
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // 2. Prepare Payload
    const payload = {
      notifications: {
        email: key === 'emailNotifications' ? value : settings.emailNotifications,
        push: key === 'pushNotifications' ? value : settings.pushNotifications,
        issueUpdates: key === 'issueUpdates' ? value : settings.issueUpdates,
        announcements: key === 'announcements' ? value : settings.announcements,
      },
      preferences: {
        darkMode: key === 'darkMode' ? value : settings.darkMode,
        language: key === 'language' ? value : settings.language,
        timezone: 'Asia/Kolkata'
      }
    };

    try {
      await editData('/users/settings', payload);
      toast.success('Setting updated');
    } catch (error) {
      toast.error('Failed to save setting');
      setSettings(settings); // Revert on failure
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full pt-20">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email', type: 'toggle' },
        { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push alerts', type: 'toggle' },
        { key: 'issueUpdates', label: 'Issue Updates', description: 'Alerts when issue status changes', type: 'toggle' },
      ],
    },
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme', type: 'toggle' },
        { 
            key: 'language', 
            label: 'Language', 
            description: 'System language', 
            type: 'select', 
            options: [
                { value: 'en', label: 'English' }, 
            ] 
        },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { key: 'twoFactorAuth', label: 'Two-Factor Auth', description: 'Extra layer of security', type: 'toggle' },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your system preferences</p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => handleUpdate(item.key, !settings[item.key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      )}

                      {item.type === 'select' && (
                        <select 
                          value={settings[item.key]}
                          onChange={(e) => handleUpdate(item.key, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {item.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h2>
             
             {/* 🟢 Updated to use Navigation instead of direct Action */}
             <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">Permanently remove your account and all data.</p>
                </div>
                <button 
                    onClick={() => navigate('/settings/delete-account')}
                    className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Delete Account
                    <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};