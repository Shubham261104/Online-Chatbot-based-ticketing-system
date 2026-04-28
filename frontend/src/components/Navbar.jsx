import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, Menu, X, LogOut, User, Ticket, Bot, Calendar, Phone, Info, Bell, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Ticket', path: '/booking' },
    { name: 'Shows & Events', path: '/shows' },
    { name: 'Chatbot', path: '/chat' },
    { name: 'My Bookings', path: '/dashboard' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    localStorage.clear();
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
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-semibold transition-all relative group ${
                    location.pathname === link.path ? 'text-museum-gold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-museum-gold"
                    />
                  )}
                </Link>
              ))}
            </div>

            {token ? (
              <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>EN</span>
                  <ChevronDown className="w-3 h-3" />
                </div>

                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                  <div className="w-8 h-8 bg-museum-gold rounded-lg flex items-center justify-center text-museum-dark text-xs font-black shadow-lg">
                    {user.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-white">{user.name?.split(' ')[0]} {user.name?.split(' ')[1]?.charAt(0)}.</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                    <span>EN</span>
                    <ChevronDown className="w-3 h-3" />
                 </div>
                 <Link to="/login">
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-transparent border border-white/30 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-all group">
                     <User className="h-4 w-4 text-museum-gold group-hover:scale-110 transition-transform" />
                     Login / Sign Up
                   </button>
                 </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
             <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-white/10 rounded-lg">
               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="absolute top-full left-0 right-0 bg-museum-dark border-b border-white/10 p-6 space-y-4 md:hidden shadow-2xl"
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
