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
            className="w-11 h-11"
          />
          <span className="text-2xl text-gray-700 font-medium">Drive</span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={24} className="text-gray-600 group-focus-within:text-blue-700 stroke-[2.5px]" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3.5 bg-gray-100 border-none rounded-full leading-5 text-gray-900 placeholder-gray-700 font-normal focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:shadow-md transition-shadow sm:text-base"
            placeholder="Search here..."
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
             <Settings size={20} className="text-black stroke-[2.5px]" />
          </div>
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
        <div className="ml-2 cursor-pointer">
           <UserCircle size={28} className="text-blue-700" />
        </div>
      </div>
    </header>
  );
};
