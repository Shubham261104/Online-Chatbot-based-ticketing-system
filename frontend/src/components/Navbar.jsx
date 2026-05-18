import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, Menu, X, LogOut, User, Ticket, Bot, Calendar, Phone, Info, Bell, Globe, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../api/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Poll every minute
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(interval);
      };
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy Tickets', path: '/booking' },
    { name: 'Shows', path: '/shows' },
    { name: 'Chatbot', path: '/chat' },
    { name: 'My Bookings', path: '/dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user && user.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-museum-dark/95 backdrop-blur-md border-b border-white/10 py-3' 
        : isHomePage ? 'bg-transparent py-6' : 'bg-museum-dark py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-museum-gold rounded-lg flex items-center justify-center text-museum-dark shadow-lg">
               <Landmark className="h-6 w-6" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-bold text-white tracking-tight leading-none">MUSEUM TICKETING</span>
              <span className="text-[10px] text-gray-400 font-medium">Chatbot Based Ticketing System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            <div className="flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-bold tracking-wide transition-all relative group py-2 ${
                    location.pathname === link.path ? 'text-museum-gold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-museum-gold rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {token ? (
              <div className="flex items-center gap-5 border-l border-white/10 pl-8">
                <div className="relative">
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="text-gray-400 hover:text-white transition-colors relative p-1.5 hover:bg-white/5 rounded-lg"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-museum-dark animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-museum-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                          <span className="text-xs font-black text-white uppercase tracking-widest">Notifications</span>
                          {unreadCount > 0 && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">{unreadCount} New</span>}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div 
                                key={n.id} 
                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-museum-gold/5' : ''}`}
                                onClick={() => markAsRead(n.id)}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className={`text-xs font-bold ${!n.is_read ? 'text-museum-gold' : 'text-white'}`}>{n.title}</h4>
                                  <span className="text-[9px] text-gray-500 font-medium">{new Date(n.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{n.message}</p>
                                {!n.is_read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-museum-gold rounded-full" />}
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <Bell className="h-8 w-8 text-gray-600 mx-auto mb-3 opacity-20" />
                              <p className="text-xs text-gray-500 font-bold">No notifications yet</p>
                            </div>
                          )}
                        </div>
                        <button onClick={() => setIsNotifOpen(false)} className="w-full py-3 bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors">Close Panel</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 hover:border-museum-gold/50 hover:bg-white/10 transition-all group">
                  <div className="w-8 h-8 bg-museum-gold rounded-lg flex items-center justify-center text-museum-dark text-xs font-black shadow-lg group-hover:scale-110 transition-transform">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start -space-y-1">
                    <span className="text-xs font-black text-white">{user.name?.split(' ')[0]}</span>
                    <span className="text-[9px] text-museum-gold font-bold uppercase tracking-tighter">Profile</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8 border-l border-white/10 pl-8">
                 <Link to="/login">
                   <button className="flex items-center gap-2.5 px-6 py-2.5 bg-museum-gold text-museum-dark rounded-xl text-sm font-black hover:bg-white hover:scale-105 transition-all shadow-[0_10px_20px_rgba(217,160,72,0.2)] group">
                     <User className="h-4 w-4" />
                     LOGIN / SIGN UP
                   </button>
                 </Link>
              </div>
            )}
          </div>


          {/* Mobile Toggle */}
          <div className="lg:hidden">
             <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 text-white bg-white/10 rounded-xl border border-white/10 shadow-lg active:scale-95 transition-transform">
               {isOpen ? <X className="h-6 w-6 text-museum-gold" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-museum-dark border-b border-white/10 p-6 space-y-4 lg:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className={`block text-lg font-semibold ${location.pathname === link.path ? 'text-museum-gold' : 'text-gray-300'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
               {token ? (
                 <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 text-red-400 font-bold">
                    <LogOut className="h-5 w-5" /> Logout
                 </button>
               ) : (
                 <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-4 bg-museum-gold text-museum-dark font-black rounded-xl">Login / Sign Up</button>
                 </Link>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
