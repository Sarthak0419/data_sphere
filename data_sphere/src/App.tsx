import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Drive } from './pages/Drive';
import { Recent } from './pages/Recent';
import { SharedWithMe } from './pages/SharedWithMe';
import { Computers } from './pages/Comuters';
import { Starred } from './pages/Starred';
import { Trash } from './pages/Trash';
import { Spam } from './pages/spam';
import { Login } from './pages/Login';
import StoragePage from './pages/Storage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './components/AuthContext';

export interface UploadedFile {
  name: string;
  type: string;
  date: string;
  size: string;
}

function App() {
  // 1. STATE DEFINITIONS
  const [starredFiles, setStarredFiles] = useState<Set<string>>(new Set());
  const [trashedFiles, setTrashedFiles] = useState<Set<string>>(new Set());
  const [spamFiles, setSpamFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

  // 2. HELPER FUNCTIONS
  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 4);
    });
  };

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
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      name: file.name,
      type: file.name.split('.').pop() || 'file',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: formatFileSize(file.size),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // 3. SERVER CONNECTION TEST (Placed correctly)
  useEffect(() => {
    fetch('http://localhost:5000')
      .then(response => response.text())
      .then(data => console.log("📢 Server says:", data))
      .catch(error => console.error("❌ Error:", error));
  }, []);

  // 4. MAIN UI RENDER (Only one return!)
  return (
    <BrowserRouter>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
      <Routes>
        {/* Public route - Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout onNewClick={triggerFileUpload} onLogout={logout} searchQuery={searchQuery} onSearchChange={setSearchQuery} searchHistory={searchHistory} onAddToSearchHistory={addToSearchHistory} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/drive/my-drive" replace />} />
          <Route path="drive/my-drive" element={<Drive starredFiles={starredFiles} onToggleStar={toggleStar} trashedFiles={trashedFiles} onMoveToTrash={moveToTrash} onMarkAsSpam={markAsSpam} uploadedFiles={uploadedFiles} searchQuery={searchQuery} />} />
          <Route path="drive/recent" element={<Recent starredFiles={starredFiles} onToggleStar={toggleStar} trashedFiles={trashedFiles} onMoveToTrash={moveToTrash} searchQuery={searchQuery} />} />
          <Route path="drive/shared-with-me" element={<SharedWithMe starredFiles={starredFiles} onToggleStar={toggleStar} trashedFiles={trashedFiles} onMoveToTrash={moveToTrash} searchQuery={searchQuery} />} />
          <Route path="drive/computers" element={<Computers searchQuery={searchQuery} />} />
          <Route path="drive/starred" element={<Starred starredFiles={starredFiles} onToggleStar={toggleStar} trashedFiles={trashedFiles} onMoveToTrash={moveToTrash} searchQuery={searchQuery} />} />
          <Route path="drive/trash" element={<Trash trashedFiles={trashedFiles} onRestoreFile={restoreFile} onDeletePermanently={deletePermanently} searchQuery={searchQuery} />} />
          <Route path="drive/spam" element={<Spam spamFiles={spamFiles} onMarkNotSpam={markNotSpam} onDeleteSpam={deleteSpam} searchQuery={searchQuery} />} />
          <Route path="drive/storage" element={<StoragePage />} />
          <Route path="*" element={<div className="p-4">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;