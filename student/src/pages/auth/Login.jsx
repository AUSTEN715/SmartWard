import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import { postData } from '../../utils/apiUtils';
import { openAlertBox } from '../../utils/toast';

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); 
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await postData('/auth/login', { ...formData, role });
      
      console.log("LOGIN API RESPONSE:", response);

      if (response.success) {
        openAlertBox('Success', 'Login Successful!'); 
        
        // 🛠️ ROBUST TOKEN FINDER
        const accessToken = response.data?.accessToken || response.accessToken || response.token;
        const refreshToken = response.data?.refreshToken || response.refreshToken;
        const userData = response.data?.user || response.user;

        if (accessToken) {
           localStorage.setItem('accesstoken', accessToken); 
           
           if (refreshToken) {
             localStorage.setItem('refreshToken', refreshToken); 
           }
           
           if (userData) {
             localStorage.setItem('user', JSON.stringify(userData));
           }
           
           navigate('/dashboard');
        } else {
           console.error("❌ Token not found in response structure:", response);
           openAlertBox('Error', 'Login successful but no token received from server.');
        }

      } else {
        openAlertBox('Error', response.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error("Login Error:", error);
      openAlertBox('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      openAlertBox('Success', 'Logged in with Google successfully!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE: Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Hostel Life" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-900/90 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SmartHostel</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Simplifying <br />
              <span className="text-blue-200">Hostel Life.</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-md">
              Report issues, track status, and stay updated with announcements—all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-[420px] space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-gray-500">Please enter your details to sign in.</p>
          </div>

          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                role === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                role === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Management
            </button>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
          >
            {/* 🟢 GOOGLE LOGO RESTORED HERE */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.45H18.46C18.18 15.92 17.33 17.18 16.06 18.03V21H19.93C22.19 18.92 23.52 15.86 23.52 12.29Z" fill="#4285F4"/>
              <path d="M12 24C15.24 24 17.95 22.92 19.93 21.09L16.06 18.03C14.99 18.76 13.62 19.18 12 19.18C8.88 19.18 6.23 17.07 5.28 14.23H1.27V17.34C3.25 21.27 7.31 24 12 24Z" fill="#34A853"/>
              <path d="M5.28 14.23C5.03 13.37 4.9 12.45 4.9 11.5C4.9 10.55 5.03 9.63 5.28 8.77V5.66H1.27C0.46 7.27 0 9.09 0 11.5C0 13.91 0.46 15.73 1.27 17.34L5.28 14.23Z" fill="#FBBC05"/>
              <path d="M12 3.82C13.76 3.82 15.34 4.43 16.58 5.61L19.99 2.2C17.95 0.28 15.24 0 12 0C7.31 0 3.25 2.73 1.27 6.66L5.28 9.77C6.23 6.93 8.88 3.82 12 3.82Z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.01] shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};