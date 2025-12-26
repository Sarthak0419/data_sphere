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
  { icon: HardDrive, label: 'My Drive', active: true },
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
        <button className="flex items-center gap-3 bg-white border border-gray-300 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <Plus size={24} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-600">New</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a 
                href="#" 
                className={`flex items-center gap-3 px-6 py-1.5 rounded-r-full text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} className={item.active ? 'text-blue-700' : 'text-gray-500'} />
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
        <p className="text-xs text-gray-600 mb-1">4.2 GB of 15 GB used</p>
        <button className="text-xs text-blue-600 border border-gray-300 rounded px-3 py-1 hover:bg-blue-50">
          Get more storage
        </button>
      </div>
    </aside>
  );
};
