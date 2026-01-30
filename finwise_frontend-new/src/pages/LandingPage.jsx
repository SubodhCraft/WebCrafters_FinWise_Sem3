import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Target,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  Calendar as CalendarIcon,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo-finwise.png';
import DashboardImg from '../assets/Dashboard.png';
import AnalyticsImg from '../assets/Analytics.png';
import GoalsImg from '../assets/Goals.png';
import CalendarImg from '../assets/Calendar.png';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode: darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => navigate('/register');
  const handleLogin = () => navigate('/LoginPage');
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'bg-[#030712] text-slate-100' : 'bg-white text-slate-900'}`}>

      {/* Precision Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div className={`max-w-6xl mx-auto px-6 h-16 flex items-center justify-between rounded-2xl transition-all ${isScrolled ? (darkMode ? 'bg-slate-900/80 border border-white/5 backdrop-blur-xl shadow-2xl' : 'bg-white/80 border border-slate-200 backdrop-blur-xl shadow-lg') : 'bg-transparent'}`}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="FinWise" className="w-8 h-8" />
            <span className="text-lg font-bold tracking-tight">FinWise</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <button onClick={scrollToFeatures} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors">Platform</button>
            <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors">Solutions</button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <button onClick={toggleTheme} className="text-slate-500 hover:text-indigo-600 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleLogin} className="text-sm font-bold">Sign In</button>
            <button
              onClick={handleGetStarted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20"
            >
              Get Started
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-[150] p-8 flex flex-col gap-10 md:hidden ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={logo} alt="FinWise" className="w-8 h-8" />
              <span className="text-xl font-bold">FinWise</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}><X size={28} /></button>
          </div>
          <div className="flex flex-col gap-6">
            <button onClick={scrollToFeatures} className="text-3xl font-bold text-left">Platform</button>
            <button className="text-3xl font-bold text-left">Solutions</button>
            <button onClick={handleLogin} className="text-3xl font-bold text-left">Sign In</button>
          </div>
          <button onClick={handleGetStarted} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl">Start Free Trial</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-[4.5rem] font-bold tracking-tight leading-[1.1] mb-8">
            The next generation of <br />
            <span className="text-indigo-600">wealth management.</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
            Professional-grade tracking tools for your personal economy. Monitor expenses, coordinate targets, and unlock strategic growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-24">
            <button onClick={handleGetStarted} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2">
              Start Building Wealth <ArrowRight size={20} />
            </button>
            <button onClick={scrollToFeatures} className="px-10 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-900">
              Platform Tour
            </button>
          </div>

          {/* Hero Image / Dashboard Reveal */}
          <div className="w-full max-w-6xl relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl rounded-full"></div>
            <div className={`relative rounded-3xl border-4 p-2 ${darkMode ? 'bg-slate-900 border-white/5 shadow-3xl shadow-black' : 'bg-white border-slate-100 shadow-3xl shadow-indigo-100/30'}`}>
              <img src={DashboardImg} alt="FinWise Dashboard" className="rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: Alternating Layout */}
      <section id="features" className="py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-40">

          {/* Feature 01: Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center">
                <BarChart3 size={28} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">Advanced Analytics for <br /> Strategic Growth.</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  Gain deep visibility into your capital flow. Our high-fidelity visualizations deconstruct every transaction to uncover hidden optimization opportunities.
                </p>
              </div>
              <ul className="space-y-4">
                {['Real-time spend analysis', 'Historical trend visualization', 'Predictive outflow modeling'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-sm">
                    <CheckCircle2 size={18} className="text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`relative order-1 lg:order-2 rounded-3xl overflow-hidden border-2 ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <img src={AnalyticsImg} alt="Analytics" className="w-full h-auto" />
            </div>
          </div>

          {/* Feature 02: Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`relative rounded-3xl overflow-hidden border-2 ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <img src={GoalsImg} alt="Goals" className="w-full h-auto" />
            </div>
            <div className="space-y-8">
              <div className="w-14 h-14 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center">
                <Target size={28} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">Set Your Targets. <br /> Watch Them Clear.</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  Establish high-priority savings targets and deploy capital with precision. Our goal-tracking engine ensures you hit every milestone on time.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <p className="font-bold text-2xl text-indigo-600">92%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-500 transition-colors">Success Rate</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-2xl text-purple-600">$4B+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-500 transition-colors">Capital Goal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 03: Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CalendarIcon size={28} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">Sync Your Schedule <br /> with Your Ledger.</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  Coordinate your financial life across a unified temporal grid. Visualize your daily inflow and outflow to never miss a beat.
                </p>
              </div>
              <button onClick={handleGetStarted} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">
                Try Calendar Sync
              </button>
            </div>
            <div className={`relative order-1 lg:order-2 rounded-3xl overflow-hidden border-2 ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-100 shadow-2xl shadow-indigo-100/30'}`}>
              <img src={CalendarImg} alt="Calendar" className="w-full h-auto" />
            </div>
          </div>

        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-6 border-y border-slate-100 dark:border-white/5 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">"The most professional financial <br /> tool I've ever deployed."</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center font-bold text-indigo-600">JD</div>
            <div className="text-left">
              <p className="font-bold">John Doe</p>
              <p className="text-xs text-slate-500">Wealth Strategist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-10">Ready to scale?</h2>
          <button
            onClick={handleGetStarted}
            className="px-16 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all"
          >
            Create Your Account
          </button>
          <p className="mt-8 text-slate-500 font-medium tracking-tight hover:text-indigo-600 transition-colors cursor-pointer">Start your free 14-day execution period. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FinWise" className="w-8 h-8 opacity-60" />
            <span className="text-lg font-bold opacity-60">FinWise</span>
          </div>
          <div className="flex gap-12 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
          </div>
          <p className="text-sm text-slate-400 font-medium">© 2026 FinWise Core Architecture</p>
        </div>
      </footer>
    </div>
  );
}