import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Drive } from './pages/Drive';
import { Starred } from './pages/Starred';
import { Trash } from './pages/Trash';
import { Spam } from './pages/spam';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './components/AuthContext';

function App() {
  // 1. STATE DEFINITIONS
  const [uploadCount, setUploadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 4);
    });
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Get auth token from localStorage
    const storedAccounts = localStorage.getItem('accountSessions');
    const activeUserId = localStorage.getItem('activeUserId');
    let token: string | null = null;

    if (storedAccounts && activeUserId) {
      const accounts = JSON.parse(storedAccounts);
      const activeSession = accounts.find((s: { user: { id: string }; token: string }) => s.user.id === activeUserId);
      token = activeSession?.token || null;
    }

    if (!token) {
      console.error('No auth token found. Please log in.');
      return;
    }

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5000/api/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ File uploaded to S3:', data);
          setUploadCount(prev => prev + 1);
        } else {
          console.error('❌ Upload failed:', data.message);
        }
      } catch (error) {
        console.error('❌ Upload error:', error);
      }
    }

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
          <Route path="drive/my-drive" element={<Drive uploadCount={uploadCount} searchQuery={searchQuery} />} />
          <Route path="drive/starred" element={<Starred searchQuery={searchQuery} />} />
          <Route path="drive/trash" element={<Trash searchQuery={searchQuery} />} />
          <Route path="drive/spam" element={<Spam searchQuery={searchQuery} />} />
          <Route path="*" element={<div className="p-4">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;