import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar as CalendarIcon,
  Loader2,
  ArrowRight,
  PieChart,
  Activity
} from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import toast from 'react-hot-toast';
import { getCalendarTransactionsApi } from '../../service/api';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Calendar = () => {
  const { formatAmount, getCurrencySymbol } = useCurrency();
  const { isDarkMode: darkMode } = useTheme();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthTransactions();
  }, [currentDate]);

  const fetchMonthTransactions = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await getCalendarTransactionsApi(year, month);
      setTransactions(response.data.transactions || {});
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(1);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const yearName = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const selectedTransactions = transactions[selectedDate] || [];
  const totalIncome = selectedTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = selectedTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalIncome - totalExpense;

  const getDaySummary = (day) => {
    const dayTransactions = transactions[day] || [];
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, count: dayTransactions.length };
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <Header title="Calendar" />

        <main className="flex-1 p-8 space-y-10 relative z-10 mt-20">

          {/* Executive Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Financial Calendar</h1>
              <p className="text-slate-500 text-sm mt-1">Track your income and expenses day by day.</p>
            </div>

            <div className={`flex items-center gap-3 p-1.5 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 text-sm font-bold tracking-tight min-w-[140px] text-center">
                {monthName} {yearName}
              </div>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">

            {/* Calendar Visualization (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="grid grid-cols-7 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {emptyDays.map((_, i) => <div key={`empty-${i}`} className="h-24" />)}
                  {days.map(day => {
                    const summary = getDaySummary(day);
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                    const isSelected = selectedDate === day;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`h-24 p-2 rounded-xl border-2 transition-all flex flex-col justify-between group relative overflow-hidden ${isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg active:scale-95'
                          : isToday
                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 font-bold'
                            : `bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`
                          }`}
                      >
                        <span className="text-xs font-bold leading-none">{day}</span>

                        {summary.count > 0 && (
                          <div className="space-y-1">
                            {summary.income > 0 && (
                              <div className={`h-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-emerald-500'}`} style={{ width: '100%' }}></div>
                            )}
                            {summary.expense > 0 && (
                              <div className={`h-1.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-rose-500'}`} style={{ width: '60%' }}></div>
                            )}
                          </div>
                        )}
                        {!isSelected && summary.count > 0 && (
                          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>


            </div>

            {/* Side Panel (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-8">

              {/* Day Details Card */}
              <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-bold">Daily Summary</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{monthName} {selectedDate}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'}`}>
                    {selectedDate}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Income</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">+{getCurrencySymbol()}{formatAmount(totalIncome)}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <div className="flex items-center gap-3">
                      <TrendingDown size={16} className="text-rose-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expense</span>
                    </div>
                    <span className="text-sm font-bold text-rose-500">-{getCurrencySymbol()}{formatAmount(totalExpense)}</span>
                  </div>

                  <div className={`mt-8 p-6 rounded-xl border-2 transition-all ${netAmount >= 0 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-white'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 text-center">Net Change</p>
                    <p className="text-2xl font-bold text-center">
                      {netAmount >= 0 ? '+' : ''}{getCurrencySymbol()}{formatAmount(netAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transactions Board */}
              <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Transactions</h4>
                <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-2">
                  {selectedTransactions.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Activity size={24} className="text-slate-300" />
                      </div>
                      <p className="text-xs font-medium text-slate-400 italic">No transactions for this day.</p>
                    </div>
                  ) : (
                    selectedTransactions.map((t, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-xl border border-transparent transition-all hover:border-slate-200 dark:hover:border-slate-700 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${t.type === 'income' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-rose-500 shadow-lg shadow-rose-500/20'}`}>
                            {t.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-none mb-1">{t.category}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{t.remarks || 'No remarks'}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {getCurrencySymbol()}{formatAmount(t.amount)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {selectedTransactions.length > 0 && (
                  <button className="w-full mt-6 py-3 rounded-xl border border-indigo-600/20 text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    View Details <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;