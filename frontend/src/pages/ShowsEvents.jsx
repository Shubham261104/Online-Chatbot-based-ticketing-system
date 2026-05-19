import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  ChevronDown, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Landmark, 
  Music, 
  Wrench, 
  Gift, 
  Ticket,
  ShieldCheck,
  Zap,
  Bot,
  Languages,
  Mail,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import heroBg from '../assets/hero-bg.png';

const ShowsEvents = () => {
  const [activeTab, setActiveTab] = useState('All Events');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price_asc', 'price_desc', 'name'
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const categories = [
    { name: 'All Events', icon: <Sparkles className="w-4 h-4 text-museum-gold animate-pulse" /> },
    { name: 'Exhibitions', icon: <Landmark className="w-4 h-4 text-blue-600" /> },
    { name: 'Cultural Shows', icon: <Music className="w-4 h-4 text-purple-600" /> },
    { name: 'Workshops', icon: <Wrench className="w-4 h-4 text-orange-600" /> },
    { name: 'Special Events', icon: <Gift className="w-4 h-4 text-rose-600" /> },
  ];

  const events = [
    {
      id: 1,
      category: 'Exhibition',
      tagColor: 'bg-blue-50 text-blue-600 border border-blue-100',
      iconBg: 'bg-blue-50 text-blue-600',
      btnStyle: 'bg-[#0B1528] hover:bg-black shadow-lg shadow-blue-900/10',
      title: 'Treasures of Ancient Egypt',
      date: 'May 20 - Jun 30, 2026',
      startDate: '2026-05-20',
      endDate: '2026-06-30',
      time: '10:00 AM - 6:00 PM',
      location: 'Gallery 1, Main Building',
      desc: 'Discover the wonders of ancient Egypt through rare artifacts and sculptures.',
      price: 250,
      image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 2,
      category: 'Cultural Show',
      tagColor: 'bg-rose-50 text-rose-600 border border-rose-100',
      iconBg: 'bg-rose-50 text-rose-600',
      btnStyle: 'bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-95 shadow-lg shadow-rose-500/20',
      title: 'Rhythms of India',
      date: 'May 25, 2026',
      startDate: '2026-05-25',
      endDate: '2026-05-25',
      time: '5:00 PM - 7:00 PM',
      location: 'Auditorium, Main Building',
      desc: 'A mesmerizing evening of classical dance and music performances.',
      price: 300,
      image: 'https://images.unsplash.com/photo-1514222139-b786bb23c828?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 3,
      category: 'Workshop',
      tagColor: 'bg-amber-50 text-amber-600 border border-amber-100',
      iconBg: 'bg-amber-50 text-amber-600',
      btnStyle: 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/10',
      title: 'Pottery Workshop for Kids',
      date: 'Jun 01, 2026',
      startDate: '2026-06-01',
      endDate: '2026-06-01',
      time: '11:00 AM - 1:00 PM',
      location: 'Workshop Room, Ground Floor',
      desc: 'A fun and creative pottery workshop where kids can learn and create.',
      price: 200,
      image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 4,
      category: 'Special Event',
      tagColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600',
      btnStyle: 'bg-[#005B3A] hover:bg-emerald-900 shadow-lg shadow-emerald-800/15',
      title: 'Museum Night: After Hours',
      date: 'Jun 07, 2026',
      startDate: '2026-06-07',
      endDate: '2026-06-07',
      time: '7:00 PM - 11:00 PM',
      location: 'Main Building',
      desc: 'Experience the museum like never before with exclusive night access.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 5,
      category: 'Exhibition',
      tagColor: 'bg-blue-50 text-blue-600 border border-blue-100',
      iconBg: 'bg-blue-50 text-blue-600',
      btnStyle: 'bg-[#0B1528] hover:bg-black shadow-lg shadow-blue-900/10',
      title: 'Renaissance Masterpieces',
      date: 'Jun 10 - Jul 25, 2026',
      startDate: '2026-06-10',
      endDate: '2026-07-25',
      time: '10:00 AM - 6:00 PM',
      location: 'Gallery 3, East Wing',
      desc: 'Witness the brilliance of Leonardo, Michelangelo, and Raphael in an exclusive collection.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 6,
      category: 'Cultural Show',
      tagColor: 'bg-rose-50 text-rose-600 border border-rose-100',
      iconBg: 'bg-rose-50 text-rose-600',
      btnStyle: 'bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-95 shadow-lg shadow-rose-500/20',
      title: 'Echoes of Mozart & Beethoven',
      date: 'Jun 15, 2026',
      startDate: '2026-06-15',
      endDate: '2026-06-15',
      time: '6:30 PM - 9:00 PM',
      location: 'Grand Hall, Main Building',
      desc: 'Experience live symphonic orchestra performing timeless classical masterpieces.',
      price: 450,
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 7,
      category: 'Workshop',
      tagColor: 'bg-amber-50 text-amber-600 border border-amber-100',
      iconBg: 'bg-amber-50 text-amber-600',
      btnStyle: 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/10',
      title: 'Ancient Calligraphy Masterclass',
      date: 'Jun 22, 2026',
      startDate: '2026-06-22',
      endDate: '2026-06-22',
      time: '2:00 PM - 5:00 PM',
      location: 'Library Archive Room',
      desc: 'Learn the sacred art of ink calligraphy and medieval lettering from masters.',
      price: 250,
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 8,
      category: 'Special Event',
      tagColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600',
      btnStyle: 'bg-[#005B3A] hover:bg-emerald-900 shadow-lg shadow-emerald-800/15',
      title: 'Cosmic Journey: Stargazing Night',
      date: 'Jun 28, 2026',
      startDate: '2026-06-28',
      endDate: '2026-06-28',
      time: '8:00 PM - 11:30 PM',
      location: 'Museum Rooftop Observatory',
      desc: 'Unveil the mysteries of the night sky through high-powered telescopes with astronomers.',
      price: 600,
      image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesTab = activeTab === 'All Events' || event.category === activeTab.replace('s', '');
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return new Date(a.startDate) - new Date(b.startDate);
  });

  const getEventsForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(event => {
      const start = event.startDate;
      const end = event.endDate || event.startDate;
      return dateStr >= start && dateStr <= end;
    });
  };

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

  // Calendar View Component
  const CalendarViewComponent = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)); // Starts at May 2025

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
    };

    const calendarDays = [
      ...Array(startDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
    ];

    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevMonth}
              className="w-10 h-10 border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer text-gray-600 font-bold"
            >
              &larr;
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-10 h-10 border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer text-gray-600 font-bold"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-[#FAF9F6]/50 rounded-xl min-h-[90px] md:min-h-[110px]" />;
            }

            const dayEvents = getEventsForDate(year, month, day);

            return (
              <div 
                key={`day-${day}`} 
                className="bg-white border border-gray-100 rounded-xl p-2 min-h-[90px] md:min-h-[110px] flex flex-col justify-between hover:border-museum-gold/30 transition-all group"
              >
                <div className="text-right text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                  {day}
                </div>
                <div className="flex-grow mt-2 overflow-y-auto space-y-1">
                  {dayEvents.map(event => {
                    let pillColor = "";
                    if (event.category === 'Exhibition') pillColor = "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100/50";
                    else if (event.category === 'Cultural Show') pillColor = "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100/50";
                    else if (event.category === 'Workshop') pillColor = "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100/50";
                    else pillColor = "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100/50";

                    return (
                      <Link 
                        key={event.id}
                        to="/event-booking" 
                        state={{ event }}
                        className={`block text-[9px] font-bold py-1 px-1.5 rounded-lg truncate transition-all ${pillColor}`}
                        title={event.title}
                      >
                        {event.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col pt-24 relative overflow-hidden">
      {/* Decorative side watermarks */}
      <div className="absolute left-0 top-[400px] opacity-[0.05] pointer-events-none hidden xl:block z-0 text-gray-800 select-none">
        <svg width="220" height="400" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M20 180h60M30 180V80c0-10 10-20 20-20s20 10 20 20v100M40 50c0-5 5-10 10-10s10 5 10 10-5 10-10 10-10-5-10-10z" />
          <path d="M45 70c0 5 10 5 10 0M35 100h30M35 130h30M35 160h30" />
        </svg>
      </div>
      <div className="absolute right-0 top-[500px] opacity-[0.05] pointer-events-none hidden xl:block z-0 text-gray-800 select-none">
        <svg width="250" height="350" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M10 40 l50 -25 l50 25 z" />
          <path d="M15 40 h90M18 45 h84" />
          <path d="M25 45 v50M35 45 v50M50 45 v50M60 45 v50M75 45 v50M85 45 v50M95 45 v50" />
          <path d="M12 95 h96M10 100 h100" />
        </svg>
      </div>

      {/* Side Dot Grid Decorations */}
      <div className="absolute left-6 top-[550px] w-12 h-36 opacity-[0.08] pointer-events-none hidden xl:block z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }} />
      <div className="absolute right-6 top-[650px] w-12 h-36 opacity-[0.08] pointer-events-none hidden xl:block z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }} />

      {/* Hero Header */}
      <section className="relative min-h-[50vh] lg:h-[380px] flex items-center bg-museum-dark overflow-hidden py-16">
        <div 
          className="absolute inset-0 z-0 bg-[length:auto_100%] bg-center lg:bg-[center_35%] bg-no-repeat bg-museum-dark opacity-35"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-museum-dark via-museum-dark/70 to-transparent z-0" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
           <div className="lg:col-span-7">
              <div className="relative">
                <span className="text-museum-gold text-2xl absolute -top-8 left-0 animate-pulse">✦</span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                  Shows & <span className="text-museum-gold">Events</span>
                </motion.h1>
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed"
              >
                Explore exciting exhibitions, cultural shows, and special events happening at our museum.
              </motion.p>
           </div>
           
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-5 flex justify-end"
           >
              <div className="bg-[#2D1F10]/80 backdrop-blur-md p-6 rounded-3xl border border-museum-gold/20 flex items-center gap-5 max-w-md shadow-2xl relative">
                <div className="w-12 h-12 bg-museum-gold rounded-2xl flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6 text-museum-dark" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-bold text-museum-gold mb-1 tracking-wider uppercase">Don't Miss Out!</h3>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">Book your tickets easily and enjoy exclusive experiences.</p>
                </div>
                <Link to="/booking" className="w-8 h-8 bg-museum-gold rounded-full flex items-center justify-center shrink-0 hover:bg-museum-accent transition-colors">
                  <ArrowRight className="w-4 h-4 text-museum-dark font-bold" />
                </Link>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-20 -mt-12">
         <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-4 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
               {categories.map((cat) => (
                 <button
                   key={cat.name}
                   onClick={() => setActiveTab(cat.name)}
                   className={`px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                     activeTab === cat.name 
                       ? 'bg-[#0B1528] text-white shadow-md' 
                       : 'bg-[#FDFDFD] text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200/50'
                   }`}
                 >
                   {cat.icon}
                   {cat.name}
                 </button>
               ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto flex-grow justify-end">
               <div className="relative flex items-center max-w-xs w-full">
                 <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search events..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 bg-[#FBFBFB] rounded-2xl border border-transparent focus:border-museum-gold/30 focus:ring-2 focus:ring-museum-gold/5 outline-none transition-all font-bold text-xs"
                 />
               </div>
               
               <button 
                 onClick={() => setViewMode(viewMode === 'grid' ? 'calendar' : 'grid')}
                 className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-bold text-xs transition-all cursor-pointer ${
                   viewMode === 'calendar' 
                     ? 'bg-[#0B1528] text-white border-[#0B1528] shadow-md' 
                     : 'border-gray-100 text-gray-600 bg-[#FBFBFB] hover:bg-gray-100'
                 }`}
               >
                  {viewMode === 'calendar' ? <LayoutGrid className="w-4 h-4 text-museum-gold" /> : <Calendar className="w-4 h-4" />}
                  <span>{viewMode === 'calendar' ? 'Grid View' : 'Calendar View'}</span>
               </button>
               
               <div className="relative">
                 <button 
                   onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                   className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-bold text-xs transition-all cursor-pointer ${
                     isSortDropdownOpen || sortBy !== 'default'
                       ? 'bg-[#0B1528] text-white border-[#0B1528] shadow-md'
                       : 'border-gray-100 text-gray-600 bg-[#FBFBFB] hover:bg-gray-100'
                   }`}
                 >
                    <Filter className={`w-4 h-4 ${isSortDropdownOpen || sortBy !== 'default' ? 'text-museum-gold' : 'text-gray-400'}`} />
                    <span>
                      {sortBy === 'default' && 'Sort By'}
                      {sortBy === 'price_asc' && 'Price: Low to High'}
                      {sortBy === 'price_desc' && 'Price: High to Low'}
                      {sortBy === 'name' && 'Name: A-Z'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortDropdownOpen ? 'rotate-180 text-museum-gold' : 'text-gray-400'}`} />
                 </button>

                 {isSortDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                      {[
                        { id: 'default', label: 'Date (Soonest)' },
                        { id: 'price_asc', label: 'Price: Low to High' },
                        { id: 'price_desc', label: 'Price: High to Low' },
                        { id: 'name', label: 'Name (A-Z)' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                            sortBy === option.id ? 'text-museum-gold bg-slate-50' : 'text-gray-600'
                          }`}
                        >
                          {option.label}
                          {sortBy === option.id && <span className="text-museum-gold">✓</span>}
                        </button>
                      ))}
                   </div>
                 )}
               </div>
            </div>
         </div>
      </div>

      {/* Events Grid / Calendar View */}
      <div className="max-w-7xl mx-auto px-6 w-full mt-12 mb-20 relative z-10">
         {viewMode === 'grid' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedEvents.map((event, i) => {
                const isWishlisted = wishlist.includes(event.id);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image with Heart Icon overlay */}
                      <div className="relative h-48 overflow-hidden m-4 rounded-[1.5rem]">
                         <img 
                           src={event.image} 
                           alt={event.title} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <button 
                           onClick={() => toggleWishlist(event.id)}
                           className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                             isWishlisted 
                               ? 'bg-rose-500 text-white shadow-rose-500/20 shadow-lg' 
                               : 'bg-white text-gray-700 hover:text-rose-500'
                           }`}
                         >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                         </button>
                      </div>
                      
                      {/* Content details */}
                      <div className="px-6 pb-2">
                         <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${event.tagColor} mb-3 inline-block`}>
                            {event.category}
                         </span>
                         <h3 className="text-base font-bold text-gray-900 mb-4 leading-snug group-hover:text-museum-gold transition-colors line-clamp-1" title={event.title}>
                            {event.title}
                         </h3>
                         
                         <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                               <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${event.iconBg} bg-opacity-70`}>
                                  <Calendar className="w-3.5 h-3.5" />
                               </div>
                               <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                               <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${event.iconBg} bg-opacity-70`}>
                                  <Clock className="w-3.5 h-3.5" />
                               </div>
                               <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                               <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${event.iconBg} bg-opacity-70`}>
                                  <MapPin className="w-3.5 h-3.5" />
                               </div>
                               <span className="line-clamp-1">{event.location}</span>
                            </div>
                         </div>
                         
                         <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2">
                            {event.desc}
                         </p>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                       <span className="text-lg font-bold text-gray-900">₹{event.price}</span>
                       <Link to="/event-booking" state={{ event }}>
                          <button className={`px-5 py-2.5 ${event.btnStyle} text-white font-bold rounded-xl flex items-center gap-2 transition-all text-xs cursor-pointer`}>
                             Book Now <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                       </Link>
                    </div>
                  </motion.div>
                );
              })}
           </div>
         ) : (
           <CalendarViewComponent />
         )}
      </div>

      {/* Benefits Bar */}
      <div className="bg-white border-y border-gray-100 py-12 mb-0 relative z-10">
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
                    <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{benefit.sub}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-museum-dark py-12 relative z-10">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Subscribe to our Newsletter</h3>
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
                 className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-xl shadow-purple-500/20 cursor-pointer"
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
