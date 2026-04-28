import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Ticket, Landmark, Trophy, Globe, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const About = () => {
  const stats = [
    { icon: <Ticket className="w-6 h-6 text-blue-600" />, value: '50K+', label: 'Tickets Booked', color: 'bg-blue-50' },
    { icon: <Heart className="w-6 h-6 text-rose-600" />, value: '20K+', label: 'Happy Visitors', color: 'bg-rose-50' },
    { icon: <Landmark className="w-6 h-6 text-indigo-600" />, value: '15+', label: 'Museums Partnered', color: 'bg-indigo-50' },
    { icon: <Trophy className="w-6 h-6 text-amber-600" />, value: '100+', label: 'Events Organized', color: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative bg-museum-dark overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Museum" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-museum-dark via-museum-dark/90 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-museum-gold font-black uppercase tracking-[0.3em] text-sm mb-6 block"
           >
             About Us
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight max-w-3xl"
           >
             Making Museum Visits <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Simple, Smart & Memorable</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-lg text-gray-400 max-w-2xl leading-relaxed font-medium"
           >
             Our mission is to connect people with art, culture, and history through seamless technology and exceptional experiences.
           </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 lg:py-32">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-4 block">Who We Are</span>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
                    About Museum <br />Ticketing System
                  </h2>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8">
                    Museum Ticketing System is an intelligent platform that combines the power of AI chatbots with a modern ticketing experience. We aim to make museum visits more accessible, efficient, and enjoyable for everyone.
                  </p>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    By leveraging state-of-the-art technology, we help museums manage their visitors while providing guests with a friction-less booking journey and instant information through our AI assistant.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Our Mission', icon: <Target className="w-6 h-6" />, desc: 'To simplify the way people discover, book, and enjoy museum experiences.', color: 'bg-blue-50 text-blue-600' },
                    { title: 'Our Vision', icon: <Eye className="w-6 h-6" />, desc: 'To be the world\'s most trusted and innovative museum ticketing platform.', color: 'bg-purple-50 text-purple-600' },
                    { title: 'Our Values', icon: <Landmark className="w-6 h-6" />, desc: 'Customer First, Innovation, Integrity, and Accessibility.', color: 'bg-green-50 text-green-600' },
                    { title: 'Our Team', icon: <Users className="w-6 h-6" />, desc: 'A passionate team of developers, designers, and culture enthusiasts.', color: 'bg-indigo-50 text-indigo-600' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 group hover:-translate-y-2 transition-all duration-300"
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${item.color}`}>
                          {item.icon}
                       </div>
                       <h4 className="font-black text-gray-900 mb-3 uppercase tracking-tighter">{item.title}</h4>
                       <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Stats Bar */}
      <section className="pb-24 lg:pb-32">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gray-50 rounded-[2.5rem] p-10 lg:p-16 border border-gray-100 shadow-inner grid grid-cols-2 lg:grid-cols-4 gap-12">
               {stats.map((stat, i) => (
                 <div key={i} className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${stat.color}`}>
                       {stat.icon}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tighter">{stat.value}</h3>
                       <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
