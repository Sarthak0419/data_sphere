import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  onNewClick?: () => void;
  onUserClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onNewClick, onUserClick }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onUserClick={onUserClick} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNewClick={onNewClick} />
        <main className="flex-1 bg-white rounded-tl-2xl border border-gray-200 m-2 ml-[264px] overflow-y-auto p-4">
          <Outlet />
        </main>
        {/* Right sidebar could go here */}
      </div>
    </div>
  );
};
