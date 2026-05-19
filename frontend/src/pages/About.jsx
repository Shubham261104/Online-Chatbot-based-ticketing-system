import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, Eye, Heart, Users, Ticket, Landmark, Trophy, Globe, 
  MessageSquare, Zap, ShieldCheck, Smartphone, Sparkles, ArrowRight,
  Monitor, Cpu, BarChart3, Clock, ChevronDown, Award, MapPin
} from 'lucide-react';
import { MUSEUM_DETAILS } from '../data/museumData';

const About = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeMuseumTab, setActiveMuseumTab] = useState('india');

  const stats = [
    { icon: <Ticket className="w-6 h-6 text-blue-600" />, value: '12,500+', label: 'Tickets Booked', color: 'bg-blue-50' },
    { icon: <Heart className="w-6 h-6 text-rose-600" />, value: '9,800+', label: 'Happy Visitors', color: 'bg-rose-50' },
    { icon: <Landmark className="w-6 h-6 text-indigo-600" />, value: '15+', label: 'Active Museums', color: 'bg-indigo-50' },
    { icon: <Award className="w-6 h-6 text-amber-600" />, value: '4.9/5', label: 'Average Rating', color: 'bg-amber-50' },
  ];

  const techFeatures = [
    { 
      title: 'AI Smart Assistant', 
      desc: 'Our intelligent chatbot uses natural language processing to guide visitors through exhibits, suggest time slots, and pre-fill booking details instantly.',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      title: 'Dynamic QR Tickets', 
      desc: 'Say goodbye to paper. Our system generates secure, real-time QR codes that allow for contactless entry and instant scanner verification.',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-emerald-600 to-teal-600'
    },
    { 
      title: 'Real-time Capacity Tracking', 
      desc: 'Museum administrators get live dashboard insights to manage crowds effectively, prevent congestion, and optimize slots.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600'
    },
    { 
      title: 'Secure Razorpay Payments', 
      desc: 'A robust cloud payments integration ensuring 100% secure payments, instant receipt generation, and smooth cancellations.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'from-orange-600 to-amber-600'
    }
  ];

  const showcaseMuseums = {
    india: [
      { name: 'National Museum', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['National Museum'] },
      { name: 'Salar Jung Museum', img: 'https://images.unsplash.com/photo-1566121318576-53b482e56e5c?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['Salar Jung Museum'] },
      { name: 'Indian Museum', img: 'https://images.unsplash.com/photo-1601807576163-587225545555?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['Indian Museum'] },
      { name: 'Albert Hall Museum', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['Albert Hall Museum'] }
    ],
    world: [
      { name: 'Louvre Museum', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['Louvre Museum'] },
      { name: 'Metropolitan Museum of Art', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['Metropolitan Museum of Art'] },
      { name: 'British Museum', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600&auto=format&fit=crop', details: MUSEUM_DETAILS['British Museum'] }
    ]
  };

  const faqs = [
    {
      q: "How does the AI booking chatbot help me?",
      a: "Our smart AI chatbot is equipped to check ticket pricing, show list of museums, and pre-populate your booking parameters (like visitor count, dates, slots). All you do is click 'Book Now' to finish payment!"
    },
    {
      q: "What is your ticket cancellation and refund policy?",
      a: "You can cancel any active booking directly from the Dashboard. If the ticket status is paid, the amount will be processed for refund securely back to your original source of payment within 5-7 business days."
    },
    {
      q: "How do I verify my ticket at the museum entrance?",
      a: "After payment, a secure dynamic QR ticket is generated on your dashboard. Simply open the ticket on your mobile phone and present the QR code to the entrance staff for verification."
    },
    {
      q: "Are my online payments secure?",
      a: "Yes. MTicket integrates Razorpay API, meaning all transactions are processed through banks with high-grade HTTPS encryption, complying with international standard PCI-DSS guidelines."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Premium Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-slate-950 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1500" 
            alt="Museum Interior" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-50/50" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-4xl mx-auto"
           >
              <span className="inline-block py-2 px-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-[0.3em] mb-8">
                Smart Ticketing Ecosystem
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
                Unifying Heritage &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Digital Simplicity</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
                MTicket leverages conversational AI, dynamic visual dashboards, and secure digital checkouts to reshape how visitors connect with historical landmarks.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                 <button 
                   onClick={() => document.getElementById('partners').scrollIntoView({ behavior: 'smooth' })}
                   className="px-10 py-4.5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-xl"
                 >
                    Partner Museums <ArrowRight className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => document.getElementById('mission').scrollIntoView({ behavior: 'smooth' })}
                   className="px-10 py-4.5 bg-slate-900 text-white border border-slate-800 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
                 >
                    Our Mission
                 </button>
              </div>
           </motion.div>
        </div>

        {/* Decorative Glowing Orbs */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
      </section>

      {/* Trust Stats Row */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-6">
         <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 border-r border-slate-100 last:border-0 pr-4">
                 <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0`}>
                    {stat.icon}
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Our Mission & Values */}
      <section id="mission" className="py-24 max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
               <div className="flex items-center gap-3">
                 <span className="w-10 h-[2px] bg-blue-600 rounded-full" />
                 <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Bridging The Gap</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                 Modernizing access to global heritage
               </h2>
               <div className="text-slate-600 space-y-4 font-medium leading-relaxed text-sm">
                  <p>
                    Historically, stepping into a museum meant waiting in queues, dealing with physical ticket booklets, and lacking context on seasonal exhibits. We developed MTicket to address these challenges.
                  </p>
                  <p>
                    MTicket works as a decentralized portal partner with state and local museums. Our core objective is simple: enable museum administration to manage slots and empower visitors to purchase tickets from anywhere.
                  </p>
               </div>

               <div className="grid grid-cols-3 gap-6 pt-4">
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                     <h4 className="text-lg font-black text-blue-600">01</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">One-Click Entry</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                     <h4 className="text-lg font-black text-indigo-600">24/7</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">AI Assistant</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                     <h4 className="text-lg font-black text-purple-600">Secure</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">QR Passes</p>
                  </div>
               </div>
            </motion.div>

            {/* Visual Side Banner */}
            <div className="relative">
               <div className="aspect-[4/3] rounded-[2rem] bg-slate-200 overflow-hidden shadow-2xl border border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800" 
                    alt="Museum Art Exhibit" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
               </div>
               
               <div className="absolute -bottom-8 -left-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                     <Globe className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-slate-900">Contactless Entry</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast-Pass Verified</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Interactive Partner Museums Showcase */}
      <section id="partners" className="py-24 bg-white border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
               <div>
                  <div className="flex items-center gap-2 mb-4">
                     <Landmark className="w-5 h-5 text-blue-600 animate-pulse" />
                     <span className="text-xs font-black uppercase text-blue-600 tracking-widest">Our network</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Partnered Museums & Venues</h2>
               </div>
               
               {/* Country Tabs */}
               <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit shrink-0">
                  <button 
                    onClick={() => setActiveMuseumTab('india')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                      activeMuseumTab === 'india' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                     India Partners
                  </button>
                  <button 
                    onClick={() => setActiveMuseumTab('world')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                      activeMuseumTab === 'world' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                     Global Partners
                  </button>
               </div>
            </div>

            {/* Museum Cards Grid */}
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeMuseumTab}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -15 }}
                 transition={{ duration: 0.25 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
               >
                  {showcaseMuseums[activeMuseumTab].map((museum) => (
                    <div
                      key={museum.name}
                      className="bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden hover:border-blue-200 transition-all duration-300 group shadow-sm flex flex-col justify-between"
                    >
                       <div>
                          <div className="aspect-[4/3] overflow-hidden relative">
                             <img 
                               src={museum.img} 
                               alt={museum.name} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                             />
                             <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-blue-400" />
                                {museum.details?.location.split(',').slice(-1)[0].trim() || 'Partner'}
                             </div>
                          </div>
                          <div className="p-5 space-y-3">
                             <h4 className="font-black text-slate-800 text-base leading-tight line-clamp-1">{museum.name}</h4>
                             <p className="text-xs text-slate-500 line-clamp-3 font-medium leading-relaxed">{museum.details?.desc}</p>
                          </div>
                       </div>
                       
                       <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-white">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Famous For</p>
                          <p className="text-[11px] font-bold text-slate-700 line-clamp-1">{museum.details?.famousFor || 'Art & History collection.'}</p>
                       </div>
                    </div>
                  ))}
               </motion.div>
            </AnimatePresence>
         </div>
      </section>

      {/* Tech Pillars Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full">Core Technologies</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-6 tracking-tighter">Built with modern architecture</h2>
            <p className="text-slate-500 font-medium mt-3 text-sm">We combine cutting-edge tooling to ensure your journey is fast, secure, and intuitive.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techFeatures.map((feature, i) => (
              <div 
                key={i}
                className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group"
              >
                 <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-105 transition-transform`}>
                    {feature.icon}
                 </div>
                 <h4 className="text-base font-black text-slate-800 mb-3 tracking-tight">{feature.title}</h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-semibold">{feature.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Frequently Asked Questions</h2>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Answers to common booking queries</p>
            </div>

            <div className="space-y-4">
               {faqs.map((faq, i) => {
                 const isOpen = activeFaq === i;
                 return (
                   <div 
                     key={i} 
                     className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 hover:border-blue-100 transition-colors"
                   >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : i)}
                        className="w-full p-6 text-left flex justify-between items-center gap-4 bg-white"
                      >
                         <span className="font-black text-slate-850 text-sm">{faq.q}</span>
                         <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                             <p className="p-6 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-100/50 bg-slate-50/20">
                                {faq.a}
                             </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* Premium CTA section */}
      <section className="py-24 px-6">
         <div className="max-w-7xl mx-auto bg-slate-950 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Ready to experience heritage?</h2>
               <p className="text-slate-400 mb-10 text-sm leading-relaxed">Book museum entry slots, reserve guides, and manage all your historical travels in a single page.</p>
               <Link to="/booking" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                  Book Your Ticket <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] -mr-48 -mt-48" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] -ml-48 -mb-48" />
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
