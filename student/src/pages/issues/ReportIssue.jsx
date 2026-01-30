import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Image as ImageIcon, Trash2, Loader, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { openAlertBox } from '../../utils/toast'; 
import { postData } from '../../utils/apiUtils';

export const ReportIssue = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. GET USER DATA (To auto-fill Hostel/Block IDs)
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    roomNumber: user.roomNumber || '', // Auto-fill if available
  });

  const categories = [
    { id: 'PLUMBING', name: 'Plumbing', icon: '🚰' },
    { id: 'ELECTRICAL', name: 'Electrical', icon: '⚡' },
    { id: 'CLEANLINESS', name: 'Cleanliness', icon: '🧹' },
    { id: 'INTERNET', name: 'Internet', icon: '📡' },
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.category) {
      openAlertBox('Error', "Please select a category");
      setIsLoading(false);
      return;
    }

    // 2. CHECK FOR HOSTEL ID (Required by Schema)
    // If the user profile doesn't have a hostel ID, we can't submit.
    if (!user.hostel) {
       openAlertBox('Error', "Your profile is not assigned to a Hostel. Please contact Admin.");
       setIsLoading(false);
       return;
    }

    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('priority', formData.priority);
      data.append('roomNumber', formData.roomNumber);
      
      // 3. ATTACH HOSTEL & BLOCK IDs (Hidden fields)
      // We send the ID strings stored in the user profile
      data.append('hostel', typeof user.hostel === 'object' ? user.hostel._id : user.hostel);
      
      if (user.block) {
        data.append('block', typeof user.block === 'object' ? user.block._id : user.block);
      }
      
      // Also send reporter ID just in case backend doesn't pull it from token
      data.append('reporter', user._id);

      files.forEach((file) => {
        data.append('media', file); 
      });

      const response = await postData('/issues', data);

      if (response.success) {
        openAlertBox('Success', "Issue reported successfully!");
        navigate('/issues');
      } else {
        openAlertBox('Error', response.message || "Failed to report issue");
      }
    } catch (err) {
      console.error(err);
      openAlertBox('Error', "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to display Hostel Name safely
  const hostelName = user.hostel ? (typeof user.hostel === 'object' ? user.hostel.name : 'My Hostel') : 'Not Assigned';

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Report New Issue</h1>
          <button onClick={() => navigate('/issues')} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Category <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat.id})}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      formData.category === cat.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* LOCATION SECTION (New) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-blue-500" /> Location Details
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Hostel (Auto-detected)</label>
                     <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">
                        {hostelName}
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Room Number / Area</label>
                     <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        placeholder="e.g. 304 or Common Room"
                        required
                     />
                  </div>
               </div>
            </div>

            <Input 
              label="Issue Title" 
              placeholder="E.g., Leaking tap in Room 201" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                placeholder="Describe the issue details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">Max 5 files</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
               <div className="flex p-1 bg-gray-100 rounded-lg">
                 {[
                   { label: 'Low', value: 'LOW' }, 
                   { label: 'Medium', value: 'MEDIUM' }, 
                   { label: 'High', value: 'HIGH' }
                 ].map((p) => (
                   <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p.value})}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                      formData.priority === p.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                   >
                     {p.label}
                   </button>
                 ))}
               </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button variant="secondary" fullWidth onClick={() => navigate('/issues')}>Cancel</Button>
              <Button variant="primary" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Submit Report'}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};