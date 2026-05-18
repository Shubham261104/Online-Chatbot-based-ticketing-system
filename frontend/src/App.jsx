import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { useEffect } from 'react';

import Home from './pages/Home';
import Booking from './pages/Booking';
import ShowsEvents from './pages/ShowsEvents';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChatbotPage from './pages/ChatbotPage';
import Profile from './pages/Profile';
import EventBooking from './pages/EventBooking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideFooter = location.pathname === '/chat';

  // Force logout when the website is first started (per session)
  useEffect(() => {
    const appStarted = sessionStorage.getItem('appStarted');
    if (!appStarted) {
      localStorage.clear();
      sessionStorage.setItem('appStarted', 'true');
    }
  }, []);

  // Guard: If not logged in, redirect to login page (except for login/register)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const isPublicPage = ['/about', '/contact', '/privacy', '/terms', '/cookies'].includes(location.pathname);

    if (!token && !isAuthPage && !isPublicPage) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/shows" element={<ShowsEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/event-booking" element={<EventBooking />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>

      </main>
      {!hideFooter && <Footer />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
