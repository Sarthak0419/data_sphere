import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  HardDrive, 
  Clock, 
  Star, 
  AlertOctagon, 
  Trash2
} from 'lucide-react';
import { apiUrl } from '../config/api';
import { useAuth } from './AuthContext';

const navItems = [
  { icon: HardDrive, label: 'My Storage', path: '/drive/my-drive' },
  { icon: Clock, label: 'Recent', path: '/drive/recent' },
  { icon: Star, label: 'Starred', path: '/drive/starred' },
  { icon: AlertOctagon, label: 'Spam', path: '/drive/spam' },
  { icon: Trash2, label: 'Trash', path: '/drive/trash' },
];

interface SidebarProps {
  onNewClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [usedBytes, setUsedBytes] = useState(0);

  const totalBytes = 10 * 1024 * 1024 * 1024;

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  };

  useEffect(() => {
    const fetchStorageUsage = async () => {
      if (!user) {
        setUsedBytes(0);
        return;
      }

      const storedAccounts = localStorage.getItem('accountSessions');
      const activeUserId = localStorage.getItem('activeUserId');
      if (!storedAccounts || !activeUserId) {
        setUsedBytes(0);
        return;
      }

      const sessions = JSON.parse(storedAccounts) as Array<{ user: { id: string }; token: string }>;
      const token = sessions.find((session) => session.user.id === activeUserId)?.token;
      if (!token) {
        setUsedBytes(0);
        return;
      }

      try {
        const usageRes = await fetch(apiUrl('/api/files/storage-usage'), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!usageRes.ok) {
          throw new Error('Failed to fetch storage usage');
        }

        const usage = await usageRes.json() as { usedBytes: string; quotaBytes: string };
        const parsedUsed = Number(usage.usedBytes);
        setUsedBytes(Number.isFinite(parsedUsed) ? parsedUsed : 0);
      } catch (error) {
        console.error('Failed to fetch storage usage', error);
      }
    };

    fetchStorageUsage();

    const refreshInterval = window.setInterval(fetchStorageUsage, 15000);
    return () => window.clearInterval(refreshInterval);
  }, [user?.id, location.pathname]);

  const usagePercent = useMemo(() => {
    if (totalBytes <= 0) return 0;
    return Math.min((usedBytes / totalBytes) * 100, 100);
  }, [usedBytes]);
  
  return (
    <aside className="w-64 py-4 flex flex-col h-[calc(100vh-64px)] hidden lg:flex border-r border-gray-200 bg-white fixed left-0 top-[64px]">
      <div className="px-4 mb-6">
        <button 
          onClick={onNewClick}
          className="group relative w-[120px] h-[60px] cursor-pointer flex items-center border-2 border-black shadow-[4px_4px_#323232] bg-white rounded-[10px] overflow-hidden transition-all duration-300 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
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
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link 
                  to={item.path} 
                  className={`flex items-center-fix gap-3 px-6 py-2 rounded-r-full text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-800' 
                      : 'text-black hover:bg-gray-300'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-blue-800 stroke-[2.5px]' : 'text-black stroke-[2.5px]'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
          <div className="bg-blue-600 h-1 rounded-full transition-all duration-300" style={{ width: `${usagePercent}%` }}></div>
        </div>
        <p className="text-sm text-black mb-7 font-medium">{formatBytes(usedBytes)} of 10 GB used</p>
      </div>
    </aside>
  );
};
