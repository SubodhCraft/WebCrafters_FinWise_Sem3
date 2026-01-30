import React, { useState, useEffect } from 'react';
import {
  Bell,
  User,
  ChevronDown,
  X,
  Sun,
  Moon,
  Command,
  Zap,
  Globe,
  BellRing,
  LogOut
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getUserProfileApi, getRecentTransactionsApi } from '../../../service/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const Header = ({ title = 'Dashboard', user: userProp }) => {
  const { currency, toggleCurrency, getCurrencySymbol } = useCurrency();
  const { isDarkMode: darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || '{"fullName": "User", "email": "user@finwise.com"}');
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await getRecentTransactionsApi();
      if (response.data?.success) {
        // Map transactions to a notification format
        const transNotifications = response.data.transactions.slice(0, 5).map(t => ({
          id: t.id,
          title: `New ${t.type === 'income' ? 'Income' : 'Expense'}`,
          desc: `${t.category}: ${getCurrencySymbol()} ${formatAmount(t.amount)}`,
          time: new Date(t.date).toLocaleDateString(),
          type: t.type
        }));
        setNotifications(transNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [currency]); // Refresh when currency changes to update amounts

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfileApi();
        if (response.data.success) {
          setUserData(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Failed to fetch user in header', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userProp) {
      setUserData(prev => ({ ...prev, ...userProp }));
    }
  }, [userProp]);

  const userName = userData.fullName || userData.username || 'User';
  const userEmail = userData.email || 'user@finwise.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/LoginPage');
  };

  return (
    <header className={`fixed top-0 right-0 left-72 h-20 z-[40] transition-all duration-300 px-8 flex items-center justify-between border-b backdrop-blur-xl ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>

      {/* Title Area */}
      <div className="flex flex-col">
      </div>

      {/* Control Hub */}
      <div className="flex items-center gap-6">

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <button
            onClick={() => {
              toggleCurrency();
              toast.success(`Currency: ${currency === 'NPR' ? 'USD' : 'NPR'}`);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            <Globe size={18} />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${darkMode ? 'hover:bg-slate-900 text-yellow-500' : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>

        {/* Profile */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-3 p-1 rounded-2xl transition-all border ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture.startsWith('http') ? userData.profilePicture : `http://localhost:5000/uploads/profiles/${userData.profilePicture}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userName.charAt(0)
              )}
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
              <div className={`absolute top-12 right-0 w-64 rounded-2xl border shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${darkMode ? 'bg-slate-900 border-slate-800 shadow-black' : 'bg-white border-slate-100 shadow-slate-200'}`}>
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold truncate">{userName}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{userEmail}</p>
                </div>
                <div className="p-2">
                  <Link to="/settings" onClick={() => setShowProfile(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                    <User size={14} className="text-slate-500" />
                    Account Settings
                  </Link>
                  <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 transition-all ${darkMode ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'}`}>
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header >
  );
};

export default Header;
