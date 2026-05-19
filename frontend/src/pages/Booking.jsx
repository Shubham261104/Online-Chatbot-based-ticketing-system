// Force build trigger: 2026-05-12T12:44
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Clock, CreditCard, CheckCircle, ChevronRight, ArrowLeft, Info, Ticket, Landmark, ShieldCheck, Zap, Bot, Languages, LogIn, RefreshCw, MapPin, QrCode, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import TicketModal from '../components/TicketModal';
import MuseumSelector from '../components/MuseumSelector';
import { getMuseumInfo } from '../data/museumData';

const TICKET_TYPES = [
  { type: 'General', addCharge: 0, desc: 'Standard museum access' },
  { type: 'Premium', addCharge: 150, desc: 'Includes guided tour & fast-track entry' },
  { type: 'VIP', addCharge: 400, desc: 'All-access, VIP lounge & dedicated guide' },
];

const DEFAULT_SLOTS = [
  { time: '09:00 AM - 10:30 AM', status: 'Available', remaining: 50 },
  { time: '10:30 AM - 12:00 PM', status: 'Available', remaining: 50 },
  { time: '12:00 PM - 01:30 PM', status: 'Available', remaining: 50 },
  { time: '01:30 PM - 03:00 PM', status: 'Available', remaining: 50 },
  { time: '03:00 PM - 04:30 PM', status: 'Available', remaining: 50 },
  { time: '04:30 PM - 06:00 PM', status: 'Available', remaining: 50 },
  { time: '06:00 PM - 07:30 PM', status: 'Available', remaining: 50 },
  { time: '07:30 PM - 09:00 PM', status: 'Available', remaining: 50 },
];

const statusColor = { Available: 'text-green-500', 'Few Tickets Left': 'text-orange-500', 'Sold Out': 'text-red-500', 'Time Passed': 'text-gray-400' };

const steps = [
  { id: 1, name: 'Visit Details', sub: 'Date & Time', icon: <Calendar className="w-5 h-5" /> },
  { id: 2, name: 'Visitors', sub: 'Number of Tickets', icon: <Users className="w-5 h-5" /> },
  { id: 3, name: 'Ticket Type', sub: 'Category', icon: <Ticket className="w-5 h-5" /> },
  { id: 4, name: 'Payment', sub: 'Visitor Info & Pay', icon: <CreditCard className="w-5 h-5" /> },
  { id: 5, name: 'Confirmation', sub: 'E-Ticket', icon: <CheckCircle className="w-5 h-5" /> },
];

const today = new Date().toISOString().split('T')[0];

