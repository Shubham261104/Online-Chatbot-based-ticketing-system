import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin, Download, CheckCircle, Activity, Users, DollarSign, ArrowUpRight, Zap, XCircle, Info, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../api/api';
import { toast } from 'react-toastify';
import TicketModal from '../components/TicketModal';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [lookup, setLookup] = useState({ id: '', email: '' });
  const [searching, setSearching] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Explorer"}');
  const token = localStorage.getItem('token');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [activeTab, setActiveTab] = useState('Today');
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTickets = tickets.filter(t => t.date === todayStr && t.status === 'paid');
  const upcomingTickets = tickets.filter(t => t.date > todayStr && t.status === 'paid');
  const historyTickets = tickets.filter(t => t.date < todayStr || t.status === 'cancelled' || t.status === 'refunded');

  const filteredTickets = activeTab === 'Today' ? todayTickets : activeTab === 'Upcoming' ? upcomingTickets : historyTickets;

  const cancellationReasons = [
    { label: 'Change of Plans', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Health Issues', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Travel Difficulties', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Booked by Mistake', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Personal Emergency', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Other Reason', icon: CheckCircle, color: 'text-slate-500', bg: 'bg-slate-50' }
  ];

  const [additionalNote, setAdditionalNote] = useState('');
  const [showRewardsInfo, setShowRewardsInfo] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Handled by interceptor, but we can clear state here
        setTickets([]);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
      
      // Polling for real-time updates every 10 seconds
      const interval = setInterval(() => {
        fetchHistory();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [token]);

  const handleCancel = async (ticketId, reason) => {
    try {
      const finalReason = additionalNote ? `${reason}: ${additionalNote}` : reason;
      const res = await api.post(`/tickets/${ticketId}/cancel`, { reason: finalReason });
      toast.success(res.data.message || 'Ticket cancelled successfully');
      setIsCancelModalOpen(false);
      setCancelReason('');
      setAdditionalNote('');
      fetchHistory(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      // In a real app, we'd have a specific lookup endpoint. 
      // For now, we'll search in all tickets if admin or just handle guest view.
      // We'll simulate finding it from the backend if it exists.
      const res = await api.get('/admin/tickets'); // Using admin route for lookup simulation
      const ticket = res.data.find(t => t.id == lookup.id && t.visitor_email.toLowerCase() === lookup.email.toLowerCase());
      if (ticket) {
        setTickets([ticket]);
        toast.success('Ticket found!');
      } else {
        toast.error('No ticket found with these details.');
      }
    } catch (err) {
      toast.error('Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const stats = [
    { label: 'Total Visits', value: historyTickets.filter(t => t.status === 'paid').length + todayTickets.length, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Upcoming', value: upcomingTickets.length, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Guest Tickets', value: token ? 'Member' : 'Guest', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Reward Points', value: (historyTickets.filter(t => t.status === 'paid').length + todayTickets.length) * 45, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', help: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
               {token ? `Welcome back, ${user.name}` : 'My Bookings'}
             </h1>
             <p className="text-slate-500 font-medium italic">
               {token ? 'Manage your cultural exploration from one place.' : 'Track your museum tickets and visit details.'}
             </p>
           </div>
           {!token && (
             <form onSubmit={handleLookup} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
               <input 
                 type="text" placeholder="Ticket ID" required
                 value={lookup.id} onChange={e => setLookup({...lookup, id: e.target.value})}
                 className="px-4 py-2 bg-slate-50 rounded-xl outline-none text-sm font-bold w-24" 
               />
               <input 
                 type="email" placeholder="Email Address" required
                 value={lookup.email} onChange={e => setLookup({...lookup, email: e.target.value})}
                 className="px-4 py-2 bg-slate-50 rounded-xl outline-none text-sm font-bold" 
               />
               <Button type="submit" size="sm" isLoading={searching}>
                 Lookup
               </Button>
             </form>
           )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <Card key={i} className="flex items-center gap-5 p-6 border-none shadow-sm relative group">
               <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
                  <s.icon className="h-7 w-7" />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    {s.help && (
                      <button 
                        onClick={() => setShowRewardsInfo(true)}
                        className="p-1 hover:bg-indigo-50 rounded-lg text-indigo-400 hover:text-indigo-600 transition-all active:scale-90"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{s.value}</h3>
               </div>
               {s.help && (
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">CLICK INFO</span>
                 </div>
               )}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900">Your Tickets</h2>
              
              {/* Tab Navigation */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                {['Today', 'Upcoming', 'History'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                      activeTab === tab
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                    {tab === 'Today' && todayTickets.length > 0 && (
                      <span className="ml-2 bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">
                        {todayTickets.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {filteredTickets.length > 0 ? (
               <div className="space-y-4">
                  {filteredTickets.map(t => (
                     <Card key={t.id} className="p-4 flex items-center justify-between hover:border-blue-100 group transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                             activeTab === 'Today' ? 'bg-blue-50 text-blue-600' : 
                             activeTab === 'Upcoming' ? 'bg-emerald-50 text-emerald-600' :
                             'bg-slate-50 text-slate-400'
                           }`}>
                              <Ticket className="h-6 w-6" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-bold text-slate-800 tracking-tight">{t.event_name || 'Museum Entry Ticket'}</h4>
                                {t.date === todayStr && t.status === 'paid' && (
                                  <span className="bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Active Now</span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID: #{t.id}</span>
                                <Calendar className="h-3 w-3" /> {t.date} • {t.time_slot}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="hidden sm:block text-right pr-8 border-r border-slate-50">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                t.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                                t.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                'bg-amber-50 text-amber-600'
                              }`}>
                                {t.status}
                              </span>
                           </div>
                           <div className="flex items-center gap-3">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setSelectedTicket(t);
                                 setIsModalOpen(true);
                               }}
                             >
                               <Eye className="w-4 h-4" /> View
                             </Button>
                             {['paid'].includes(t.status) && t.date >= todayStr && (
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setTicketToCancel(t.id);
                                   setIsCancelModalOpen(true);
                                 }}
                               >
                                 <XCircle className="w-4 h-4" /> Cancel
                               </Button>
                             )}
                             <Button variant="ghost" size="sm" className="p-2" onClick={(e) => { e.stopPropagation(); toast.info('Download feature coming soon!'); }}>
                               <Download className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                             </Button>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            ) : (
               <Card className="py-20 text-center border-dashed border-2 bg-transparent">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Ticket className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">No {activeTab} Tickets</h3>
                  <p className="text-slate-400 font-bold mb-6 italic">
                    {activeTab === 'Today' ? "You don't have any visits scheduled for today." :
                     activeTab === 'Upcoming' ? "No future visits planned yet. Ready for an adventure?" :
                     "Your past booking history is empty."}
                  </p>
                  <Button size="sm" onClick={() => window.location.href='/booking'} className="shadow-lg shadow-blue-100">Book New Ticket</Button>
               </Card>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-6">
             <h2 className="text-2xl font-black text-slate-900">Explore More</h2>
             <Card className="bg-blue-600 border-none p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 transform translate-x-1/3 -translate-y-1/3 opacity-10 group-hover:scale-125 transition-transform duration-700">
                   <Zap className="w-48 h-48" />
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight">Join as a <br />Member</h3>
                <p className="text-blue-100/70 text-sm mb-10 relative z-10 leading-relaxed font-medium italic">Save your tickets permanently, get exclusive access, and skip the lines.</p>
                <Button variant="secondary" onClick={() => window.location.href='/register'} className="w-full relative z-10 font-black shadow-none border-none">Sign Up Now</Button>
             </Card>
             
             <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800">Support Chat</h3>
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium italic">Our AI Guide is ready to help you with your next booking.</p>
                <Button variant="ghost" className="w-full text-xs" onClick={() => window.location.href='/chat'}>Open Concierge</Button>
             </Card>
          </div>
        </div>
      </div>
      <TicketModal 
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Rewards Info Modal */}
      <AnimatePresence>
        {showRewardsInfo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowRewardsInfo(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Reward Points</h3>
                    <p className="text-slate-500 font-medium text-sm">How to earn and redeem your points</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    { label: 'Complete a Visit', points: '+45', sub: 'Earned after your ticket is verified at the museum', icon: CheckCircle },
                    { label: 'Book Premium/VIP', points: '+25', sub: 'Bonus points for choosing premium experiences', icon: Zap },
                    { label: 'Write a Review', points: '+20', sub: 'Share your museum experience with others', icon: Info },
                    { label: 'Invite Friends', points: '+100', sub: 'Points for every friend who books their first ticket', icon: Users },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                      </div>
                      <span className="text-sm font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-50 shadow-sm">{item.points}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200" 
                  onClick={() => setShowRewardsInfo(false)}
                >
                  Got It, Thanks!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Reason Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsCancelModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 leading-none">Cancel Ticket</h3>
                      <p className="text-slate-500 font-medium text-sm mt-1">Select a reason to proceed with refund</p>
                    </div>
                  </div>
                  <button onClick={() => setIsCancelModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <XCircle className="w-6 h-6 text-slate-300" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {cancellationReasons.map((r) => (
                    <button 
                      key={r.label}
                      onClick={() => setCancelReason(r.label)}
                      className={`group p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                        cancelReason === r.label 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`w-10 h-10 ${r.bg} ${r.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <r.icon className="w-5 h-5" />
                        </div>
                        <span className={`font-bold text-sm ${cancelReason === r.label ? 'text-red-600' : 'text-slate-600'}`}>
                          {r.label}
                        </span>
                      </div>
                      {cancelReason === r.label && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {cancelReason && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Additional Note (Optional)</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-200 transition-all text-sm font-medium h-24 resize-none"
                      placeholder="Tell us more about why you are cancelling..."
                      value={additionalNote}
                      onChange={(e) => setAdditionalNote(e.target.value)}
                    />
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <button 
                    className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100" 
                    onClick={() => setIsCancelModalOpen(false)}
                  >
                    Keep Ticket
                  </button>
                  <Button 
                    className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-lg shadow-red-200 active:scale-95 transition-all" 
                    onClick={() => handleCancel(ticketToCancel, cancelReason)}
                    disabled={!cancelReason}
                  >
                    Confirm Cancellation
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sparkles = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default Dashboard;
