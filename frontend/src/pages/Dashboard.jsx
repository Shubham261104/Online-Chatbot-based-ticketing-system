import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin, Download, CheckCircle, Activity, Users, DollarSign, ArrowUpRight, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../api/api';
import { toast } from 'react-toastify';
import TicketModal from '../components/TicketModal';
import { Eye } from 'lucide-react';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [lookup, setLookup] = useState({ id: '', email: '' });
  const [searching, setSearching] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Explorer"}');
  const token = localStorage.getItem('token');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

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
    { label: 'Total Visits', value: tickets.length, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Upcoming', value: tickets.filter(t => t.status === 'paid').length, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Guest Tickets', value: token ? 'Member' : 'Guest', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Reward Points', value: '450', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
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
            <Card key={i} className="flex items-center gap-5 p-6 border-none shadow-sm">
               <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
                  <s.icon className="h-7 w-7" />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{s.value}</h3>
               </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Your Tickets</h2>
            {tickets.length > 0 ? (
               <div className="space-y-4">
                  {tickets.map(t => (
                     <Card key={t.id} className="p-4 flex items-center justify-between hover:border-blue-100 group transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Ticket className="h-6 w-6" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 tracking-tight">Museum Entry Ticket</h4>
                              <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID: #{t.id}</span>
                                <Calendar className="h-3 w-3" /> {t.date} • {t.time_slot}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="hidden sm:block text-right pr-8 border-r border-slate-50">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {t.status}
                              </span>
                           </div>
                           <div className="flex items-center gap-3">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                               onClick={() => {
                                 setSelectedTicket(t);
                                 setIsModalOpen(true);
                               }}
                             >
                               <Eye className="w-4 h-4" /> View Ticket
                             </Button>
                             <Button variant="ghost" size="sm" className="p-2" onClick={() => toast.info('Download feature coming soon!')}>
                               <Download className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                             </Button>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            ) : (
               <Card className="py-20 text-center border-dashed border-2 bg-transparent">
                  <Ticket className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold mb-4 italic">No tickets found.</p>
                  <Button size="sm" onClick={() => window.location.href='/booking'}>Book New Ticket</Button>
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
    </div>
  );
};

const Sparkles = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default Dashboard;