export default function Booking() {
  const location = useLocation();
  const chatbotData = location.state?.bookingData;
  
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuseumModalOpen, setIsMuseumModalOpen] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [fee, setFee] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  useEffect(() => {
    if (chatbotData?.museum) {
      setSelectedMuseum(chatbotData.museum);
    }
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (loggedUser.name) {
      setForm(prev => ({ 
        ...prev, 
        name: prev.name || loggedUser.name, 
        email: prev.email || loggedUser.email 
      }));
    }
    setIsLoggedIn(!!localStorage.getItem('token'));
    fetchSettings();
  }, [chatbotData]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.booking_fee) setFee(Number(res.data.booking_fee));
    } catch (err) {
      console.error("Using default fee");
    }
  };

  const [form, setForm] = useState({
    date: chatbotData?.date || today,
    timeSlot: chatbotData?.timeSlot || DEFAULT_SLOTS[0].time,
    adults: chatbotData?.adults ?? 1,
    children: chatbotData?.children ?? 0,
    students: chatbotData?.students ?? 0,
    females: chatbotData?.females ?? 0,
    seniors: chatbotData?.seniors ?? 0,
    foreigners: chatbotData?.foreigners ?? 0,
    ticketType: TICKET_TYPES[0],
    name: '',
    email: '',
  });

  // If coming from chatbot, we might want to skip to payment or summary step
  const [currentStep, setCurrentStep] = useState(chatbotData ? 4 : 1);

  // Fetch real-time slot availability whenever date changes
  const fetchSlots = useCallback(async (date) => {
    setSlotsLoading(true);
    try {
      const res = await api.get(`/slots?date=${date}`);
      setSlots(res.data);
      // Auto-select first available slot if nothing is selected or current is sold out/time passed
      const firstAvail = res.data.find(s => s.status !== 'Sold Out' && s.status !== 'Time Passed');
      if (firstAvail && (!form.timeSlot || res.data.find(s => s.time === form.timeSlot)?.status === 'Sold Out' || res.data.find(s => s.time === form.timeSlot)?.status === 'Time Passed')) {
        setForm(f => ({ ...f, timeSlot: firstAvail.time }));
      }
    } catch {
      setSlots(DEFAULT_SLOTS);
    } finally {
      setSlotsLoading(false);
    }
  }, [form.timeSlot]);

  useEffect(() => {
    fetchSlots(form.date);

    // Real-time polling every 5 seconds
    const interval = setInterval(() => {
      fetchSlots(form.date);
    }, 5000);

    return () => clearInterval(interval);
  }, [form.date, fetchSlots]);

  const selectedSlotData = slots.find(s => s.time === form.timeSlot);
  const currentPrice = selectedSlotData ? Number(selectedSlotData.price) : 500;
  
  const multipliers = {
    adults: 1.0,
    children: 0.5,
    students: 0.5,
    females: 0.8,
    seniors: 0.7,
    foreigners: 2.0
  };

  const ticketAddon = form.ticketType.addCharge || 0;
  const effectivePrice = currentPrice + ticketAddon;

  const totalPrice = 
    (form.adults * effectivePrice * multipliers.adults) +
    (form.children * effectivePrice * multipliers.children) +
    (form.students * effectivePrice * multipliers.students) +
    (form.females * effectivePrice * multipliers.females) +
    (form.seniors * effectivePrice * multipliers.seniors) +
    (form.foreigners * effectivePrice * multipliers.foreigners);
    
  const grand = totalPrice + fee;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleBookAndPay = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login first to book tickets!');
      navigate('/login?redirect=/booking');
      return;
    }
    if (!selectedMuseum) {
      toast.error('Please choose a museum first!');
      setCurrentStep(1);
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Book ticket
      const bookRes = await api.post('/book-ticket', {
        date: form.date,
        timeSlot: form.timeSlot,
        adults: form.adults,
        children: form.children,
        students: form.students,
        females: form.females,
        seniors: form.seniors,
        foreigners: form.foreigners,
        name: form.name,
        email: form.email,
        event_name: selectedMuseum,
        ticket_type: form.ticketType.type,
      });

      const ticket = bookRes.data.ticket;
      const orderId = bookRes.data.razorpay_order_id;

      // Step 2: Record simulated payment
      await api.post('/payment', {
        ticket_id: ticket.id,
        amount: ticket.total_price,
        payment_status: 'successful',
        method: 'simulated',
        transaction_id: orderId,
      });

      setConfirmedTicket({ ...ticket, orderId });
      setCurrentStep(5);
      toast.success('Booking confirmed!');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      window.dispatchEvent(new Event('activity-completed'));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Booking failed. Please login first.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const AuthBanner = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
          <LogIn className="w-5 h-5 text-amber-600" />
        </div>
        <p className="text-sm font-bold text-amber-800">You need to be logged in to book tickets.</p>
      </div>
      <button
        onClick={() => navigate('/login?redirect=/booking')}
        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl transition shrink-0"
      >
        Login Now
      </button>
    </div>
  );

  const SummaryCard = () => (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 sticky top-32">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
        <h3 className="text-xl font-black text-gray-900">Booking Summary</h3>
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Landmark className="w-6 h-6" />
        </div>
      </div>
      <div className="space-y-4 text-sm font-bold text-gray-700">
        <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-gray-400" /><span>{form.date}</span></div>
        <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-gray-400" /><span>{form.timeSlot}</span></div>
        <div className="flex items-center gap-3">
          <Landmark className="w-4 h-4 text-gray-400" />
          <span className={selectedMuseum ? "text-blue-600 font-black" : "text-gray-400 italic"}>
            {selectedMuseum || 'No Museum Selected'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {form.adults > 0 && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{form.adults} Adult</span>}
            {form.children > 0 && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{form.children} Child</span>}
            {form.students > 0 && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{form.students} Student</span>}
            {form.females > 0 && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{form.females} Female</span>}
            {form.seniors > 0 && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{form.seniors} Senior</span>}
            {form.foreigners > 0 && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{form.foreigners} Foreigner</span>}
          </div>
        </div>
        <div className="flex items-center gap-3"><Ticket className="w-4 h-4 text-gray-400" /><span>{form.ticketType.type}</span></div>
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest mb-1">
            <span>Price Breakdown</span>
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50 shadow-sm">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                </span>
                LIVE
              </span>
              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-1">
                Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Base Tickets</span>
            <span>₹{(
              (form.adults * currentPrice * multipliers.adults) +
              (form.children * currentPrice * multipliers.children) +
              (form.students * currentPrice * multipliers.students) +
              (form.females * currentPrice * multipliers.females) +
              (form.seniors * currentPrice * multipliers.seniors) +
              (form.foreigners * currentPrice * multipliers.foreigners)
            ).toLocaleString()}</span>
          </div>
          {form.ticketType.addCharge > 0 && (
            <div className="flex justify-between text-blue-600">
              <span className="font-medium">{form.ticketType.type} Addon</span>
              <span>+₹{(totalPrice - (
                (form.adults * currentPrice * multipliers.adults) +
                (form.children * currentPrice * multipliers.children) +
                (form.students * currentPrice * multipliers.students) +
                (form.females * currentPrice * multipliers.females) +
                (form.seniors * currentPrice * multipliers.seniors) +
                (form.foreigners * currentPrice * multipliers.foreigners)
              )).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Convenience Fee</span>
            <span>₹{fee}</span>
          </div>
          <div className="flex justify-between text-base text-blue-600 pt-2 border-t border-gray-100">
            <span className="font-bold">Total Amount</span>
            <motion.span 
              key={grand}
              initial={{ scale: 1.2, color: '#2563eb' }}
              animate={{ scale: 1, color: '#2563eb' }}
              className="text-xl font-black"
            >
              ₹{grand.toLocaleString()}
            </motion.span>
          </div>
        </div>
      </div>
      {currentStep < 4 && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (!selectedMuseum) {
              toast.error('Please choose a museum first!');
              setCurrentStep(1);
            } else {
              setCurrentStep(4);
            }
          }}
          className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200"
        >
          Proceed to Payment
        </motion.button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col pt-24 relative overflow-hidden">
      {/* Background Ambient Blobs */}
      <motion.div 
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/12 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{
          x: [0, -30, 50, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 right-1/12 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-6 w-full pt-10 mb-8 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Book Your Tickets</h1>
            <p className="text-gray-500 font-medium">Select your visit details and book your tickets in easy steps</p>
          </div>
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl self-start md:self-center">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="text-xs">
              <p className="text-amber-500 font-bold uppercase tracking-wider text-[9px]">Live Server Time</p>
              <p className="font-black font-mono text-[11px] tracking-tight">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })} |{' '}
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
        </div>
        {!isLoggedIn && <AuthBanner />}
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-8 mb-20 z-10">

        {/* Steps sidebar */}
        <div className="lg:w-1/4 space-y-3">
          {steps.map(step => (
            <motion.div
              key={step.id}
              whileHover={{ scale: currentStep === step.id ? 1.02 : 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                currentStep === step.id
                  ? 'bg-white border-blue-100 shadow-xl shadow-blue-100/30 relative overflow-hidden'
                  : currentStep > step.id
                  ? 'bg-green-50/80 border-green-100 opacity-90'
                  : 'bg-white/40 border-transparent opacity-50'
              }`}
            >
              {currentStep === step.id && (
                <motion.div 
                  layoutId="activeStepLine"
                  className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600" 
                />
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                currentStep > step.id 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.id 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                ) : step.id}
              </div>
              <div>
                <h4 className={`font-bold text-sm ${currentStep === step.id ? 'text-gray-900 font-extrabold' : 'text-gray-500'}`}>{step.name}</h4>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">{step.sub}</p>
              </div>
              {currentStep === step.id && (
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="ml-auto"
                >
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="lg:w-1/2">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {currentStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">1. Select Destination & Time</h2>
                    <p className="text-gray-500">Choose your museum and preferred visit time</p>
                  </div>
                  <button 
                    onClick={() => setIsMuseumModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shrink-0"
                  >
                    <Landmark className="w-5 h-5" />
                    {selectedMuseum ? 'Change Museum' : 'Choose Museum'}
                  </button>
                </div>

                {selectedMuseum && (
                  <div className="space-y-6 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl text-white shadow-lg shadow-blue-100 flex items-center justify-between relative overflow-hidden"
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                          <Landmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Selected Destination</p>
                          <h4 className="text-lg font-black">{selectedMuseum}</h4>
                        </div>
                      </div>
                      <div className="hidden sm:block relative z-10">
                        <CheckCircle className="w-8 h-8 text-blue-200 opacity-50" />
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter">About the Museum</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-gray-600 font-medium leading-relaxed">
                          {getMuseumInfo(selectedMuseum).desc}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-blue-100/50">
                          <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Famous For</p>
                            <p className="text-sm font-bold text-slate-800">{getMuseumInfo(selectedMuseum).famousFor}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Location</p>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-slate-800">{getMuseumInfo(selectedMuseum).location}</p>
                              <a 
                                href={getMuseumInfo(selectedMuseum).mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shrink-0 shadow-sm"
                              >
                                <MapPin className="w-3 h-3" />
                                SEE LOCATION
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Visit Date</label>
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    className="w-full max-w-xs px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition font-bold text-gray-700"
                  />
                </div>

                <div className="mb-8 relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-gray-700">Time Slot</label>
                    {slotsLoading && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-opacity ${slotsLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {slots.map((slot, i) => (
                      <motion.button
                        key={i}
                        whileHover={!(slot.status === 'Sold Out' || slot.status === 'Time Passed') ? { y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" } : {}}
                        whileTap={!(slot.status === 'Sold Out' || slot.status === 'Time Passed') ? { scale: 0.98 } : {}}
                        disabled={slot.status === 'Sold Out' || slot.status === 'Time Passed'}
                        onClick={() => set('timeSlot', slot.time)}
                        className={`p-5 rounded-2xl border text-left transition-all relative ${
                          form.timeSlot === slot.time
                            ? 'bg-white border-blue-600 shadow-xl ring-2 ring-blue-600/30'
                            : (slot.status === 'Sold Out' || slot.status === 'Time Passed')
                            ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed grayscale'
                            : 'bg-gray-50 border-transparent hover:border-gray-200'
                        }`}
                      >
                        {form.timeSlot === slot.time && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          </div>
                        )}
                        <h5 className="font-bold text-sm text-gray-900 mb-1">{slot.time}</h5>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            {slot.status !== 'Time Passed' && slot.status !== 'Sold Out' && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                            )}
                            <span className={`text-[10px] font-bold ${statusColor[slot.status] || 'text-gray-400'}`}>{slot.status}</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400">{slot.remaining} left</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-8">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-bold text-blue-800">Weekday mornings are less crowded. Enjoy a better experience!</p>
                </div>

                <div className="flex justify-end">
                  <button onClick={() => setCurrentStep(2)}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center gap-3 transition shadow-xl shadow-blue-200">
                    Continue to Visitors <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-1">2. Number of Visitors</h2>
                <p className="text-gray-500 mb-6">Select how many adults and children will be visiting</p>

                {/* Price Chart Section */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Pricing Chart</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Adult', mult: 1.0, color: 'text-blue-600', bg: 'bg-white' },
                      { label: 'Child/Student', mult: 0.5, color: 'text-emerald-600', bg: 'bg-white' },
                      { label: 'Female', mult: 0.8, color: 'text-rose-600', bg: 'bg-white' },
                      { label: 'Senior', mult: 0.7, color: 'text-amber-600', bg: 'bg-white' },
                      { label: 'Foreigner', mult: 2.0, color: 'text-purple-600', bg: 'bg-white' },
                    ].map((p, i) => (
                      <div key={i} className={`${p.bg} p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col`}>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{p.label}</span>
                        <span className={`text-sm font-black ${p.color}`}>₹{currentPrice * p.mult}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {[
                  { label: 'Adults', key: 'adults', min: 0, note: '(Age 18+)', mult: 1.0 }, 
                  { label: 'Children', key: 'children', min: 0, note: '(Age 3-17)', mult: 0.5 },
                  { label: 'Students', key: 'students', min: 0, note: '(With Valid ID)', mult: 0.5 },
                  { label: 'Females', key: 'females', min: 0, note: '(Special Discount)', mult: 0.8 },
                  { label: 'Senior Citizens', key: 'seniors', min: 0, note: '(Age 60+)', mult: 0.7 },
                  { label: 'Foreigners', key: 'foreigners', min: 0, note: '(International)', mult: 2.0 },
                ].map(({ label, key, min, note, mult }) => (
                  <motion.div 
                    key={key} 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between bg-gray-50 rounded-2xl p-6 mb-4 hover:bg-slate-100/50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-900">{label}</p>
                        <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded">₹{currentPrice * mult}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">{note}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => set(key, Math.max(min, form[key] - 1))}
                        className="w-10 h-10 bg-white border border-gray-200 rounded-xl font-black text-xl text-gray-700 hover:border-blue-600 hover:text-blue-600 transition shadow-sm"
                      >
                        −
                      </motion.button>
                      <motion.span 
                        key={form[key]}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-black text-gray-900 w-6 text-center block"
                      >
                        {form[key]}
                      </motion.span>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => set(key, form[key] + 1)}
                        className="w-10 h-10 bg-blue-600 rounded-xl font-black text-xl text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                      >
                        +
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-between mt-8">
                  <button onClick={() => setCurrentStep(1)}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl flex items-center gap-2 transition">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button onClick={() => setCurrentStep(3)}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center gap-3 transition shadow-xl shadow-blue-200">
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-1">3. Choose Ticket Type</h2>
                <p className="text-gray-500 mb-8">Select the category that suits your visit</p>

                {/* Visitor Selection Summary */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Selections (Step 2)</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {form.adults > 0 && <span className="text-sm font-black text-slate-700">{form.adults} Adults</span>}
                      {form.children > 0 && <span className="text-sm font-black text-slate-700">{form.children} Children</span>}
                      {form.students > 0 && <span className="text-sm font-black text-slate-700">{form.students} Students</span>}
                      {form.females > 0 && <span className="text-sm font-black text-slate-700">{form.females} Females</span>}
                      {form.seniors > 0 && <span className="text-sm font-black text-slate-700">{form.seniors} Seniors</span>}
                      {form.foreigners > 0 && <span className="text-sm font-black text-slate-700">{form.foreigners} Foreigners</span>}
                    </div>
                  </div>
                </div>

                {/* Ticket Type Selection */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Select Ticket Category</h3>
                  {TICKET_TYPES.map((type) => (
                    <motion.button
                      key={type.type}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => set('ticketType', type)}
                      className={`w-full p-6 rounded-3xl border-2 text-left transition-all relative ${
                        form.ticketType.type === type.type
                          ? 'bg-blue-50/50 border-blue-600 shadow-lg'
                          : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {form.ticketType.type === type.type && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          form.ticketType.type === type.type ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-black text-gray-900">{type.type}</h4>
                            {type.addCharge > 0 ? (
                              <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                                +₹{type.addCharge} EXTRA
                              </span>
                            ) : (
                              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                BASE PRICE
                              </span>
                            )}
                            {type.type === 'VIP' && (
                              <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">POPULAR</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{type.desc}</p>
                          <div className="mt-2 flex items-center gap-1.5">
                             <p className="text-[10px] font-bold text-gray-400">Total per Adult:</p>
                             <p className="text-sm font-black text-blue-600">₹{currentPrice + type.addCharge}</p>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-8">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                         <Info className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="font-black text-amber-900 uppercase tracking-tighter">Dynamic Pricing Notice</h4>
                   </div>
                   <p className="text-sm font-bold text-amber-800 mb-6">Ticket prices vary based on your selected time slot and visitor type.</p>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Adults', mult: 1.0, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Children', mult: 0.5, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Students', mult: 0.5, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Females', mult: 0.8, color: 'text-rose-600', bg: 'bg-rose-50' },
                        { label: 'Seniors', mult: 0.7, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Foreigners', mult: 2.0, color: 'text-purple-600', bg: 'bg-purple-50' },
                      ].map((item, i) => (
                        <div key={i} className={`${item.bg} p-4 rounded-2xl border border-white/50 shadow-sm`}>
                           <p className={`text-[10px] font-black ${item.color} uppercase tracking-widest mb-1`}>{item.label}</p>
                           <p className="text-xl font-black text-slate-900">₹{currentPrice * item.mult}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep(2)}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl flex items-center gap-2 transition">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button onClick={() => setCurrentStep(4)}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center gap-3 transition shadow-xl shadow-blue-200">
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-1">4. Visitor Details & Payment</h2>
                <p className="text-gray-500 mb-8">Enter your details to receive the e-ticket</p>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition font-medium text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@email.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-4">Select Payment Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', label: 'Card', icon: <CreditCard className="w-5 h-5" /> },
                      { id: 'upi', label: 'UPI', icon: <Smartphone className="w-5 h-5" /> },
                      { id: 'qr', label: 'QR Code', icon: <QrCode className="w-5 h-5" /> },
                    ].map((m) => (
                      <motion.button
                        key={m.id}
                        type="button"
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                          paymentMethod === m.id
                            ? 'bg-blue-50/50 border-blue-600 text-blue-700 shadow-md'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMethod === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100'
                        }`}>
                          {m.icon}
                        </div>
                        <span className="font-black text-sm">{m.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {paymentMethod === 'card' && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-4"
                      >
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Card Number</label>
                          <input type="text" placeholder="**** **** **** ****" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Expiry</label>
                            <input type="text" placeholder="MM / YY" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">CVV</label>
                            <input type="password" placeholder="***" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'upi' && (
                      <motion.div
                        key="upi"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6"
                      >
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Enter UPI ID</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="username@upi" className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition" />
                          <button type="button" className="px-6 py-3.5 bg-slate-900 text-white font-black text-xs rounded-2xl hover:bg-slate-800 transition shadow-sm">VERIFY</button>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'qr' && (
                      <motion.div
                        key="qr"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col items-center text-center"
                      >
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-6 relative group">
                          <QrCode className="w-48 h-48 text-slate-800 transition-transform group-hover:scale-95" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-[2px] rounded-3xl">
                             <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">REFRESHING...</div>
                          </div>
                        </div>
                        <h4 className="font-black text-slate-900 mb-1">Scan & Pay</h4>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed">Open any UPI app like GPay, PhonePe, or Paytm <br/> to scan this QR code and pay ₹{grand}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6" />
                    <span className="font-black text-lg">Payment Summary</span>
                  </div>
                  <div className="space-y-2 text-sm font-bold text-blue-100">
                    <div className="flex justify-between"><span>Tickets ({form.adults}A + {form.children}C) × {form.ticketType.type}</span><span>₹{totalPrice}</span></div>
                    <div className="flex justify-between"><span>Convenience Fee</span><span>₹{fee}</span></div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-500">
                    <span className="font-black text-lg">Total</span>
                    <span className="text-3xl font-black">₹{grand}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4 mb-8">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm font-bold text-green-800">Your payment is secure and encrypted. Instant e-ticket after payment.</p>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep(3)}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl flex items-center gap-2 transition">
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={handleBookAndPay}
                    disabled={loading}
                    className="px-10 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-black rounded-2xl flex items-center gap-3 transition shadow-xl shadow-green-200">
                    {loading ? 'Processing...' : <>Confirm & Pay ₹{grand} <CheckCircle className="w-5 h-5" /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && confirmedTicket && (
              <motion.div 
                key="s5" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-10 border border-gray-100 text-center"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
                <p className="text-gray-500 mb-8">Your e-ticket has been booked successfully.</p>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-left mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-lg">E-Ticket</span>
                    <Ticket className="w-6 h-6 opacity-60" />
                  </div>
                  <div className="space-y-3 text-sm font-bold text-blue-100">
                    <div className="flex justify-between"><span>Ticket ID</span><span className="text-white">#{confirmedTicket.id}</span></div>
                    <div className="flex justify-between"><span>Name</span><span className="text-white">{confirmedTicket.visitor_name}</span></div>
                    <div className="flex justify-between"><span>Date</span><span className="text-white">{confirmedTicket.date}</span></div>
                    <div className="flex justify-between"><span>Time Slot</span><span className="text-white">{confirmedTicket.time_slot}</span></div>
                    <div className="flex flex-wrap gap-2 py-2">
                       {confirmedTicket.adults > 0 && <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{confirmedTicket.adults} Adult</span>}
                       {confirmedTicket.children > 0 && <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{confirmedTicket.children} Child</span>}
                       {confirmedTicket.students > 0 && <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{confirmedTicket.students} Student</span>}
                       {confirmedTicket.females > 0 && <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{confirmedTicket.females} Female</span>}
                       {confirmedTicket.seniors > 0 && <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{confirmedTicket.seniors} Senior</span>}
                       {confirmedTicket.foreigners > 0 && <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{confirmedTicket.foreigners} Foreigner</span>}
                    </div>
                    <div className="flex justify-between pt-3 border-t border-blue-500"><span>Total Paid</span><span className="text-white text-lg font-black">₹{grand}</span></div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">A copy will be sent to <span className="font-bold text-gray-700">{form.email}</span></p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => setIsModalOpen(true)}
                    className="px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 font-black rounded-2xl transition hover:bg-blue-50">
                    View Full Ticket
                  </button>
                  <button onClick={() => { setCurrentStep(1); setForm({ date: today, timeSlot: DEFAULT_SLOTS[0].time, adults: 1, children: 0, ticketType: TICKET_TYPES[0], name: '', email: '' }); setConfirmedTicket(null); }}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition shadow-xl shadow-blue-200">
                    Book Another Ticket
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right summary (hide on step 5) */}
        {currentStep < 5 && (
          <div className="lg:w-1/4">
            <SummaryCard />
          </div>
        )}
      </div>

      <TicketModal 
        ticket={confirmedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <MuseumSelector 
        isOpen={isMuseumModalOpen}
        onClose={() => setIsMuseumModalOpen(false)}
        onSelect={(museum) => setSelectedMuseum(museum)}
      />

      {/* Benefits Bar */}
      <div className="bg-white border-y border-gray-100 py-12 mb-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-blue-50 text-blue-600', title: 'Secure Booking', sub: 'Your data is safe' },
            { icon: <Zap className="w-8 h-8" />, color: 'bg-purple-50 text-purple-600', title: 'Instant Confirmation', sub: 'Get E-ticket instantly' },
            { icon: <Bot className="w-8 h-8" />, color: 'bg-indigo-50 text-indigo-600', title: 'Chatbot Support', sub: '24/7 help available' },
            { icon: <Languages className="w-8 h-8" />, color: 'bg-green-50 text-green-600', title: 'Multi-language', sub: 'Support for 10+ languages' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${b.color}`}>{b.icon}</div>
              <div>
                <h4 className="font-black text-gray-900">{b.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
