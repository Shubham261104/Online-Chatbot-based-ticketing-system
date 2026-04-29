import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Info, Settings, ShieldCheck } from 'lucide-react';

const CookiePolicy = () => {
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
              <Cookie className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Cookie Policy</h1>
            <p className="text-slate-500 font-bold italic uppercase tracking-widest text-sm">Last Updated: April 30, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Info className="w-6 h-6 text-museum-gold" /> 1. What are Cookies?
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep you logged in, and understand how you interact with our platform to improve your experience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Settings className="w-6 h-6 text-museum-gold" /> 2. Types of Cookies We Use
              </h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2 font-medium">
                <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., login, security).</li>
                <li><strong>Analytical Cookies:</strong> Help us understand visitor behavior and improve our interface.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings like language or theme.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-museum-gold" /> 3. Managing Cookies
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Most web browsers allow you to control cookies through their settings. However, disabling essential cookies may affect the functionality of our ticketing system and chatbot.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-slate-100">
              <p className="text-slate-400 text-sm italic text-center font-medium">
                We value your privacy. This Cookie Policy explains how we use these technologies to provide a better user experience for our museum visitors.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;
