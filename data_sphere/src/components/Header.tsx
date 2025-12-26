import React from 'react';
import { Search, HelpCircle, Settings, Grip, UserCircle, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center gap-3 w-60">
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer lg:hidden">
          <Menu size={24} className="text-gray-600" />
        </div>
        <div className="flex items-center gap-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" 
            alt="Drive Logo" 
            className="w-10 h-10"
          />
          <span className="text-xl text-gray-600 font-normal">Drive</span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-500 group-focus-within:text-blue-600" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 bg-gray-100 border-none rounded-full leading-5 text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:shadow-md transition-shadow sm:text-sm"
            placeholder="Search in Drive"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
             <Settings size={20} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-60 justify-end">
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600">
          <HelpCircle size={24} />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600">
          <Settings size={24} />
        </div>
        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600">
          <Grip size={24} />
        </div>
        <div className="ml-2 cursor-pointer">
           <UserCircle size={32} className="text-blue-600" />
        </div>
      </div>
    </header>
  );
};
