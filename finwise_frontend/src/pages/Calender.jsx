import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import toast from 'react-hot-toast';
import { getCalendarTransactionsApi } from '../../service/api';

const Calendar = () => {
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
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(1);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
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
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction Calendar</h1>
        <div className="">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
              {/* Header with Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                  ))}

                  {/* Days of month */}
                  {days.map((day) => {
                    const isToday =
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();

                    const isSelected = day === selectedDate;
                    const daySummary = getDaySummary(day);
                    const hasTransactions = daySummary.count > 0;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 rounded-lg text-center font-medium transition-all relative min-h-[50px] ${isSelected
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : isToday
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                            : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        <div className="text-sm">{day}</div>
                        {hasTransactions && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                            {daySummary.income > 0 && (
                              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-green-300' : 'bg-green-500'}`}></div>
                            )}
                            {daySummary.expense > 0 && (
                              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-300' : 'bg-red-500'}`}></div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Transactions Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString(
                    'en-US',
                    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </h2>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Income</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">NRS {totalIncome.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600 mt-2">NRS {totalExpense.toFixed(2)}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
                  </div>
                </div>

                <div className={`rounded-lg shadow-md p-6 border-l-4 ${netAmount >= 0
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-orange-50 border-orange-500'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Net Amount</p>
                      <p className={`text-2xl font-bold mt-2 ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                        {netAmount >= 0 ? '+' : ''}NRS {netAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {netAmount >= 0 ? 'Profit' : 'Loss'}
                      </p>
                    </div>
                    <DollarSign className={`w-8 h-8 opacity-50 ${netAmount >= 0 ? 'text-blue-500' : 'text-orange-500'
                      }`} />
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transactions ({selectedTransactions.length})
                </h3>

                {selectedTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`p-3 rounded-lg ${transaction.type === 'income'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                              }`}
                          >
                            {transaction.type === 'income' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-500">{transaction.time}</p>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                {transaction.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p
                          className={`text-lg font-bold ${transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}NRS {transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions for this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;