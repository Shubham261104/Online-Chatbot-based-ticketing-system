import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Scale } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-slate-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Terms of Service</h1>
            <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm">Last Updated: April 30, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-museum-gold" /> 1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                By accessing or using the Museum Ticketing System, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Scale className="w-6 h-6 text-museum-gold" /> 2. Booking and Payments
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                All bookings made through the platform are subject to availability. Prices for tickets are subject to change without notice. Payments are processed through secure third-party gateways. Once a ticket is issued, it is generally non-refundable unless specified otherwise for specific events.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-museum-gold" /> 3. User Conduct
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Users are responsible for maintaining the confidentiality of their account information. Any misuse of the system, including fraudulent bookings or attempts to circumvent security measures, will lead to immediate account termination and potential legal action.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-slate-100">
              <p className="text-slate-400 text-sm italic text-center font-medium">
                The Museum Ticketing System reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
