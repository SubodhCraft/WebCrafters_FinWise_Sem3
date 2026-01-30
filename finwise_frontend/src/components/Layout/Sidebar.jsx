import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  StickyNote,
  Calendar,
  Target,
  PieChart,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  User,
  HelpCircle,
  Bell,
  Heart
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo-finwise.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode: darkMode } = useTheme();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    navigate('/LoginPage');
  };

  const navGroups = [
    {
      title: 'Main Menu',
      items: [
        { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'analytics', path: '/analytics', icon: PieChart, label: 'Analytics' },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'notes', path: '/selfnotes', icon: StickyNote, label: 'Self Notes' },
        { id: 'calendar', path: '/calendar', icon: Calendar, label: 'Calendar' },
        { id: 'goals', path: '/goals', icon: Target, label: 'Goals' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  if (isAdmin) {
    navGroups.push({
      title: 'Administration',
      items: [
        { id: 'admin', path: '/admin', icon: Shield, label: 'Admin Panel' }
      ]
    });
  }

  return (
    <aside className={`w-72 h-screen fixed left-0 top-0 flex flex-col transition-all duration-500 z-[100] border-r ${darkMode ? 'bg-slate-950 border-white/5 text-slate-100' : 'bg-white border-slate-100 text-slate-900 shadow-xl shadow-slate-200/20'}`}>

      {/* Sweet & Professional Brand Identity */}
      <div className="p-8 pb-8">
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110">
            <img src={logo} alt="FinWise" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none">
              Fin<span className="text-indigo-600">Wise</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">Your Wealth Partner</p>
          </div>
        </div>
      </div>

      {/* Elegant Navigation Matrix */}
      <nav className="flex-1 px-6 space-y-8 overflow-y-auto custom-scrollbar pb-8">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {group.title}
            </h3>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : `text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-indigo-50/50'}`
                      }`}
                  >
                    <div className="flex items-center gap-4 relative z-10 w-full">
                      <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'}`} />
                      <span className="font-semibold text-sm tracking-tight">{item.label}</span>
                    </div>

                    {isActive && (
                      <div className="opacity-50">
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>


      {/* Friendly Profile Section */}
      <div className="p-6 pt-0">
        <div className={`p-4 rounded-[2rem] border transition-all duration-500 ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-xs truncate leading-none mb-1">{user.fullName || user.username || 'User'}</p>
              <p className="text-[9px] font-medium text-slate-400 truncate">{user.email || 'Premium Member'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 text-[10px] font-bold uppercase tracking-widest ${darkMode
              ? 'bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'
              : 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;