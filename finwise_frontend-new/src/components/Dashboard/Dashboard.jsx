import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Loader2,
  Trash2,
  Download,
  DollarSign,
  Activity,
  ChevronRight,
  MoreVertical,
  Calendar,
  Wallet,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  getUserProfileApi,
  getAllCategoriesApi,
  getTransactionStatsApi,
  getRecentTransactionsApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi
} from '../../../service/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const Dashboard = () => {
  const { currency, formatAmount, getCurrencySymbol, isPrivacyMode } = useCurrency();
  const { isDarkMode: darkMode } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [userData, setUserData] = useState({ id: null, username: '', email: '' });
  const [stats, setStats] = useState({ balance: 0, income: 0, expenses: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchUserData(),
        fetchCategories(),
        fetchDashboardData()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getUserProfileApi();
      if (response.data.success) {
        setUserData({
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      if (response.data) {
        setCategories({
          income: response.data.incomeCategories || [],
          expense: response.data.expenseCategories || []
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setTransactionsLoading(true);
      const [statsRes, transactionsRes] = await Promise.all([
        getTransactionStatsApi(),
        getRecentTransactionsApi()
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (transactionsRes.data?.transactions) {
        setRecentTransactions(Array.isArray(transactionsRes.data.transactions) ? transactionsRes.data.transactions : []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error('Required fields missing');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...formData,
        type: transactionType,
        amount: parseFloat(formData.amount)
      };

      if (isEditing && selectedTransaction) {
        await updateTransactionApi(selectedTransaction.id, payload);
        toast.success(`Transaction updated`);
      } else {
        await createTransactionApi(payload);
        toast.success(`Transaction recorded`);
      }

      setShowModal(false);
      setIsEditing(false);
      fetchDashboardData();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update record' : 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setTransactionType(transaction.type);
    setFormData({
      category: transaction.category,
      amount: transaction.amount.toString(),
      remarks: transaction.remarks || '',
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    setIsEditing(true);
    setShowTypeSelector(false);
    setShowDetailsModal(false);
    setShowModal(true);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(24);
      doc.setTextColor(79, 70, 229);
      doc.text('FinWise', 105, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text('Executive Financial Statement', 105, 28, { align: 'center' });

      // Info Section
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Issuer: @${userData.username || 'user'}`, 14, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 45);
      doc.text(`Currency: ${currency}`, 14, 50);

      // Summary Table
      autoTable(doc, {
        startY: 60,
        head: [['Strategic Summary', 'Value']],
        body: [
          ['Total Volume (Income)', `${getCurrencySymbol()} ${formatAmount(stats.income)}`],
          ['Executive Outflow (Expenses)', `${getCurrencySymbol()} ${formatAmount(stats.expenses)}`],
          ['Liquidity Position (Balance)', `${getCurrencySymbol()} ${formatAmount(stats.balance)}`],
          ['Efficiency (Savings Rate)', `${stats.income > 0 ? (((stats.income - stats.expenses) / stats.income) * 100).toFixed(1) : 0}%`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });

      // Transaction Detailed Ledger
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Transaction Ledger', 14, doc.lastAutoTable.finalY + 20);

      const tableData = recentTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.category,
        t.type.toUpperCase(),
        t.remarks || 'No description provided.',
        `${t.type === 'income' ? '+' : '-'}${getCurrencySymbol()} ${formatAmount(t.amount)}`
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Date', 'Category', 'Type', 'Description', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          4: { halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 4) {
            const val = data.cell.raw;
            if (val.startsWith('+')) data.cell.styles.textColor = [16, 185, 129];
            if (val.startsWith('-')) data.cell.styles.textColor = [244, 63, 94];
          }
        }
      });

      doc.save(`FinWise_Report_${new Date().getTime()}.pdf`);
      toast.success('Professional report generated');
    } catch (e) {
      console.error(e);
      toast.error('Export failed');
    }
  };

  const filteredTransactions = recentTransactions;

  // Mock Trend for Chart
  const trendData = [
    { name: 'Mon', balance: stats.balance * 0.8 },
    { name: 'Tue', balance: stats.balance * 0.85 },
    { name: 'Wed', balance: stats.balance * 0.9 },
    { name: 'Thu', balance: stats.balance * 0.82 },
    { name: 'Fri', balance: stats.balance * 0.95 },
    { name: 'Sat', balance: stats.balance * 0.98 },
    { name: 'Sun', balance: stats.balance },
  ];

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <Header title="Dashboard" />

        <main className="flex-1 p-8 space-y-8 mt-20 max-w-[1600px] mx-auto w-full relative z-10">

          {/* Executive Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div>

              <h1 className="text-4xl font-bold tracking-tight">Dash<span className="text-indigo-600">Board</span></h1>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowTypeSelector(true);
                  setTransactionType(null);
                  setFormData({ category: '', amount: '', remarks: '', date: new Date().toISOString().split('T')[0] });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Plus size={18} />
                New Record
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Income', value: isPrivacyMode ? 'XXXX' : stats.income, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Total Expenses', value: isPrivacyMode ? 'XXXX' : stats.expenses, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { label: 'Net Savings', value: isPrivacyMode ? 'XXXX' : stats.income - stats.expenses, icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Savings Rate', value: isPrivacyMode ? 'XXXX' : `${stats.income > 0 ? (((stats.income - stats.expenses) / stats.income) * 100).toFixed(1) : 0}%`, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' }
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <MoreVertical size={16} className="text-slate-300" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold tracking-tight">
                  {typeof stat.value === 'number' ? `${getCurrencySymbol()} ${formatAmount(stat.value)}` : stat.value}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8">

            {/* Primary Analytic Area */}
            <div className="col-span-12 space-y-8">

              {/* Transaction Ledger Table */}
              <div className={`rounded-[2rem] border overflow-hidden ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/10 text-indigo-600 rounded-xl"><Layers size={20} /></div>
                    <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
                  </div>
                  <button onClick={exportToPDF} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Download Statement</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`text-[11px] font-bold uppercase tracking-wider border-b ${darkMode ? 'text-gray-500 border-white/5 bg-white/2' : 'text-gray-400 border-gray-50 bg-gray-50/30'}`}>
                        <th className="px-8 py-5 text-left font-bold">Transaction</th>
                        <th className="px-8 py-5 text-left font-bold">Description</th>
                        <th className="px-8 py-5 text-right font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
                      {transactionsLoading ? (
                        [1, 2, 3, 4, 5].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-8 py-6 flex items-center gap-4"><div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28"></div></td>
                            <td className="px-8 py-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-48"></div></td>
                            <td className="px-8 py-6 text-right"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16 ml-auto"></div></td>
                          </tr>
                        ))
                      ) : filteredTransactions.length === 0 ? (
                        <tr><td colSpan="3" className="px-8 py-20 text-center"><p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No transactions found</p></td></tr>
                      ) : (
                        filteredTransactions.map(t => (
                          <tr
                            key={t.id}
                            onClick={() => { setSelectedTransaction(t); setShowDetailsModal(true); }}
                            className={`group transition-all cursor-pointer ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                  {t.category.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold tracking-tight group-hover:text-indigo-600 transition-colors">{t.category}</p>
                                  <p className={`text-[10px] font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className={`text-sm font-medium line-clamp-1 italic max-w-sm ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`}>"{t.remarks || 'No description.'}"</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className={`text-base font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {t.type === 'income' ? '+' : '-'}{getCurrencySymbol()} {formatAmount(t.amount)}
                              </p>
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>Transaction Status</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[500] p-4">
          <div className={`w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-300 ${darkMode ? 'bg-black border-white/5' : 'bg-white border-gray-100'}`}>
            <div className={`p-10 flex flex-col items-center gap-4 text-center ${selectedTransaction.type === 'income' ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}>
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl ${selectedTransaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                <Activity size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight uppercase leading-none">{selectedTransaction.category}</h2>
                <p className={`text-[11px] font-semibold uppercase tracking-widest mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Transaction ID: #{(selectedTransaction.id || '0').toString().padStart(4, '0')}</p>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="space-y-1">
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Amount</p>
                  <p className={`text-3xl font-bold tracking-tight ${selectedTransaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {getCurrencySymbol()} {formatAmount(selectedTransaction.amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
                  <p className="text-xl font-bold">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Description</p>
                <div className={`p-6 rounded-2xl border text-sm font-medium leading-relaxed italic ${darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                  "{selectedTransaction.remarks || 'No detailed description provided.'}"
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleEdit(selectedTransaction)}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={16} />
                  Edit
                </button>
                <button
                  onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) { deleteTransactionApi(selectedTransaction.id).then(() => { toast.success('Record Deleted'); setShowDetailsModal(false); fetchDashboardData(); }); } }}
                  className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className={`w-full py-4 mt-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${darkMode ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-white' : 'bg-gray-50 border border-gray-100 text-gray-500 hover:text-black'}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[500] p-4">
          <div className={`w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-300 ${darkMode ? 'bg-black border-white/5' : 'bg-white border-gray-100'}`}>
            <div className={`p-10 border-b flex justify-between items-center ${darkMode ? 'border-white/5' : 'border-gray-50'}`}>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isEditing ? `Edit ${transactionType === 'income' ? 'Income' : 'Expense'}` : (showTypeSelector ? 'New Transaction' : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`)}
                </h2>
                <p className={`text-xs font-medium mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {isEditing ? 'Make changes to your existing record' : (showTypeSelector ? 'Select the type of transaction to add' : 'Fill in the details for your record')}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 transition-all rounded-xl ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-10">
              {showTypeSelector ? (
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => { setTransactionType('income'); setShowTypeSelector(false); }}
                    className={`p-10 rounded-3xl group transition-all flex flex-col items-center gap-4 active:scale-95 border-2 ${darkMode ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-200'}`}
                  >
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-center">
                      <ArrowUpRight size={28} />
                    </div>
                    <span className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Income</span>
                  </button>
                  <button
                    onClick={() => { setTransactionType('expense'); setShowTypeSelector(false); }}
                    className={`p-10 rounded-3xl group transition-all flex flex-col items-center gap-4 active:scale-95 border-2 ${darkMode ? 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30' : 'bg-rose-50 border-rose-100 hover:border-rose-200'}`}
                  >
                    <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl shadow-lg flex items-center justify-center">
                      <ArrowDownRight size={28} />
                    </div>
                    <span className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>Expense</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Amount</label>
                      <div className="relative group">
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{getCurrencySymbol()}</span>
                        <input
                          type="number"
                          required
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className={`w-full pl-9 pr-4 py-3.5 rounded-2xl border transition-all outline-hidden text-sm font-bold ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl border transition-all outline-hidden text-sm font-bold appearance-none ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                      >
                        <option value="">Select Category</option>
                        {(transactionType === 'income' ? categories.income : categories.expense).map(c => <option key={c.id} value={c.name} className={darkMode ? 'bg-slate-900' : 'bg-white'}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-hidden text-sm font-bold ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-4 focus:ring-white/5 [color-scheme:dark]' : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Remarks</label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className={`w-full h-24 px-5 py-4 rounded-2xl border transition-all outline-hidden text-sm font-medium resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                      placeholder="Add a brief description..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTypeSelector(true)}
                      className={`flex-1 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all active:scale-[0.98] ${darkMode ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-white' : 'bg-gray-50 border border-gray-100 text-gray-500 hover:text-black'}`}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-[2] py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 ${darkMode ? 'bg-white text-black hover:bg-gray-100 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)]' : 'bg-black text-white hover:bg-gray-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]'}`}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? 'Update Transaction' : 'Save Transaction')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;