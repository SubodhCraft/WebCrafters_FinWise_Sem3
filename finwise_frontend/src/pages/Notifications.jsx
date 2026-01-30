import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownLeft, Trash2, Filter, Layers, BellRing, Activity } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { getRecentTransactionsApi } from '../../service/api.js';

const Notifications = () => {
    const { isDarkMode: darkMode } = useTheme();
    const { currency, formatAmount, getCurrencySymbol } = useCurrency();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, [currency]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getRecentTransactionsApi();
            if (response.data?.success) {
                const transNotifs = response.data.transactions.map(t => ({
                    id: t.id,
                    type: t.type === 'income' ? 'income' : 'expense',
                    title: `New ${t.type === 'income' ? 'Inflow' : 'Outflow'} Logged`,
                    description: `${t.category}: ${t.remarks || 'Financial ledger update recorded successfully.'}`,
                    amount: t.amount,
                    time: new Date(t.date).toLocaleString(),
                    unread: true
                }));

                // Add some mock system notifications
                const systemNotifs = [
                    {
                        id: 'sys-1',
                        type: 'system',
                        title: 'Welcome to FinWise Premium',
                        description: 'Your strategic wealth management workspace is now active. Explore Analytics for deeper insights.',
                        time: new Date().toLocaleDateString(),
                        unread: false
                    }
                ];

                setNotifications([...transNotifs, ...systemNotifs]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'income': return <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><ArrowUpRight size={24} /></div>;
            case 'expense': return <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><ArrowDownLeft size={24} /></div>;
            default: return <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl"><Bell size={24} /></div>;
        }
    };

    return (
        <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <Sidebar />
            <div className="flex-1 ml-72 relative">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <Header title="Notification Center" />

                <main className="p-8 mt-24 max-w-5xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                                    <Bell size={20} />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Review your real-time financial alerts and system logs.</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setNotifications([])}
                                className={`flex items-center gap-2 px-6 py-3 border-2 transition-all font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl ${darkMode ? 'border-slate-800 text-slate-400 hover:border-rose-500 hover:text-rose-500' : 'border-slate-100 text-slate-400 hover:border-rose-500 hover:text-rose-500'}`}
                            >
                                <Trash2 size={16} />
                                Purge Logs
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className={`p-8 rounded-[2.5rem] border animate-pulse ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                                    <div className="flex gap-6">
                                        <div className="w-14 h-14 bg-slate-800/50 rounded-2xl"></div>
                                        <div className="space-y-3 flex-1">
                                            <div className="h-5 bg-slate-800/50 rounded-lg w-1/3"></div>
                                            <div className="h-4 bg-slate-800/50 rounded-lg w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : notifications.length === 0 ? (
                            <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-400">
                                    <BellRing size={48} className="animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">Strategy Inbox Empty</h3>
                                <p className="text-slate-500 text-sm italic font-medium max-w-xs mx-auto">"Precision is the core of wealth management. You are currently all caught up."</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${darkMode ? 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-900 hover:border-indigo-500/30' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5'}`}
                                >
                                    {/* Status Indicator */}
                                    {n.unread && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>}

                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex gap-6">
                                            <div className="group-hover:scale-110 transition-transform duration-500">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-xl tracking-tight">{n.title}</h4>
                                                    {n.unread && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                                                </div>
                                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl">{n.description}</p>

                                                <div className="flex flex-wrap items-center gap-4 mt-6">
                                                    <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                                        <Layers size={12} className="text-slate-400" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{n.time}</span>
                                                    </div>

                                                    {n.amount && (
                                                        <div className={`py-1.5 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm ${n.type === 'income' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                                                            {n.type === 'income' ? '+' : '-'}{getCurrencySymbol()} {formatAmount(n.amount)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setNotifications(notifications.filter(notif => notif.id !== n.id))}
                                            className="opacity-0 group-hover:opacity-100 p-3 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default Notifications;
=======
export default Notifications;
>>>>>>> origin/Shraddha
