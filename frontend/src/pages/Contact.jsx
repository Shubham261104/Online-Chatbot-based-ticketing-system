import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react';
import signupBg from '../assets/signup-bg.png';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left Side: Contact Details */}
            <div className="space-y-12">
               <div>
                  <span className="text-amber-600 font-black uppercase tracking-widest text-xs mb-4 block">Contact Us</span>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
                    We'd Love to <br />Hear From You!
                  </h1>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    Have questions, suggestions, or need help? <br />
                    Our team is here to assist you.
                  </p>
               </div>

               <div className="space-y-8">
                  {[
                    { icon: <MapPin className="w-5 h-5" />, title: 'Our Address', value: '123 Museum Road, Culture City,\nNew Delhi - 110001, India', color: 'bg-blue-50 text-blue-600' },
                    { icon: <Phone className="w-5 h-5" />, title: 'Phone Number', value: '+91 98765 43210', color: 'bg-green-50 text-green-600' },
                    { icon: <Mail className="w-5 h-5" />, title: 'Email Address', value: 'support@museumticketing.com', color: 'bg-purple-50 text-purple-600' },
                    { icon: <Clock className="w-5 h-5" />, title: 'Working Hours', value: 'Monday - Sunday\n9:00 AM - 7:00 PM', color: 'bg-orange-50 text-orange-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md ${item.color}`}>
                          {item.icon}
                       </div>
                       <div>
                          <h4 className="font-black text-gray-900 mb-1 uppercase tracking-tighter text-sm">{item.title}</h4>
                          <p className="text-gray-500 font-medium whitespace-pre-line leading-relaxed">{item.value}</p>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Center Image Component (Re-styled for split layout) */}
               <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 h-64 lg:h-80">
                  <img src={signupBg} alt="Museum" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Stay Connected</h3>
                     <div className="flex gap-3">
                        {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                          <a key={i} href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all">
                             <Icon className="w-5 h-5" />
                          </a>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:pt-12">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-[0_30px_80px_rgba(0,0,0,0.05)] border border-gray-100"
               >
                  <div className="mb-12">
                     <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Send Us a Message</h2>
                     <p className="text-gray-400 font-medium">We usually respond within 24 hours.</p>
                  </div>

                  <form className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                           <div className="relative group">
                              <MessageCircle className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                              <input 
                                type="text" 
                                placeholder="John Doe"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-gray-900 font-medium"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Email</label>
                           <div className="relative group">
                              <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                              <input 
                                type="email" 
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-gray-900 font-medium"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                        <input 
                          type="text" 
                          placeholder="How can we help you?"
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-gray-900 font-medium"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                        <textarea 
                          rows="6"
                          placeholder="Type your message here..."
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-gray-900 font-medium resize-none"
                        />
                     </div>

                     <button 
                       type="submit"
                       className="w-full py-5 bg-museum-dark hover:bg-black text-white font-black text-lg rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
                     >
                        <Send className="w-6 h-6" />
                        Send Message
                     </button>
                  </form>
               </motion.div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Contact;
