import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, Landmark, Eye, EyeOff, ShieldCheck, Ticket, Bot } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../api/api';
import loginBg from '../assets/login-bg.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-museum-dark">
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Left Side: Image & Features */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 z-0">
            <img src={loginBg} alt="Museum" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-museum-dark via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 w-full max-w-lg">
            <Link to="/" className="flex items-center space-x-3 mb-20">
              <div className="w-12 h-12 bg-museum-gold rounded-xl flex items-center justify-center text-museum-dark shadow-lg">
                 <Landmark className="h-7 w-7" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-bold text-white tracking-tight leading-none uppercase">MUSEUM</span>
                <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Ticketing System</span>
              </div>
            </Link>
            
            <div className="space-y-12">
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                     <Ticket className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Easy Booking</h3>
                    <p className="text-gray-400">Book tickets in just a few clicks</p>
                  </div>
               </motion.div>
               
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Secure Payments</h3>
                    <p className="text-gray-400">100% secure payment gateway</p>
                  </div>
               </motion.div>
               
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                     <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI Chatbot</h3>
                    <p className="text-gray-400">Get instant help anytime</p>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-museum-dark">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back 👋</h2>
              <p className="text-gray-500 font-medium">Login to continue your journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-museum-gold transition-colors" />
                  <input 
                    type="email" required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-museum-gold/20 focus:border-museum-gold transition-all text-gray-900 font-medium"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-museum-gold transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-museum-gold/20 focus:border-museum-gold transition-all text-gray-900 font-medium"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-1">
                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg text-museum-gold focus:ring-museum-gold border-gray-300" />
                <label htmlFor="remember" className="text-sm font-bold text-gray-600">Remember me</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-museum-dark hover:bg-black text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <LogIn className="h-6 w-6" />}
                Login
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">OR</span></div>
            </div>

            <button className="w-full py-4 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
               <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
               Login with Google
            </button>

            <div className="mt-10 text-center text-gray-500 font-medium">
              Don't have an account? <Link to="/register" className="text-blue-600 font-black hover:underline ml-1">Sign Up</Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-8 text-center text-gray-500 text-sm font-medium">
        © 2024 Museum Ticketing System. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
