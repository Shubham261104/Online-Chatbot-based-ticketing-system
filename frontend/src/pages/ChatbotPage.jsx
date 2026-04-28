import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RotateCcw, MessageCircle, Sparkles, Plus, History, HelpCircle, Map, Info, Globe, ChevronDown, Paperclip, Ticket, Headphones, Check, CheckCheck, Trash2, ShieldCheck, Zap, ArrowRight, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';

const QUICK_ACTIONS = [
  { label: 'Book Tickets', icon: <Ticket className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Parking Info', icon: <Map className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { label: 'Photography', icon: <Sparkles className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { label: 'Student Discount', icon: <Star className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'bot', 
      text: "Namaste! 🙏\nI'm your Museum AI Assistant. I can help you explore the museum, check ticket prices, or book your visit in seconds.\n\nHow can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (val) => {
    const messageToSend = (typeof val === 'string' ? val : input).trim();
    if (!messageToSend) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), role: 'user', text: messageToSend, time };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chatbot', { message: messageToSend });
      setTimeout(() => {
        const botReply = { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: res.data.reply || "I'm here to help!", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: (res.data.reply && res.data.reply.toLowerCase().includes('book')) ? { label: 'Go to Booking', path: '/booking' } : null
        };
        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: "I'm online but having a tiny connection issue. We are open from 9 AM to 6 PM!", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const menuItems = [
    { id: 'new', label: 'New Exploration', icon: <Sparkles className="w-5 h-5" />, active: true },
    { id: 'history', label: 'Conversations', icon: <History className="w-5 h-5" /> },
    { id: 'guide', label: 'Visitor Guide', icon: <Map className="w-5 h-5" /> },
    { id: 'support', label: 'Support', icon: <Headphones className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen bg-[#FDFDFF] pt-20 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] bg-white border-r border-slate-100 hidden lg:flex flex-col p-6">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center relative shadow-lg shadow-blue-100">
               <Bot className="w-6 h-6 text-white" />
               <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
               <h3 className="text-base font-black text-slate-900 tracking-tight">AI Assistant</h3>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Now</span>
               </div>
            </div>
         </div>

         <div className="flex-grow space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Menu</p>
            {menuItems.map((item) => (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all font-bold text-sm ${
                  item.active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                 {item.icon}
                 <span className="truncate">{item.label}</span>
              </button>
            ))}
         </div>

         <div className="mt-auto">
            <div className="bg-slate-900 p-6 rounded-3xl text-white mb-4">
               <h4 className="text-sm font-black mb-1">Quick Booking</h4>
               <p className="text-[10px] text-slate-400 mb-4">Get your pass instantly.</p>
               <Link to="/booking" className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black text-center transition-all">
                  Book Now
               </Link>
            </div>
         </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col relative bg-[#FDFDFF] max-w-7xl mx-auto w-full border-x border-slate-50">
         {/* Header */}
         <div className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
               <div className="lg:hidden w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h2 className="text-base font-black text-slate-900">Museum Virtual Guide</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Powered Assistance</p>
               </div>
            </div>
            <button onClick={() => setMessages([])} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-all">
               <Trash2 className="w-5 h-5" />
            </button>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 no-scrollbar scroll-smooth">
            <AnimatePresence>
               {messages.map((m) => (
                 <motion.div 
                   key={m.id}
                   initial={{ opacity: 0, y: 15, scale: 0.98 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                 >
                   <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                     m.role === 'bot' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                   }`}>
                      {m.role === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                   </div>
                   <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                      <div className={`p-4 md:p-5 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                         <p className="whitespace-pre-line">{m.text}</p>
                         {m.action && (
                           <div className="mt-4 pt-4 border-t border-slate-100">
                             <button onClick={() => navigate(m.action.path)} className="flex items-center justify-between w-full p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all group">
                                <span className="text-[10px] font-black uppercase tracking-widest">{m.action.label}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                             </button>
                           </div>
                         )}
                      </div>
                      <div className={`flex items-center gap-1.5 mt-2 text-[9px] font-black uppercase tracking-widest text-slate-300 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                         <span>{m.time}</span>
                         {m.role === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                   </div>
                 </motion.div>
               ))}
               <div ref={messagesEndRef} />
            </AnimatePresence>
            
            {isTyping && (
               <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                     <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                  </div>
               </div>
            )}
         </div>

         {/* Footer / Input */}
         <div className="px-6 py-6 bg-white border-t border-slate-100">
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
               {QUICK_ACTIONS.map((action) => (
                 <button key={action.label} onClick={() => handleSend(action.label)} className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm hover:shadow-md ${action.color}`}>
                    {action.icon} {action.label}
                 </button>
               ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." className="flex-grow py-3 px-4 outline-none font-bold text-slate-700 bg-transparent text-sm" />
               <button type="submit" disabled={!input.trim()} className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 disabled:opacity-30 shrink-0 transition-all">
                  <Send className="w-5 h-5" />
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
