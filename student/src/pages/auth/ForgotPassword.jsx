import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle, KeyRound, ChevronLeft, Loader } from 'lucide-react';
import { postData } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [newPassword, setNewPassword] = useState('');

  // Helper to handle OTP input changes
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Auto-focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // STEP 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await postData('/auth/forgot-password', { email });

    setIsLoading(false);
    
    if (response.success) {
      openAlertBox('Success', "OTP sent to your email.");
      setStep(2);
    } else {
      openAlertBox('Error', response.message || "Failed to send OTP.");
    }
  };

  // STEP 2: Verify & Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const otpString = otp.join('');
    const response = await postData('/auth/reset-password', { 
      email, 
      otp: otpString, 
      newPassword 
    });

    setIsLoading(false);

    if (response.success) {
      openAlertBox('Success', "Password reset successfully!");
      navigate('/login');
    } else {
      openAlertBox('Error', response.message || "Invalid OTP or failed to reset.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE: Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Security" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 mix-blend-multiply" />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-center p-12 text-white h-full">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Forgot your <br />
              <span className="text-blue-200">Password?</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-md">
              No worries! It happens to the best of us. Enter your email and we'll help you get back into your account.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-[420px]">
          
          <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>

          {step === 1 ? (
            // STEP 1: Email Input
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                <p className="mt-2 text-gray-500">Enter your email address to receive a verification code.</p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="student@uni.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70"
                >
                  {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          ) : (
            // STEP 2: OTP & New Password
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Enter Code</h2>
                <p className="mt-2 text-gray-500">We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span></p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                  <div className="flex gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-full h-12 text-center text-lg font-bold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70"
                >
                  {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                  {!isLoading && <CheckCircle className="w-5 h-5" />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};