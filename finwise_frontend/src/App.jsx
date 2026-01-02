import { useState } from 'react'
import Sidebar from "./components/Layout/Sidebar";
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import SearchPage from './components/Search/SearchPage';

import './App.css'

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setSideBarCollapsed(!sideBarCollapsed);
  const openSearch = () => setIsSearching(true);
  const closeSearch = () => setIsSearching(false);

  return (
    <div className="min-h-screen bg-[#EAEEFF]"> 
      <div className="flex h-screen overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />

        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* HEADER */}
          <Header 
            sidebarCollapsed={sideBarCollapsed}
            onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchFocus={openSearch}
            isSearching={isSearching}
          />

          {/* MAIN CONTENT AREA */}
          <main className='flex-1 overflow-y-auto'> 
            <div className='p-8'> 
              {/* Static View Switching */}
              {isSearching ? (
                <SearchPage query={searchQuery} />
              ) : (
              <Dashboard />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App
