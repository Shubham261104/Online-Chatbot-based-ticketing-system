import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Clock, CreditCard, CheckCircle, ChevronRight, ArrowLeft, Info, Ticket, Landmark, ShieldCheck, Zap, Bot, Languages, LogIn, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import TicketModal from '../components/TicketModal';

const TICKET_TYPES = [
  { type: 'General', adultPrice: 200, childPrice: 100, desc: 'Standard museum access' },
  { type: 'Premium', adultPrice: 400, childPrice: 200, desc: 'Includes guided tour' },
  { type: 'VIP', adultPrice: 800, childPrice: 400, desc: 'All-access + lounge' },
];

const DEFAULT_SLOTS = [
  { time: '09:00 AM - 10:30 AM', status: 'Available', remaining: 50 },
  { time: '10:30 AM - 12:00 PM', status: 'Available', remaining: 50 },
  { time: '12:00 PM - 01:30 PM', status: 'Available', remaining: 50 },
  { time: '01:30 PM - 03:00 PM', status: 'Available', remaining: 50 },
  { time: '03:00 PM - 04:30 PM', status: 'Available', remaining: 50 },
  { time: '04:30 PM - 06:00 PM', status: 'Available', remaining: 50 },
];

const statusColor = { Available: 'text-green-500', 'Few Tickets Left': 'text-orange-500', 'Sold Out': 'text-red-500' };

const steps = [
  { id: 1, name: 'Visit Details', sub: 'Date & Time', icon: <Calendar className="w-5 h-5" /> },
  { id: 2, name: 'Visitors', sub: 'Number of Tickets', icon: <Users className="w-5 h-5" /> },
  { id: 3, name: 'Ticket Type', sub: 'Category', icon: <Ticket className="w-5 h-5" /> },
  { id: 4, name: 'Payment', sub: 'Visitor Info & Pay', icon: <CreditCard className="w-5 h-5" /> },
  { id: 5, name: 'Confirmation', sub: 'E-Ticket', icon: <CheckCircle className="w-5 h-5" /> },
];

