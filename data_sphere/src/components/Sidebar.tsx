import React from 'react';
import { 
  Plus, 
  HardDrive, 
  Monitor, 
  Users, 
  Clock, 
  Star, 
  AlertOctagon, 
  Trash2, 
  Cloud 
} from 'lucide-react';

const navItems = [
  { icon: HardDrive, label: 'My Storage', active: true },
  { icon: Monitor, label: 'Computers' },
  { icon: Users, label: 'Shared with me' },
  { icon: Clock, label: 'Recent' },
  { icon: Star, label: 'Starred' },
  { icon: AlertOctagon, label: 'Spam' },
  { icon: Trash2, label: 'Trash' },
  { icon: Cloud, label: 'Storage' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 py-4 flex flex-col h-[calc(100vh-64px)] hidden lg:flex">
      <div className="px-4 mb-6">
        <button className="group relative w-[120px] h-[60px] cursor-pointer flex items-center border-2 border-black shadow-[4px_4px_#323232] bg-white rounded-[10px] overflow-hidden transition-all duration-300 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
          <span className="translate-x-[24px] text-black font-semibold transition-all duration-300 group-hover:text-transparent">
            New
          </span>
          <span className="absolute translate-x-[77px] h-full w-[39px] bg-white flex items-center justify-center transition-all duration-300 group-hover:w-full group-hover:translate-x-0">
            <Plus size={28} className="text-blue-600" />
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a 
                href="#" 
                className={`flex items-center-fix gap-3 px-6 py-2 rounded-r-full text-base font-medium transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-800' 
                    : 'text-black hover:bg-gray-300'
                }`}
              >
                <item.icon size={18} className={item.active ? 'text-blue-800 stroke-[2.5px]' : 'text-black stroke-[2.5px]'} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
          <div className="bg-blue-600 h-1 rounded-full" style={{ width: '30%' }}></div>
        </div>
        <p className="text-sm text-black mb-1 font-medium">4.2 GB of 15 GB used</p>
        <button className="text-sm font-medium text-blue-700 border border-gray-300 rounded px-4 py-1.5 hover:bg-blue-50">
          Get more storage
        </button>
      </div>
    </aside>
  );
};
