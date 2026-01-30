import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Target,
  TrendingUp,
  Calendar,
  Edit2,
  X,
  Check,
  Loader2,
  TrendingDown,
  ArrowRight,
  Clock,
  Activity,
  Layers,
  MoreVertical,
  Flag,
  Zap,
  Shield,
  CheckCircle2
} from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  getAllGoalsApi,
  createGoalApi,
  updateGoalApi,
  deleteGoalApi,
  toggleGoalStatusApi,
  getAllCategoriesApi
} from '../../service/api';

import { useCurrency } from '../context/CurrencyContext.jsx';

const Goal = () => {
  const { formatAmount, getCurrencySymbol } = useCurrency();
  const { isDarkMode: darkMode } = useTheme();

  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    targetAmount: '',
    category: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    color: '#6366F1',
    icon: 'target'
  });

  useEffect(() => {
    fetchGoals();
    fetchCategories();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await getAllGoalsApi();
      setGoals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to sync goals');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      const allCategories = [
        ...(response.data.incomeCategories || []),
        ...(response.data.expenseCategories || [])
      ];
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount || !formData.category || !formData.endDate) {
      toast.error('Required fields missing');
      return;
    }

    try {
      setSubmitLoading(true);
      if (editingGoal) {
        await updateGoalApi(editingGoal.id, formData);
        toast.success('Goal updated');
      } else {
        await createGoalApi(formData);
        toast.success('Goal created');
      }
      fetchGoals();
      resetForm();
    } catch (error) {
      toast.error('Failed to save goal');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleGoalStatusApi(id);
      fetchGoals();
      toast.success('Goal completed');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteGoal = async (id) => {
    if (window.confirm('Delete this goal? This action is permanent.')) {
      try {
        await deleteGoalApi(id);
        toast.success('Goal deleted');
        fetchGoals();
      } catch (error) {
        toast.error('Failed to delete goal');
      }
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type || 'income',
      title: goal.title,
      targetAmount: goal.targetAmount,
      category: goal.category,
      period: goal.period || 'monthly',
      startDate: goal.startDate.split('T')[0],
      endDate: goal.endDate.split('T')[0],
      description: goal.description || '',
      color: goal.color || '#6366F1',
      icon: goal.icon || 'target'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      title: '',
      targetAmount: '',
      category: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      description: '',
      color: '#6366F1',
      icon: 'target'
    });
    setShowForm(false);
    setEditingGoal(null);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <Header title="Goals" />

        <main className="flex-1 p-8 space-y-8 relative z-10 mt-20 max-w-[1600px] mx-auto w-full">

          {/* Sweet & Professional Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight"> <span className="text-indigo-600">Goals</span></h1>
            </div>

            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Plus size={18} />
              Add Goal
            </button>
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading Goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className={`py-24 text-center rounded-[2.5rem] border border-dashed transition-all flex flex-col items-center justify-center ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <Flag size={40} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No active goals</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm italic">Set your first goal to start tracking progress.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {goals.map((goal) => {
                const progress = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));

                return (
                  <div
                    key={goal.id}
                    className={`p-10 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group ${darkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-indigo-500/30' : 'bg-white border-slate-50 shadow-sm hover:shadow-2xl hover:border-indigo-600/10'}`}
                  >
                    {/* Background Visual Ornament */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Target size={120} className="transform translate-x-12 -translate-y-8" />
                    </div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:rotate-[10deg] group-hover:scale-110`} style={{ backgroundColor: goal.color }}>
                          <Target size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase">{goal.title}</h3>
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${goal.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                              {goal.type === 'income' ? 'Asset Growth' : 'Expense Bound'}
                            </span>
                            <div className="flex items-center gap-2 text-slate-400 pl-3 border-l border-slate-200 dark:border-slate-800">
                              <Clock size={12} />
                              <span className="text-[9px] font-bold uppercase tracking-widest">{goal.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => handleEditGoal(goal)} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteGoal(goal.id)} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Amount</p>
                          <p className="text-3xl font-bold tracking-tighter" style={{ color: goal.color }}>
                            {getCurrencySymbol()} {formatAmount(goal.currentAmount || 0)}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Amount</p>
                          <p className="text-lg font-bold text-slate-400 tracking-tight">{getCurrencySymbol()} {formatAmount(goal.targetAmount)}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className={`${progress >= 100 ? 'text-emerald-500' : 'text-slate-400'}`}>Trajectory Completion</span>
                          <span style={{ color: goal.color }}>{progress.toFixed(1)}%</span>
                        </div>
                        <div className={`h-2.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <div
                            className="h-full transition-all duration-1000 ease-out shadow-lg"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: goal.color,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Due: {new Date(goal.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers size={12} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              {goal.category}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleStatus(goal.id)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${goal.status === 'completed'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-indigo-600/5 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-600/20 active:scale-95'
                            }`}
                        >
                          {goal.status === 'completed' ? (
                            <><CheckCircle2 size={12} /> Milestone Achieved</>
                          ) : (
                            'Verify Completion'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[500] p-4">
          <div className={`w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{editingGoal ? 'Update Goal' : 'Create New Goal'}</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal Settings</p>
                </div>
              </div>
              <button onClick={resetForm} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Side Controls */}
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Goal Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                      placeholder="e.g. Save for New Home"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Goal Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold appearance-none ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                      >
                        <option value="income">Income Goal</option>
                        <option value="expense">Expense Limit</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Period</label>
                      <select
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold appearance-none ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one-time">One-Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{getCurrencySymbol()}</span>
                      <input
                        type="number"
                        required
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                        className={`w-full pl-10 pr-4 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold appearance-none ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, i) => (
                        <option key={i} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Side Settings */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-sm font-bold ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Goal Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full h-32 px-5 py-4 rounded-xl border-2 transition-all outline-none text-sm font-medium resize-none leading-relaxed italic ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                      placeholder="Add details about your goal..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Visual Configuration</label>
                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer bg-white border-2 border-slate-100 dark:border-slate-800 p-1"
                      />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Theme Accent</p>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">{formData.color}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all ${darkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingGoal ? <><Zap size={16} /> Update Goal</> : <><Shield size={16} /> Save Goal</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goal;
