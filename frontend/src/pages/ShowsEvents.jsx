import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Search, Filter, ChevronDown, Heart, ArrowRight, Star, Bell, ShieldCheck, Zap, Bot, Languages, Mail, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import heroBg from '../assets/hero-bg.png';


const ShowsEvents = () => {
  const [activeTab, setActiveTab] = useState('All Events');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const categories = [
    { name: 'All Events', icon: <Filter className="w-4 h-4" /> },
    { name: 'Exhibitions', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Cultural Shows', icon: <Star className="w-4 h-4" /> },
    { name: 'Workshops', icon: <Zap className="w-4 h-4" /> },
    { name: 'Special Events', icon: <Bell className="w-4 h-4" /> },
  ];

  const events = [
    {
      id: 1,
      category: 'Exhibition',
      tagColor: 'bg-purple-100 text-purple-600',
      title: 'Treasures of Ancient Egypt',
      date: 'May 20 - Jun 30, 2025',
      startDate: '2025-05-20',
      time: '10:00 AM - 6:00 PM',
      location: 'Gallery 1, Main Building',
      desc: 'Discover the wonders of ancient Egypt through rare artifacts and immersive displays.',
      price: 250,
      image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 2,
      category: 'Cultural Show',
      tagColor: 'bg-rose-100 text-rose-600',
      title: 'Rhythms of India',
      date: 'May 25, 2025',
      startDate: '2025-05-25',
      time: '5:00 PM - 7:00 PM',
      location: 'Auditorium, Main Building',
      desc: 'A mesmerizing evening of classical dance and music celebrating India\'s rich cultural heritage.',
      price: 300,
      image: 'https://images.unsplash.com/photo-1514222139-b786bb23c828?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 3,
      category: 'Workshop',
      tagColor: 'bg-amber-100 text-amber-600',
      title: 'Pottery Workshop for Kids',
      date: 'Jun 01, 2025',
      startDate: '2025-06-01',
      time: '11:00 AM - 1:00 PM',
      location: 'Workshop Room, Ground Floor',
      desc: 'A fun and creative pottery workshop where kids can learn and create their own masterpieces.',
      price: 200,
      image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 4,
      category: 'Special Event',
      tagColor: 'bg-green-100 text-green-600',
      title: 'Museum Night: After Hours',
      date: 'Jun 07, 2025',
      startDate: '2025-06-07',
      time: '7:00 PM - 11:00 PM',
      location: 'Main Building',
      desc: 'Experience the museum like never before with exclusive after-hours access and special surprises.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === 'All Events' || event.category === activeTab.replace('s', '');
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      toast.info('Removed from wishlist');
    } else {
      setWishlist([...wishlist, id]);
      toast.success('Added to wishlist!');
    }
  };

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      toast.success('Subscribed successfully!');
      setEmail('');
      setIsSubscribing(false);
    }, 1500);
  };

  const handleComingSoon = (feature) => {
    toast.info(`${feature} feature is coming soon!`);
  };


  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col pt-24">
      {/* Hero Header */}
      <section className="relative bg-museum-dark overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Museum" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-museum-dark via-museum-dark/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-white mb-6"
              >
                Shows & Events
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-300 max-w-xl leading-relaxed"
              >
                Explore exciting exhibitions, cultural shows, and special events happening at our museum.
              </motion.p>
           </div>
           
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="hidden lg:flex justify-end"
           >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 flex items-start gap-6 max-w-md">
                 <div className="w-14 h-14 bg-museum-gold rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <Calendar className="w-7 h-7 text-museum-dark" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Don't Miss Out!</h3>
                    <p className="text-gray-300 font-medium leading-snug">Book your tickets early and enjoy exclusive experiences.</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-6 w-full py-12">
         <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-3">
               {categories.map((cat) => (
                 <button
                   key={cat.name}
                   onClick={() => setActiveTab(cat.name)}
                   className={`px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                     activeTab === cat.name 
                       ? 'bg-museum-dark text-white shadow-lg' 
                       : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                   }`}
                 >
                   {cat.icon}
                   {cat.name}
                 </button>
               ))}
            </div>
            
            <div className="flex flex-1 items-center gap-4 w-full lg:w-auto relative group">
               <Search className="absolute left-6 w-5 h-5 text-gray-400 group-focus-within:text-museum-gold transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search exhibitions or events..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-museum-gold/30 focus:ring-4 focus:ring-museum-gold/5 outline-none transition-all font-bold text-sm"
               />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 lg:border-l lg:pl-8 border-gray-100">
               <button 
                 onClick={() => handleComingSoon('Calendar View')}
                 className="flex items-center justify-between gap-4 px-6 py-4 border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 bg-gray-50 min-w-[180px] hover:bg-gray-100 transition-all"
               >
                  <span>Calendar View</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
               </button>
               <button 
                 onClick={() => handleComingSoon('Sorting')}
                 className="flex items-center justify-between gap-4 px-6 py-4 border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 bg-gray-50 min-w-[150px] hover:bg-gray-100 transition-all"
               >
                  <span>Sort By</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
               </button>
            </div>
         </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 group"
              >
                <div className="relative h-56 overflow-hidden">
                   <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <button 
                     onClick={() => toggleWishlist(event.id)}
                     className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-md rounded-xl flex items-center justify-center transition-all ${
                       wishlist.includes(event.id) ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/20 text-white hover:bg-white hover:text-rose-500'
                     }`}
                   >
                      <Heart className={`w-5 h-5 ${wishlist.includes(event.id) ? 'fill-current' : ''}`} />
                   </button>
                </div>
                
                <div className="p-8">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${event.tagColor} mb-4 inline-block`}>
                      {event.category}
                   </span>
                   <h3 className="text-xl font-black text-gray-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                      {event.title}
                   </h3>
                   
                   <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                         <Calendar className="w-4 h-4 text-gray-400" />
                         <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                         <Clock className="w-4 h-4 text-gray-400" />
                         <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                         <MapPin className="w-4 h-4 text-gray-400" />
                         <span>{event.location}</span>
                      </div>
                   </div>
                   
                   <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
                      {event.desc}
                   </p>
                   
                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <span className="text-2xl font-black text-gray-900">₹{event.price}</span>
                      <Link to="/event-booking" state={{ event }}>
                         <button className="px-6 py-3 bg-museum-dark hover:bg-black text-white font-bold rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                            Book Now <ArrowRight className="w-4 h-4" />
                         </button>
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* Benefits Bar */}
      <div className="bg-white border-y border-gray-100 py-12 mb-0">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-blue-50 text-blue-600', title: 'Easy Booking', sub: 'Book tickets in just a few clicks' },
              { icon: <Zap className="w-8 h-8" />, color: 'bg-green-50 text-green-600', title: 'Secure Payments', sub: '100% secure payment options' },
              { icon: <Bot className="w-8 h-8" />, color: 'bg-rose-50 text-rose-600', title: 'Chatbot Support', sub: 'Get instant help anytime' },
              { icon: <Languages className="w-8 h-8" />, color: 'bg-indigo-50 text-indigo-600', title: 'Multi-language', sub: 'Support for 10+ languages' },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-6">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${benefit.color}`}>
                    {benefit.icon}
                 </div>
                 <div>
                    <h4 className="font-black text-gray-900">{benefit.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{benefit.sub}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-museum-dark py-12">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Subscribe to our Newsletter</h3>
                  <p className="text-gray-400 font-medium">Get updates on new shows, events, and exclusive offers.</p>
               </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="flex-grow md:w-[300px] bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-museum-gold transition-all text-white font-medium"
               />
               <button 
                 onClick={handleSubscribe}
                 disabled={isSubscribing}
                 className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-xl shadow-purple-500/20"
               >
                  {isSubscribing ? '...' : 'Subscribe'}
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ShowsEvents;
