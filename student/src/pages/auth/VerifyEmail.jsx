import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Loader, ArrowRight } from 'lucide-react';
import { postData } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  
  // Get email passed from Register page
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      openAlertBox('Error', 'No email found. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const otpString = otp.join('');
    
    // Backend API: POST /auth/verify-email
    const response = await postData('/auth/verify-email', { email, otp: otpString });

    setIsLoading(false);

    if (response.success) {
      openAlertBox('Success', 'Email verified successfully!');
      
      // If backend sends token after verification, save it here
      if (response.data?.accessToken) {
        localStorage.setItem('accesstoken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } else {
      openAlertBox('Error', response.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify your Email</h2>
          <p className="text-gray-500 mt-2">
            We've sent a 6-digit code to <br/> <span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Verify Account'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};