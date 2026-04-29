import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, CreditCard, CheckCircle, ArrowLeft, Info, Ticket, Landmark, ShieldCheck, Zap, Star } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';
import TicketModal from '../components/TicketModal';

export default function EventBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    adults: 1,
    children: 0,
    name: '',
    email: '',
  });
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!event) {
      toast.error('Please select an event first.');
      navigate('/shows');
    }
  }, [event, navigate]);

  if (!event) return null;

  const totalPrice = (form.adults * event.price) + (form.children * (event.price / 2));
  const fee = 30;
  const grand = totalPrice + fee;

  const handleBook = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login first to book tickets!');
      navigate('/login?redirect=/shows');
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/book-ticket', {
        date: event.startDate,
        timeSlot: event.time,
        adults: form.adults,
        children: form.children,
        name: form.name,
        email: form.email,
        event_name: event.title,
        total_price: grand
      });

      const ticket = res.data.ticket;
      
      // Simulate payment
      await api.post('/payment', {
        ticket_id: ticket.id,
        amount: grand,
        payment_status: 'successful',
        method: 'simulated',
        transaction_id: res.data.razorpay_order_id,
      });

      setConfirmedTicket({ ...ticket, orderId: res.data.razorpay_order_id });
      setStep(3);
      toast.success('Event booking confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Book Your Spot</h2>
                  <p className="text-gray-500 mb-10">Secure your tickets for <span className="text-blue-600 font-bold">{event.title}</span></p>

                  <div className="space-y-6 mb-10">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-black text-slate-900">Adult Tickets</p>
                        <p className="text-xs text-gray-400 font-bold">₹{event.price} per person</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setForm({...form, adults: Math.max(1, form.adults - 1)})} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-black hover:bg-blue-600 hover:text-white transition-all">−</button>
                        <span className="text-xl font-black w-6 text-center">{form.adults}</span>
                        <button onClick={() => setForm({...form, adults: form.adults + 1})} className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">+</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-black text-slate-900">Child Tickets</p>
                        <p className="text-xs text-gray-400 font-bold">₹{event.price/2} per child (Age 3-17)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setForm({...form, children: Math.max(0, form.children - 1)})} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-black hover:bg-blue-600 hover:text-white transition-all">−</button>
                        <span className="text-xl font-black w-6 text-center">{form.children}</span>
                        <button onClick={() => setForm({...form, children: form.children + 1})} className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold" />
                    <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold" />
                  </div>

                  <button onClick={() => setStep(2)} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                    Continue to Payment <Zap className="w-5 h-5 fill-current" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Final Step</h2>
                  <p className="text-gray-500 mb-10">Confirm details and pay for your event ticket</p>

                  <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 text-white mb-10 shadow-2xl">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                           <Star className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter">Event Ticket</span>
                     </div>
                     <div className="space-y-3 text-blue-100 font-bold mb-8">
                        <div className="flex justify-between"><span>Event</span><span className="text-white">{event.title}</span></div>
                        <div className="flex justify-between"><span>Visitors</span><span className="text-white">{form.adults}A + {form.children}C</span></div>
                        <div className="flex justify-between"><span>Base Price</span><span className="text-white">₹{totalPrice}</span></div>
                        <div className="flex justify-between"><span>Booking Fee</span><span className="text-white">₹{fee}</span></div>
                     </div>
                     <div className="flex justify-between items-center pt-6 border-t border-white/10">
                        <span className="text-lg font-black uppercase tracking-widest text-blue-400">Total Amount</span>
                        <span className="text-4xl font-black">₹{grand}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-10">
                     <ShieldCheck className="w-6 h-6 text-emerald-600" />
                     <p className="text-sm font-bold text-emerald-800">Your payment is secured and your e-ticket will be generated instantly.</p>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all">Back</button>
                    <button onClick={handleBook} disabled={loading} className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                      {loading ? 'Processing...' : <>Confirm & Pay ₹{grand} <CheckCircle className="w-5 h-5" /></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && confirmedTicket && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] shadow-xl p-12 border border-gray-100 text-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-3">You're All Set! 🎉</h2>
                  <p className="text-gray-500 mb-10">Your event ticket for <span className="font-bold text-slate-900">{event.title}</span> has been confirmed.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setIsModalOpen(true)} className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all">View E-Ticket</button>
                    <button onClick={() => navigate('/dashboard')} className="px-10 py-5 border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all">My Dashboard</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Event Info */}
          <div>
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 sticky top-32">
               <div className="h-48 relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${event.tagColor} mb-2 inline-block`}>
                      {event.category}
                    </span>
                    <h3 className="text-xl font-black text-white">{event.title}</h3>
                  </div>
               </div>
               <div className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-black text-slate-900">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 text-amber-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                      <p className="text-sm font-black text-slate-900">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 text-indigo-600">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue</p>
                      <p className="text-sm font-black text-slate-900">{event.location}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
                     <Info className="w-5 h-5 text-gray-300" />
                     <p className="text-xs font-bold text-gray-400 leading-relaxed italic">{event.desc}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <TicketModal 
        ticket={confirmedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
