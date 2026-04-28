import React, { useState } from 'react';
import { Calendar, Users, Clock, CreditCard, CheckCircle, ChevronRight, ArrowLeft, Info, Bell, User, Ticket, Landmark, ShieldCheck, Zap, Bot, Languages, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: 'May 25, 2025',
    timeSlot: '10:30 AM - 12:00 PM',
    ticketType: 'General',
    numTickets: 2,
    price: 200,
    fee: 20
  });

  const steps = [
    { id: 1, name: 'Visit Details', sub: 'Select Date & Time', icon: <Calendar className="w-5 h-5" /> },
    { id: 2, name: 'Visitors', sub: 'Number of Tickets', icon: <Users className="w-5 h-5" /> },
    { id: 3, name: 'Ticket Type', sub: 'Choose Ticket Category', icon: <Ticket className="w-5 h-5" /> },
    { id: 4, name: 'Payment', sub: 'Make Payment', icon: <CreditCard className="w-5 h-5" /> },
    { id: 5, name: 'Confirmation', sub: 'Receive E-Ticket', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const timeSlots = [
    { time: '09:00 AM - 10:30 AM', status: 'Available', statusColor: 'text-green-500' },
    { time: '10:30 AM - 12:00 PM', status: 'Available', statusColor: 'text-green-500' },
    { time: '12:00 PM - 01:30 PM', status: 'Few Tickets Left', statusColor: 'text-orange-500' },
    { time: '01:30 PM - 03:00 PM', status: 'Available', statusColor: 'text-green-500' },
    { time: '03:00 PM - 04:30 PM', status: 'Few Tickets Left', statusColor: 'text-orange-500' },
    { time: '04:30 PM - 06:00 PM', status: 'Sold Out', statusColor: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col pt-24">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-10 mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Book Your Tickets</h1>
        <p className="text-gray-500 font-medium">Select your visit details and book your tickets in easy steps</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-8 mb-20">
        
        {/* Left Sidebar: Steps */}
        <div className="lg:w-1/4 space-y-4">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                currentStep === step.id 
                  ? 'bg-white border-blue-100 shadow-lg shadow-blue-100/50 relative overflow-hidden' 
                  : 'bg-white/50 border-transparent opacity-60'
              }`}
            >
              {currentStep === step.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                currentStep === step.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.id}
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <span className={`text-gray-400 ${currentStep === step.id && 'text-blue-600'}`}>{step.icon}</span>
                    <h4 className={`font-bold text-sm ${currentStep === step.id ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</h4>
                 </div>
                 <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{step.sub}</p>
              </div>
              {currentStep === step.id && <ChevronRight className="ml-auto w-5 h-5 text-blue-600" />}
            </div>
          ))}
        </div>

        {/* Center: Step Content */}
        <div className="lg:w-1/2">
           <AnimatePresence mode="wait">
             {currentStep === 1 && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100"
               >
                 <div className="mb-10">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">1. Select Visit Date & Time</h2>
                    <p className="text-gray-500 font-medium">Check availability and choose your preferred date and time slot</p>
                 </div>

                 <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 ml-1">Select Date</label>
                      <div className="relative group max-w-sm">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          type="text" 
                          readOnly 
                          value={bookingData.date}
                          className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold text-gray-700"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4 ml-1">Available Time Slots</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {timeSlots.map((slot, i) => (
                           <button 
                             key={i}
                             onClick={() => setBookingData({...bookingData, timeSlot: slot.time})}
                             className={`p-6 rounded-[1.5rem] border text-left transition-all relative ${
                               bookingData.timeSlot === slot.time 
                                 ? 'bg-white border-blue-600 shadow-xl shadow-blue-100 ring-2 ring-blue-600 ring-offset-2' 
                                 : slot.status === 'Sold Out' ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' : 'bg-gray-50 border-transparent hover:border-gray-200'
                             }`}
                           >
                              {bookingData.timeSlot === slot.time && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                </div>
                              )}
                              <h5 className="font-bold text-sm text-gray-900 mb-2">{slot.time}</h5>
                              <span className={`text-[11px] font-bold ${slot.statusColor}`}>{slot.status}</span>
                           </button>
                         ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                       <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <Info className="w-5 h-5 text-white" />
                       </div>
                       <p className="text-sm font-bold text-blue-800 leading-relaxed">
                          Tip: Weekday mornings are less crowded. Enjoy a better experience!
                       </p>
                    </div>

                    <div className="pt-6 flex justify-end">
                       <button 
                         onClick={() => setCurrentStep(2)}
                         className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-blue-200"
                       >
                          Continue to Visitors <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Right Sidebar: Summary */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 sticky top-32">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Booking Summary</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                   <Landmark className="w-6 h-6" />
                </div>
             </div>

             <div className="space-y-8">
                <div>
                   <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Visit Details</h5>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                         <Calendar className="w-5 h-5 text-gray-400" />
                         <span>{bookingData.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                         <Clock className="w-5 h-5 text-gray-400" />
                         <span>{bookingData.timeSlot}</span>
                      </div>
                   </div>
                </div>

                <div>
                   <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Tickets</h5>
                   <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-gray-700">
                         <div className="flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-gray-400" />
                            <span>Ticket Type</span>
                         </div>
                         <span className="text-gray-900">{bookingData.ticketType}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-700">
                         <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span>No. of Tickets</span>
                         </div>
                         <span className="text-gray-900">{bookingData.numTickets}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                   <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Price Details</h5>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold text-gray-700">
                         <span>Ticket Price (₹{bookingData.price} x {bookingData.numTickets})</span>
                         <span>₹{bookingData.price * bookingData.numTickets}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-700">
                         <span>Convenience Fee</span>
                         <span>₹{bookingData.fee}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                         <span className="text-lg font-black text-gray-900">Total Amount</span>
                         <span className="text-2xl font-black text-blue-600">₹{bookingData.price * bookingData.numTickets + bookingData.fee}</span>
                      </div>
                   </div>
                </div>

                <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-blue-200 mt-4">
                   Proceed to Payment
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Benefits Bar */}
      <div className="bg-white border-y border-gray-100 py-12 mb-20">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-blue-50 text-blue-600', title: 'Secure Booking', sub: 'Your data is safe with us' },
              { icon: <Zap className="w-8 h-8" />, color: 'bg-purple-50 text-purple-600', title: 'Instant Confirmation', sub: 'Get E-ticket instantly' },
              { icon: <Bot className="w-8 h-8" />, color: 'bg-indigo-50 text-indigo-600', title: 'Chatbot Support', sub: '24/7 help available' },
              { icon: <Languages className="w-8 h-8" />, color: 'bg-green-50 text-green-600', title: 'Multi-language', sub: 'Support for 10+ languages' },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-6">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${benefit.color}`}>
                    {benefit.icon}
                 </div>
                 <div>
                    <h4 className="font-black text-gray-900">{benefit.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{benefit.sub}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Booking;
