import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, Eye, Heart, Users, Ticket, Landmark, Trophy, Globe, 
  MessageSquare, Zap, ShieldCheck, Smartphone, Sparkles, ArrowRight,
  Monitor, Cpu, BarChart3, Clock
} from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const About = () => {
  const stats = [
    { icon: <Ticket className="w-6 h-6 text-blue-600" />, value: '50K+', label: 'Tickets Booked', color: 'bg-blue-50' },
    { icon: <Heart className="w-6 h-6 text-rose-600" />, value: '20K+', label: 'Happy Visitors', color: 'bg-rose-50' },
    { icon: <Landmark className="w-6 h-6 text-indigo-600" />, value: '15+', label: 'Museums Partnered', color: 'bg-indigo-50' },
    { icon: <Trophy className="w-6 h-6 text-amber-600" />, value: '100+', label: 'Events Organized', color: 'bg-amber-50' },
  ];

  const techFeatures = [
    { 
      title: 'AI Smart Assistant', 
      desc: 'Our intelligent chatbot uses natural language processing to guide visitors through exhibits and handle complex booking queries instantly.',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      title: 'Dynamic QR Tickets', 
      desc: 'Say goodbye to paper. Our system generates secure, real-time QR codes that allow for contactless entry and instant verification.',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-emerald-600 to-teal-600'
    },
    { 
      title: 'Real-time Analytics', 
      desc: 'Museum administrators get live heatmaps and visitor data to manage crowds effectively and optimize exhibit schedules.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600'
    },
    { 
      title: 'Museum-as-a-Service', 
      desc: 'A robust cloud infrastructure ensuring 99.9% uptime, even during peak festive seasons and major international exhibitions.',
      icon: <Cpu className="w-6 h-6" />,
      color: 'from-orange-600 to-amber-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-950 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
            alt="Museum Interior" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center"
           >
              <span className="inline-block py-2 px-6 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-[0.3em] mb-8">
                The Future of Heritage
              </span>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tighter">
                Redefining the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">Museum Experience</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                MTicket is more than just a booking portal. It's an intelligent ecosystem designed to bridge the gap between ancient history and modern convenience.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                 <button 
                   onClick={() => document.getElementById('mission').scrollIntoView({ behavior: 'smooth' })}
                   className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-white/10 hover:bg-slate-50 transition-all flex items-center gap-3"
                 >
                    Our Mission <ArrowRight className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => document.getElementById('tech').scrollIntoView({ behavior: 'smooth' })}
                   className="px-10 py-5 bg-slate-900 text-white border border-slate-800 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
                 >
                    Explore Tech
                 </button>
              </div>
           </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      </section>

      {/* Detail Section: The Problem & Solution */}
      <section id="mission" className="py-24 lg:py-32 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <motion.div
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-1 px-0 bg-blue-600 rounded-full" />
                    <span className="text-blue-600 font-black uppercase tracking-widest text-xs">Innovation in Culture</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                    Why MTicket was <br />created?
                  </h2>
                  <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                     <p>
                        Traditionally, visiting a museum meant long queues, physical tickets, and limited information on the go. We saw an opportunity to modernize this journey.
                     </p>
                     <p>
                        MTicket was built to provide a <strong>unified digital entry point</strong>. Whether it's discovering hidden treasures, booking tickets at 2 AM, or getting instant help from our AI Assistant, we ensure technology works for you, not against you.
                     </p>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-8">
                     <div className="p-6 border-l-4 border-blue-600 bg-slate-50 rounded-r-2xl">
                        <h4 className="text-2xl font-black text-slate-900 mb-1">01</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase">Seamless Access</p>
                     </div>
                     <div className="p-6 border-l-4 border-indigo-600 bg-slate-50 rounded-r-2xl">
                        <h4 className="text-2xl font-black text-slate-900 mb-1">24/7</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase">AI Assistance</p>
                     </div>
                  </div>
               </motion.div>

               <div className="relative">
                  <div className="aspect-square rounded-[3rem] bg-slate-100 overflow-hidden relative shadow-2xl shadow-slate-200">
                     <img 
                       src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80" 
                       alt="Art Gallery" 
                       className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                  {/* Floating Stat Card */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -bottom-10 -left-10 p-8 bg-white rounded-3xl shadow-2xl shadow-blue-200 border border-blue-50"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                           <Globe className="w-7 h-7" />
                        </div>
                        <div>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">Global</p>
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Standards</p>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>
         </div>
      </section>

      {/* Detailed Features Grid */}
      <section id="tech" className="py-24 lg:py-32 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">Powered by Modern Technology</h2>
               <p className="text-slate-500 font-medium">We use cutting-edge tools to ensure your journey from the website to the museum entrance is flawless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {techFeatures.map((feature, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 bg-white rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group"
                 >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                       {feature.icon}
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Stats & Trust Section */}
      <section className="py-24 lg:py-32">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
               {stats.map((stat, i) => (
                 <div key={i}>
                    <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="pb-24 lg:pb-32 px-6">
         <div className="max-w-7xl mx-auto bg-slate-950 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center">
            <div className="relative z-10">
               <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Ready to Start Your Journey?</h2>
               <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">Join thousands of others who are exploring culture the smart way.</p>
               <Link to="/booking" className="inline-flex items-center gap-3 px-12 py-6 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all">
                  Book Your Ticket <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
            {/* Abstract Background for CTA */}
            <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] -mr-48 -mt-48" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] -ml-48 -mb-48" />
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
