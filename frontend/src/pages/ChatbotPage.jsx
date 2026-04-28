import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RotateCcw, MessageCircle, Sparkles, Plus, History, HelpCircle, Map, Info, Globe, ChevronDown, Paperclip, Ticket, Headphones, Check, CheckCheck, Trash2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'bot', 
      text: "Hello! 👋\nI'm your Museum Assistant. I can help you with:\n\n🎟️ Ticket booking\n🕒 Museum timings\n📍 Location & directions\n💬 General queries\n\nWhat would you like to know?",
      time: '10:30 AM' 
    },
    { 
      id: 2, 
      role: 'user', 
      text: "What are the museum timings?", 
      time: '10:31 AM' 
    },
    { 
      id: 3, 
      role: 'bot', 
      text: "Our museum is open from:\n\n🕒 Tuesday to Sunday: 10:00 AM - 6:00 PM\n🚫 Closed on Mondays\n\nLast entry is 30 minutes before closing time.", 
      time: '10:31 AM' 
    },
    { 
      id: 4, 
      role: 'user', 
      text: "How much are the ticket prices?", 
      time: '10:32 AM' 
    },
    { 
      id: 5, 
      role: 'bot', 
      text: "Here are our ticket prices:\n\n👤 Adults: ₹200\n🎓 Students: ₹100 (with valid ID)\n👶 Children below 6 years: Free\n👨‍👩‍👧‍👦 Group (10+ people): 10% off\n\nWould you like to book tickets now?", 
      time: '10:32 AM' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), role: 'user', text: input, time };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chat/message', { message: input });
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: res.data.reply, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: "I'm currently connected to our live agents. How can I help you?", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const menuItems = [
    { id: 'new', label: 'New Chat', icon: <MessageCircle className="w-5 h-5" />, active: true },
    { id: 'history', label: 'My Conversations', icon: <History className="w-5 h-5" /> },
    { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'guide', label: 'Visitor Guide', icon: <Map className="w-5 h-5" /> },
    { id: 'info', label: 'Museum Information', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen bg-[#F8F9FB] pt-20 flex">
      {/* Sidebar */}
      <div className="w-[320px] bg-white border-r border-gray-100 flex flex-col p-6 hidden lg:flex">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center relative shadow-lg shadow-blue-50">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
               <h3 className="text-lg font-black text-gray-900">Museum Assistant</h3>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Online</span>
               </div>
            </div>
         </div>

         <div className="flex-grow space-y-2">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${
                  item.active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                 {item.icon}
                 {item.label}
              </button>
            ))}
            
            <div className="pt-6">
               <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Globe className="w-5 h-5 text-gray-400" />
                     <span className="text-sm font-bold text-gray-700">Language</span>
                  </div>
                  <button className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest">
                     English <ChevronDown className="w-3 h-3" />
                  </button>
               </div>
            </div>
         </div>

         <div className="mt-auto space-y-6">
            <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
               <div className="relative z-10 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">
                     <Ticket className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-black text-gray-900 mb-2">Need to book tickets?</h4>
                  <p className="text-[11px] text-gray-500 font-medium mb-4">I can help you find and book tickets for your visit.</p>
                  <Link to="/booking">
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all">
                       Book Tickets Now
                    </button>
                  </Link>
               </div>
            </div>
            
            <div className="flex items-center gap-3 pl-2">
               <Headphones className="w-5 h-5 text-gray-400" />
               <div className="text-[11px] font-bold">
                  <span className="text-gray-400">Need more help?</span>
                  <Link to="/contact" className="text-blue-600 block hover:underline">Contact Support</Link>
               </div>
            </div>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
         {/* Header */}
         <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
            <div>
               <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  Welcome to Museum Assistant 👋
               </h2>
               <p className="text-xs font-medium text-gray-500">How can I help you today?</p>
            </div>
            <button onClick={() => setMessages([])} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
               <Trash2 className="w-4 h-4" />
               Clear Chat
            </button>
         </div>

         {/* Chat Window */}
         <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
            <AnimatePresence>
               {messages.map((m) => (
                 <motion.div 
                   key={m.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                 >
                   {m.role === 'bot' && (
                     <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-gray-400" />
                     </div>
                   )}
                   <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div className={`p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-[#E0E7FF] text-blue-900 rounded-tr-none' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                      }`}>
                         <p className="whitespace-pre-line">{m.text}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                         <span>{m.time}</span>
                         {m.role === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                   </div>
                 </motion.div>
               ))}
            </AnimatePresence>
            {isTyping && (
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                     <Bot className="w-5 h-5 text-gray-400 animate-pulse" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                     <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
               </div>
            )}
            <div ref={scrollRef} />
         </div>

         {/* Footer / Input */}
         <div className="p-6 bg-white border-t border-gray-100">
            {/* Quick Actions */}
            <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
               {['Book Tickets', 'Shows & Events', 'How to Reach?', 'Cancel Booking', 'FAQs'].map((action) => (
                 <button 
                   key={action}
                   onClick={() => setInput(action)}
                   className="px-5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap shadow-sm"
                 >
                    {action}
                 </button>
               ))}
            </div>

            <form onSubmit={handleSend} className="relative group">
               <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                  <Paperclip className="w-5 h-5" />
               </button>
               <input 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 placeholder="Type your message..."
                 className="w-full pl-16 pr-16 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-600 transition-all font-medium text-gray-700"
               />
               <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  <Send className="w-5 h-5" />
               </button>
            </form>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
               <span>Powered by AI • Museum Assistant</span>
               <ShieldCheck className="w-3 h-3" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
