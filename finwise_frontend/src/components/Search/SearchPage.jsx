import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react'; // Added X icon

const SearchPage = ({ query, searchTriggered, searchResultCount }) => {
  const [recentSearches, setRecentSearches] = useState([]);

  // Fetch history when bar is empty
  useEffect(() => {
    if (!query || query.trim() === "") {
      fetch('http://localhost:3000/api/search/recent')
        .then(res => res.json())
        .then(data => setRecentSearches(data.map(i => i.term)))
        .catch(err => console.error("History fetch failed", err));
    }
  }, [query]);

  // --- NEW: DELETE FUNCTION ---
  const handleDelete = async (termToDelete) => {
    try {
      const response = await fetch(`http://localhost:3000/api/search/delete/${termToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted term from the local state immediately
        setRecentSearches(prev => prev.filter(term => term !== termToDelete));
      }
    } catch (err) {
      console.error("Failed to delete search term:", err);
    }
  };

  // 1. If user is typing but hasn't pressed Enter yet -> BLANK PAGE
  if (query && !searchTriggered) {
    return <div className="min-h-[60vh] animate-pulse"></div>;
  }

  // 2. If bar is empty -> Show TOP SEARCH HISTORY
  if (!query) {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-[#5B21B6] mb-4">Top Search</h2>
          <div className="flex flex-wrap gap-2.5">
            {recentSearches.map((tag, i) => (
              <div key={i} className="flex items-center group">
                <button className="px-3 py-1.5 border border-[#B794F4] rounded-l-lg text-xs text-[#7148D6] bg-white hover:bg-violet-50 transition-colors">
                  {tag}
                </button>
                {/* Delete button next to the tag */}
                <button 
                  onClick={() => handleDelete(tag)}
                  className="px-2 py-1.75 border-y border-r border-[#B794F4] rounded-r-lg bg-white text-[#7148D6] hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete search"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 3. Search submitted AND no results -> SORRY PAGE
  if (searchTriggered && searchResultCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <img src="/src/assets/no_search.png" alt="No results" className="w-40 h-40 mb-6 object-contain" />
        <div className="bg-[#E9E9FF] px-6 py-1.5 rounded-xl mb-3 border border-[#D6BCFA]">
          <span className="text-[#5B21B6] font-bold text-sm">We're sorry!!</span>
        </div>
        <p className="text-[#4A5568] text-xs font-semibold max-w-xs">
          Try again using more general search terms for "{query}"
        </p>
      </div>
    );
  }

  // 4. Results found
  return <div className="text-violet-700 font-bold">Showing results for: {query}</div>;
};

export default SearchPage;