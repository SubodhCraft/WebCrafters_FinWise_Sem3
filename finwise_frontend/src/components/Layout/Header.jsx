// import { Bell, HelpCircle, Search, Menu, X } from 'lucide-react' 
// import React from 'react'
// import ProfileIcon from "../../assets/profile.png"; 

// function Header({ onToggleSidebar, onSearchFocus, searchQuery, setSearchQuery, isSearching, onSearchSubmit }) {

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       onSearchSubmit(searchQuery); 
//     }
//   };

//   return (
//     <div className='bg-white border-b border-gray-100 px-6 py-4'> 
//       <div className='flex items-center justify-between'>
//         <div className='flex items-center mr-3'>
//             <button className='p-2 rounded-xl text-gray-500 hover:bg-gray-100' onClick={onToggleSidebar}>
//                 <Menu className='w-5 h-5' />
//             </button>
//         </div>
        
//         <div className="flex-1 max-w-lg">
//           <div className="relative">
//             {/* Search Icon */}
//             <button 
//               onClick={() => onSearchSubmit(searchQuery)}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600"
//             >
//               <Search className="w-4 h-4" />
//             </button>
            
//             <input
//               type="text"
//               placeholder="Search" 
//               value={searchQuery}
//               onFocus={onSearchFocus} 
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={handleKeyDown} 
//               className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-600 outline-none transition-all" 
//             />

//             {isSearching && (
//               <button 
//                 onClick={() => {
//                   setSearchQuery("");
//                   onSearchSubmit(""); 
//                 }} 
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Profile Section */}
//         <div className="flex items-center space-x-6 ml-auto"> 
//           <div className="flex space-x-2">
//              <button className="p-2.5 rounded-xl hover:bg-gray-100"><HelpCircle className="w-5 h-5" /></button>
//              <button className="p-2.5 rounded-xl hover:bg-gray-100"><Bell className="w-5 h-5" /></button>
//           </div>
//           <div className="flex items-center space-x-3 px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
//              <img src={ProfileIcon} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
//              <div className='text-right pr-2'>
//                 <p className="text-sm font-semibold text-gray-800">Angela Pradhan</p>
//                 <p className="text-xs text-gray-600">angelapradhan123@gmail.com</p>
//              </div>
//           </div>
//         </div>
//       </div>
//     </div >
//   )
// }
// export default Header;










// import React, { useState } from 'react';
// import { Search, Bell, User, ChevronDown } from 'lucide-react';

// const Header = ({ title = 'Dashboard', userName = 'John Doe' }) => {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);

//   const notifications = [
//     { id: 1, text: 'New transaction: $45.00 at Grocery Store', time: '5 min ago', unread: true },
//     { id: 2, text: 'Monthly budget alert: 80% spent', time: '1 hour ago', unread: true },
//     { id: 3, text: 'Payment received: $1,200.00', time: '2 hours ago', unread: false },
//   ];

//   const unreadCount = notifications.filter(n => n.unread).length;

//   return (
//     <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-64 z-10 shadow-sm">
//       <div className="h-full px-6 flex items-center justify-between">
//         {/* Left Section - Title & Search */}
//         <div className="flex items-center space-x-6 flex-1">
//           <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

