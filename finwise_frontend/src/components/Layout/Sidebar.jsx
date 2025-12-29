
import React from 'react'
import { LayoutDashboard, FileText, Calendar, Zap, File, Settings, LogOut } from 'lucide-react'; 
import FinwiseLogo from "../../assets/logo-finwise.png"; 

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" }, 
  { id: "notes", icon: FileText, label: "Notes" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "goals", icon: Zap, label: "Goals" }, 
  { id: "statement", icon: File, label: "Statement" },
];


function Sidebar({ collapsed, onToggle, currentPage, onPageChange }) {
  
  return (
    <div className={`${collapsed ? "w-20" : "w-60"} transition duration-300 ease-in-out bg-white border-r border-gray-100 flex flex-col relative z-10 `}>
      
      {/* Logo */}
      <div className="p-4 border-b border-gray-100"> 
        <div className='flex items-center space-x-3 bg-[#EAEEFF] p-2 rounded-xl border border-gray-100 shadow-sm'> 
          
          <img
            src={FinwiseLogo} 
            alt="FINWISE Logo"
            className="w-8 h-8 object-contain"
          />
          
          {!collapsed && (
            <div>
              <h1 className='text-xl font-bold text-violet-600'>
                FINWISE
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
        {menuItems.map((item) => {
          const isActive = currentPage === item.id; 
          
          return (
            <div key={item.id}>
              <button
                
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 
                  ${collapsed ? 'justify-center' : 'justify-start'}
                  ${isActive 
                  ? "bg-indigo-50 text-violet-600 font-semibold" 
                  : "text-gray-600 hover:bg-gray-50" }`}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "" : "text-gray-400"}`} />
                
                {!collapsed && (
                  <span className="font-medium ml-2">{item.label}</span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Settings and Logout */}
      <div className='p-4 border-t border-gray-100 space-y-2'>
        {/* Settings */}
        <button 
          className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 
            ${collapsed ? 'justify-center' : 'justify-start'}
            ${currentPage === 'settings' 
            ? "bg-indigo-50 text-violet-600 font-semibold" 
            : "text-gray-600 hover:bg-gray-50"}`} 
          onClick={() => onPageChange("settings")}
        >
          <Settings className={`w-5 h-5 ${currentPage === 'settings' ? "" : "text-gray-400"}`} />
          {!collapsed && <span className="font-medium ml-2">Settings</span>}
        </button>

        {/* Logout */}
        <button 
          className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 
            ${collapsed ? 'justify-center' : 'justify-start'}
            text-gray-600 hover:bg-gray-50`} 
          onClick={() => onPageChange("logout")}
        >
          <LogOut className={`w-5 h-5 text-gray-400`} />
          {!collapsed && <span className="font-medium ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar