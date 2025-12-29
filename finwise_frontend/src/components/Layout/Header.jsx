import { Bell, HelpCircle, Search, Menu, X } from 'lucide-react' 
import React from 'react'
import ProfileIcon from "../../assets/profile.png"; 

function Header({ onToggleSidebar, onSearchFocus, searchQuery, setSearchQuery, isSearching, onSearchSubmit }) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery); 
    }
  };

  return (
    <div className='bg-white border-b border-gray-100 px-6 py-4'> 
      <div className='flex items-center justify-between'>
        <div className='flex items-center mr-3'>
            <button className='p-2 rounded-xl text-gray-500 hover:bg-gray-100' onClick={onToggleSidebar}>
                <Menu className='w-5 h-5' />
            </button>
        </div>
        
        <div className="flex-1 max-w-lg">
          <div className="relative">
            {/* Search Icon */}
            <button 
              onClick={() => onSearchSubmit(searchQuery)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <input
              type="text"
              placeholder="Search" 
              value={searchQuery}
              onFocus={onSearchFocus} 
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} 
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-600 outline-none transition-all" 
            />

            {isSearching && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  onSearchSubmit(""); 
                }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-6 ml-auto"> 
          <div className="flex space-x-2">
             <button className="p-2.5 rounded-xl hover:bg-gray-100"><HelpCircle className="w-5 h-5" /></button>
             <button className="p-2.5 rounded-xl hover:bg-gray-100"><Bell className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
             <img src={ProfileIcon} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
             <div className='text-right pr-2'>
                <p className="text-sm font-semibold text-gray-800">Angela Pradhan</p>
                <p className="text-xs text-gray-600">angelapradhan123@gmail.com</p>
             </div>
          </div>
        </div>
      </div>
    </div >
  )
}
export default Header;