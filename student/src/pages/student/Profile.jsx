import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Book, Home, Camera, Save, Edit2, LogOut } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { fetchDataFromApi, postData } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast'; 

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    hostel: '',
    room: '',
    avatar: null
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchDataFromApi('/auth/profile');
        
        if (response.success && response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    // CORRECTED ENDPOINT: /auth/profile/update
    const response = await postData('/auth/profile/update', user);
    
    if (response.success) {
      openAlertBox('Success', "Profile updated successfully!");
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      openAlertBox('Error', response.message || "Failed to update profile.");
    }
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Button 
            variant={isEditing ? 'success' : 'outline'}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            icon={isEditing ? Save : Edit2}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Avatar & Quick Stats */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl text-blue-600 font-bold mx-auto mb-4 border-4 border-white shadow-sm overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.fullName ? user.fullName.charAt(0) : 'U'
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-4 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-md">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.fullName || 'Student Name'}</h2>
              <p className="text-gray-500 text-sm">{user.department || 'Department'}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-around">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">12</div>
                  <div className="text-xs text-gray-500">Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">2</div>
                  <div className="text-xs text-gray-500">Lost Items</div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>

          {/* RIGHT COLUMN: Details Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Full Name" 
                    icon={User} 
                    value={user.fullName} 
                    onChange={(e) => setUser({...user, fullName: e.target.value})}
                    disabled={!isEditing} 
                  />
                  <Input 
                    label="Email Address" 
                    icon={Mail} 
                    value={user.email} 
                    disabled={true} 
                    className="bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Phone Number" 
                    icon={Phone} 
                    value={user.phone} 
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                    disabled={!isEditing} 
                  />
                  <Input 
                    label="Year / Semester" 
                    icon={Book} 
                    value={user.year} 
                    onChange={(e) => setUser({...user, year: e.target.value})}
                    disabled={!isEditing} 
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Hostel Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Hostel Block" 
                      icon={Home} 
                      value={user.hostel} 
                      onChange={(e) => setUser({...user, hostel: e.target.value})}
                      disabled={!isEditing} 
                    />
                    <Input 
                      label="Room Number" 
                      icon={Home} 
                      value={user.room} 
                      onChange={(e) => setUser({...user, room: e.target.value})}
                      disabled={!isEditing} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};