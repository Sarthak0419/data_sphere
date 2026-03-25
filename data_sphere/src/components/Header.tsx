import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Settings, Grip, UserCircle, Clock, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';

interface HeaderProps {
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchHistory?: string[];
  onAddToSearchHistory?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
   
  searchQuery = '', 
  onSearchChange, 
  searchHistory = [], 
  onAddToSearchHistory 
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [isReady, setIsReady] = useState(false); // Controls the automatic intro animation
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, accounts, switchAccount, addAccount, logout } = useAuth();

  // Trigger the automatic intro animation after the component mounts
  useEffect(() => {
    // Wait 800ms with the logo in the center, then animate it open
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle clicking outside to dismiss the search history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
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
    <header className={`relative flex items-center px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50 h-16 ${!isReady ? 'overflow-hidden' : ''}`}>
      
      {/* LEFT: Logo - Origin point for all animations */}
      <div 
        className={`flex items-center gap-2 whitespace-nowrap z-10 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${!isReady 
            ? 'absolute left-1/2 -translate-x-1/2 scale-110' 
            : 'relative left-0 translate-x-0 scale-100'
          }
        `}
      >
        {/* 3D Folder Logo */}
        <div className="relative group flex items-center justify-center shrink-0">
          <div className="file relative w-11 h-8 origin-bottom [perspective:1500px]">
            <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-lg rounded-tl-none group-hover:shadow-[0_10px_20px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-5 after:h-1 after:bg-amber-600 after:rounded-t-lg before:absolute before:content-[''] before:-top-[3.5px] before:left-[18.5px] before:w-1 before:h-1 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%)]"></div>
            <div className="work-4 absolute inset-0.5 bg-zinc-400 rounded-lg transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"></div>
            <div className="work-3 absolute inset-0.5 bg-zinc-300 rounded-lg transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"></div>
            <div className="work-2 absolute inset-0.5 bg-zinc-200 rounded-lg transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"></div>
            <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[30px] rounded-lg rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[35px] after:h-[4px] after:bg-amber-400 after:rounded-t-lg before:absolute before:content-[''] before:-top-[2.5px] before:right-[34px] before:size-1 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%)] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_10px_20px_#fbbf24,_inset_0_-10px_20px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(0.5px)]"></div>
          </div>
        </div>
        <span className="text-xl text-gray-800 font-medium">Data Sphere</span>
      </div>

      {/* CENTER: Search Bar - Expands from logo */}
      <div ref={searchContainerRef} className="flex-1 flex justify-center mx-8">
        <div 
          className={`transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[300ms]
            ${!isReady 
              ? 'opacity-0 -translate-x-[200px] scale-75'
              : 'opacity-100 translate-x-0 scale-100'
            }
          `}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              name="search"
              tabIndex={isReady ? 0 : -1}
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-100 transition-all focus:w-[500px] outline-none"
            />
            <svg
              className="size-6 absolute top-3 right-3 text-gray-500"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>

            {/* Search History Dropdown */}
            {showHistory && searchHistory.length > 0 && isReady && (
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
      </div>

      {/* RIGHT: User Icons - Expands from logo */}
      <div className={`flex items-center gap-2 justify-end transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[500ms] ${!isReady ? 'opacity-0 -translate-x-[300px] scale-75' : 'opacity-100 translate-x-0 scale-100'}`}>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-700">
          <HelpCircle size={24} className="stroke-[2.5px]" />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-700">
          <Settings size={24} className="stroke-[2.5px]" />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-700">
          <Grip size={24} className="stroke-[2.5px]" />
        </div>
        <div className="ml-2 relative" ref={userMenuRef}>
          <div 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {user?.profilePic ? (
              <img 
                src={user.profilePic} 
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <UserCircle size={28} className="text-blue-700" />
            )}
          </div>
          
          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
              {/* Current User Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={user.username}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <UserCircle size={56} className="text-blue-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">{user?.username || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
                  </div>
                </div>
              </div>

              {/* Other Accounts */}
              {accounts.length > 1 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Switch Account
                  </div>
                  {accounts
                    .filter(session => session.user.id !== user?.id)
                    .map(session => (
                      <div
                        key={session.user.id}
                        onClick={() => {
                          switchAccount(session.user.id);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {session.user.profilePic ? (
                          <img 
                            src={session.user.profilePic} 
                            alt={session.user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircle size={40} className="text-gray-400" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{session.user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Add Account Option */}
              <div
                onClick={() => {
                  addAccount();
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserPlus size={20} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Add another account</span>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};