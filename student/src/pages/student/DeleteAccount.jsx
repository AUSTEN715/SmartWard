import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, Loader, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { deleteData } from '../../utils/apiUtils';
import { toast } from 'react-hot-toast';

export const DeleteAccount = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (confirmText !== 'DELETE') {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Processing deletion...');

    try {
      // Sends password to backend for verification
      const response = await deleteData('/users/account', { 
        data: { password } // Axios sends body in 'data' key for DELETE requests
      });

      if (response.success) {
        toast.success('Account deleted successfully', { id: toastId });
        localStorage.clear();
        navigate('/login');
      } else {
        toast.error(response.message || 'Incorrect password', { id: toastId });
      }
    } catch (error) {
      toast.error('Server error', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto pt-8">
        <button 
          onClick={() => navigate('/settings')} 
          className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Settings
        </button>

        <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-700">Delete Account</h1>
              <p className="text-red-600 mt-1 text-sm">
                This action is permanent and cannot be undone. All your data will be removed.
              </p>
            </div>
          </div>

          <form onSubmit={handleDelete} className="p-8 space-y-6">
            
            {/* Warning List */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>By deleting your account, you acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You will lose access to the SmartHostel dashboard immediately.</li>
                <li>Your profile and settings will be permanently removed.</li>
                <li>Any open issues you reported will be closed or archived.</li>
              </ul>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Password to Confirm
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Your current password"
                  required
                />
              </div>
            </div>

            {/* Double Confirmation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type "DELETE" below
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="DELETE"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || confirmText !== 'DELETE' || !password}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Permanently Delete My Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};