//           <div className="relative max-w-md w-full">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search transactions, accounts..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Right Section - Notifications & Profile */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Bell className="w-6 h-6" />
//               {unreadCount > 0 && (
//                 <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
//                 <div className="px-4 py-2 border-b border-gray-100">
//                   <h3 className="font-semibold text-gray-800">Notifications</h3>
//                 </div>
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.map((notif) => (
//                     <div
//                       key={notif.id}
//                       className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
//                         notif.unread ? 'bg-indigo-50' : ''
//                       }`}
//                     >
//                       <p className="text-sm text-gray-800">{notif.text}</p>
//                       <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="px-4 py-2 border-t border-gray-100">
//                   <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
//                     View all notifications
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Profile Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowProfile(!showProfile)}
//               className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                 {userName.charAt(0)}
//               </div>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-semibold text-gray-800">{userName}</p>
//                 <p className="text-xs text-gray-500">Premium User</p>
//               </div>
//               <ChevronDown className="w-4 h-4 text-gray-600" />
//             </button>

//             {showProfile && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   <p className="font-semibold text-gray-800">{userName}</p>
//                   <p className="text-sm text-gray-500">john.doe@email.com</p>
//                 </div>
//                 <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
//                   <User className="w-4 h-4" />
//                   <span>My Profile</span>
//                 </button>
//                 <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
//                   Settings
//                 </button>
//                 <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
//                   Help & Support
//                 </button>
//                 <div className="border-t border-gray-100 mt-2 pt-2">
//                   <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, X } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getUserProfileApi } from '../../../service/api';
import toast from 'react-hot-toast';

const Header = ({ title = 'Dashboard', user: userProp, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || '{"fullName": "User", "email": "user@example.com"}');
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Sync with prop if it changes
  React.useEffect(() => {
    if (userProp) {
      setUserData(prev => ({ ...prev, ...userProp }));
    }
  }, [userProp]);

  React.useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const response = await getUserProfileApi();
        if (response.data.success) {
          const user = response.data.user;
          const newUserData = {
            ...userData,
            fullName: user.fullName || user.username,
            email: user.email,
            username: user.username
          };
          setUserData(newUserData);
          localStorage.setItem('user', JSON.stringify(newUserData));
        }
      } catch (error) {
        console.error("Error fetching fresh profile for header:", error);
      }
    };
    fetchFreshProfile();
  }, []);

  const userName = userData.fullName || userData.username || 'User';
  const userEmail = userData.email || 'user@example.com';

  const notifications = [
    { id: 1, text: 'New transaction: NRS 45.00 at Grocery Store', time: '5 min ago', unread: true },
    { id: 2, text: 'Monthly budget alert: 80% spent', time: '1 hour ago', unread: true },
    { id: 3, text: 'Payment received: NRS 1,200.00', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    if (onSearch) {
      onSearch(query);
    }

    // Logic for actual search results in overlay if needed
    const dummyData = [
      { id: 1, type: 'Transaction', text: 'Grocery Payment' },
      { id: 2, type: 'Goal', text: 'Education Fund' },
      { id: 3, type: 'Note', text: 'Monthly Planning' },
    ];

    const results = dummyData.filter(item =>
      item.text.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSearchOverlay(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/LoginPage');
  };

  // Only show search bar if NOT on /dashboard
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-64 z-10 shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left Section - Title & Conditional Search */}
          <div className="flex items-center space-x-6 flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

            {isDashboard && (
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions, accounts..."
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    if (onSearch) onSearch(query);
                  }}
                  onFocus={() => setShowSearchOverlay(false)}
                  className="w-full pl-11 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all duration-200"
                >
                  Search
                </button>
              </div>
            )}
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${notif.unread ? 'bg-indigo-50' : ''
                          }`}
                      >
                        <p className="text-sm text-gray-800">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500">Premium User</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 mb-1">
                    <p className="font-bold text-gray-800 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>

                  <div className="px-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfile(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center space-x-3 transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowProfile(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center space-x-3 transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                        <Search className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Account Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center space-x-3 transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-red-100/50 group-hover:bg-red-100 rounded-lg transition-colors">
                        <X className="w-4 h-4 rotate-45" />
                      </div>
                      <span className="font-bold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-md z-[100] flex flex-col items-center pt-32 transition-all duration-300"
          onClick={() => setShowSearchOverlay(false)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl rounded-3xl w-3/4 max-w-2xl p-8 shadow-2xl border border-white/50 relative animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <button onClick={() => setShowSearchOverlay(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {searchResults.length > 0 && (
              <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {searchResults.map((res) => (
                  <li
                    key={res.id}
                    className="group bg-white/50 hover:bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2.5 rounded-xl ${res.type === 'Transaction' ? 'bg-green-50 text-green-600' :
                        res.type === 'Goal' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                        {res.type === 'Transaction' ? <Search className="w-5 h-5" /> :
                          res.type === 'Goal' ? <Bell className="w-5 h-5" /> :
                            <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg leading-tight">{res.text}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{res.type}</p>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors -rotate-90" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;