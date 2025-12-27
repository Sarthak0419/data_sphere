import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Drive } from './pages/Drive';
import { Starred } from './pages/Starred';

function App() {
  const [starredFiles, setStarredFiles] = useState<Set<string>>(new Set());

  const toggleStar = (fileName: string) => {
    setStarredFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/drive/my-drive" replace />} />
          <Route path="drive/my-drive" element={<Drive starredFiles={starredFiles} onToggleStar={toggleStar} />} />
          <Route path="drive/starred" element={<Starred starredFiles={starredFiles} onToggleStar={toggleStar} />} />
          <Route path="*" element={<div className="p-4">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
