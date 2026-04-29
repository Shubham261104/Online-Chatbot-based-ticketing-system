import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Ticket as TicketIcon, IndianRupee, Info, Landmark, Download, Printer, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const TicketModal = ({ ticket, isOpen, onClose }) => {
  if (!ticket) return null;

  const museumImage = "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop";
  const ticketId = `MUS${ticket.date.replace(/-/g, '')}${String(ticket.id).padStart(5, '0')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2rem]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-[110] p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white md:text-gray-400 md:hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ticket Container */}
            <div className="flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-fit relative">
              
              {/* Left Side (Main Info) */}
              <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
                {/* Museum Header Overlay */}
                <div className="absolute top-5 left-6 z-20 flex items-center gap-3 text-slate-900">
                  <div className="w-10 h-10 bg-museum-gold rounded-lg flex items-center justify-center text-white shadow-lg">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight uppercase leading-none">National Heritage Museum</h3>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Explore. Learn. Be Inspired.</p>
                  </div>
                </div>

                {/* Left Side Visual (Museum Image) - subtle watermark */}
                <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-[0.07] select-none pointer-events-none hidden md:block">
                  <img src={museumImage} alt="Museum" className="h-full w-full object-cover grayscale" />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col pt-20 px-6 pb-6 relative z-10 md:ml-[5%]">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">E-Ticket</h2>
                    <div className="inline-block px-5 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg shadow-slate-100">
                      Treasures of Ancient India
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <div className="h-px w-8 bg-gray-200" />
                      EXHIBITION
                      <div className="h-px w-8 bg-gray-200" />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-8">
                    {[
                      { label: 'Visit Date', value: ticket.date, icon: Calendar, sub: 'Confirmed' },
                      { label: 'Time Slot', value: ticket.time_slot, icon: Clock },
                      { label: 'Visitor Name', value: ticket.visitor_name, icon: User },
                      { label: 'No. of Tickets', value: `${ticket.adults + ticket.children} Total`, icon: TicketIcon },
                      { label: 'Ticket Type', value: ticket.event_name ? ticket.event_name : 'General Entry', icon: Zap },
                      { label: 'Total Paid', value: `₹${ticket.total_price}.00`, icon: IndianRupee },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                          <p className="text-sm font-black text-slate-900 leading-tight">{item.value}</p>
                          {item.sub && <p className="text-[9px] font-bold text-green-500 mt-0.5">{item.sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Important Instructions */}
                  <div className="bg-[#FAF8F5] border border-museum-gold/10 rounded-2xl p-5 mt-auto">
                    <div className="flex items-center gap-2 mb-2 text-museum-gold">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Instructions</span>
                    </div>
                    <ul className="text-[9px] font-bold text-gray-500 space-y-1 ml-4 list-disc leading-relaxed">
                      <li>Arrive 15 mins before your slot.</li>
                      <li>Carry a valid ID proof.</li>
                      <li>Non-refundable & non-transferable.</li>
                    </ul>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="bg-museum-dark h-12 px-6 flex items-center justify-between text-white mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-museum-gold rounded flex items-center justify-center text-museum-dark">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">MUSEUM TICKETING</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-500">museum.in</span>
                </div>
              </div>

              {/* DASHED SEPARATOR */}
              <div className="relative w-px hidden md:flex flex-col items-center bg-gray-50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/80 rounded-full z-10" />
                <div className="h-full border-l-2 border-dashed border-gray-200" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-black/80 rounded-full z-10" />
              </div>

              {/* Right Side (Stub / QR) */}
              <div className="w-full md:w-[32%] bg-[#FDFDFF] flex flex-col relative overflow-hidden">
                {/* Dark Header */}
                <div className="bg-museum-dark p-6 text-white text-center">
                   <p className="text-[9px] font-black text-museum-gold uppercase tracking-[0.3em] mb-1 opacity-80">Ticket ID</p>
                   <h4 className="text-lg font-black tracking-tighter uppercase">{ticketId}</h4>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-museum-dark mb-4 shadow-lg border border-slate-100">
                      <Landmark className="w-6 h-6" />
                   </div>
                   <h3 className="font-black text-[11px] text-slate-900 tracking-tight uppercase mb-1">{ticket.event_name || 'Heritage Museum'}</h3>
                   
                   <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Visitor Name</p>
                        <p className="text-[11px] font-black text-slate-900 truncate max-w-[120px]">{ticket.visitor_name}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Visit Date & Slot</p>
                        <p className="text-[11px] font-black text-slate-900">{ticket.date}</p>
                        <p className="text-[9px] font-bold text-gray-500">{ticket.time_slot}</p>
                      </div>
                   </div>

                   {/* QR Code */}
                   <div className="p-3 bg-white border-2 border-slate-50 rounded-[1.5rem] shadow-lg mb-3">
                      <QRCodeSVG value={ticketId} size={110} level="H" />
                   </div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Scan at Entry</p>

                   {/* Barcode */}
                   <div className="w-full space-y-1 flex flex-col items-center opacity-80">
                      <div className="w-full h-10 flex items-stretch gap-[1px] px-4">
                        {Array.from({ length: 45 }).map((_, i) => (
                           <div key={i} className="bg-slate-900 flex-1" style={{ width: `${Math.random() * 3 + 1}px`, opacity: Math.random() > 0.3 ? 1 : 0.5 }} />
                        ))}
                      </div>
                      <p className="text-[9px] font-black text-slate-900 tracking-[0.3em] uppercase">{ticketId}</p>
                   </div>
                </div>

                {/* Print/Download Actions */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                   <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 transition-all">
                      <Download className="w-4 h-4" /> Download
                   </button>
                   <button onClick={() => window.print()} className="flex-1 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all">
                      <Printer className="w-4 h-4" /> Print
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TicketModal;
