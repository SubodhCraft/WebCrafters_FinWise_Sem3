import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarPage = () => {
  const [viewDate, setViewDate] = useState(new Date()); 
  const [events, setEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the Form
  const [formData, setFormData] = useState({
    event_name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'income'
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch from Database
  const fetchSummary = async () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    try {
      const res = await fetch(`http://localhost:3000/api/calender/summary?year=${year}&month=${month}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSummary(); }, [viewDate]);

  // Handle Form Submission to Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/calender/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSummary(); // Refresh UI with new database data
      }
    } catch (err) { console.error(err); }
  };

  const renderSummaryCard = (dayData) => {
    const income = parseFloat(dayData.income || 0);
    const expense = parseFloat(dayData.expense || 0);
    const total = income - expense;
    const isLoss = total < 0;

    const bgColor = isLoss ? 'bg-[#F1E4E7]' : 'bg-[#EDE9FE]';
    const borderColor = isLoss ? 'border-[#991B1B]' : 'border-[#8457D8]';
    const textColor = isLoss ? 'text-[#991B1B]' : 'text-[#8457D8]';

    return (
      <div className={`${bgColor} border-r-4 ${borderColor} rounded-l-lg p-2 mt-1 shadow-sm`}>
        <div className="text-[10px] space-y-0.5 font-medium text-gray-500">
          <div className="flex justify-between"><span>Income :</span> <span>{income}</span></div>
          <div className="flex justify-between"><span>Expense :</span> <span>{expense}</span></div>
          <div className={`flex justify-between font-bold pt-1 mt-1 border-t border-gray-300 ${textColor}`}>
            <span>{isLoss ? 'Loss' : 'Profit'} :</span> <span>{Math.abs(total)}</span>
          </div>
        </div>
      </div>
    );
  };

  const generateGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid = [];
    for (let i = firstDay - 1; i >= 0; i--) grid.push({ day: new Date(year, month, -i).getDate(), current: false });
    for (let i = 1; i <= daysInMonth; i++) grid.push({ day: i, current: true });
    return grid;
  };

  return (
    <div className="max-w-6xl relative">
      <h1 className="text-2xl font-bold text-[#5B21B6] mb-8">Calender</h1>

      <div className="bg-white rounded-4xl shadow-sm border border-[#EAEEFF] p-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-[#8457D8]">
              {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
            </h2>
            <div className="flex space-x-1.5">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 bg-[#8457D8] text-white rounded-full"><ChevronLeft size={16} /></button>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 bg-[#8457D8] text-white rounded-full"><ChevronRight size={16} /></button>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[#8457D8] text-white font-medium rounded-xl hover:bg-opacity-90"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Event
          </button>
        </div>

        <div className="border border-[#EAEEFF] rounded-4xl overflow-hidden">
          <div className="grid grid-cols-7 bg-[#F8FAFF] border-b border-[#EAEEFF]">
            {daysOfWeek.map(day => <div key={day} className="py-4 text-center text-sm font-bold text-[#8457D8]">{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {generateGrid().map((cell, index) => {
              const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
              const dayData = cell.current ? events[dateStr] : null;
              return (
                <div key={index} className="min-h-32.5 border-r border-b border-[#EAEEFF] p-3 last:border-r-0">
                  <div className="flex justify-end mb-1">
                    <span className={`text-xs font-bold ${cell.current ? 'text-gray-400' : 'text-gray-100'}`}>{cell.day}</span>
                  </div>
                  {dayData && renderSummaryCard(dayData)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96 shadow-xl border border-[#8457D8]">
            <h3 className="text-xl font-bold text-[#8457D8] mb-4">Add New Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Event Name" className="w-full border p-2 rounded-lg" required onChange={(e) => setFormData({...formData, event_name: e.target.value})} />
              <input type="number" placeholder="Amount" className="w-full border p-2 rounded-lg" required onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              <input type="date" className="w-full border p-2 rounded-lg" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              <select className="w-full border p-2 rounded-lg" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <div className="flex space-x-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-[#8457D8] text-white py-2 rounded-lg">Save to DB</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;