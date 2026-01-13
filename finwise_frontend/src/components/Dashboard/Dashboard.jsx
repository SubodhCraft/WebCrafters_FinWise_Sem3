import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';

const SummaryCard = ({ title, subtitle, amount, colorClass }) => (
  <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between transition-shadow hover:shadow-lg">
    <div className="flex justify-end">
      <ArrowUpRight className="w-5 h-5 text-violet-600" /> 
    </div>
    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    <p className="text-xs text-gray-600 mt-1 h-8">{subtitle}</p>
    <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
      <span className="text-2xl font-semibold mr-1">NPR</span> {amount}
    </p>
  </div>
);

const TransactionItem = ({ category, description, amount, date, color, text_color }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-xl">
    <div className="flex items-start space-x-3">
      <div className={`w-2 h-2 mt-2 rounded-full ${color}`}></div> 
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{category}</h4>
        <p className="text-xs text-gray-600 w-96 truncate">{description}</p>
        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <span className={`text-lg font-bold ${text_color}`}>
        <span className="text-base font-semibold mr-0.5">NPR</span> {parseFloat(amount).toLocaleString()}
      </span>
      <span className="inline-flex items-center justify-center w-5 h-5 p-0.5 text-xs rounded-full border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
        &gt;
      </span>
    </div>
  </div>
);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); 

  const availableBalance = 0;
  const totalIncome = 0;
  const totalExpenses = 0;

  const summaryData = [
    {
      title: 'Available Balance',
      subtitle: "Navigation active. Database connection paused.",
      amount: availableBalance.toLocaleString(),
      colorClass: 'text-violet-500', 
    },
    {
      title: 'Income',
      subtitle: 'Static data placeholder.',
      amount: totalIncome.toLocaleString(),
      colorClass: 'text-green-600', 
    },
    {
      title: 'Expenses',
      subtitle: "Static data placeholder.",
      amount: totalExpenses.toLocaleString(),
      colorClass: 'text-red-600', 
    },
  ];

  return (
    <div className="space-y-8"> 
      <div className='flex justify-end'>
          <button className="flex items-center px-4 py-2 bg-violet-700 text-white font-medium rounded-xl hover:bg-opacity-90 transition-all shadow-md shadow-violet-700/25">
            <Plus className="w-4 h-4 mr-1" />
            <span className="text-sm">Add new transactions</span>
          </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((data, index) => (
          <SummaryCard key={index} {...data} />
        ))}
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        
        <div className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No transactions to display (Backend paused).</p>
          ) : (
            transactions.map((t) => (
              <TransactionItem 
                key={t.id} 
                category={t.category}
                description={t.description}
                amount={t.amount}
                date={t.date}
                color={t.color}
                text_color={t.text_color}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;