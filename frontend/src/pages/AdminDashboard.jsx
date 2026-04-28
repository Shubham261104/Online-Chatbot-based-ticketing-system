import React from 'react';
import { BarChart, Users, DollarSign, Ticket, Activity, ArrowUpRight, Search } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Visitors', value: '12,840', icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Revenue', value: '₹4,25,000', icon: DollarSign, color: 'bg-green-500', trend: '+8%' },
    { label: 'Tickets Sold', value: '1,240', icon: Ticket, color: 'bg-purple-500', trend: '+15%' },
    { label: 'Active Sessions', value: '42', icon: Activity, color: 'bg-orange-500', trend: '-2%' },
  ];

  const recentBookings = [
    { id: '#8892', name: 'Rahul Sharma', date: '2026-04-27', amount: '₹1250', status: 'Paid' },
    { id: '#8891', name: 'Ankita Singh', date: '2026-04-27', amount: '₹500', status: 'Paid' },
    { id: '#8890', name: 'Michael Doe', date: '2026-04-26', amount: '₹2250', status: 'Pending' },
    { id: '#8889', name: 'Suresh Kumar', date: '2026-04-26', amount: '₹750', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
            <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">Export Report</button>
            <button className="btn-primary py-2 px-4 text-sm">Update Pricing</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="card p-6 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table */}
          <div className="lg:col-span-2 card p-0">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm" />
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase text-left">
                <tr>
                  <th className="px-6 py-4">Visitor</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {recentBookings.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{b.name}</div>
                      <div className="text-xs text-slate-400">{b.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{b.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${b.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right underline text-primary-600 cursor-pointer">Details</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side Info */}
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-6">Popular Slots</h3>
            <div className="space-y-6">
              {[
                { label: 'Morning (09:00 - 12:00)', value: 85, color: 'bg-blue-500' },
                { label: 'Afternoon (12:00 - 03:00)', value: 62, color: 'bg-purple-500' },
                { label: 'Evening (03:00 - 06:00)', value: 45, color: 'bg-orange-500' },
              ].map((slot, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">{slot.label}</span>
                    <span className="font-bold">{slot.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${slot.color} h-full`} style={{ width: `${slot.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-primary-900 rounded-2xl p-6 text-white text-center">
              <Bot className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <h4 className="font-bold mb-2">Chatbot Analytics</h4>
              <p className="text-xs text-white/70 mb-4">92% of queries were resolved by AI without human intervention.</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm border border-white/20 transition-colors">View Chat Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
