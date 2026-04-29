import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Ticket, Sparkles, ChevronRight, Zap, ShieldCheck, Languages, Landmark, MessageSquare, ArrowRight, Star, BarChart3 } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';

const Home = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
      title: "AI Chatbot Assistant",
      desc: "Get instant answers and book tickets easily with our smart chatbot.",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Ticket className="w-6 h-6 text-green-500" />,
      title: "Quick & Easy Booking",
      desc: "Book your tickets in just a few clicks. Simple, fast and secure.",
      bgColor: "bg-green-50",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: "Secure Payments",
      desc: "Multiple payment options with 100% secure transactions.",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Languages className="w-6 h-6 text-amber-500" />,
      title: "Multilingual Support",
      desc: "Chat and book in your preferred language for a seamless experience.",
      bgColor: "bg-amber-50",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-500" />,
      title: "Smart Analytics",
      desc: "We use data to improve services and provide better visitor experiences.",
      bgColor: "bg-rose-50",
    }
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&h=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop"
  ];

  const [visitorCount, setVisitorCount] = useState(12480);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Daily Visitors", value: 2500, suffix: "+", decimals: 0 },
    { label: "Museum Exhibits", value: 1500, suffix: "+", decimals: 0 },
    { label: "Booking Success", value: 99.9, suffix: "%", decimals: 1 },
    { label: "Active Guides", value: 24, suffix: "/7", decimals: 0 },
  ];

  const MouseSpotlight = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
      <motion.div 
        animate={{ 
          x: mousePos.x - 400, 
          y: mousePos.y - 400 
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-museum-gold/5 blur-[120px] rounded-full pointer-events-none z-0 opacity-40"
      />
    );
  };



  const liveEvents = [
    "Renaissance Art Tour (Hall A) - Starting in 10 mins",
    "Ancient Egypt Virtual Reality Experience - Live Now",
    "Special Guest Lecture: Digital Archeology - Hall C",
    "Interactive Science for Kids - Zone 4",
  ];

  const testimonials = [
    {
      name: "Sophia Chen",
      role: "Art Historian",
      content: "The AI chatbot made booking my weekend tour incredibly simple. No more waiting on hold!",
      rating: 5,
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Marcus Thorne",
      role: "Family Traveler",
      content: "The real-time slot updates saved our family trip. We could book exactly when the museum was less crowded.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Elena Rodriguez",
      role: "Cultural Blogger",
      content: "A premium experience from start to finish. The digital ticket on my phone worked flawlessly at the gate.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop"
    }
  ];


  const CountUp = ({ to, duration = 2, suffix = "", decimals = 0 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
      return latest.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    });
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
      if (isInView) {
        animate(count, to, { duration });
      }
    }, [isInView, to, duration, count]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
  };


  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <MouseSpotlight />
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(circle, #D9A048 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Museum Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-museum-dark via-museum-dark/70 to-transparent" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              >
                <Sparkles className="text-museum-gold/30 w-8 h-8" />
              </motion.div>
            ))}
          </div>

          {/* Floating Museum Symbols */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[Landmark, Sparkles, Bot].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -60, 0],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.03, 0.08, 0.03],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 12 + i * 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute text-museum-gold hidden xl:block"
                style={{
                  top: `${15 + i * 30}%`,
                  right: `${5 + i * 12}%`,
                }}
              >
                <Icon className="w-64 h-64" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-museum-gold/20 backdrop-blur-md text-museum-gold rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-museum-gold/30"
            >
              <Landmark className="h-4 w-4" /> Welcome to Museum Ticketing
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-8xl font-bold text-white leading-[1.1] mb-8"
            >
              Book Museum <br />
              Tickets <span className="text-museum-gold">Easily</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-xl leading-relaxed font-medium"
            >
              Skip the lines and enjoy a seamless booking experience with our AI Chatbot. Get instant support and secure your entry in seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-5 mb-16"
            >
              <Link to="/booking">
                <button className="px-10 py-5 bg-museum-gold hover:bg-museum-accent text-museum-dark font-black text-lg rounded-2xl flex items-center gap-2 transition-all transform hover:scale-[1.02] shadow-2xl shadow-museum-gold/20">
                  Book Tickets Now <ArrowRight className="w-6 h-6" />
                </button>
              </Link>
              <Link to="/about">
                <button className="px-10 py-5 bg-white/5 backdrop-blur-sm border-2 border-white/20 hover:bg-white/10 text-white font-bold text-lg rounded-2xl flex items-center gap-2 transition-all">
                  Explore Museum <Landmark className="w-6 h-6" />
                </button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 w-fit"
            >
              <div className="flex -space-x-3">
                {avatars.map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                    alt="Visitor" 
                    className="w-12 h-12 rounded-full border-4 border-museum-dark object-cover shadow-xl"
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-museum-dark bg-museum-gold flex items-center justify-center text-museum-dark font-black text-xs shadow-xl">
                  +2k
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none mb-1">
                  <span className="text-museum-gold tabular-nums">{visitorCount.toLocaleString()}</span> happy visitors
                </p>
                <div className="flex items-center gap-1">
                   {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-museum-gold text-museum-gold" />)}
                  <span className="text-gray-400 text-sm ml-2">4.9/5 Live Rating</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Chatbot Preview Widget */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-5 xl:col-span-4 hidden lg:flex justify-end"
          >
            <div className="w-full max-w-[400px] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-8 relative border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100 shadow-inner overflow-hidden relative group">
                  <Bot className="w-9 h-9 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 leading-none mb-1">Hi there! 👋</h4>
                  <p className="text-gray-500 font-medium">Your Virtual Guide</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                  <p className="text-gray-700 font-medium">Welcome to the Museum! I can help you find available slots and book tickets in seconds.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl rounded-tr-none border border-blue-100 ml-auto w-[80%]">
                  <p className="text-blue-700 font-bold">Show me available tickets for tomorrow.</p>
                </div>
              </div>
              
              <Link to="/chat">
                <button className="w-full py-5 bg-museum-dark hover:bg-black text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-xl">
                  Chat Now to Book
                  <MessageSquare className="w-6 h-6 text-museum-gold group-hover:rotate-12 transition-transform" />
                </button>
              </Link>

              {/* Decorative Element */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-museum-gold/20 blur-3xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Ticker */}
      <div className="bg-museum-gold/10 border-y border-museum-gold/10 overflow-hidden py-3">
        <motion.div 
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {[...liveEvents, ...liveEvents].map((event, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-museum-dark font-black text-sm uppercase tracking-widest">{event}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-gray-50/30 relative overflow-hidden">
        {/* Live Background Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 -left-20 w-[600px] h-[600px] bg-museum-gold/5 blur-[120px] rounded-full pointer-events-none"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-20">
            <span className="text-museum-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Our Advantage</span>
            <h2 className="text-4xl md:text-6xl font-black text-museum-dark leading-tight">Smart Ticketing, <br />Better Experience</h2>
            <div className="w-20 h-2 bg-museum-gold mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  to={i === 0 || i === 3 ? "/chat" : i === 4 ? "/dashboard" : "/booking"}
                  className="block h-full bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(217,160,72,0.15)] transition-all duration-500 hover:-translate-y-3 group"
                >
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight">{feature.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed font-medium">{feature.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-20 border-t border-gray-100 pt-20">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <h4 className="text-4xl md:text-5xl font-black text-museum-dark mb-2 tracking-tighter">
                  <CountUp to={stat.value} decimals={stat.decimals} />
                  {stat.suffix}
                </h4>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Mesh Gradient Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(217,160,72,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.05),transparent_40%)]"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-museum-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-black text-museum-dark mb-6">What Our Visitors Say</h2>
            <p className="text-gray-500 font-medium italic leading-relaxed">Hear from thousands of global explorers who have experienced the future of cultural discovery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 relative group hover:bg-museum-dark transition-all duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-museum-gold text-museum-gold" />
                  ))}
                </div>
                <p className="text-gray-600 font-medium italic mb-8 group-hover:text-gray-300 transition-colors leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg" />
                  <div>
                    <h4 className="font-black text-gray-900 group-hover:text-white transition-colors leading-none mb-1">{t.name}</h4>
                    <p className="text-xs text-museum-gold font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <div className="absolute top-10 right-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                   <MessageSquare className="w-16 h-16 text-museum-dark group-hover:text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Floating Chatbot Trigger */}
      <Link to="/chat" className="fixed bottom-10 right-10 z-[100] group">
         <motion.div 
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           className="w-20 h-20 bg-museum-gold text-museum-dark rounded-[2rem] shadow-[0_20px_50px_rgba(217,160,72,0.4)] flex items-center justify-center relative overflow-hidden"
         >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot className="w-10 h-10" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white animate-pulse" />
         </motion.div>
      </Link>

      {/* CTA Section */}
      <section className="py-32 bg-museum-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-museum-gold/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black text-white mb-10 leading-tight"
          >
            Ready for an unforgettable journey through time?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/booking">
              <button className="px-16 py-6 bg-museum-gold hover:bg-museum-accent text-museum-dark font-black text-2xl rounded-[2rem] transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(217,160,72,0.3)]">
                Book Your Tickets Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
