import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Ticket, Activity, Search, LayoutDashboard, Settings, LogOut, Bell, Menu, X, Bot, Calendar, ArrowUpRight, Eye, Ban, CheckCircle, Trash2, Plus, ShieldAlert, BarChart2, MessageSquare, Send, ChevronDown } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TicketModal from '../components/TicketModal';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [notifHistory, setNotifHistory] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyForm, setReplyForm] = useState({ status: 'open', admin_reply: '' });
  const [sendingReply, setSendingReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  // Notification Form State
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'info', target: 'all' });
  const [sendingNotif, setSendingNotif] = useState(false);

  // User Management State
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user' });

  // Graph Analysis State
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [graphType, setGraphType] = useState('hours'); // 'hours' or 'days'

  const [systemSettings, setSystemSettings] = useState({ default_capacity: 50, ticket_price: 500, booking_fee: 50, visitor_types: [] });
  const [savingSettings, setSavingSettings] = useState(false);

  // Seating Management State
  const [seatingDate, setSeatingDate] = useState(new Date().toISOString().split('T')[0]);
  const [daySlots, setDaySlots] = useState([]);
  const [isSeatingLoading, setIsSeatingLoading] = useState(false);
  const [isUpdatingSlots, setIsUpdatingSlots] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Route Guard: Only admin allowed
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized access. Admin only.');
      navigate('/');
    } else {
      fetchAllData();
    }

    // Set up real-time polling every 30 seconds
    const interval = setInterval(() => {
      fetchAllData(true); // Silent update
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async (silent = false) => {
    console.log(`Fetching admin data (${silent ? 'background' : 'initial'})...`);
    if (!silent) setLoading(true);
    
    try {
      const [statsRes, ticketsRes, usersRes, chatsRes, settingsRes, notifRes, supportRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/tickets'),
        api.get('/admin/users'),
        api.get('/admin/chat-logs'),
        api.get('/admin/settings'),
        api.get('/admin/notifications/history'),
        api.get('/admin/support'),
      ]);
      
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (ticketsRes.status === 'fulfilled') setTickets(ticketsRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      if (chatsRes.status === 'fulfilled') setChatLogs(chatsRes.value.data);
      if (notifRes.status === 'fulfilled') setNotifHistory(notifRes.value.data);
      if (supportRes.status === 'fulfilled') setSupportTickets(supportRes.value.data);
      if (settingsRes.status === 'fulfilled' && settingsRes.value.data) setSystemSettings(settingsRes.value.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
      if (!silent) toast.error('Failed to load admin data');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out');
    navigate('/login');
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSendingNotif(true);
    try {
      await api.post('/admin/notifications', notifForm);
      toast.success('Notification sent successfully!');
      setNotifForm({ title: '', message: '', type: 'info', target: 'all' });
      fetchAllData();
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setSendingNotif(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', createForm);
      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user' });
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleBlockUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/users/${userToBlock.id}/block`, { reason: blockReason });
      toast.success('User blocked successfully');
      setIsBlockModalOpen(false);
      setUserToBlock(null);
      setBlockReason('');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;
    try {
      await api.post(`/admin/users/${id}/unblock`);
      toast.success('User unblocked successfully');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to unblock user');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    setSendingReply(true);
    try {
      await api.post(`/admin/support/${selectedSupport.id}/update`, replyForm);
      toast.success('Reply sent & ticket updated!');
      setIsReplyModalOpen(false);
      setSelectedSupport(null);
      setReplyForm({ status: 'open', admin_reply: '' });
      fetchAllData();
    } catch (err) {
      toast.error('Failed to update support ticket');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteSupport = async (id) => {
    if (!window.confirm('Delete this support ticket permanently?')) return;
    try {
      await api.delete(`/admin/support/${id}`);
      toast.success('Ticket deleted');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await api.post('/admin/settings', systemSettings);
      toast.success('System settings saved securely!');
      fetchAllData();
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchSeatingData = async (date) => {
    setIsSeatingLoading(true);
    try {
      const res = await api.get(`/admin/slots?date=${date}`);
      setDaySlots(res.data);
    } catch (err) {
      toast.error('Failed to load slots for this date');
    } finally {
      setIsSeatingLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Seating & Pricing') {
      fetchSeatingData(seatingDate);
    }
  }, [activeTab, seatingDate]);

  const handleUpdateSlots = async () => {
    setIsUpdatingSlots(true);
    try {
      await api.post('/admin/slots/bulk-update', { slots: daySlots });
      toast.success('Seating and pricing updated for this day!');
      fetchSeatingData(seatingDate);
    } catch (err) {
      toast.error('Failed to update slots');
    } finally {
      setIsUpdatingSlots(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Admin Console...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'Notifications':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Create New Notification</h3>
               <form onSubmit={handleSendNotification} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Title</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500/10"
                      value={notifForm.title}
                      onChange={(e) => setNotifForm({...notifForm, title: e.target.value})}
                      placeholder="e.g. System Maintenance"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                    <textarea 
                      required
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-500/10 h-32 resize-none"
                      value={notifForm.message}
                      onChange={(e) => setNotifForm({...notifForm, message: e.target.value})}
                      placeholder="Enter detailed message..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Type</label>
                        <select 
                          className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none"
                          value={notifForm.type}
                          onChange={(e) => setNotifForm({...notifForm, type: e.target.value})}
                        >
                           <option value="info">Information</option>
                           <option value="alert">Alert / Warning</option>
                           <option value="success">Success / Event</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Audience</label>
                        <select 
                          className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none"
                          value={notifForm.target}
                          onChange={(e) => setNotifForm({...notifForm, target: e.target.value})}
                        >
                           <option value="all">Broadcast (All Users)</option>
                           {users.map(u => (
                             <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                           ))}
                        </select>
                     </div>
                  </div>
                  <button 
                    disabled={sendingNotif}
                    className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                  >
                    {sendingNotif ? 'Sending...' : 'Send Notification Now'}
                  </button>
               </form>
            </div>

            <div className="space-y-6">
               <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white">
                  <Bell className="w-10 h-10 mb-4 opacity-50" />
                  <h4 className="text-lg font-black mb-2">Notification Tips</h4>
                  <ul className="text-xs text-blue-100 font-medium space-y-3 list-disc ml-4">
                     <li>Broadcast messages reach every registered user.</li>
                     <li>Use "Alert" for important system updates.</li>
                     <li>"Success" is great for new museum exhibition announcements.</li>
                     <li>Targeting specific users is useful for personalized reminders.</li>
                  </ul>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-50">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Broadcasts & Alerts</h4>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto p-2">
                    {notifHistory.length === 0 ? (
                      <p className="p-4 text-xs font-bold text-slate-400 text-center">No notifications sent yet.</p>
                    ) : (
                      notifHistory.map(notif => (
                        <div key={notif.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-xl">
                           <div className="flex justify-between items-start mb-1">
                              <h5 className="text-sm font-black text-slate-800">{notif.title}</h5>
                              <span className="text-[10px] font-bold text-slate-400">{new Date(notif.created_at).toLocaleDateString()}</span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-3">{notif.message}</p>
                           <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${notif.type === 'alert' ? 'bg-amber-50 text-amber-600' : notif.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                 {notif.type}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                 Audience: {notif.user_id ? '1 User' : 'Broadcast'}
                              </span>
                              <span className="text-[10px] font-black text-indigo-600 ml-auto bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1">
                                 <Users className="w-3 h-3" /> Reached {notif.reach} User{notif.reach !== 1 ? 's' : ''}
                              </span>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
               </div>
            </div>
          </div>
        );
      case 'Tickets':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">All Tickets ({tickets.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Visitor</th>
                    <th className="px-8 py-4">Slot</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Price</th>
                    <th className="px-8 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-800">{t.visitor_name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{t.visitor_email}</p>
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-slate-600">{t.date} | {t.time_slot}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          t.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">₹{t.total_price}</td>
                      <td className="px-8 py-5 text-center">
                        <button 
                          onClick={() => {
                            setSelectedTicket(t);
                            setIsTicketModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Ticket"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Users':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Platform Users ({users.length})</h3>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Email</th>
                    <th className="px-8 py-4">Role / Status</th>
                    <th className="px-8 py-4 text-center">Last Visit</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-5 font-black text-slate-800 text-sm">{u.name}</td>
                      <td className="px-8 py-5 text-sm text-slate-600">{u.email}</td>
                      <td className="px-8 py-5">
                         <div className="flex flex-col gap-1 items-start">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                             {u.role}
                           </span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.status === 'blocked' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                             {u.status || 'active'}
                           </span>
                           {u.status === 'blocked' && (
                             <span className="text-[9px] text-red-400 font-bold max-w-[150px] truncate" title={u.block_reason}>Reason: {u.block_reason}</span>
                           )}
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center text-xs text-slate-500 font-bold">
                        {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-8 py-5 text-right flex justify-end gap-2">
                        {u.status === 'blocked' ? (
                          <button onClick={() => handleUnblockUser(u.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Unblock User">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setUserToBlock(u); setIsBlockModalOpen(true); }} 
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Block User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Chat Logs':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Live Chat Audit Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Message</th>
                    <th className="px-8 py-4">Sender</th>
                    <th className="px-8 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {chatLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-5 text-xs font-black text-slate-800">{log.user?.name || 'Guest'}</td>
                      <td className="px-8 py-5 text-xs text-slate-600 italic max-w-xs truncate" title={log.message}>"{log.message}"</td>
                      <td className="px-8 py-5 text-center">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${log.sender === 'bot' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                           {log.sender}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-[10px] text-slate-400 font-bold">{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Seating & Pricing':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Seating & Dynamic Pricing</h3>
                    <p className="text-xs font-bold text-slate-400">Configure how many seats are available and the ticket price for each individual time slot.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <input 
                      type="date" 
                      value={seatingDate}
                      onChange={(e) => setSeatingDate(e.target.value)}
                      className="bg-transparent font-black text-slate-800 outline-none"
                    />
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <tr>
                       <th className="px-6 py-4">Time Slot</th>
                       <th className="px-6 py-4 text-center">Booked</th>
                       <th className="px-6 py-4">Total Capacity</th>
                       <th className="px-6 py-4">Price (₹)</th>
                       <th className="px-6 py-4 text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {isSeatingLoading ? (
                       <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-bold">Loading slots...</td></tr>
                     ) : daySlots.map((slot, idx) => (
                       <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-5 font-black text-slate-700">{slot.time_slot}</td>
                         <td className="px-6 py-5 text-center">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{slot.booked} Seats</span>
                         </td>
                         <td className="px-6 py-5">
                            <input 
                              type="number" 
                              value={slot.capacity}
                              onChange={(e) => {
                                const newSlots = [...daySlots];
                                newSlots[idx].capacity = e.target.value;
                                setDaySlots(newSlots);
                              }}
                              className="w-24 bg-slate-50 p-2 rounded-xl border border-slate-100 font-bold outline-none focus:bg-white"
                            />
                         </td>
                         <td className="px-6 py-5">
                            <input 
                              type="number" 
                              value={slot.price}
                              onChange={(e) => {
                                const newSlots = [...daySlots];
                                newSlots[idx].price = e.target.value;
                                setDaySlots(newSlots);
                              }}
                              className="w-32 bg-slate-50 p-2 rounded-xl border border-slate-100 font-bold outline-none focus:bg-white"
                            />
                         </td>
                         <td className="px-6 py-5 text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${slot.booked >= slot.capacity ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                               {slot.booked >= slot.capacity ? 'Sold Out' : 'Available'}
                            </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>

               <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleUpdateSlots}
                    disabled={isUpdatingSlots}
                    className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingSlots ? 'Updating...' : 'Save Configuration for this Day'}
                  </button>
               </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                     <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-xs">Visitor Category Multipliers</h3>
               </div>
               <p className="text-slate-400 text-sm mb-8">Define how different types of visitors are charged. (e.g. Students get 50% off).</p>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { type: 'Adult', multiplier: 1.0, color: 'border-blue-500' },
                    { type: 'Student', multiplier: 0.5, color: 'border-emerald-500' },
                    { type: 'Senior Citizen', multiplier: 0.7, color: 'border-amber-500' },
                    { type: 'Foreigner', multiplier: 2.0, color: 'border-purple-500' },
                  ].map((cat, i) => (
                    <div key={i} className={`bg-white/5 p-6 rounded-2xl border-l-4 ${cat.color}`}>
                       <h5 className="text-sm font-black mb-1">{cat.type}</h5>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Price: {cat.multiplier}x Base</p>
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Rate:</span>
                          <span className="text-sm font-black text-white">{cat.multiplier * 100}%</span>
                       </div>
                    </div>
                  ))}
               </div>
               <p className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">* These categories are applied automatically during the checkout process.</p>
            </div>
          </div>
        );
      case 'Support & Feedback': {
        const statusColors = {
          open: 'bg-red-50 text-red-600',
          in_progress: 'bg-amber-50 text-amber-600',
          resolved: 'bg-emerald-50 text-emerald-600',
          closed: 'bg-slate-100 text-slate-500',
        };
        return (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Tickets', value: supportTickets.length, color: 'text-slate-700', bg: 'bg-white' },
                { label: 'Open', value: supportTickets.filter(t => t.status === 'open').length, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'In Progress', value: supportTickets.filter(t => t.status === 'in_progress').length, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Resolved', value: supportTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-6 rounded-[2rem] border border-slate-100 shadow-sm`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                  <h3 className={`text-3xl font-black ${s.color}`}>{s.value}</h3>
                </div>
              ))}
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Support Inbox ({supportTickets.length})</h3>
              </div>
              {supportTickets.length === 0 ? (
                <div className="p-16 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold text-sm">No support tickets yet</p>
                  <p className="text-slate-300 text-xs mt-1">Support & feedback submitted by users will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-4">User</th>
                        <th className="px-8 py-4">Subject</th>
                        <th className="px-8 py-4">Message</th>
                        <th className="px-8 py-4 text-center">Status</th>
                        <th className="px-8 py-4">Submitted</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {supportTickets.map(st => (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <p className="text-sm font-black text-slate-800">{st.user_name || 'Anonymous'}</p>
                            <p className="text-[10px] font-bold text-slate-400">{st.user_email || '—'}</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-bold text-slate-700 max-w-[180px] truncate" title={st.subject}>{st.subject}</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-xs text-slate-500 max-w-[220px] truncate italic" title={st.message}>"{st.message}"</p>
                            {st.admin_reply && (
                              <p className="text-[10px] text-blue-500 font-bold mt-1 truncate max-w-[220px]" title={st.admin_reply}>↳ {st.admin_reply}</p>
                            )}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusColors[st.status] || 'bg-slate-100 text-slate-500'}`}>
                              {st.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-[10px] text-slate-400 font-bold">
                            {new Date(st.created_at).toLocaleString()}
                          </td>
                          <td className="px-8 py-5 text-right flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedSupport(st);
                                setReplyForm({ status: st.status, admin_reply: st.admin_reply || '' });
                                setIsReplyModalOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Reply & Update"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSupport(st.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Ticket"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      }
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Paid Bookings', value: stats?.totalBookings || 0, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => { 
                      const typeMap = {
                        'Paid Bookings': 'bookings',
                        'Total Revenue': 'revenue',
                        'Registered Users': 'users',
                        'System Health': 'health'
                      };
                      setGraphType(typeMap[stat.label]); 
                      setIsGraphModalOpen(true); 
                    }}
                    className={`p-2 opacity-0 group-hover:opacity-100 rounded-xl transition-all ${
                      stat.label === 'Paid Bookings' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' :
                      stat.label === 'Total Revenue' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                      stat.label === 'Registered Users' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' :
                      'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }`}
                    title={`Analyze ${stat.label}`}
                  >
                    <BarChart2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Transactions</h3>
                  <button onClick={() => setActiveTab('Tickets')} className="text-blue-600 text-xs font-black hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-4">Visitor</th>
                        <th className="px-8 py-4">Slot</th>
                        <th className="px-8 py-4 text-right">Amount</th>
                        <th className="px-8 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats?.recentTickets?.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <p className="text-sm font-black text-slate-800">{t.visitor_name}</p>
                            <p className="text-[10px] font-bold text-slate-400">ID: #{t.id}</p>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-slate-300" />
                              <span className="text-xs font-bold text-slate-600">{t.date}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">
                            ₹{t.total_price}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              t.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Peak Hours</h3>
                    <button 
                      onClick={() => { setGraphType('hours'); setIsGraphModalOpen(true); }}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <BarChart2 className="w-3 h-3" /> Analyze Graph
                    </button>
                  </div>
                  <div className="space-y-6">
                    {stats?.popularSlots?.map((slot, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-600">{slot.time_slot}</span>
                          <span className="text-xs font-black text-slate-900">{slot.count} Bookings</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats?.totalBookings ? (slot.count / stats.totalBookings) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Peak Days</h3>
                    <button 
                      onClick={() => { setGraphType('days'); setIsGraphModalOpen(true); }}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <BarChart2 className="w-3 h-3" /> Analyze Graph
                    </button>
                  </div>
                  <div className="space-y-6">
                    {stats?.popularDays?.map((day, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-600">{day.day}</span>
                          <span className="text-xs font-black text-slate-900">{day.count} Bookings</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats?.totalBookings ? (day.count / stats.totalBookings) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className={`bg-[#0f172a] text-slate-300 w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="font-black tracking-tighter text-xl">ADMIN PANEL</span>
          </div>

          <nav className="space-y-1">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Tickets', icon: Ticket },
              { label: 'Users', icon: Users },
              { label: 'Seating & Pricing', icon: Activity },
              { label: 'Chat Logs', icon: Bot },
              { label: 'Support & Feedback', icon: MessageSquare, badge: supportTickets.filter(t => t.status === 'open').length },
              { label: 'Notifications', icon: Bell },
              { label: 'Settings', icon: Settings },
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.label ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 outline-none w-64 transition-all" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Updates</span>
             </div>
             <button onClick={() => fetchAllData()} title="Refresh Data" className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
               <Activity className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-black text-slate-900">{user.name}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                   {user.name?.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900">{activeTab} Console</h2>
            <p className="text-slate-500 text-sm font-medium">Manage and monitor {activeTab.toLowerCase()} effectively.</p>
          </div>

          {renderContent()}
        </div>
      </main>

      <TicketModal 
        ticket={selectedTicket}
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />

      {/* User Block Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBlockModalOpen(false)} />
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 text-amber-600">
                <ShieldAlert className="w-8 h-8" />
                <h3 className="text-xl font-black text-slate-900">Block User</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to block <strong className="text-slate-800">{userToBlock?.name}</strong>? They will be denied login access.</p>
              <form onSubmit={handleBlockUserSubmit}>
                <div className="mb-6">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Reason</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors resize-none h-24"
                    placeholder="Enter reason for blocking..."
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsBlockModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 text-sm font-black text-white bg-amber-600 hover:bg-amber-700 rounded-2xl transition-colors shadow-lg shadow-amber-200">Block User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">Add New User</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Name</label>
                  <input type="text" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" required value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors" placeholder="Email Address" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Password</label>
                  <input type="password" required minLength="6" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors" placeholder="Minimum 6 characters" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Role</label>
                  <select value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors shadow-lg shadow-blue-200 mt-4">Create Account</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Graph Analysis Modal */}
      {isGraphModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsGraphModalOpen(false)} />
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    graphType === 'hours' || graphType === 'bookings' ? 'bg-blue-50 text-blue-600' : 
                    graphType === 'days' || graphType === 'revenue' ? 'bg-emerald-50 text-emerald-600' : 
                    graphType === 'users' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {graphType === 'hours' ? 'Peak Hours Analysis' : 
                       graphType === 'days' ? 'Peak Days Analysis' : 
                       graphType === 'revenue' ? 'Revenue Growth Analysis' :
                       graphType === 'bookings' ? 'Booking Volume Analysis' :
                       graphType === 'users' ? 'User Growth Analysis' :
                       'System Performance Analysis'}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {graphType === 'revenue' ? 'Daily revenue breakdown' : 
                       graphType === 'bookings' ? 'Daily ticket sales volume' :
                       graphType === 'users' ? 'Daily registration metrics' :
                       graphType === 'health' ? 'System uptime & reliability' :
                       'Visualizing booking trends'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsGraphModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <Bar 
                  data={{
                    labels: graphType === 'hours' 
                      ? stats?.popularSlots?.map(s => s.time_slot) 
                      : graphType === 'days'
                        ? stats?.popularDays?.map(d => d.day)
                        : graphType === 'revenue'
                          ? stats?.revenueTrends?.map(r => r.date)
                          : graphType === 'bookings'
                            ? stats?.bookingTrends?.map(b => b.date)
                            : graphType === 'users'
                              ? stats?.userTrends?.map(u => u.date)
                              : stats?.healthTrends?.map(h => h.date),
                    datasets: [
                      {
                        label: graphType === 'revenue' ? 'Revenue (₹)' : 
                               graphType === 'bookings' ? 'Bookings' :
                               graphType === 'users' ? 'New Users' :
                               graphType === 'health' ? 'Uptime (%)' :
                               'Total Bookings',
                        data: graphType === 'hours' 
                          ? stats?.popularSlots?.map(s => s.count) 
                          : graphType === 'days'
                            ? stats?.popularDays?.map(d => d.count)
                            : graphType === 'revenue'
                              ? stats?.revenueTrends?.map(r => r.revenue)
                              : graphType === 'bookings'
                                ? stats?.bookingTrends?.map(b => b.count)
                                : graphType === 'users'
                                  ? stats?.userTrends?.map(u => u.count)
                                  : stats?.healthTrends?.map(h => h.health),
                        backgroundColor: 
                          (graphType === 'hours' || graphType === 'bookings') ? 'rgba(37, 99, 235, 0.8)' : 
                          (graphType === 'days' || graphType === 'revenue') ? 'rgba(16, 185, 129, 0.8)' : 
                          graphType === 'users' ? 'rgba(79, 70, 229, 0.8)' :
                          'rgba(245, 158, 11, 0.8)',
                        borderRadius: 8,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, family: 'Inter', weight: 'bold' },
                        bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
                        padding: 12,
                        cornerRadius: 12,
                        displayColors: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { font: { family: 'Inter', weight: 'bold' } },
                        grid: { color: 'rgba(241, 245, 249, 1)' },
                        border: { display: false }
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter', weight: 'bold' } },
                        border: { display: false }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Reply Modal */}
      {isReplyModalOpen && selectedSupport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsReplyModalOpen(false)} />
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Reply to Ticket</h3>
                    <p className="text-xs text-slate-400 font-bold">#{selectedSupport.id} · {selectedSupport.user_name || 'Anonymous'}</p>
                  </div>
                </div>
                <button onClick={() => setIsReplyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Original Message */}
              <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</p>
                <p className="text-sm font-bold text-slate-800 mb-4">{selectedSupport.subject}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedSupport.message}</p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Update Status</label>
                  <select
                    value={replyForm.status}
                    onChange={e => setReplyForm({...replyForm, status: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-blue-600 transition-colors font-bold text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Admin Reply (optional)</label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-600 transition-colors resize-none font-medium text-sm"
                    placeholder="Write your response to the user..."
                    value={replyForm.admin_reply}
                    onChange={e => setReplyForm({...replyForm, admin_reply: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsReplyModalOpen(false)} className="flex-1 py-4 text-sm font-black text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-200">
                    Cancel
                  </button>
                  <button type="submit" disabled={sendingReply} className="flex-1 py-4 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
