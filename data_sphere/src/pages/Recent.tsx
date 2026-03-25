import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Image as ImageIcon, File, Star, Trash2, AlertOctagon } from 'lucide-react';
import { apiUrl } from '../config/api';

interface FileItem {
  id: string;
  name: string;
  createdAt: string;
  size: string;
  isStarred: boolean;
}

interface RecentProps {
  searchQuery?: string;
}

const getAuthToken = (): string | null => {
  const storedAccounts = localStorage.getItem('accountSessions');
  const activeUserId = localStorage.getItem('activeUserId');
  if (!storedAccounts || !activeUserId) return null;
  const accounts = JSON.parse(storedAccounts);
  const session = accounts.find((s: { user: { id: string }; token: string }) => s.user.id === activeUserId);
  return session?.token || null;
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'txt':
      return <FileText size={20} className="text-blue-600" />;
    case 'pdf':
      return <File size={20} className="text-red-600" />;
    case 'docx':
    case 'doc':
      return <File size={20} className="text-blue-700" />;
    case 'xlsx':
    case 'xls':
      return <File size={20} className="text-green-600" />;
    case 'pptx':
    case 'ppt':
      return <File size={20} className="text-orange-600" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon size={20} className="text-purple-600" />;
    default:
      return <File size={20} className="text-black" />;
  }
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const Recent: React.FC<RecentProps> = ({ searchQuery = '' }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const patchFile = async (id: string, data: Record<string, unknown>) => {
    const token = getAuthToken();
    if (!token) return;
    await fetch(apiUrl(`/api/files/${id}`), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  const toggleStar = async (file: FileItem) => {
    await patchFile(file.id, { isStarred: !file.isStarred });
    setFiles(prev => prev.map(f => (f.id === file.id ? { ...f, isStarred: !f.isStarred } : f)));
  };

  const moveToTrash = async (id: string) => {
    await patchFile(id, { isTrashed: true });
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const markSpam = async (id: string) => {
    await patchFile(id, { isSpam: true });
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(apiUrl('/api/files'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch recent files');
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error('Failed to load recent files', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = query
      ? files.filter(file => file.name.toLowerCase().includes(query))
      : files;

    return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [files, searchQuery]);

  return (
    <div className="h-full">
      <h1 className="text-3xl font-normal text-black mb-2">Recent</h1>
      <p className="text-gray-600 text-sm mb-6">Latest files and quick actions</p>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No recent files found</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-base font-medium text-black w-1/2">Name</th>
                <th className="py-4 px-6 text-base font-medium text-black">Last modified</th>
                <th className="py-4 px-6 text-base font-medium text-black">File size</th>
                <th className="py-4 px-6 text-base font-medium text-black"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id} className="group border-b border-gray-100 last:border-b-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.name)}
                      <span className="text-black font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-black">
                    {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6 text-black">{formatBytes(parseInt(file.size, 10) || 0)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className={`p-2 rounded-full hover:bg-gray-100 transition-opacity ${file.isStarred ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}
                        onClick={() => toggleStar(file)}
                        title={file.isStarred ? 'Remove from starred' : 'Add to starred'}
                      >
                        <Star size={18} className={file.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-black'} />
                      </button>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => moveToTrash(file.id)}
                        title="Move to trash"
                      >
                        <Trash2 size={18} className="text-black" />
                      </button>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => markSpam(file.id)}
                        title="Mark as spam"
                      >
                        <AlertOctagon size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
