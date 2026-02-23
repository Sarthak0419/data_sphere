import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Settings, Grip, UserCircle, Menu, Clock, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from './AuthContext';

interface HeaderProps {
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchHistory?: string[];
  onAddToSearchHistory?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onUserClick, 
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
  const { user, accounts, switchAccount, addAccount } = useAuth();

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

  // Automatically focus the input when the search bar finishes opening
  useEffect(() => {
    if (isReady && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 1200); // Wait for the slide animation to finish
    }
  }, [isReady]);

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
    <header className="relative flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50 h-16 overflow-hidden">
      
      {/* LEFT: Mobile Menu (Fades in after animation) */}
      <div className={`w-10 transition-opacity duration-700 ${!isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer lg:hidden shrink-0">
          <Menu size={24} className="text-gray-600" />
        </div>
      </div>

      {/* CENTER: Morphing Container */}
      <div ref={searchContainerRef} className="flex-1 max-w-4xl relative h-full flex items-center ml-2 mr-4">
        
        {/* LOGO (Starts centered, moves left) */}
        <div 
          className={`absolute z-20 flex items-center gap-2 whitespace-nowrap transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]
            ${!isReady 
              ? 'left-1/2 -translate-x-1/2 scale-125' // Centered and slightly larger
              : 'left-0 translate-x-0 scale-100'       // Moved to the left resting position
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

        {/* SEARCH BAR (Expands from the moving logo) */}
        <div 
          className={`absolute left-[170px] right-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] origin-left
            ${!isReady 
              ? 'opacity-0 scale-x-0 translate-x-12' // Hidden behind the centered logo
              : 'opacity-100 scale-x-100 translate-x-0' // Fully expanded
            }
          `}
        >
          {/* Custom keyframes for the continuous moving shimmer */}
          <style>{`
            @keyframes sweep {
              0% { transform: translateX(-100%) skewX(-15deg); }
              100% { transform: translateX(300%) skewX(-15deg); }
            }
            .animate-sweep {
              animation: sweep 2.5s infinite ease-in-out;
            }
          `}</style>

          <div className="relative group w-full overflow-hidden rounded-full bg-gray-100 focus-within:bg-white transition-colors duration-300">
            
            {/* Continuous Moving Shimmer Overlay (Only active after opening) */}
            {isReady && (
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-full">
                <div className="w-[50%] h-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-sweep"></div>
              </div>
            )}

            {/* Left Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
              <Search size={24} className="text-gray-600 group-focus-within:text-blue-700 stroke-[2.5px] transition-colors" />
            </div>
            
            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              tabIndex={isReady ? 0 : -1}
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-12 pr-12 py-3.5 bg-transparent border-none rounded-full leading-5 text-gray-900 placeholder-gray-700 font-normal focus:outline-none focus:ring-1 focus:ring-blue-200 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all sm:text-base relative z-10"
              placeholder="Search here..."
            />
            
            {/* Right Settings Icon */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer z-20">
               <Settings size={20} className="text-black stroke-[2.5px]" />
            </div>
          </div>

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

      {/* RIGHT: User Icons (Fades in after animation) */}
      <div className={`flex items-center gap-2 w-60 justify-end transition-opacity duration-700 delay-300 ${!isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
                  onLogout?.();
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