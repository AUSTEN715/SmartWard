import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Loader } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { toast } from 'react-hot-toast';
import { fetchDataFromApi, editData } from '../../utils/apiUtils';

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState('Student');
  const [joinDate, setJoinDate] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roomNumber: '',
    department: '',
    year: '',
    profileImage: '', // Added field for image
    bio: 'Student at SmartHostel.', 
  });

  // 1. Fetch Profile Data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchDataFromApi('/auth/profile'); 
        
        if (response.success && response.data?.user) {
          const u = response.data.user;
          setFormData({
            fullName: u.fullName || '',
            email: u.email || '',
            phone: u.phone || '',
            roomNumber: u.roomNumber || '',
            department: u.department || '',
            year: u.year || '',
            profileImage: u.profileImage || '', // Load image URL from DB
            bio: 'Student at SmartHostel.',
          });
          setUserRole(u.role);
          setJoinDate(new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
          
          localStorage.setItem('user', JSON.stringify(u));
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating profile...');

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        roomNumber: formData.roomNumber
      };

      const response = await editData('/auth/profile', payload);

      if (response.success) {
        toast.success('Profile updated successfully', { id: toastId });
        setIsEditing(false);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...payload }));
      } else {
        toast.error(response.message || 'Update failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Server error', { id: toastId });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-center">
                
                {/* 🟢 PROFILE IMAGE SECTION */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center mx-auto">
                    {formData.profileImage ? (
                      <img 
                        src={formData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      // DEFAULT USER PIC (Silhouette)
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Camera Button (Optional: Hook this up to an upload function later) */}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2.5 shadow-md hover:bg-blue-700 transition-colors border-2 border-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-4">{formData.fullName}</h2>
                <p className="text-gray-600 text-sm mt-1">{userRole}</p>
                
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500" /> <span className="truncate">{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-blue-500" /> <span>{formData.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" /> 
                    <span>{formData.roomNumber ? `Room ${formData.roomNumber}` : 'Room Not Assigned'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-500" /> <span>Joined {joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form (Same as before) */}
          <div className="lg:col-span-2">
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
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input 
                      type="text" 
                      name="roomNumber" 
                      value={formData.roomNumber} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input 
                      type="text" 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input 
                      type="text" 
                      name="year" 
                      value={formData.year} 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    disabled={!isEditing} 
                    rows="3" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none" 
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};