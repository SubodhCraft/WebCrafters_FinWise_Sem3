import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, TrendingUp, Calendar, Edit2, X, Check } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import toast from 'react-hot-toast';
import {
  getAllGoalsApi,
  createGoalApi,
  updateGoalApi,
  deleteGoalApi,
  toggleGoalStatusApi,
  getAllCategoriesApi
} from '../../service/api';

const Goal = () => {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    targetAmount: '',
    category: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    color: '#4CAF50',
    icon: 'target'
  });

  useEffect(() => {
    fetchGoals();
    fetchCategories();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await getAllGoalsApi();
      setGoals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesApi();

      // Combine income and expense categories
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
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingGoal) {
        // Update existing goal
        await updateGoalApi(editingGoal.id, formData);
        toast.success('Goal updated successfully');
      } else {
        // Create new goal
        await createGoalApi(formData);
        toast.success('Goal created successfully');
      }

      resetForm();
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error(error.response?.data?.message || 'Failed to save goal');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      title: goal.title,
      targetAmount: goal.targetAmount,
      category: goal.category,
      period: goal.period,
      startDate: new Date(goal.startDate).toISOString().split('T')[0],
      endDate: new Date(goal.endDate).toISOString().split('T')[0],
      description: goal.description || '',
      color: goal.color || '#4CAF50',
      icon: goal.icon || 'target'
    });
    setShowForm(true);
  };

  const deleteGoal = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      await deleteGoalApi(id);
      toast.success('Goal deleted successfully');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const toggleGoalStatus = async (id) => {
    try {
      await toggleGoalStatusApi(id);
      toast.success('Goal status updated');
      fetchGoals();
    } catch (error) {
      console.error('Error toggling goal:', error);
      toast.error('Failed to update goal status');
    }
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
      color: '#4CAF50',
      icon: 'target'
    });
    setShowForm(false);
    setEditingGoal(null);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
            <p className="text-gray-600 mt-1">Set and track your income goals and expense limits</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'Add Goal'}
          </button>
        </div>

        {/* Add/Edit Goal Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="income">Income Goal</option>
                    <option value="expense">Expense Limit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Monthly Savings Goal"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                {editingGoal && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No goals yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                style={{ borderLeft: `4px solid ${goal.color}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${goal.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {goal.type === 'income' ? 'Income Goal' : 'Expense Limit'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                      </span>
                      <span>Category: {goal.category}</span>
                      <span>Period: {goal.period}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-blue-600 hover:text-blue-700 transition-colors p-2"
                      title="Edit goal"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleGoalStatus(goal.id)}
                      className="text-gray-600 hover:text-gray-700 transition-colors p-2"
                      title={goal.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {goal.isActive ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700 transition-colors p-2"
                      title="Delete goal"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>NRS {parseFloat(goal.currentAmount || 0).toLocaleString()}</span>
                    <span>NRS {parseFloat(goal.targetAmount).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${goal.progress || 0}%`,
                        backgroundColor: goal.color
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {(goal.progress || 0).toFixed(1)}% Complete
                    </span>
                    <span className="text-xs font-medium" style={{ color: goal.color }}>
                      NRS {parseFloat(goal.remainingAmount || goal.targetAmount).toLocaleString()} remaining
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goal;