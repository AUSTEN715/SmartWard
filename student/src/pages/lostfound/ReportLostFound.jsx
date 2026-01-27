import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Camera, Loader, Image as ImageIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { postData } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast';

export const ReportLostFound = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('lost'); // 'lost' or 'found'
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    dateLostFound: new Date().toISOString().split('T')[0],
    location: '',
    description: ''
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('type', type.toUpperCase()); // Backend likely expects uppercase
      data.append('itemName', formData.itemName);
      data.append('category', formData.category.toUpperCase());
      data.append('dateLostFound', formData.dateLostFound);
      data.append('location', formData.location);
      data.append('description', formData.description);
      
      if (file) {
        data.append('image', file); // Sending file as 'image'
      }

      const response = await postData('/lost-found', data);

      if (response.success) {
        openAlertBox('Success', 'Item reported successfully!');
        navigate('/lost-found');
      } else {
        openAlertBox('Error', response.message || 'Failed to report item');
      }
    } catch (error) {
      openAlertBox('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Report Item</h1>
          <button onClick={() => navigate('/lost-found')} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">What are you reporting?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('lost')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    type === 'lost' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  🔴 Lost Item
                </button>
                <button
                  type="button"
                  onClick={() => setType('found')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    type === 'found' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  🟢 Found Item
                </button>
              </div>
            </div>

            <Input 
              label="Item Name" 
              placeholder="e.g., Blue Fossil Watch" 
              required 
              value={formData.itemName}
              onChange={(e) => setFormData({...formData, itemName: e.target.value})}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Documents">Documents</option>
                  <option value="Keys">Keys</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input 
                label="Date" 
                type="date" 
                required 
                value={formData.dateLostFound}
                onChange={(e) => setFormData({...formData, dateLostFound: e.target.value})}
              />
            </div>

            <Input 
              label="Location" 
              placeholder={type === 'lost' ? "Where did you lose it?" : "Where did you find it?"} 
              required 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                rows={3} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Provide distinguishing features (color, scratches, brand)..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer block relative">
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                />
                {file ? (
                    <div className="flex flex-col items-center text-green-600">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500 mt-1">Click to change</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload image</p>
                    </div>
                )}
              </label>
            </div>

            <div className="pt-4 flex gap-4">
              <Button variant="secondary" fullWidth onClick={() => navigate('/lost-found')}>Cancel</Button>
              <Button variant="primary" fullWidth type="submit" disabled={loading}>
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Submit Report'}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};