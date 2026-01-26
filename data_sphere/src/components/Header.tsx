import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Settings, Grip, UserCircle, Menu, Clock, X } from 'lucide-react';

interface HeaderProps {
  onUserClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchHistory?: string[];
  onAddToSearchHistory?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onUserClick, searchQuery = '', onSearchChange, searchHistory = [], onAddToSearchHistory }) => {
  const [showHistory, setShowHistory] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onAddToSearchHistory?.(searchQuery.trim());
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (query: string) => {
    onSearchChange?.(query);
    setShowHistory(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center gap-3 w-60">
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer lg:hidden">
          <Menu size={24} className="text-gray-600" />
        </div>
        <div className="flex items-center gap-2">
          {/* 3D Folder Logo */}
          <div className="relative group flex items-center justify-center">
            <div className="file relative w-11 h-8 cursor-pointer origin-bottom [perspective:1500px]">
              <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-lg rounded-tl-none group-hover:shadow-[0_10px_20px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-5 after:h-1 after:bg-amber-600 after:rounded-t-lg before:absolute before:content-[''] before:-top-[3.5px] before:left-[18.5px] before:w-1 before:h-1 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%)]"></div>
              <div className="work-4 absolute inset-0.5 bg-zinc-400 rounded-lg transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
              <div className="work-3 absolute inset-0.5 bg-zinc-300 rounded-lg transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
              <div className="work-2 absolute inset-0.5 bg-zinc-200 rounded-lg transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>
              <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[30px] rounded-lg rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[35px] after:h-[4px] after:bg-amber-400 after:rounded-t-lg before:absolute before:content-[''] before:-top-[2.5px] before:right-[34px] before:size-1 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%)] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_10px_20px_#fbbf24,_inset_0_-10px_20px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(0.5px)]"></div>
            </div>
          </div>
          <span className="text-xl text-gray-800 font-medium">Data Sphere</span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl px-4">
        <div className="relative group" ref={searchContainerRef}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={24} className="text-gray-600 group-focus-within:text-blue-700 stroke-[2.5px]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleKeyDown}
            className="block w-full pl-12 pr-4 py-3.5 bg-gray-100 border-none rounded-full leading-5 text-gray-900 placeholder-gray-700 font-normal focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:shadow-md transition-shadow sm:text-base"
            placeholder="Search here..."
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
             <Settings size={20} className="text-black stroke-[2.5px]" />
          </div>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b border-gray-100">Recent searches</div>
              {searchHistory.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleHistoryClick(query)}
                >
                  <Clock size={16} className="text-gray-400" />
                  <span className="flex-1 text-gray-700 text-sm truncate">{query}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-60 justify-end">
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-700">
          <HelpCircle size={24} className="stroke-[2.5px]" />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-700">
          <Settings size={24} className="stroke-[2.5px]" />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-700">
          <Grip size={24} className="stroke-[2.5px]" />
        </div>
        <div className="ml-2 cursor-pointer" onClick={onUserClick}>
           <UserCircle size={28} className="text-blue-700" />
        </div>
      </div>
    </header>
  );
};
