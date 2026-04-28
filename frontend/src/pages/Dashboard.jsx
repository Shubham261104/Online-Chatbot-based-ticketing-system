import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin, Download, CheckCircle, Activity, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../api/api';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Explorer"}');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data);
      } catch (err) {}
    };
    fetchHistory();
  }, []);

  const stats = [
    { label: 'Total Visits', value: tickets.length, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Upcoming', value: tickets.filter(t => t.status === 'paid').length, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg Guest', value: '2.4', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Points', value: '450', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome back, {user.name}</h1>
           <p className="text-slate-500 font-medium italic">Manage your cultural exploration from one place.</p>
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
            <h2 className="text-2xl font-black text-slate-900">Recent Activity</h2>
            {tickets.length > 0 ? (
               <div className="space-y-4">
                  {tickets.map(t => (
                     <Card key={t._id} className="p-4 flex items-center justify-between hover:border-primary-100 group transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                              <Ticket className="h-6 w-6" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 tracking-tight">Museum General Entry</h4>
                              <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
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
                           <Button variant="ghost" size="sm" className="p-2"><Download className="h-5 w-5" /></Button>
                        </div>
                     </Card>
                  ))}
               </div>
            ) : (
               <Card className="py-20 text-center border-dashed border-2 bg-transparent">
                  <Ticket className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold mb-4 italic">You haven't visited any exhibition yet.</p>
                  <Button size="sm" onClick={() => window.location.href='/booking'}>Make Your First Booking</Button>
               </Card>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-6">
             <h2 className="text-2xl font-black text-slate-900">Explore More</h2>
             <Card className="bg-primary-600 border-none p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 transform translate-x-1/3 -translate-y-1/3 opacity-10 group-hover:scale-125 transition-transform duration-700">
                   <Sparkles className="w-48 h-48" />
                </div>
                <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight">Become a <br />Royal Member</h3>
                <p className="text-slate-100/70 text-sm mb-10 relative z-10 leading-relaxed font-medium italic">Unlimited access, private viewings, and exclusive artifacts narrated by Premium AI.</p>
                <Button variant="secondary" className="w-full relative z-10 font-black shadow-none border-none">Upgrade Now</Button>
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
    </div>
  );
};

const Sparkles = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default Dashboard;
