// import React, { useState, useEffect } from 'react';
// import { ArrowUpRight, Plus } from 'lucide-react';

// const SummaryCard = ({ title, subtitle, amount, colorClass }) => (
//   <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between transition-shadow hover:shadow-lg">
//     <div className="flex justify-end">
//       <ArrowUpRight className="w-5 h-5 text-violet-600" /> 
//     </div>
//     <h3 className="text-base font-semibold text-gray-900">{title}</h3>
//     <p className="text-xs text-gray-600 mt-1 h-8">{subtitle}</p>
//     <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
//       <span className="text-2xl font-semibold mr-1">NPR</span> {amount}
//     </p>
//   </div>
// );

// const TransactionItem = ({ category, description, amount, date, color, text_color }) => (
//   <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-xl">
//     <div className="flex items-start space-x-3">
//       <div className={`w-2 h-2 mt-2 rounded-full ${color}`}></div> 
//       <div>
//         <h4 className="text-sm font-semibold text-gray-800">{category}</h4>
//         <p className="text-xs text-gray-600 w-96 truncate">{description}</p>
//         <p className="text-xs text-gray-400 mt-0.5">{date}</p>
//       </div>
//     </div>
//     <div className="flex items-center space-x-4">
//       <span className={`text-lg font-bold ${text_color}`}>
//         <span className="text-base font-semibold mr-0.5">NPR</span> {parseFloat(amount).toLocaleString()}
//       </span>
//       <span className="inline-flex items-center justify-center w-5 h-5 p-0.5 text-xs rounded-full border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
//         &gt;
//       </span>
//     </div>
//   </div>
// );

// function Dashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false); 

//   const availableBalance = 0;
//   const totalIncome = 0;
//   const totalExpenses = 0;

//   const summaryData = [
//     {
//       title: 'Available Balance',
//       subtitle: "Navigation active. Database connection paused.",
//       amount: availableBalance.toLocaleString(),
//       colorClass: 'text-violet-500', 
//     },
//     {
//       title: 'Income',
//       subtitle: 'Static data placeholder.',
//       amount: totalIncome.toLocaleString(),
//       colorClass: 'text-green-600', 
//     },
//     {
//       title: 'Expenses',
//       subtitle: "Static data placeholder.",
//       amount: totalExpenses.toLocaleString(),
//       colorClass: 'text-red-600', 
//     },
//   ];

//   return (
//     <div className="space-y-8"> 
//       <div className='flex justify-end'>
//           <button className="flex items-center px-4 py-2 bg-violet-700 text-white font-medium rounded-xl hover:bg-opacity-90 transition-all shadow-md shadow-violet-700/25">
//             <Plus className="w-4 h-4 mr-1" />
//             <span className="text-sm">Add new transactions</span>
//           </button>
//       </div>

//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {summaryData.map((data, index) => (
//           <SummaryCard key={index} {...data} />
//         ))}
//       </section>

//       <section className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        
//         <div className="divide-y divide-gray-100">
//           {transactions.length === 0 ? (
//             <p className="text-center py-10 text-gray-400">No transactions to display (Backend paused).</p>
//           ) : (
//             transactions.map((t) => (
//               <TransactionItem 
//                 key={t.id} 
//                 category={t.category}
//                 description={t.description}
//                 amount={t.amount}
//                 date={t.date}
//                 color={t.color}
//                 text_color={t.text_color}
//               />
//             ))
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Dashboard;



import React, { useState } from 'react';
import Sidebar from '../Layout/Sidebar.jsx';
import Header from '../Layout/Header.jsx';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample Data
  const statsCards = [
    {
      title: 'Total Balance',
      amount: '$24,580.00',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Income',
      amount: '$8,450.00',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Expenses',
      amount: '$3,240.00',
      change: '-4.3%',
      trend: 'down',
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Savings',
      amount: '$5,210.00',
      change: '+15.8%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const recentTransactions = [
    { id: 1, name: 'Grocery Store', category: 'Food & Dining', amount: -85.50, date: '2026-01-20', type: 'expense' },
    { id: 2, name: 'Salary Deposit', category: 'Income', amount: 3500.00, date: '2026-01-18', type: 'income' },
    { id: 3, name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: '2026-01-17', type: 'expense' },
    { id: 4, name: 'Electric Bill', category: 'Utilities', amount: -120.00, date: '2026-01-16', type: 'expense' },
    { id: 5, name: 'Freelance Project', category: 'Income', amount: 850.00, date: '2026-01-15', type: 'income' },
    { id: 6, name: 'Coffee Shop', category: 'Food & Dining', amount: -12.50, date: '2026-01-14', type: 'expense' },
  ];

  const categorySpending = [
    { category: 'Food & Dining', amount: 890, percentage: 35, color: 'bg-blue-500' },
    { category: 'Transportation', amount: 450, percentage: 18, color: 'bg-green-500' },
    { category: 'Entertainment', amount: 320, percentage: 13, color: 'bg-purple-500' },
    { category: 'Utilities', amount: 580, percentage: 23, color: 'bg-orange-500' },
    { category: 'Shopping', amount: 280, percentage: 11, color: 'bg-pink-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-64">
        <Header title="Dashboard" userName="John Doe" />
        
        <main className="pt-16 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{card.change}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.amount}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? 
                          <ArrowDownRight className="w-5 h-5 text-green-600" /> : 
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.name}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `+${transaction.amount}`}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spending by Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Spending by Category</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {categorySpending.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-bold text-gray-800">${item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.percentage}% of total</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Monthly Budget</p>
                <p className="text-2xl font-bold text-indigo-600">$2,520 / $3,000</p>
                <div className="w-full bg-indigo-200 rounded-full h-2 mt-3">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '84%' }} />
                </div>
                <p className="text-xs text-gray-600 mt-2">84% of budget used</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
                <div className="text-2xl mb-2">💰</div>
                <p className="font-medium">Add Income</p>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
                <div className="text-2xl mb-2">💸</div>
                <p className="font-medium">Add Expense</p>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
                <div className="text-2xl mb-2">📊</div>
                <p className="font-medium">View Reports</p>
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
                <div className="text-2xl mb-2">🎯</div>
                <p className="font-medium">Set Budget</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;