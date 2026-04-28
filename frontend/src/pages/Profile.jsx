import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Edit3, Camera, LogOut, Ticket, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name":"Explorer","email":"visitor@museum.com"}'));
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: editForm.name, email: editForm.email };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const profileStats = [
    { label: 'Total Visits', value: '12', icon: <Ticket className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Member Since', value: '2024', icon: <Calendar className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Reward Points', value: '850', icon: <Star className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8"
        >
          <div className="h-48 bg-gradient-to-r from-museum-dark to-slate-800 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
             <button 
               onClick={() => toast.info('Cover photo update coming soon!')}
               className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all border border-white/10"
             >
                <Camera className="w-5 h-5" />
             </button>
          </div>
          
          <div className="px-10 pb-10 relative">
             <div className="flex flex-col md:flex-row md:items-end gap-8 -mt-16 mb-8">
                <div className="relative group cursor-pointer" onClick={() => toast.info('Profile picture update coming soon!')}>
                   <div className="w-32 h-32 bg-museum-gold rounded-[2.5rem] border-[6px] border-white flex items-center justify-center text-museum-dark text-4xl font-black shadow-2xl relative z-10">
                      {user.name.charAt(0)}
                   </div>
                   <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                   <div className="absolute bottom-2 right-2 z-20 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                      <Camera className="w-4 h-4" />
                   </div>
                </div>
                
                <div className="flex-grow">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{user.name}</h1>
                   <p className="text-slate-500 font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Cultural Explorer
                   </p>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-900/20"
                >
                   <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profileStats.map((stat, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:bg-white transition-all group">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${stat.color}`}>
                        {stat.icon}
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                        <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                 onClick={() => setIsEditing(false)}
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="bg-white rounded-[3rem] p-10 w-full max-w-md relative z-[210] shadow-2xl"
               >
                  <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">Update Profile</h2>
                  <form onSubmit={handleUpdate} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Full Name</label>
                        <input 
                          type="text" 
                          value={editForm.name} 
                          onChange={e => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-2">Email Address</label>
                        <input 
                          type="email" 
                          value={editForm.email} 
                          onChange={e => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                        />
                     </div>
                     <div className="flex gap-4 pt-4">
                        <button 
                          type="button" onClick={() => setIsEditing(false)}
                          className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200"
                        >
                           Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/20"
                        >
                           Save Changes
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Account Details */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40"
           >
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                 <User className="w-6 h-6 text-blue-600" /> Account Details
              </h3>
              
              <div className="space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                       <Mail className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                       <p className="font-bold text-slate-900">{user.email}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                       <Phone className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                       <p className="font-bold text-slate-900">+91 98765 43210</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                       <p className="font-bold text-slate-900">New Delhi, India</p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Security & Activity */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col gap-8"
           >
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 flex-grow">
                 <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-500" /> Recent Activity
                 </h3>
                 <div className="space-y-6">
                    {[
                      { action: 'Booked Ticket #554', time: '2 hours ago' },
                      { action: 'Shared E-Ticket to Email', time: 'Yesterday' },
                      { action: 'Updated Profile Picture', time: '3 days ago' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                         <span className="font-bold text-slate-700 text-sm">{act.action}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.time}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-6 bg-rose-50 text-rose-600 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white transition-all group"
              >
                 <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out Account
              </button>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
