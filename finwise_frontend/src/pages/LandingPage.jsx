import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, TrendingUp, Wallet, PieChart, Calendar, CreditCard, Receipt, PiggyBank, ShoppingBag, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);


const navigate = useNavigate();
const handleGetStarted = () => {
  navigate('/login');
};

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Header */}
      <header className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between backdrop-blur-sm bg-white/60 rounded-2xl px-6 py-4 shadow-lg border border-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                {!logoError ? (
                  <img 
                    src="/logo.png" 
                    alt="FinWise Logo" 
                    className="w-full h-full object-contain p-1"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-purple-600 via-purple-700 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    FW
                  </div>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent">
                FinWise
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
    
              <button className="px-6 py-2.5 text-gray-700 rounded-full font-medium hover:bg-purple-50 transition-all duration-300">
                About
              </button>
             
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 backdrop-blur-sm bg-white/90 rounded-2xl p-6 shadow-lg border border-white/40">
              <nav className="flex flex-col gap-3">
                <button className="px-6 py-3 text-gray-700 rounded-full font-medium hover:bg-purple-50 transition-all text-left">
                  About
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto text-center">
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
            Take Control of Your
            <br />
            <span className="bg-linear-to-r from-purple-600 via-purple-700 to-blue-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4">
            Track expenses, manage budgets, and achieve your financial goals with FinWise. 
            Simple, powerful, and designed for your success.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-10 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
              Get Started  <ArrowRight size={22} />
            </button>
            
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </section>

      {/* Dashboard Preview */}
      <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to simplify your financial life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Budget Overview Card */}
            <div className="lg:col-span-4 group hover:-translate-y-2 transition-all duration-300">
              <div className="h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 border border-purple-100 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <PieChart className="text-purple-600" size={24} />
                    Budget Overview
                  </h4>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    On Track
                  </span>
                </div>
                
                <div className="relative h-48 flex items-center justify-center mb-6">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#f3e8ff" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke="url(#gradient)" strokeWidth="12" fill="none"
                      strokeDasharray="440" strokeDashoffset="141" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-purple-700">68%</span>
                    <span className="text-sm text-gray-500">Used</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Budget</span>
                    <span className="font-bold text-gray-900">NPR 500,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-bold text-red-600">NPR 340,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-bold text-green-600">NPR 160,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Income & Expenses Card */}
            <div className="lg:col-span-4 group hover:-translate-y-2 transition-all duration-300">
              <div className="h-full bg-linear-to-br from-purple-600 to-blue-600 rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 text-white transition-all">
                <h4 className="text-lg font-bold mb-6">Monthly Summary</h4>
                
                <div className="space-y-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-purple-100">Total Income</p>
                        <p className="text-2xl font-bold">NPR 75,750</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2" style={{width: '85%'}}></div>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/30 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                        <Wallet size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-purple-100">Total Expenses</p>
                        <p className="text-2xl font-bold">NPR 35,350</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2" style={{width: '47%'}}></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Net Savings</span>
                      <span className="text-2xl font-bold">NPR 40,400</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Transaction */}
            <div className="lg:col-span-4 group hover:-translate-y-2 transition-all duration-300">
              <div className="h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 border border-purple-100 flex flex-col justify-center items-center text-center transition-all">
                <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Plus size={40} className="text-purple-600" strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Add Transaction</h4>
                <p className="text-gray-600 mb-6">Track your income and expenses in seconds</p>
                <button className="w-full px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                  Add New
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-6 group hover:-translate-y-2 transition-all duration-300">
              <div className="h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 border border-purple-100 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Receipt className="text-purple-600" size={24} />
                    Recent Activity
                  </h4>
                  <button className="text-sm text-purple-600 font-semibold hover:text-purple-700">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: PiggyBank, label: 'Salary Deposit', amount: '+75,000', color: 'text-green-600', bg: 'bg-green-50', date: 'Today' },
                    { icon: ShoppingBag, label: 'Grocery Shopping', amount: '-5,400', color: 'text-red-600', bg: 'bg-red-50', date: 'Yesterday' },
                    { icon: CreditCard, label: 'Online Shopping', amount: '-15,750', color: 'text-red-600', bg: 'bg-red-50', date: '2 days ago' },
                    { icon: Receipt, label: 'Utility Bills', amount: '-9,600', color: 'text-red-600', bg: 'bg-red-50', date: '3 days ago' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-purple-50 rounded-2xl transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                          <item.icon className={item.color.replace('text-', 'text-').replace('-600', '-500')} size={22} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-lg ${item.color}`}>
                        NPR {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="lg:col-span-6 group hover:-translate-y-2 transition-all duration-300">
              <div className="h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl p-6 sm:p-8 border border-purple-100 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="text-purple-600" size={24} />
                    December 2025
                  </h4>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                      ←
                    </button>
                    <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                      →
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['S','M','T','W','T','F','S'].map(day => (
                    <div key={day} className="text-sm font-bold text-gray-400 py-2">{day}</div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => {
                    const isToday = i + 1 === 26;
                    const hasTransaction = [5, 10, 15, 20, 25].includes(i + 1);
                    return (
                      <div
                        key={i}
                        className={`
                          aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer relative
                          ${isToday 
                            ? 'bg-linear-to-br from-purple-600 to-blue-600 text-white shadow-lg scale-110' 
                            : hasTransaction
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'text-gray-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        {i + 1}
                        {hasTransaction && !isToday && (
                          <span className="absolute bottom-1 w-1 h-1 bg-purple-600 rounded-full"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-linear-to-br from-purple-600 via-purple-700 to-blue-600 rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Start Your Financial Journey?
              </h3>
              <p className="text-lg sm:text-xl text-purple-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of users who have transformed their financial lives with FinWise
              </p>
              <button 
              onClick={handleGetStarted}
              className="px-12 py-5 bg-white text-purple-700 text-lg font-bold rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto">
                Get Started <ArrowRight size={22} />
              </button>
              <p className="text-sm text-purple-100 mt-6">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="FinWise Logo" 
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  FW
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FinWise</h1>
          </div>
          <p className="text-gray-600 mb-6">Making financial management simple and accessible for everyone</p>
         
          <p className="text-sm text-gray-500 mt-8">©️ 2025 FinWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}