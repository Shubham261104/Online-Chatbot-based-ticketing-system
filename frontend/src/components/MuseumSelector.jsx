import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Globe, MapPin, ChevronDown, X, Check } from 'lucide-react';

const INDIA_MUSEUMS = {
  'Andaman and Nicobar Islands': ['Samudrika Marine Museum', 'Anthropological Museum', 'Cellular Jail Museum'],
  'Andhra Pradesh': ['INS Kurusura Submarine Museum', 'Amaravati Heritage Museum', 'Victoria Jubilee Museum'],
  'Arunachal Pradesh': ['Jawaharlal Nehru State Museum'],
  'Assam': ['Assam State Museum', 'Srimanta Sankaradeva Kalakshetra'],
  'Bihar': ['Bihar Museum', 'Patna Museum', 'Nalanda Archaeological Museum'],
  'Chandigarh': ['Government Museum and Art Gallery', 'International Dolls Museum'],
  'Chhattisgarh': ['Mahant Ghasidas Memorial Museum'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Tribal Cultural Museum', 'Daman Museum'],
  'Delhi': ['National Museum', 'National Rail Museum', 'National Gallery of Modern Art', 'Crafts Museum'],
  'Goa': ['Goa State Museum', 'Museum of Christian Art', 'Naval Aviation Museum'],
  'Gujarat': ['Calico Museum of Textiles', 'Lalbhai Dalpatbhai Museum', 'Baroda Museum and Picture Gallery'],
  'Haryana': ['Kurukshetra Panorama and Science Centre', 'Heritage Rezang La Memorial'],
  'Himachal Pradesh': ['Himachal State Museum', 'Kangra Art Museum'],
  'Jammu and Kashmir': ['Dogra Art Museum', 'Sri Pratap Singh Museum'],
  'Jharkhand': ['Ranchi Science Centre', 'State Museum Hotwar'],
  'Karnataka': ['Visvesvaraya Industrial and Technological Museum', 'Government Museum Bangalore', 'Mysore Sand Sculpture Museum'],
  'Kerala': ['Kerala Folklore Museum', 'Napier Museum', 'Hill Palace Museum'],
  'Ladakh': ['Hall of Fame Museum', 'Munshi Aziz Bhat Museum'],
  'Lakshadweep': ['Marine Aquarium and Museum'],
  'Madhya Pradesh': ['Indira Gandhi Rashtriya Manav Sangrahalaya', 'State Museum Bhopal', 'Maharaja Chhatrasal Museum'],
  'Maharashtra': ['Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', 'Mani Bhavan Gandhi Sangrahalaya', 'Raja Dinkar Kelkar Museum'],
  'Manipur': ['Manipur State Museum'],
  'Meghalaya': ['Don Bosco Museum'],
  'Mizoram': ['Mizoram State Museum'],
  'Nagaland': ['Nagaland State Museum'],
  'Odisha': ['Odisha State Museum', 'Regional Museum of Natural History'],
  'Puducherry': ['Pondicherry Museum'],
  'Punjab': ['Virasat-e-Khalsa', 'Partition Museum', 'Sheesh Mahal'],
  'Rajasthan': ['Albert Hall Museum', 'City Palace Museum Jaipur', 'Mehrangarh Museum'],
  'Sikkim': ['Namgyal Institute of Tibetology'],
  'Tamil Nadu': ['Government Museum Chennai', 'DakshinaChitra Museum', 'Gass Forest Museum'],
  'Telangana': ['Salar Jung Museum', 'Nizam\'s Museum', 'Birla Science Museum'],
  'Tripura': ['Ujjayanta Palace (Tripura State Museum)'],
  'Uttar Pradesh': ['State Museum Lucknow', 'Allahabad Museum', 'Sarnath Museum'],
  'Uttarakhand': ['Forest Research Institute Museum', 'Regional Science Center Dehradun'],
  'West Bengal': ['Indian Museum', 'Victoria Memorial Hall', 'Science City Kolkata']
};

const WORLD_MUSEUMS = {
  'France': ['Louvre Museum', 'Musée d\'Orsay', 'Centre Pompidou'],
  'USA': ['Metropolitan Museum of Art', 'American Museum of Natural History', 'The Art Institute of Chicago'],
  'UK': ['British Museum', 'Victoria and Albert Museum', 'National Gallery London'],
  'Italy': ['Vatican Museums', 'Uffizi Gallery', 'Accademia Gallery'],
  'Spain': ['Prado Museum', 'Reina Sofía Museum', 'Guggenheim Museum Bilbao'],
  'Netherlands': ['Rijksmuseum', 'Van Gogh Museum', 'Anne Frank House'],
  'Egypt': ['Egyptian Museum Cairo', 'Grand Egyptian Museum'],
  'China': ['The Palace Museum (Forbidden City)', 'National Museum of China']
};

export default function MuseumSelector({ onSelect, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('india'); // 'india' or 'world'
  const [selectedState, setSelectedState] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Choose Museum</h2>
            <p className="text-sm font-bold text-gray-400">Select your destination for visit</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => { setActiveTab('india'); setSelectedState(''); setSelectedCountry(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'india' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}
            >
              <MapPin className="w-4 h-4" /> Museums in India
            </button>
            <button 
              onClick={() => { setActiveTab('world'); setSelectedState(''); setSelectedCountry(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all ${activeTab === 'world' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}
            >
              <Globe className="w-4 h-4" /> World's Top Museums
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'india' ? (
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select State</label>
                <div className="relative group">
                  <select 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="">Select a state...</option>
                    {Object.keys(INDIA_MUSEUMS).sort().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                </div>

                {selectedState && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 grid grid-cols-1 gap-3"
                  >
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Available Museums in {selectedState}</label>
                    {INDIA_MUSEUMS[selectedState].sort().map(museum => (
                      <button
                        key={museum}
                        onClick={() => { onSelect(museum); onClose(); }}
                        className="group flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-slate-900">{museum}</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                          <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Country</label>
                <div className="relative group">
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="">Select a country...</option>
                    {Object.keys(WORLD_MUSEUMS).sort().map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                </div>

                {selectedCountry && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 grid grid-cols-1 gap-3"
                  >
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Top Museums in {selectedCountry}</label>
                    {WORLD_MUSEUMS[selectedCountry].sort().map(museum => (
                      <button
                        key={museum}
                        onClick={() => { onSelect(museum); onClose(); }}
                        className="group flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-slate-900">{museum}</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {activeTab === 'india' ? '8 states' : '8 countries'} with curated museum lists
          </p>
        </div>
      </motion.div>
    </div>
  );
}
