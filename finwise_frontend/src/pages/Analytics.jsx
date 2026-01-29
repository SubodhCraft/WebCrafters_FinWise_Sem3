import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Download, Calendar, TrendingUp, TrendingDown, DollarSign,
  Filter, FileText
} from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6'];

const Analytics = () => {
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

      setCategoryData({
        income: categoryResponse.data.income || [],
        expense: categoryResponse.data.expense || []
      });

      const trendsResponse = await axios.get(`${API_URL}/transactions/analytics/trends`, {
        params: { months: 6 },
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrendsData(trendsResponse.data.trends || []);

      const statsResponse = await axios.get(`${API_URL}/transactions/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(statsResponse.data);
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

      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229);
      doc.text('FinWise - Financial Analytics Report', pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Period: ${dateRange.startDate} to ${dateRange.endDate}`, pageWidth / 2, 28, { align: 'center' });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Financial Summary', 14, 40);

      const summaryData = [
        ['Total Income', `NRS ${(stats.income || 0).toFixed(2)}`],
        ['Total Expenses', `NRS ${(stats.expenses || 0).toFixed(2)}`],
        ['Net Balance', `NRS ${(stats.balance || 0).toFixed(2)}`],
        ['Savings Rate', `${(stats.income || 0) > 0 ? (((stats.balance || 0) / (stats.income || 1)) * 100).toFixed(1) : 0}%`]
      ];

      autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        margin: { left: 14, right: 14 }
      });

      if (categoryData.income.length > 0) {
        const currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 120;
        doc.setFontSize(14);
        doc.text('Income by Category', 14, currentY);

        const incomeTableData = categoryData.income.map(item => [
          item.name,
          `NRS ${(item.value || 0).toFixed(2)}`,
          `${(((item.value || 0) / (stats.income || 1)) * 100).toFixed(1)}%`
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [['Category', 'Amount', 'Percentage']],
          body: incomeTableData,
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] },
          margin: { left: 14, right: 14 }
        });
      }

      if (categoryData.expense.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Expenses by Category', 14, 20);

        const expenseTableData = categoryData.expense.map(item => [
          item.name,
          `NRS ${(item.value || 0).toFixed(2)}`,
          `${(((item.value || 0) / (stats.expenses || 1)) * 100).toFixed(1)}%`
        ]);

        autoTable(doc, {
          startY: 25,
          head: [['Category', 'Amount', 'Percentage']],
          body: expenseTableData,
          theme: 'striped',
          headStyles: { fillColor: [239, 68, 68] },
          margin: { left: 14, right: 14 }
        });
      }

      if (trendsData.length > 0) {
        const nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20;
        if (nextY > 240) {
          doc.addPage();
          doc.setFontSize(14);
          doc.text('Monthly Trends', 14, 20);
          var startYTrend = 25;
        } else {
          doc.setFontSize(14);
          doc.text('Monthly Trends', 14, nextY);
          var startYTrend = nextY + 5;
        }

        const trendsTableData = trendsData.map(item => [
          item.month,
          `NRS ${(item.income || 0).toFixed(2)}`,
          `NRS ${(item.expense || 0).toFixed(2)}`,
          `NRS ${(item.net || 0).toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: startYTrend,
          head: [['Month', 'Income', 'Expenses', 'Net']],
          body: trendsTableData,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] },
          margin: { left: 14, right: 14 }
        });
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      doc.save(`FinWise_Analytics_${dateRange.startDate}_to_${dateRange.endDate}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900 mb-1">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
              {entry.name}: <span className="font-semibold">NRS {entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
            <p className="text-gray-600 mt-1">Detailed overview of your spending and income distribution</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-300"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={exportToPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Date Range Filter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchAnalyticsData}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">NRS {stats.balance.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-indigo-500 opacity-30" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total Income</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">NRS {stats.income.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500 opacity-30" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">NRS {stats.expenses.toLocaleString()}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-500 opacity-30" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Savings Rate</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {stats.income > 0 ? ((stats.balance / stats.income) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-500 opacity-30" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Income vs Expense Trend</h3>
                <div className="h-[300px]">
                  {trendsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          width={60}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6 }}
                          name="Income"
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          stroke="#EF4444"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6 }}
                          name="Expenses"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No trend data available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Net Savings Performance</h3>
                <div className="h-[300px]">
                  {trendsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendsData}>
                        <defs>
                          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          width={60}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="net"
                          stroke="#6366F1"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorNet)"
                          name="Net Savings"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No performance data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Spending Impact by Category</h3>
                <div className="h-[300px]">
                  {categoryData.expense.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData.expense} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }}
                          width={100}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                        <Bar
                          dataKey="value"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                        >
                          {categoryData.expense.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No data available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Expense Distribution</h3>
                <div className="h-[300px] flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="w-full h-full max-w-[200px] max-h-[200px]">
                    {categoryData.expense.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData.expense}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.expense.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No data
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 overflow-y-auto max-h-[200px] pr-2">
                    {categoryData.expense.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-xs font-semibold text-gray-600 truncate max-w-[100px]">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Expenses by Category</h3>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <div className="overflow-auto max-h-[400px]">
                  {categoryData.expense.length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3 text-right">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {categoryData.expense.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="font-bold text-gray-700">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                              NRS {item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">
                                {stats.expenses > 0 ? ((item.value / stats.expenses) * 100).toFixed(1) : 0}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-gray-400">No data available</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Monthly Performance</h3>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="overflow-auto max-h-[400px]">
                  {trendsData.length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Month</th>
                          <th className="px-6 py-3 text-right">Income</th>
                          <th className="px-6 py-3 text-right">Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trendsData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-700">{item.month}</td>
                            <td className="px-6 py-4 text-right font-bold text-green-600">
                              +{item.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-bold ${item.net >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                                NRS {item.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-gray-400">No data available</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;