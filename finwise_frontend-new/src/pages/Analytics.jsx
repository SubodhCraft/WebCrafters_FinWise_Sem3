import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Download, Calendar, TrendingUp, TrendingDown, DollarSign,
  Filter, FileText, Activity, Zap, Loader2
} from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Header from '../components/Layout/Header.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6'];

const Analytics = () => {
  const { currency, formatAmount, getCurrencySymbol, isPrivacyMode } = useCurrency();
  const { isDarkMode: darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({ income: [], expense: [] });
  const [trendsData, setTrendsData] = useState([]);
  const [stats, setStats] = useState({ balance: 0, income: 0, expenses: 0 });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const categoryResponse = await axios.get(`${API_URL}/transactions/analytics/category`, {
        params: dateRange,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (categoryResponse.data) {
        setCategoryData({
          income: categoryResponse.data.income || [],
          expense: categoryResponse.data.expense || []
        });
      }
      const trendsResponse = await axios.get(`${API_URL}/transactions/analytics/trends`, {
        params: { months: 6 },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (trendsResponse.data?.trends) {
        setTrendsData(trendsResponse.data.trends);
      }
      const statsResponse = await axios.get(`${API_URL}/transactions/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(24);
      doc.setTextColor(79, 70, 229);
      doc.text('FinWise Analytics', 105, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text('Quarterly Financial Strategy & Analytics Performance', 105, 28, { align: 'center' });

      // Report Info
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 45);
      doc.text(`Total Records Analyzed: ${trendsData.length} Months`, 14, 50);

      // Section 1: Executive Summary
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Executive Summary', 14, 65);

      const summaryData = [
        ['Liquidity Metric', 'Absolute Value', 'Status'],
        ['Total Strategic Inflow', `${getCurrencySymbol()} ${formatAmount(stats.income || 0)}`, 'Growth'],
        ['Executive Outflow', `${getCurrencySymbol()} ${formatAmount(stats.expenses || 0)}`, 'Controlled'],
        ['Net Capital Retention', `${getCurrencySymbol()} ${formatAmount(stats.balance || 0)}`, 'Positive'],
        ['Retention Efficiency', `${(stats.income || 0) > 0 ? (((stats.balance || 0) / (stats.income || 1)) * 100).toFixed(1) : 0}%`, 'Optimal']
      ];

      autoTable(doc, {
        startY: 70,
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 5 }
      });

      // Section 2: Monthly Strategic Performance
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Monthly Strategic Performance', 14, 20);

      const trendsTableData = trendsData.map(item => [
        item.month,
        `${getCurrencySymbol()} ${formatAmount(item.income)}`,
        `${getCurrencySymbol()} ${formatAmount(item.expense)}`,
        `${getCurrencySymbol()} ${formatAmount(item.net)}`
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Month', 'Inflow', 'Outflow', 'Net Growth']],
        body: trendsTableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 4 },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const val = data.cell.raw;
            if (val && !val.includes('-')) data.cell.styles.textColor = [16, 185, 129];
          }
        }
      });

      // Section 3: Expense Allocation Matrix
      if (categoryData.expense.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Expense Allocation Matrix', 14, doc.lastAutoTable.finalY + 20);

        const expenseTableData = categoryData.expense.map(item => [
          item.name,
          `${getCurrencySymbol()} ${formatAmount(item.value || 0)}`,
          `${(((item.value || 0) / (stats.expenses || 1)) * 100).toFixed(1)}%`
        ]);

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 25,
          head: [['Asset Category', 'Allocation Amount', 'Portfolio %']],
          body: expenseTableData,
          theme: 'striped',
          headStyles: { fillColor: [244, 63, 94], textColor: 255 },
          styles: { fontSize: 8, cellPadding: 4 }
        });
      }

      doc.save(`FinWise_Analytical_Performance_${new Date().getTime()}.pdf`);
      toast.success('Executive analytical report generated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate professional report');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <p className="text-xs font-bold text-slate-500 mb-2">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
              {entry.name}: {getCurrencySymbol()} {formatAmount(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <Header title="Analytics" />

        <main className="flex-1 p-8 space-y-10 relative z-10 mt-20">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
              <p className="text-slate-500 text-sm mt-1">Detailed breakdown of your income and expenses.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}
              >
                <Filter size={16} />
                Filters
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {showFilters && (
            <div className={`p-8 rounded-2xl border animate-in fade-in slide-in-from-top-4 duration-300 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold outline-none ${darkMode ? 'bg-slate-800/50 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold outline-none ${darkMode ? 'bg-slate-800/50 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchAnalyticsData}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Generating analytics...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Net Savings', value: isPrivacyMode ? 'XXXX' : stats.balance, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                  { label: 'Total Income', value: isPrivacyMode ? 'XXXX' : stats.income, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Total Expenses', value: isPrivacyMode ? 'XXXX' : stats.expenses, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                  { label: 'Savings Rate', value: isPrivacyMode ? 'XXXX' : `${stats.income > 0 ? ((stats.balance / stats.income) * 100).toFixed(1) : 0}%`, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                ].map((s, i) => (
                  <div key={i} className={`p-6 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-lg ${s.bg} ${s.color}`}>
                        <s.icon size={18} />
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-2xl font-bold tracking-tight">
                      {typeof s.value === 'number' ? `${getCurrencySymbol()} ${formatAmount(s.value)}` : s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`p-8 rounded-2xl border relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-lg font-bold mb-8">Income vs Expenses</h3>
                  <div className={`h-[300px] transition-all duration-700 ${isPrivacyMode ? 'blur-xl opacity-30 select-none pointer-events-none' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: darkMode ? '#030712' : '#fff' }} name="Income" />
                        <Line type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={3} dot={{ r: 4, fill: '#F43F5E', strokeWidth: 2, stroke: darkMode ? '#030712' : '#fff' }} name="Expenses" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-8 rounded-2xl border relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-lg font-bold mb-8">Savings Over Time</h3>
                  <div className={`h-[300px] transition-all duration-700 ${isPrivacyMode ? 'blur-xl opacity-30 select-none pointer-events-none' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendsData}>
                        <defs>
                          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="net" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" name="Net Savings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Composition Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`p-8 rounded-2xl border relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-lg font-bold mb-8">Expenses by Category</h3>
                  <div className={`h-[300px] transition-all duration-700 ${isPrivacyMode ? 'blur-xl opacity-30 select-none pointer-events-none' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData.expense} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} width={80} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                          {categoryData.expense.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-8 rounded-2xl border relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-lg font-bold mb-8">Expense Distribution</h3>
                  <div className={`h-[300px] transition-all duration-700 ${isPrivacyMode ? 'blur-xl opacity-30 select-none pointer-events-none' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.expense.length > 0 ? categoryData.expense : [{ name: 'N/A', value: 1 }]}
                          cx="50%" cy="50%"
                          innerRadius={70} outerRadius={110}
                          paddingAngle={5} dataKey="value"
                          stroke="none"
                        >
                          {categoryData.expense.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                          {categoryData.expense.length === 0 && <Cell fill="#cbd5e1" />}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold">Monthly Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-slate-800">
                        <th className="px-8 py-5 text-left">Month</th>
                        <th className="px-8 py-5 text-right">Income</th>
                        <th className="px-8 py-5 text-right">Expenses</th>
                        <th className="px-8 py-5 text-right">Net Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {trendsData.map((item, index) => (
                        <tr key={index} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors`}>
                          <td className="px-8 py-5 font-bold text-sm">{item.month}</td>
                          <td className="px-8 py-5 text-right font-bold text-sm text-emerald-500">+{getCurrencySymbol()} {formatAmount(item.income)}</td>
                          <td className="px-8 py-5 text-right font-bold text-sm text-rose-500">-{getCurrencySymbol()} {formatAmount(item.expense)}</td>
                          <td className={`px-8 py-5 text-right font-bold text-sm ${item.net >= 0 ? 'text-indigo-500' : 'text-orange-500'}`}>
                            {item.net >= 0 ? '+' : ''}{getCurrencySymbol()} {formatAmount(item.net)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;