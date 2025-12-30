import { useState } from 'react'
import Sidebar from "./components/Layout/Sidebar";
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';

import './App.css'

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [searchQuery, setSearchQuery] = useState("");

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
          />

          {/* MAIN CONTENT AREA */}
          <main className='flex-1 overflow-y-auto'> 
            <div className='p-8 space-y-8'> 
              {currentPage === "dashboard" ? (
                <Dashboard />
              ) : (
                <div className="text-gray-500">
                  Section "{currentPage}" is under construction (Frontend only).
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App
