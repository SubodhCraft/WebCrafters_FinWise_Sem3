import React, { useState, useEffect } from 'react';
import {
    Users,
    Tag,
    MessageSquare,
    TrendingUp,
    TrendingDown,
    Plus,
    Trash2,
    Shield,
    Search,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Grid,
    Key,
    Loader2,
    Database,
    Zap,
    Cpu,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    LogOut,
    CheckCircle,
    Clock,
    X,
    Filter,
    BarChart3,
    PieChart,
    AlertCircle,
    User
} from 'lucide-react';
import {
    getAdminStatsApi,
    getCategoryStatsApi,
    getAllFeedbacksApi,
    resolveFeedbackApi,
    deleteFeedbackApi,
    createCategoryApi,
    deleteCategoryApi,
    getAllCategoriesApi,
    getAllUsersAdminApi,
    deleteUserAdminApi,
    toggleUserRoleAdminApi
} from '../../service/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import logo from '../assets/logo-finwise.png';

const AdminDashboard = () => {
    const { isDarkMode: darkMode, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, recentUsers: 0 });
    const [categoryStats, setCategoryStats] = useState({ topCategories: [], leastCategories: [] });
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState({ incomeCategories: [], expenseCategories: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [showCatForm, setShowCatForm] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', type: 'expense' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalUsers: 0, totalPages: 1 });

    useEffect(() => {
        fetchData();
    }, [activeTab, currentPage]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (activeTab === 'users') {
                setCurrentPage(1);
                fetchData();
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const [statsRes, catStatsRes] = await Promise.all([getAdminStatsApi(), getCategoryStatsApi()]);
                setStats(statsRes.data.data);
                setCategoryStats(catStatsRes.data.data);
            } else if (activeTab === 'categories') {
                const catRes = await getAllCategoriesApi();
                setCategories(catRes.data);
            } else if (activeTab === 'feedbacks') {
                const feedbackRes = await getAllFeedbacksApi();
                setFeedbacks(feedbackRes.data.data);
            } else if (activeTab === 'users') {
                const usersRes = await getAllUsersAdminApi({ search: searchTerm, page: currentPage, limit: 10 });
                setUsers(usersRes.data.data);
                setPagination(usersRes.data.pagination);
            }
        } catch (error) {
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await createCategoryApi(newCat);
            toast.success("Category created successfully");
            setNewCat({ name: '', type: 'expense' });
            setShowCatForm(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to create category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategoryApi(id);
            toast.success("Category deleted");
            fetchData();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUserAdminApi(id);
            toast.success("User removed successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleToggleRole = async (id) => {
        try {
            const res = await toggleUserRoleAdminApi(id);
            toast.success(res.data.message || "Role updated");
            fetchData();
        } catch (error) {
            toast.error("Role update failed");
        }
    };

    const handleResolveFeedback = async (id) => {
        try {
            const res = await resolveFeedbackApi(id);
            toast.success(res.data.message);
            fetchData();
        } catch (error) {
            toast.error("Failed to update feedback status");
        }
    };

    const StatCard = ({ icon, label, value, trend }) => (
        <div className={`p-8 rounded-3xl border transition-all duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{icon}</div>
                {trend && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        </div>
    );

    return (
        <div className={`flex min-h-screen transition-colors duration-700 ${darkMode ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-gray-900'}`}>

            {/* Executive Admin Sidebar */}
            <div className={`w-80 h-screen fixed left-0 top-0 flex flex-col p-8 transition-all z-50 border-r ${darkMode ? 'bg-black/40 backdrop-blur-3xl border-white/5' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/50'}`}>
                <div className="flex items-center gap-4 mb-16 px-2">
                    <div className="w-12 h-12 flex items-center justify-center transition-transform hover:rotate-6">
                        <img src={logo} alt="FinWise" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Admin</h1>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Dashboard</p>
                    </div>
                </div>

                <div className="flex-1 space-y-1">
                    <p className={`px-4 text-[10px] font-bold uppercase tracking-widest mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Management</p>
                    {[
                        { id: 'overview', icon: <Activity size={18} />, label: 'Overview' },
                        { id: 'users', icon: <Users size={18} />, label: 'Users' },
                        { id: 'categories', icon: <Tag size={18} />, label: 'Categories' },
                        { id: 'feedbacks', icon: <MessageSquare size={18} />, label: 'Feedbacks' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm text-left group ${activeTab === tab.id
                                ? (darkMode ? 'bg-white text-black shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)]' : 'bg-black text-white shadow-xl')
                                : `hover:translate-x-1 ${darkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}`}
                        >
                            <span className={`transition-colors ${activeTab === tab.id ? '' : 'text-gray-400 group-hover:text-inherit'}`}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={`pt-8 border-t space-y-3 ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${darkMode ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-50 text-gray-500 hover:text-black'}`}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        Appearance
                    </button>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/LoginPage'); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${darkMode ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Operational Surface */}
            <div className="flex-1 ml-80 p-12 relative overflow-hidden flex flex-col h-screen overflow-y-auto custom-scrollbar">
                {/* Visual Identity Elements */}
                <div className={`absolute top-0 right-0 w-[60%] h-[60%] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`}></div>
                <div className={`absolute bottom-0 left-0 w-[30%] h-[30%] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-10 ${darkMode ? 'bg-purple-900' : 'bg-purple-200'}`}></div>

                <header className="flex justify-between items-end mb-16 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>Connected as Admin</span>
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tighter capitalize leading-none">{activeTab.replace('_', ' ')}</h2>
                    </div>
                </header>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center mb-20">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-600/20"></div>
                            <Loader2 className="w-full h-full animate-spin text-indigo-600" />
                        </div>
                        <p className={`mt-6 text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading Dashboard...</p>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10 pb-20">
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <StatCard icon={<Users size={28} />} label="Total Users" value={stats?.totalUsers || 0} trend={12} />
                                    <StatCard icon={<Activity size={28} />} label="Transactions" value={stats?.totalTransactions || 0} trend={8} />
                                    <StatCard icon={<Plus size={28} />} label="New Joins" value={stats?.recentUsers || 0} trend={15} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${darkMode ? 'bg-black border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><TrendingUp size={24} /></div>
                                                <h3 className="text-xl font-bold tracking-tight">Top Activity</h3>
                                            </div>
                                            <BarChart3 size={20} className="text-gray-400" />
                                        </div>
                                        <div className="space-y-4">
                                            {(categoryStats?.topCategories || []).map((cat, i) => (
                                                <div key={`high-velocity-${cat.category || i}`} className={`flex justify-between items-center p-5 rounded-2xl border group transition-all ${darkMode ? 'bg-white/2 border-white/5 hover:bg-white/5' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                                                    <span className="text-sm font-bold tracking-tight">{cat.category}</span>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-emerald-500 font-black text-lg">{cat.count}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Uses</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!categoryStats?.topCategories?.length) && (
                                                <div className="py-10 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">No data found</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${darkMode ? 'bg-black border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><TrendingDown size={24} /></div>
                                                <h3 className="text-xl font-bold tracking-tight">Lowest Activity</h3>
                                            </div>
                                            <PieChart size={20} className="text-gray-400" />
                                        </div>
                                        <div className="space-y-4">
                                            {(categoryStats?.leastCategories || []).map((cat, i) => (
                                                <div key={`low-latency-${cat.category || i}`} className={`flex justify-between items-center p-5 rounded-2xl border group transition-all ${darkMode ? 'bg-white/2 border-white/5 hover:bg-white/5' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                                                    <span className="text-sm font-bold tracking-tight">{cat.category}</span>
                                                    <div className="flex flex-col items-end">
                                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-black text-lg`}>{cat.count}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Uses</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!categoryStats?.leastCategories?.length) && (
                                                <div className="py-10 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">No data found</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'users' && (
                            <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${darkMode ? 'bg-black border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                                <div className={`p-10 border-b flex flex-col md:flex-row justify-between items-center gap-6 ${darkMode ? 'border-white/5 bg-white/2' : 'border-gray-50 bg-gray-50/50'}`}>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">User List</h3>
                                        <p className={`text-[11px] font-semibold uppercase tracking-wider mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage all users on the platform</p>
                                    </div>
                                    <div className="relative w-full md:w-96 group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                                            <Search size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search users by name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className={`w-full pl-13 pr-6 py-4 rounded-2xl border transition-all text-sm font-bold outline-hidden ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`text-[11px] font-bold uppercase tracking-widest border-b ${darkMode ? 'text-gray-600 border-white/5' : 'text-gray-400 border-gray-50'}`}>
                                                <th className="px-10 py-6 text-left">ID</th>
                                                <th className="px-10 py-6 text-left">User Profile</th>
                                                <th className="px-10 py-6 text-left">Role</th>
                                                <th className="px-10 py-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
                                            {users.map(user => (
                                                <tr key={user?.id || Math.random()} className={`group transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                                                    <td className="px-10 py-6 text-xs font-mono font-bold text-gray-500 uppercase">#{(user?.id || '0').toString().padStart(4, '0')}</td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                                {user?.username?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold tracking-tight">{user?.username}</p>
                                                                <p className={`text-[10px] font-semibold ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${user?.role === 'admin'
                                                            ? (darkMode ? 'bg-white text-black' : 'bg-black text-white')
                                                            : (darkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}>
                                                            {user?.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <button
                                                                onClick={() => handleToggleRole(user?.id)}
                                                                className={`p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-indigo-500/10 text-indigo-400' : 'hover:bg-indigo-50 text-indigo-600'}`}
                                                                title="Change Role"
                                                            >
                                                                <Key size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user?.id)}
                                                                className={`p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-rose-500/10 text-rose-500' : 'hover:bg-rose-50 text-rose-600'}`}
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr><td colSpan="4" className="py-20 text-center text-xs font-bold text-gray-500 uppercase tracking-widest italic">No users found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={`p-8 border-t flex justify-between items-center ${darkMode ? 'border-white/5 bg-white/2' : 'border-gray-50 bg-gray-50/30'}`}>
                                    <p className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                        Page: <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{currentPage} // {pagination?.totalPages || 1}</span>
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className={`p-3 rounded-xl border transition-all disabled:opacity-20 active:scale-90 ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-black'}`}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            disabled={currentPage >= (pagination?.totalPages || 1)}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className={`p-3 rounded-xl border transition-all disabled:opacity-20 active:scale-90 ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-black'}`}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div className="space-y-10">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className={`px-6 py-4 rounded-2xl border flex items-center gap-4 ${darkMode ? 'bg-indigo-600/10 border-indigo-600/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                                        <Database size={20} />
                                    </div>
                                    <button
                                        onClick={() => setShowCatForm(true)}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.25rem] font-black text-sm transition-all active:scale-95 shadow-2xl ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                                    >
                                        <Plus size={20} /> Add Category
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {['income', 'expense'].map(type => (
                                        <div key={type} className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${darkMode ? 'bg-black border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                                            <div className={`p-8 border-b flex items-center justify-between ${darkMode ? 'border-white/5 bg-white/2' : 'border-gray-50 bg-gray-50/50'}`}>
                                                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${type === 'income' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)]'}`}></div>
                                                    {type} Group
                                                </h3>
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${darkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                                    {(type === 'income' ? categories?.incomeCategories : categories?.expenseCategories)?.length || 0} Entries
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                                {(type === 'income' ? categories?.incomeCategories : categories?.expenseCategories)?.map(cat => (
                                                    <div key={cat.id} className={`flex justify-between items-center p-6 rounded-2xl group transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                                        <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                                                        <button
                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                            className="p-2.5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!(type === 'income' ? categories?.incomeCategories : categories?.expenseCategories)?.length) && (
                                                    <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">No Categories</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'feedbacks' && (
                            <div className="grid grid-cols-1 gap-8">
                                {(feedbacks || []).map(f => (
                                    <div key={f.id} className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${darkMode ? 'bg-black border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    <User size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black tracking-tight">{f.user?.username || 'User'}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock size={12} className="text-gray-400" />
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{new Date(f.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 p-3 bg-gray-500/5 rounded-2xl">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <div key={`${f.id}-star-${s}`} className={`w-3 h-3 rounded-full transition-all duration-500 ${s <= f.rating
                                                        ? (darkMode ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)]')
                                                        : (darkMode ? 'bg-white/10' : 'bg-gray-200')}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={`p-8 rounded-3xl border-l-[6px] text-base font-bold leading-relaxed italic ${darkMode ? 'bg-white/2 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                            "{f.message}"
                                        </div>
                                        <div className="mt-10 flex justify-between items-center pt-8 border-t border-white/5">
                                            <div className="flex items-center gap-2">
                                                {f.isResolved ? (
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl">
                                                        <CheckCircle size={14} /> Resolved
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest bg-amber-500/10 px-4 py-2 rounded-xl">
                                                        <AlertCircle size={14} /> Not Resolved
                                                    </span>
                                                )}
                                            </div>
                                            {!f.isResolved && (
                                                <button
                                                    onClick={() => handleResolveFeedback(f.id)}
                                                    className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {feedbacks.length === 0 && (
                                    <div className="py-40 text-center flex flex-col items-center gap-6">
                                        <div className="p-8 bg-gray-500/5 rounded-full"><MessageSquare size={48} className="text-gray-300" /></div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">No feedback yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Global Category Definition Terminal */}
            {showCatForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
                    <div className={`w-full max-w-md rounded-[2.5rem] p-10 border transition-all duration-500 animate-in fade-in zoom-in duration-300 ${darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-100 shadow-2xl'}`}>
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight leading-none">New Category</h3>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Create a new category for the platform</p>
                            </div>
                            <button onClick={() => setShowCatForm(false)} className={`p-3 rounded-2xl transition-all ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreateCategory} className="space-y-8">
                            <div className="space-y-2">
                                <label className={`text-[11px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Category Type</label>
                                <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-[1.25rem] ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-100 border border-gray-200'}`}>
                                    {['income', 'expense'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setNewCat({ ...newCat, type: t })}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newCat.type === t
                                                ? (darkMode ? 'bg-white text-black shadow-lg' : 'bg-white text-black shadow-md')
                                                : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[11px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newCat.name}
                                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                    className={`w-full px-6 py-4 rounded-xl border-2 transition-all text-sm font-bold outline-hidden ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                                    placeholder="Enter identifier name..."
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${darkMode ? 'bg-white text-black hover:bg-gray-200 shadow-indigo-500/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/10'}`}
                            >
                                Create Category
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
