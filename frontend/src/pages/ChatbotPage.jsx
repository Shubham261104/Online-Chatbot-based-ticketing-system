// Force build trigger: 2026-05-12T12:43
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RotateCcw, MessageCircle, Sparkles, Plus, History, HelpCircle, Map, Info, Globe, ChevronDown, Paperclip, Ticket, Headphones, Check, CheckCheck, Trash2, ShieldCheck, Zap, ArrowRight, Star, Clock, Landmark, MapPin, QrCode, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import TicketModal from '../components/TicketModal';
import { t } from '../utils/translations';

const TRANSLATED_ACTIONS = {
  'English': { book: 'Book Tickets', price: 'View Prices' },
  'Hindi': { book: 'टिकट बुक करें', price: 'कीमतें देखें' },
  'Spanish': { book: 'Reservar Entradas', price: 'Ver Precios' },
  'French': { book: 'Réserver Billets', price: 'Voir Prix' },
  'German': { book: 'Tickets Buchen', price: 'Preise Sehen' },
  'Japanese': { book: 'チケット予約', price: '価格を見る' },
  'Bengali': { book: 'টিকিট বুক করুন', price: 'দাম দেখুন' },
  'Tamil': { book: 'டிக்கெட் முன்பதிவு', price: 'விலை காண்' }
};

const TICKET_TYPES = [
  { type: 'General', addCharge: 0, desc: 'Basic entry to the museum' },
  { type: 'Premium', addCharge: 150, desc: 'Guided tour + Fast-track entry' },
  { type: 'VIP', addCharge: 400, desc: 'All-access + VIP lounge + Dedicated guide' },
];

const PRICES = {
  adults: 500,
  children: 250,
  students: 200,
  females: 400,
  seniors: 350,
  foreigners: 1000,
  bookingFee: 50
};

