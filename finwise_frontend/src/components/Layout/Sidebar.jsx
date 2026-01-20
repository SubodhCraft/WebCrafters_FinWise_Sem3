
// import React from 'react'
// import { LayoutDashboard, FileText, Calendar, Zap, File, Settings, LogOut } from 'lucide-react'; 
// import FinwiseLogo from "../../assets/logo-finwise.png"; 

// const menuItems = [
//   { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" }, 
//   { id: "notes", icon: FileText, label: "Notes" },
//   { id: "calendar", icon: Calendar, label: "Calendar" },
//   { id: "goals", icon: Zap, label: "Goals" }, 
//   { id: "statement", icon: File, label: "Statement" },
// ];


// function Sidebar({ collapsed, onToggle, currentPage, onPageChange }) {
  
//   return (
//     <div className={`${collapsed ? "w-20" : "w-60"} transition duration-300 ease-in-out bg-white border-r border-gray-100 flex flex-col relative z-10 `}>
      
//       {/* Logo */}
//       <div className="p-4 border-b border-gray-100"> 
//         <div className='flex items-center space-x-3 bg-[#EAEEFF] p-2 rounded-xl border border-gray-100 shadow-sm'> 
          
//           <img
//             src={FinwiseLogo} 
//             alt="FINWISE Logo"
//             className="w-8 h-8 object-contain"
//           />
          
//           {!collapsed && (
//             <div>
//               <h1 className='text-xl font-bold text-violet-600'>
//                 FINWISE
//               </h1>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
//         {menuItems.map((item) => {
//           const isActive = currentPage === item.id; 
          
//           return (
//             <div key={item.id}>
//               <button
                
//                 className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 
//                   ${collapsed ? 'justify-center' : 'justify-start'}
//                   ${isActive 
//                   ? "bg-indigo-50 text-violet-600 font-semibold" 
//                   : "text-gray-600 hover:bg-gray-50" }`}
//                 onClick={() => onPageChange(item.id)}
//               >
//                 <item.icon className={`w-5 h-5 ${isActive ? "" : "text-gray-400"}`} />
                
//                 {!collapsed && (
//                   <span className="font-medium ml-2">{item.label}</span>
//                 )}
//               </button>
//             </div>
//           );
//         })}
//       </nav>

//       {/* Settings and Logout */}
//       <div className='p-4 border-t border-gray-100 space-y-2'>
//         {/* Settings */}
//         <button 
//           className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 
//             ${collapsed ? 'justify-center' : 'justify-start'}
//             ${currentPage === 'settings' 
//             ? "bg-indigo-50 text-violet-600 font-semibold" 
//             : "text-gray-600 hover:bg-gray-50"}`} 
//           onClick={() => onPageChange("settings")}
//         >
//           <Settings className={`w-5 h-5 ${currentPage === 'settings' ? "" : "text-gray-400"}`} />
//           {!collapsed && <span className="font-medium ml-2">Settings</span>}
//         </button>

//         {/* Logout */}
//         <button 
//           className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 
//             ${collapsed ? 'justify-center' : 'justify-start'}
//             text-gray-600 hover:bg-gray-50`} 
//           onClick={() => onPageChange("logout")}
//         >
//           <LogOut className={`w-5 h-5 text-gray-400`} />
//           {!collapsed && <span className="font-medium ml-2">Logout</span>}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Sidebar



import React from 'react';
import { Home, TrendingUp, Wallet, CreditCard, PieChart, Settings, LogOut, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'notes', icon: TrendingUp, label: 'Notes' },
    { id: 'calender', icon: Wallet, label: 'Calender' },
    { id: 'goals', icon: CreditCard, label: 'Goals' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FinWise</h1>
            <p className="text-xs text-indigo-200">Manage Your Finances</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-indigo-200'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-indigo-500">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-700 hover:text-white transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;