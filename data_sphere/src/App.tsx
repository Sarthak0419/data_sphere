import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Drive } from './pages/Drive';
import { Starred } from './pages/Starred';
import { Trash } from './pages/Trash';
import { Spam } from './pages/spam';

function App() {
  const [starredFiles, setStarredFiles] = useState<Set<string>>(new Set());
  const [trashedFiles, setTrashedFiles] = useState<Set<string>>(new Set());
  const [spamFiles, setSpamFiles] = useState<Set<string>>(new Set());

  const markAsSpam = (fileName: string) => {
    setSpamFiles(prev => {
      const newSet = new Set(prev);
      newSet.add(fileName);
      return newSet;
    });
  };

  const markNotSpam = (fileName: string) => {
    setSpamFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileName);
      return newSet;
    });
  };

  const deleteSpam = (fileName: string) => {
    setSpamFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileName);
      return newSet;
    });
  };

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

  const moveToTrash = (fileName: string) => {
    setTrashedFiles(prev => {
      const newSet = new Set(prev);
      newSet.add(fileName);
      return newSet;
    });
  };

  const restoreFile = (fileName: string) => {
    setTrashedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileName);
      return newSet;
    });
  };

  const deletePermanently = (fileName: string) => {
    setTrashedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileName);
      return newSet;
    });
    // In a real app, this would permanently delete the file from the database
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/drive/my-drive" replace />} />
          <Route path="drive/my-drive" element={<Drive starredFiles={starredFiles} onToggleStar={toggleStar} trashedFiles={trashedFiles} onMoveToTrash={moveToTrash} onMarkAsSpam={markAsSpam} />} />
          <Route path="drive/starred" element={<Starred starredFiles={starredFiles} onToggleStar={toggleStar} trashedFiles={trashedFiles} onMoveToTrash={moveToTrash} />} />
          <Route path="drive/trash" element={<Trash trashedFiles={trashedFiles} onRestoreFile={restoreFile} onDeletePermanently={deletePermanently} />} />
          <Route path="drive/spam" element={<Spam spamFiles={spamFiles} onMarkNotSpam={markNotSpam} onDeleteSpam={deleteSpam} />} />
          <Route path="*" element={<div className="p-4">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