const ChatbotPage = () => {
  const [language, setLanguage] = useState(null);

  const GREETINGS = {
    'English': "Namaste! 🙏\nI'm your Museum AI Assistant. I can help you explore the museum, check ticket prices, or book your visit in seconds.\n\nHow can I assist you today?",
    'Hindi': "नमस्ते! 🙏\nमैं आपका संग्रहालय एआई सहायक हूँ। मैं संग्रहालय का पता लगाने, टिकट की कीमतें जांचने या आपकी यात्रा बुक करने में मदद कर सकता हूँ।\n\nमैं आज आपकी कैसे मदद कर सकता हूँ?",
    'Spanish': "¡Namasté! 🙏\nSoy su asistente de inteligencia artificial del museo. Puedo ayudarle a explorar el museo, ver precios o reservar su visita.\n\n¿Cómo puedo ayudarle hoy?",
    'French': "Namasté! 🙏\nJe suis votre assistant IA de musée. Je peux vous aider à explorer le musée, vérifier les prix ou réserver votre visite.\n\nComment puis-je vous aider aujourd'hui?",
    'German': "Namaste! 🙏\nIch bin Ihr Museums-KI-Assistent. Ich kann Ihnen helfen, das Museum zu erkunden, Ticketpreise zu prüfen oder Ihren Besuch zu buchen.\n\nWie kann ich Ihnen heute helfen?",
    'Japanese': "ナマステ！ 🙏\n私は博物館のAIアシスタントです。博物館の探索、チケット価格の確認、訪問の予約などのお手伝いをします。\n\n今日はどのようなご用件でしょうか？",
    'Bengali': "নমস্কার! 🙏\nআমি আপনার মিউজিয়াম এআই সহকারী। আমি আপনাকে মিউজিয়াম ঘুরে দেখতে, টিকিটের দাম চেক করতে বা আপনার ভিজিট বুক করতে সাহায্য করতে পারি।\n\nআজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    'Tamil': "நமஸ்தே! 🙏\nநான் உங்கள் அருங்காட்சியக AI உதவியாளர். அருங்காட்சியகத்தை ஆராயவும், டிக்கெட் விலைகளைச் சரிபார்க்கவும் அல்லது உங்கள் வருகையை முன்பதிவு செய்யவும் நான் உதவ முடியும்.\n\nஇன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Please select your preferred language / कृपया अपनी पसंदीदा भाषा चुनें / Veuillez sélectionner votre langue:",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'LANGUAGE_SELECT'
    }
  ]);
  const [activeMenu, setActiveMenu] = useState('new');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookingStep, setBookingStep] = useState(null); // 'MUSEUM', 'STATE', 'COUNTRY', 'DATE', 'SLOT', 'VISITORS', 'CONFIRM'
  const [bookingData, setBookingData] = useState({
    museum: '',
    state: '',
    country: '',
    date: '',
    timeSlot: '',
    adults: 1,
    children: 0,
    students: 0,
    females: 0,
    seniors: 0,
    foreigners: 0,
    ticketType: TICKET_TYPES[0],
    name: '',
    email: '',
    paymentMethod: 'card'
  });
  const [supportData, setSupportData] = useState({ subject: '', message: '' });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [museumList, setMuseumList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chatbot/history');
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      }
    };
    fetchHistory();
  }, []);

  const addBotMessage = (text, options = {}) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'bot',
      text,
      time,
      ...options
    }]);
    setIsTyping(false);
  };

  const handleSend = async (val) => {
    const messageToSend = (typeof val === 'string' ? val : input).trim();
    if (!messageToSend) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), role: 'user', text: messageToSend, time };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const isBookAction = ['book', 'ticket', 'टिकट', 'reservar', 'réserver', 'buchen', '予約', 'বুক', 'முன்பதிவு'].some(kw => messageToSend.toLowerCase().includes(kw));
    const isPriceAction = ['price', 'cost', 'discount', 'student', 'कीमत', 'precios', 'prix', 'preise', '価格', 'দাম', 'விலை'].some(kw => messageToSend.toLowerCase().includes(kw));

    // INTERCEPT BOOKING FLOW
    if (isBookAction && !messageToSend.toLowerCase().includes('price')) {
      setTimeout(() => {
        setBookingStep('MUSEUM');
        addBotMessage(t(language, 'bookReady'), {
          type: 'MUSEUM_SELECT'
        });
      }, 600);
      return;
    }

    if (isPriceAction) {
      setTimeout(() => {
        addBotMessage(t(language, 'priceBreakup'), {
          type: 'PRICE_BREAKUP'
        });
      }, 600);
      return;
    }

    if (messageToSend.toLowerCase() === 'i need support') {
      setTimeout(() => {
        addBotMessage("We're here to help! Please fill out this form to submit your issue or feedback to our admin team.", {
          type: 'SUPPORT_FORM'
        });
      }, 600);
      return;
    }

    try {
      const res = await api.post('/chatbot', {
        message: messageToSend,
        language: language || 'English'
      });
      setTimeout(() => {
        const botReply = {
          id: Date.now() + 1,
          role: 'bot',
          text: res.data.reply || "I'm here to help!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: (res.data.reply && res.data.reply.toLowerCase().includes('book')) ? { label: 'Start Booking Flow', type: 'BOOK_FLOW' } : null
        };
        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      setTimeout(() => {
        addBotMessage(t(language, 'connectionIssue'));
      }, 1000);
    }
  };

  const handleBookingAction = async (action, data) => {
    setIsTyping(true);

    if (action === 'SELECT_MUSEUM') {
      setBookingData(prev => ({ ...prev, museum: data }));
      setBookingStep('DATE');
      setTimeout(() => {
        addBotMessage(t(language, 'selectedMuseum', data), {
          type: 'DATE_SELECT'
        });
      }, 600);
    } else if (action === 'BROWSE_STATES') {
      setBookingStep('STATE');
      setTimeout(() => {
        addBotMessage(t(language, 'selectState'), {
          type: 'STATE_SELECT'
        });
      }, 600);
    } else if (action === 'BROWSE_COUNTRIES') {
      setBookingStep('COUNTRY');
      setTimeout(() => {
        addBotMessage(t(language, 'selectCountry'), {
          type: 'COUNTRY_SELECT'
        });
      }, 600);
    } else if (action === 'SELECT_STATE') {
      setBookingData(prev => ({ ...prev, state: data }));
      // We'll show museums for this state in the next message
      setTimeout(() => {
        addBotMessage(t(language, 'museumsIn', data), {
          type: 'MUSEUM_LIST_SELECT',
          museums: INDIA_MUSEUMS[data] || []
        });
      }, 600);
    } else if (action === 'SELECT_COUNTRY') {
      setBookingData(prev => ({ ...prev, country: data }));
      setTimeout(() => {
        addBotMessage(t(language, 'topMuseums', data), {
          type: 'MUSEUM_LIST_SELECT',
          museums: WORLD_MUSEUMS[data] || []
        });
      }, 600);
    } else if (action === 'SELECT_DATE') {
      const date = data === 'today' ? new Date().toISOString().split('T')[0] : data;
      setBookingData(prev => ({ ...prev, date }));

      try {
        const res = await api.get(`/slots?date=${date}`);
        setAvailableSlots(res.data);
        setBookingStep('SLOT');
        addBotMessage(t(language, 'availableSlots', date), {
          type: 'SLOT_SELECT',
          slots: res.data
        });
      } catch (err) {
        addBotMessage(t(language, 'noSlots'));
      }
    } else if (action === 'SELECT_SLOT') {
      setBookingData(prev => ({ ...prev, timeSlot: data }));
      setBookingStep('VISITORS');
      setTimeout(() => {
        addBotMessage("Almost there! How many visitors are coming?", {
          type: 'VISITOR_SELECT'
        });
      }, 600);
    } else if (action === 'CONFIRM_VISITORS') {
      setBookingStep('TICKET_TYPE');
      setTimeout(() => {
        addBotMessage("Choose your preferred ticket category:", {
          type: 'TICKET_TYPE_SELECT'
        });
      }, 600);
    } else if (action === 'SELECT_TICKET_TYPE') {
      setBookingData(prev => ({ ...prev, ticketType: data }));
      setBookingStep('SUMMARY');
      setTimeout(() => {
        addBotMessage("Here is your booking summary and price breakup:", {
          type: 'BOOKING_SUMMARY'
        });
      }, 600);
    } else if (action === 'PROCEED_TO_DETAILS') {
      setBookingStep('USER_DETAILS');
      setTimeout(() => {
        addBotMessage("Great! Please provide your details for the e-ticket:", {
          type: 'USER_DETAILS_INPUT'
        });
      }, 600);
    } else if (action === 'SUBMIT_DETAILS') {
      setBookingStep('PAYMENT');
      setTimeout(() => {
        addBotMessage("Almost done! How would you like to pay?", {
          type: 'PAYMENT_SELECT'
        });
      }, 600);
    } else if (action === 'FINALIZE_BOOKING') {
      setBookingStep('PROCESSING');
      setIsTyping(true);
      try {
        const res = await api.post('/book-ticket', {
          ...bookingData,
          ticket_type: bookingData.ticketType.type,
          event_name: bookingData.museum
        });

        // Simulating immediate payment verification for Chatbot bookings
        const verifyRes = await api.post('/verify-payment', {
          order_id: res.data.razorpay_order_id,
          payment_id: `pay_chatbot_${Date.now()}`
        });

        setBookingStep('SUCCESS');
        addBotMessage(t(language, 'success', res.data.ticket.id).replace('{museum}', bookingData.museum), {
          type: 'BOOKING_SUCCESS',
          ticket: verifyRes.data.ticket
        });
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Sorry, something went wrong with the booking. Please try again.";
        addBotMessage(errorMsg);
        setBookingStep(null);
      }
    } else if (action === 'SUBMIT_SUPPORT') {
      setIsTyping(true);
      try {
        await api.post('/support', supportData);
        setTimeout(() => {
          addBotMessage(t(language, 'supportSuccess'));
          setSupportData({ subject: '', message: '' });
        }, 800);
      } catch (err) {
        setTimeout(() => {
          addBotMessage(t(language, 'supportError'));
        }, 800);
      }
    } else if (action === 'SELECT_LANGUAGE') {
      setLanguage(data);
      setMessages([
        {
          id: Date.now(),
          role: 'bot',
          text: GREETINGS[data] || GREETINGS['English'],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'GREETING_ACTIONS'
        }
      ]);
    }
  };

  const handleDownload = (ticket) => {
    toast.info(`Preparing download for ticket #${ticket.id}...`, {
      icon: <Download className="w-4 h-4 text-blue-500" />
    });
    // In a real app, this would trigger a PDF generation/download
    setTimeout(() => {
      toast.success("Ticket downloaded successfully!");
    }, 1500);
  };

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

  const menuItems = [
    { id: 'new', label: t(language, 'newExploration'), icon: <Sparkles className="w-5 h-5" /> },
    { id: 'history', label: t(language, 'conversations'), icon: <History className="w-5 h-5" /> },
    { id: 'guide', label: t(language, 'visitorGuide'), icon: <Map className="w-5 h-5" /> },
    { id: 'support', label: t(language, 'support'), icon: <Headphones className="w-5 h-5" /> },
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    if (id === 'new') {
      setLanguage(null);
      setMessages([
        {
          id: Date.now(),
          role: 'bot',
          text: "Please select your preferred language / कृपया अपनी पसंदीदा भाषा चुनें / Veuillez sélectionner votre langue:",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'LANGUAGE_SELECT'
        }
      ]);
      setBookingStep(null);
    } else if (id === 'history') {
      handleSend("Show my recent conversations");
    } else if (id === 'guide') {
      handleSend("Show visitor guide");
    } else if (id === 'support') {
      handleSend("I need support");
    }
  };

  return (
    <div className="h-screen bg-[#FDFDFF] pt-20 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] bg-white border-r border-slate-100 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center relative shadow-lg shadow-blue-100">
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">{t(language, 'aiAssistant')}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t(language, 'activeNow')}</span>
            </div>
          </div>
        </div>

        <div className="flex-grow space-y-1 overflow-hidden flex flex-col">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">{t(language, 'menu')}</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all font-bold text-sm shrink-0 ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          <div className="mt-8 flex-grow flex flex-col min-h-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
              <History className="w-3 h-3" /> {t(language, 'recentHistory')}
            </p>
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 pr-1">
              {history.length > 0 ? (
                history.slice(-15).reverse().map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-default group">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${log.sender === 'user' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {log.sender === 'user' ? t(language, 'you') : t(language, 'aiAssistant')}
                      </span>
                      <span className="text-[7px] font-bold text-slate-300 group-hover:text-slate-400 transition-colors">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 line-clamp-2 leading-snug">{log.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t(language, 'noHistory')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-slate-900 p-6 rounded-3xl text-white mb-4">
            <h4 className="text-sm font-black mb-1">{t(language, 'quickBooking')}</h4>
            <p className="text-[10px] text-slate-400 mb-4">{t(language, 'getPass')}</p>
            <Link to="/booking" className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black text-center transition-all">
              {t(language, 'bookNowSidebar')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col relative bg-[#FDFDFF] max-w-7xl mx-auto w-full border-x border-slate-50">
        {/* Header */}
        <div className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">{t(language, 'museumGuide')}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t(language, 'aiAssistance')}</p>
            </div>
          </div>
          <button onClick={() => setMessages([])} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 no-scrollbar scroll-smooth">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'bot' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                  }`}>
                  {m.role === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                  <div className={`p-4 md:p-5 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm ${m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                    <p className="whitespace-pre-line">{m.text}</p>

                    {m.type === 'LANGUAGE_SELECT' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {Object.keys(GREETINGS).map(lang => (
                          <button
                            key={lang}
                            onClick={() => handleBookingAction('SELECT_LANGUAGE', lang)}
                            className="p-3 bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-100 rounded-xl text-xs font-black transition-all shadow-sm text-center"
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.type === 'GREETING_ACTIONS' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button onClick={() => handleSend(TRANSLATED_ACTIONS[language]?.book || 'Book Tickets')} className="p-3 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all hover:bg-blue-700">
                          <Ticket className="w-4 h-4" /> {TRANSLATED_ACTIONS[language]?.book || 'Book Tickets'}
                        </button>
                        <button onClick={() => handleSend(TRANSLATED_ACTIONS[language]?.price || 'View Prices')} className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-emerald-100">
                          <Landmark className="w-4 h-4" /> {TRANSLATED_ACTIONS[language]?.price || 'View Prices'}
                        </button>
                      </div>
                    )}

                    {/* CUSTOM RENDERERS FOR BOOKING FLOW */}
                    {m.type === 'MUSEUM_SELECT' && (
                      <div className="mt-4 space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t(language, 'popularMuseums')}</p>
                        {['National Museum', 'Indian Museum', 'Bihar Museum'].map(m => (
                          <button key={m} onClick={() => handleBookingAction('SELECT_MUSEUM', m)}
                            className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl text-left font-bold text-xs transition-all flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-blue-600" /> {m}
                          </button>
                        ))}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <button onClick={() => handleBookingAction('BROWSE_STATES')} className="p-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4" /> {t(language, 'byState')}
                          </button>
                          <button onClick={() => handleBookingAction('BROWSE_COUNTRIES')} className="p-3 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <Globe className="w-4 h-4" /> {t(language, 'world')}
                          </button>
                        </div>
                      </div>
                    )}

                    {m.type === 'PRICE_BREAKUP' && (
                      <div className="mt-4 space-y-3">
                        <div className="p-1 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                          {[
                            { label: t(language, 'adults'), price: '₹500', desc: t(language, 'adultsDesc') },
                            { label: t(language, 'children'), price: '₹250', desc: t(language, 'childrenDesc') },
                            { label: t(language, 'students'), price: '₹200', desc: t(language, 'studentsDesc') },
                            { label: t(language, 'seniors'), price: '₹350', desc: t(language, 'seniorsDesc') },
                            { label: t(language, 'foreigners'), price: '₹1000', desc: t(language, 'foreignersDesc') },
                          ].map((p, i) => (
                            <div key={i} className="flex justify-between items-center px-4 py-3 bg-white mb-[1px] first:rounded-t-xl last:rounded-b-xl last:mb-0">
                              <div>
                                <p className="text-[11px] font-black text-slate-900">{p.label}</p>
                                <p className="text-[9px] font-bold text-slate-400">{p.desc}</p>
                              </div>
                              <span className="text-sm font-black text-blue-600">{p.price}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{t(language, 'bookingFee')}</span>
                          <span className="text-sm font-black text-emerald-600">₹50</span>
                        </div>
                        <button onClick={() => handleSend('Book Tickets')} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                          {t(language, 'bookNow')}
                        </button>
                      </div>
                    )}

                    {m.type === 'STATE_SELECT' && (
                      <div className="mt-4 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto no-scrollbar p-1 bg-slate-50 rounded-2xl border border-slate-100">
                        {Object.keys(INDIA_MUSEUMS).sort().map(state => (
                          <button key={state} onClick={() => handleBookingAction('SELECT_STATE', state)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            {state}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.type === 'COUNTRY_SELECT' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {Object.keys(WORLD_MUSEUMS).sort().map(country => (
                          <button key={country} onClick={() => handleBookingAction('SELECT_COUNTRY', country)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            {country}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.type === 'MUSEUM_LIST_SELECT' && (
                      <div className="mt-4 space-y-2">
                        {m.museums?.map(museum => (
                          <button key={museum} onClick={() => handleBookingAction('SELECT_MUSEUM', museum)} className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl text-left font-bold text-xs transition-all flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-blue-600" /> {museum}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.type === 'DATE_SELECT' && (
                      <div className="mt-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleBookingAction('SELECT_DATE', 'today')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black transition-all hover:bg-blue-700 shadow-sm shadow-blue-100">{t(language, 'today')}</button>
                          <button onClick={() => handleBookingAction('SELECT_DATE', new Date(Date.now() + 86400000).toISOString().split('T')[0])} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-black transition-all hover:bg-slate-200">{t(language, 'tomorrow')}</button>
                        </div>
                        <div className="pt-2 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{t(language, 'pickCustomDate')}</p>
                          <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              if (e.target.value) handleBookingAction('SELECT_DATE', e.target.value);
                            }}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 text-xs font-bold transition-all cursor-pointer hover:bg-slate-100"
                          />
                        </div>
                      </div>
                    )}

                    {m.type === 'SLOT_SELECT' && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {m.slots?.map(s => (
                          <button key={s.time} disabled={s.status === 'Sold Out' || s.status === 'Time Passed'}
                            onClick={() => handleBookingAction('SELECT_SLOT', s.time)}
                            className={`p-2 border rounded-lg text-[10px] font-black transition-all ${s.status === 'Available' ? 'bg-white border-slate-200 hover:border-blue-500' : 'bg-slate-50 opacity-50 cursor-not-allowed'
                              }`}>
                            {s.time}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.type === 'VISITOR_SELECT' && (
                      <div className="mt-4 space-y-2">
                        {[
                          { label: t(language, 'adults'), key: 'adults' },
                          { label: t(language, 'children'), key: 'children' },
                          { label: t(language, 'students'), key: 'students' },
                          { label: t(language, 'females'), key: 'females' },
                          { label: t(language, 'seniors'), key: 'seniors' },
                          { label: t(language, 'foreigners'), key: 'foreigners' },
                        ].map(v => (
                          <div key={v.key} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[11px] font-black text-slate-700">{v.label}</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setBookingData(prev => ({ ...prev, [v.key]: Math.max(0, prev[v.key] - 1) }))} className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-black text-slate-400 hover:text-blue-600 shadow-sm"> - </button>
                              <span className="text-xs font-black min-w-[20px] text-center text-slate-900">{bookingData[v.key]}</span>
                              <button onClick={() => setBookingData(prev => ({ ...prev, [v.key]: prev[v.key] + 1 }))} className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black shadow-lg shadow-blue-100"> + </button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => handleBookingAction('CONFIRM_VISITORS')} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 shadow-xl">{t(language, 'confirmVisitors')}</button>
                      </div>
                    )}

                    {m.type === 'TICKET_TYPE_SELECT' && (
                      <div className="mt-4 space-y-2">
                        {TICKET_TYPES.map(type => (
                          <button
                            key={type.type}
                            onClick={() => handleBookingAction('SELECT_TICKET_TYPE', type)}
                            className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-2xl text-left transition-all group"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-black text-slate-900">{type.type}</span>
                              <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {type.addCharge > 0 ? `+₹${type.addCharge}` : t(language, 'free')}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">{type.desc}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {m.type === 'BOOKING_SUMMARY' && (
                      <div className="mt-4 p-5 bg-white border border-slate-200 rounded-[2rem] space-y-4 shadow-xl">
                        <div className="space-y-2 border-b border-slate-100 pb-4">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{t(language, 'museum')}</span><span className="text-slate-900 font-black">{bookingData.museum}</span></div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{t(language, 'date')}</span><span className="text-slate-900 font-black">{bookingData.date}</span></div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{t(language, 'slot')}</span><span className="text-slate-900 font-black">{bookingData.timeSlot}</span></div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-500"><span>{t(language, 'type')}</span><span className="text-blue-600 font-black">{bookingData.ticketType.type}</span></div>
                        </div>

                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price Breakup</p>
                           {Object.keys(PRICES).filter(k => bookingData[k] > 0).map(k => (
                             <div key={k} className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 font-bold capitalize">{k} (x{bookingData[k]})</span>
                                <span className="text-slate-900 font-black">₹{bookingData[k] * PRICES[k]}</span>
                             </div>
                           ))}
                           {bookingData.ticketType.addCharge > 0 && (
                             <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 font-bold">{bookingData.ticketType.type} Upgrade</span>
                                <span className="text-slate-900 font-black">₹{bookingData.ticketType.addCharge}</span>
                             </div>
                           )}
                           <div className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-500 font-bold">Booking Fee</span>
                              <span className="text-slate-900 font-black">₹{PRICES.bookingFee}</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-sm font-black text-slate-900">Total Amount</span>
                          <span className="text-lg font-black text-blue-600">
                            ₹{
                              (Object.keys(PRICES).reduce((acc, k) => acc + (bookingData[k] || 0) * (PRICES[k] || 0), 0) + 
                              bookingData.ticketType.addCharge + 
                              PRICES.bookingFee)
                            }
                          </span>
                        </div>

                        <div className="pt-2">
                          <button onClick={() => handleBookingAction('PROCEED_TO_DETAILS')} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-transform hover:scale-[1.02]">
                            {t(language, 'proceedPayment')} <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {m.type === 'USER_DETAILS_INPUT' && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="text" placeholder={t(language, 'fullName')}
                          value={bookingData.name}
                          onChange={e => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 text-xs font-bold"
                        />
                        <input
                          type="email" placeholder={t(language, 'email')}
                          value={bookingData.email}
                          onChange={e => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 text-xs font-bold"
                        />
                        <button
                          onClick={() => handleBookingAction('SUBMIT_DETAILS')}
                          disabled={!bookingData.name || !bookingData.email}
                          className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
                        >
                          {t(language, 'continuePayment')}
                        </button>
                      </div>
                    )}

                    {m.type === 'PAYMENT_SELECT' && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {['card', 'upi', 'qr'].map(p => (
                            <button
                              key={p} onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: p }))}
                              className={`p-2 border rounded-xl text-[10px] font-black transition-all ${bookingData.paymentMethod === p ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500'
                                }`}
                            >
                              {p.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        {bookingData.paymentMethod === 'card' && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                            <input type="text" placeholder={t(language, 'cardNumber')} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-mono" />
                            <div className="flex gap-2">
                              <input type="text" placeholder="MM/YY" className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px]" />
                              <input type="password" placeholder="CVV" className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px]" />
                            </div>
                          </div>
                        )}

                        {bookingData.paymentMethod === 'upi' && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <input type="text" placeholder="username@upi" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold" />
                          </div>
                        )}

                        {bookingData.paymentMethod === 'qr' && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                            <QrCode className="w-24 h-24 text-slate-800 mb-2" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t(language, 'scanUpi')}</p>
                          </div>
                        )}

                        <button
                          onClick={() => handleBookingAction('FINALIZE_BOOKING')}
                          className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100"
                        >
                          {t(language, 'payConfirm')}
                        </button>
                      </div>
                    )}

                    {m.type === 'BOOKING_SUCCESS' && (
                      <div className="mt-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-4">
                        <div className="w-12 h-12 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <Check className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-emerald-900">{t(language, 'paySuccess')}</h4>
                          <p className="text-[10px] font-bold text-emerald-700">{t(language, 'ticketActive')}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-emerald-100 text-left">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>{t(language, 'ticketId')}</span><span className="text-slate-900 font-black">#{m.ticket?.id}</span></div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>{t(language, 'museum')}</span><span className="text-slate-900 font-black">{m.ticket?.event_name}</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => { setSelectedTicket(m.ticket); setIsModalOpen(true); }}
                            className="flex items-center justify-center gap-2 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            <Eye className="w-4 h-4" /> {t(language, 'view')}
                          </button>
                          <button
                            onClick={() => handleDownload(m.ticket)}
                            className="flex items-center justify-center gap-2 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            <Download className="w-4 h-4" /> {t(language, 'download')}
                          </button>
                        </div>

                        <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
                          {t(language, 'goDashboard')}
                        </button>
                      </div>
                    )}

                    {m.type === 'SUPPORT_FORM' && (
                      <div className="mt-4 space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">{t(language, 'adminSupport')}</h4>
                        <input
                          type="text" placeholder={t(language, 'subject')}
                          value={supportData.subject}
                          onChange={e => setSupportData(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 text-xs font-bold shadow-sm"
                        />
                        <textarea
                          placeholder={t(language, 'describeIssue')}
                          value={supportData.message}
                          onChange={e => setSupportData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 text-xs font-bold min-h-[100px] resize-none shadow-sm"
                        />
                        <button
                          onClick={() => handleBookingAction('SUBMIT_SUPPORT')}
                          disabled={!supportData.subject.trim() || !supportData.message.trim()}
                          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                          {t(language, 'submitAdmin')}
                        </button>
                      </div>
                    )}

                    {m.action && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <button onClick={() => {
                          if (m.action.type === 'BOOK_FLOW') {
                            handleSend('Book Tickets');
                          } else {
                            navigate(m.action.path);
                          }
                        }} className="flex items-center justify-between w-full p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all group">
                          <span className="text-[10px] font-black uppercase tracking-widest">{m.action.label}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 mt-2 text-[9px] font-black uppercase tracking-widest text-slate-300 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span>{m.time}</span>
                    {m.role === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Footer / Input */}
        <div className="px-6 py-6 bg-white border-t border-slate-100">
          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => handleSend(TRANSLATED_ACTIONS[language || 'English']?.book || 'Book Tickets')} className="flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm hover:shadow-md bg-blue-50 text-blue-600 border-blue-100">
              <Ticket className="w-4 h-4" /> {TRANSLATED_ACTIONS[language || 'English']?.book || 'Book Tickets'}
            </button>
            <button onClick={() => handleSend(TRANSLATED_ACTIONS[language || 'English']?.price || 'View Prices')} className="flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm hover:shadow-md bg-emerald-50 text-emerald-600 border-emerald-100">
              <Landmark className="w-4 h-4" /> {TRANSLATED_ACTIONS[language || 'English']?.price || 'View Prices'}
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={t(language, 'askAnything')} className="flex-grow py-3 px-4 outline-none font-bold text-slate-700 bg-transparent text-sm" />
            <button type="submit" disabled={!input.trim()} className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-700 disabled:opacity-30 shrink-0 transition-all">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <TicketModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ChatbotPage;
