import React from 'react';
import { Landmark, Mail, Phone, MapPin, MessageSquare, Share2, Info, Twitter, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-museum-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-museum-gold rounded-lg flex items-center justify-center text-museum-dark shadow-lg">
                 <Landmark className="h-6 w-6" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold text-white tracking-tight leading-none">MUSEUM</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Ticketing System</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium">
              Experience the treasures of history through our advanced AI-powered ticketing platform. Seamlessly bridging the past and the future.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-museum-gold hover:text-museum-dark transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-8 text-white">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-museum-gold transition-colors">Home</Link></li>
              <li><Link to="/booking" className="hover:text-museum-gold transition-colors">Book Tickets</Link></li>
              <li><Link to="/chat" className="hover:text-museum-gold transition-colors">AI Chatbot</Link></li>
              <li><Link to="/shows" className="hover:text-museum-gold transition-colors">Shows & Events</Link></li>
              <li><Link to="/about" className="hover:text-museum-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-museum-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-8 text-white">Contact Us</h4>
            <ul className="space-y-5 text-gray-400 font-medium">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0"><MapPin className="h-4 w-4 text-museum-gold" /></div>
                <span>Heritage Museum Complex, <br />Central Avenue, ND 110001</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0"><Phone className="h-4 w-4 text-museum-gold" /></div>
                <span>+91 11 2345 6789</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0"><Mail className="h-4 w-4 text-museum-gold" /></div>
                <span>contact@museumticket.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-8 text-white">Stay Updated</h4>
            <p className="text-gray-400 mb-6 font-medium">Subscribe to our newsletter for exhibition updates and exclusive events.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 outline-none focus:border-museum-gold/50 transition-all text-white font-medium"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-museum-gold rounded-lg flex items-center justify-center text-museum-dark">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm font-bold">
          <p>© 2024 Museum Ticketing System. Crafted with passion.</p>
          <div className="flex gap-8 uppercase tracking-widest text-[10px]">
            <Link to="/privacy" className="hover:text-museum-gold transition-colors text-gray-500">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-museum-gold transition-colors text-gray-500">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-museum-gold transition-colors text-gray-500">Cookie Policy</Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
