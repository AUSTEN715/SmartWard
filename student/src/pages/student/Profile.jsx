import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout'; // Import Layout
import { toast } from 'react-hot-toast'; // Use react-hot-toast

export const Profile = () => {
  // Get user from LocalStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.fullName || 'Student Name',
    email: currentUser.email || 'student@smarthostel.com',
    phone: currentUser.phone || '+91 98765 43210',
    location: currentUser.roomNumber ? `Room ${currentUser.roomNumber}, Block A` : 'Hostel Block A',
    bio: 'Student at SmartHostel.',
  });

  const stats = [
    { label: 'Issues Resolved', value: '12', icon: '✓', color: 'bg-green-100 text-green-700' },
    { label: 'Active Issues', value: '2', icon: '⚡', color: 'bg-blue-100 text-blue-700' },
    { label: 'Announcements', value: '5', icon: '📢', color: 'bg-purple-100 text-purple-700' },
  ];

  const recentActivity = [
    { action: 'Reported issue #102', time: '2 hours ago', type: 'primary' },
    { action: 'Updated profile picture', time: '2 days ago', type: 'secondary' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    
    // Update local storage to reflect changes immediately in Header
    const updatedUser = { ...currentUser, fullName: formData.name, email: formData.email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast.success('Profile updated successfully');
    
    // Optional: Reload to see changes in Header immediately
    // window.location.reload(); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {formData.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-4">{formData.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{currentUser.role || 'Student'}</p>
                
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500" /> <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-blue-500" /> <span>{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" /> <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" /> <span>Joined Jan 2024</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2">
                  {stats.map((stat, index) => (
                    <div key={index} className={`${stat.color} rounded-lg p-2 text-center`}>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-[10px] font-medium opacity-80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditing} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none" />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
                  </div>
                )}
              </form>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'primary' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};