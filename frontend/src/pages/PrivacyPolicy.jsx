import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Privacy Policy</h1>
            <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm">Last Updated: April 30, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Lock className="w-6 h-6 text-museum-gold" /> 1. Information We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We collect information you provide directly to us when you create an account, book a ticket, or communicate with our AI chatbot. This includes your name, email address, payment information, and any other details you choose to provide.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Eye className="w-6 h-6 text-museum-gold" /> 2. How We Use Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                We use the information we collect to process your bookings, provide support through our chatbot, send you ticket confirmations and updates, and improve our services. We may also use your information to send you news and special offers about museum events.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Globe className="w-6 h-6 text-museum-gold" /> 3. Data Sharing and Security
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Your data security is our priority. We do not sell your personal information to third parties. We share information only as necessary to process payments or as required by law. We implement industry-standard security measures to protect your data from unauthorized access.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-slate-100">
              <p className="text-slate-400 text-sm italic text-center font-medium">
                By using the Museum Ticketing System, you agree to the collection and use of information in accordance with this policy. If you have any questions, please contact our support team.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