const today = new Date().toISOString().split('T')[0];

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (loggedUser.name) {
      setForm(prev => ({ ...prev, name: loggedUser.name, email: loggedUser.email }));
    }
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const [form, setForm] = useState({
    date: today,
    timeSlot: DEFAULT_SLOTS[0].time,
    adults: 1,
    children: 0,
    ticketType: TICKET_TYPES[0],
    name: '',
    email: '',
  });

  // Fetch real-time slot availability whenever date changes
  const fetchSlots = useCallback(async (date) => {
    setSlotsLoading(true);
    try {
      const res = await api.get(`/slots?date=${date}`);
      setSlots(res.data);
      // Auto-select first available slot if nothing is selected or current is sold out
      const firstAvail = res.data.find(s => s.status !== 'Sold Out');
      if (firstAvail && (!form.timeSlot || res.data.find(s => s.time === form.timeSlot)?.status === 'Sold Out')) {
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

  const totalPrice = form.adults * form.ticketType.adultPrice + form.children * form.ticketType.childPrice;
  const fee = 20;
  const grand = totalPrice + fee;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleBookAndPay = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login first to book tickets!');
      navigate('/login?redirect=/booking');
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
        name: form.name,
        email: form.email,
      });

      const ticket = bookRes.data.ticket;
      const orderId = bookRes.data.razorpay_order_id;

      // Step 2: Record simulated payment
      await api.post('/payment', {
        ticket_id: ticket.id,
        amount: grand,
        payment_status: 'successful',
        method: 'simulated',
        transaction_id: orderId,
      });

      setConfirmedTicket({ ...ticket, orderId });
      setCurrentStep(5);
      toast.success('Booking confirmed!');
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
        <div className="flex items-center gap-3"><Users className="w-4 h-4 text-gray-400" /><span>{form.adults} Adult{form.adults > 1 ? 's' : ''}{form.children > 0 ? `, ${form.children} Child${form.children > 1 ? 'ren' : ''}` : ''}</span></div>
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
          <div className="flex justify-between"><span>Tickets</span><span>₹{totalPrice}</span></div>
          <div className="flex justify-between"><span>Fee</span><span>₹{fee}</span></div>
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
        <button
          onClick={() => setCurrentStep(4)}
          className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200"
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col pt-24">
      <div className="max-w-7xl mx-auto px-6 w-full pt-10 mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Book Your Tickets</h1>
        <p className="text-gray-500 font-medium">Select your visit details and book your tickets in easy steps</p>
        {!isLoggedIn && <AuthBanner />}
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-8 mb-20">

        {/* Steps sidebar */}
        <div className="lg:w-1/4 space-y-3">
          {steps.map(step => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                currentStep === step.id
                  ? 'bg-white border-blue-100 shadow-lg shadow-blue-100/50 relative overflow-hidden'
                  : currentStep > step.id
                  ? 'bg-green-50 border-green-100 opacity-80'
                  : 'bg-white/50 border-transparent opacity-50'
              }`}
            >
              {currentStep === step.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                currentStep > step.id ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <div>
                <h4 className={`font-bold text-sm ${currentStep === step.id ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</h4>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">{step.sub}</p>
              </div>
              {currentStep === step.id && <ChevronRight className="ml-auto w-5 h-5 text-blue-600" />}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="lg:w-1/2">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {currentStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-1">1. Select Date & Time</h2>
                <p className="text-gray-500 mb-8">Choose your preferred visit date and time slot</p>

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
                      <button
                        key={i}
                        disabled={slot.status === 'Sold Out'}
                        onClick={() => set('timeSlot', slot.time)}
                        className={`p-5 rounded-2xl border text-left transition-all relative ${
                          form.timeSlot === slot.time
                            ? 'bg-white border-blue-600 shadow-xl ring-2 ring-blue-600 ring-offset-2'
                            : slot.status === 'Sold Out'
                            ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
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
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className={`text-[10px] font-bold ${statusColor[slot.status]}`}>{slot.status}</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400">{slot.remaining} left</span>
                        </div>
                      </button>
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
                <p className="text-gray-500 mb-8">Select how many adults and children will be visiting</p>

                {[{ label: 'Adults', key: 'adults', min: 1, note: '(Age 18+)' }, { label: 'Children', key: 'children', min: 0, note: '(Age 3-17, under 3 free)' }].map(({ label, key, min, note }) => (
                  <div key={key} className="flex items-center justify-between bg-gray-50 rounded-2xl p-6 mb-4">
                    <div>
                      <p className="font-black text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 font-medium">{note}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => set(key, Math.max(min, form[key] - 1))}
                        className="w-10 h-10 bg-white border border-gray-200 rounded-xl font-black text-xl text-gray-700 hover:border-blue-600 hover:text-blue-600 transition">−</button>
                      <span className="text-2xl font-black text-gray-900 w-6 text-center">{form[key]}</span>
                      <button onClick={() => set(key, form[key] + 1)}
                        className="w-10 h-10 bg-blue-600 rounded-xl font-black text-xl text-white hover:bg-blue-700 transition">+</button>
                    </div>
                  </div>
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

                <div className="space-y-4 mb-8">
                  {TICKET_TYPES.map(t => (
                    <button key={t.type} onClick={() => set('ticketType', t)}
                      className={`w-full p-6 rounded-2xl border text-left transition-all relative ${
                        form.ticketType.type === t.type
                          ? 'bg-white border-blue-600 shadow-xl ring-2 ring-blue-600 ring-offset-2'
                          : 'bg-gray-50 border-transparent hover:border-gray-200'
                      }`}>
                      {form.ticketType.type === t.type && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-gray-900">{t.type}</h4>
                          <p className="text-sm text-gray-500 mt-1">{t.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-blue-600 text-lg">₹{t.adultPrice}<span className="text-xs font-bold text-gray-400">/adult</span></p>
                          <p className="text-xs text-gray-400 font-bold">₹{t.childPrice}/child</p>
                        </div>
                      </div>
                    </button>
                  ))}
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
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-10 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
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
                    <div className="flex justify-between"><span>Adults</span><span className="text-white">{confirmedTicket.adults}</span></div>
                    <div className="flex justify-between"><span>Children</span><span className="text-white">{confirmedTicket.children}</span></div>
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
