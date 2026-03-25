import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Image as ImageIcon, File, MoreVertical, LayoutGrid, List, X, Download, Filter, ArrowUpDown, Star, Cloud, Lock, Zap, Trash2, AlertOctagon } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';
import { apiUrl } from '../config/api';

interface FileItem {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  isStarred: boolean;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'txt':
      return <FileText size={24} className="text-blue-600" />;
    case 'pdf':
      return <File size={24} className="text-red-600" />;
    case 'docx':
    case 'doc':
      return <File size={24} className="text-blue-700" />;
    case 'xlsx':
    case 'xls':
      return <File size={24} className="text-green-600" />;
    case 'pptx':
    case 'ppt':
      return <File size={24} className="text-orange-600" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon size={24} className="text-purple-600" />;
    default:
      return <File size={24} className="text-black" />;
  }
};

const getAuthToken = (): string | null => {
  const storedAccounts = localStorage.getItem('accountSessions');
  const activeUserId = localStorage.getItem('activeUserId');
  if (!storedAccounts || !activeUserId) return null;
  const accounts = JSON.parse(storedAccounts);
  const session = accounts.find((s: { user: { id: string }; token: string }) => s.user.id === activeUserId);
  return session?.token || null;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const patchFile = async (id: string, data: Record<string, unknown>): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;
  await fetch(apiUrl(`/api/files/${id}`), {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const downloadFile = async (file: Pick<FileItem, 'id' | 'name'>): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;

  const response = await fetch(apiUrl(`/api/files/${file.id}/download`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Download failed');
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};

const parseSizeToBytes = (sizeStr: string): number => {
  const match = sizeStr.match(/([0-9.]+)\s*(KB|MB|GB)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  
  switch (unit) {
    case 'KB': return value * 1024;
    case 'MB': return value * 1024 * 1024;
    case 'GB': return value * 1024 * 1024 * 1024;
    default: return value;
  }
};

const FilePreviewModal: React.FC<{ file: FileItem; onClose: () => void; onDownload: (file: FileItem) => Promise<void> }> = ({ file, onClose, onDownload }) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');
  const isPDF = ext === 'pdf';
  const isExcel = ['xlsx', 'xls'].includes(ext || '');
  const isText = ext === 'txt';
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const shouldFetchPreview = isImage || isPDF || isText;
    if (!shouldFetchPreview) {
      setPreviewUrl(null);
      setTextPreview('');
      setPreviewError(null);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setPreviewError('Please log in again to preview files');
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    const loadPreview = async () => {
      try {
        setPreviewLoading(true);
        setPreviewError(null);

        const response = await fetch(apiUrl(`/api/files/${file.id}/preview`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Preview request failed');
        }

        if (isText) {
          const text = await response.text();
          if (!cancelled) setTextPreview(text);
          return;
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setPreviewUrl(objectUrl);
      } catch (error) {
        console.error('Failed to load preview', error);
        if (!cancelled) setPreviewError('Preview is not available for this file right now');
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.id, isImage, isPDF, isText]);

  const renderPreview = () => {
    if (previewLoading) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading preview...</p>
          </div>
        </div>
      );
    }

    if (previewError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center px-6">
            <File size={64} className="text-black mx-auto mb-4" />
            <p className="text-black text-lg mb-2">Preview unavailable</p>
            <p className="text-sm text-gray-500">{previewError}</p>
          </div>
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-900">
          <img 
            src={previewUrl || ''}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="h-full bg-gray-100 p-4">
          <iframe title={file.name} src={previewUrl || ''} className="w-full h-full rounded-lg border border-gray-300 bg-white" />
        </div>
      );
    }

    if (isExcel) {
      const sampleData = [
        ['Product', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales'],
        ['Product A', '$12,500', '$15,200', '$18,300', '$21,400'],
        ['Product B', '$8,900', '$9,400', '$10,100', '$11,200'],
        ['Product C', '$15,600', '$14,800', '$16,200', '$17,900'],
        ['Product D', '$6,300', '$7,100', '$8,500', '$9,200'],
        ['Total', '$43,300', '$46,500', '$53,100', '$59,700'],
      ];

      return (
        <div className="flex flex-col h-full bg-white">
          <div className="flex-1 overflow-auto p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
              <p className="text-black">Spreadsheet Preview</p>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-green-50">
                    {sampleData[0].map((header, idx) => (
                      <th key={idx} className="border border-gray-300 px-4 py-3 text-left font-semibold text-black">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx === sampleData.length - 2 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="border border-gray-300 px-4 py-2 text-black">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-black mt-4">Sample data for preview purposes</p>
          </div>
        </div>
      );
    }

    if (isText) {
      return (
        <div className="flex flex-col h-full bg-white">
          <div className="flex-1 overflow-auto p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
              <p className="text-black">Text Document</p>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <pre className="font-mono text-sm text-black whitespace-pre-wrap">{textPreview}</pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <File size={64} className="text-black mx-auto mb-4" />
          <p className="text-black text-lg mb-2">No preview available</p>
          <p className="text-black text-sm">{file.name}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div 
        className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {getFileIcon(file.name)}
            <div>
              <h2 className="text-lg font-semibold text-black">{file.name}</h2>
              <p className="text-sm text-black">{file.size} • {file.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Download" onClick={() => onDownload(file)}>
              <Download size={20} className="text-black" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X size={24} className="text-black" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

interface DriveProps {
  uploadCount?: number;
  searchQuery?: string;
}

export const Drive: React.FC<DriveProps> = ({ uploadCount = 0, searchQuery = '' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState('Could not connect to server');
  const [retryCount, setRetryCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'size-asc' | 'size-desc' | 'date'>('name');
  const [openMenuFile, setOpenMenuFile] = useState<string | null>(null);
  const [confirmTrashFile, setConfirmTrashFile] = useState<string | null>(null);

  const handleDownload = async (file: FileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await downloadFile(file);
      setOpenMenuFile(null);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  const toggleStar = async (file: FileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await patchFile(file.id, { isStarred: !file.isStarred });
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, isStarred: !file.isStarred } : f));
  };

  const handleMoveToTrash = (file: FileItem) => {
    if (file.isStarred) {
      setConfirmTrashFile(file.id);
    } else {
      patchFile(file.id, { isTrashed: true });
      setFiles(prev => prev.filter(f => f.id !== file.id));
    }
    setOpenMenuFile(null);
  };

  const confirmMoveToTrash = async () => {
    if (confirmTrashFile) {
      await patchFile(confirmTrashFile, { isTrashed: true });
      setFiles(prev => prev.filter(f => f.id !== confirmTrashFile));
      setConfirmTrashFile(null);
    }
  };

  const cancelMoveToTrash = () => {
    setConfirmTrashFile(null);
  };

  const handleMarkAsSpam = async (file: FileItem) => {
    await patchFile(file.id, { isSpam: true });
    setFiles(prev => prev.filter(f => f.id !== file.id));
    setOpenMenuFile(null);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setFetchError(false);
      setFetchErrorMessage('Could not connect to server');
      const token = getAuthToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(apiUrl('/api/files'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          throw new Error('AUTH_ERROR');
        }
        if (!res.ok) {
          throw new Error(`HTTP_${res.status}`);
        }
        const data = await res.json();
        const mapped: FileItem[] = data.map((f: { id: string; name: string; createdAt: string; size: string; isStarred: boolean }) => ({
          id: f.id,
          name: f.name,
          type: f.name.split('.').pop() || 'file',
          date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: formatBytes(parseInt(f.size)),
          isStarred: f.isStarred,
        }));
        setFiles(mapped);
      } catch (e) {
        console.error('Failed to load files from server', e);
        if (e instanceof Error && e.message === 'AUTH_ERROR') {
          setFetchErrorMessage('Session expired. Please log in again');
        } else if (e instanceof Error && e.message.startsWith('HTTP_')) {
          setFetchErrorMessage('Server returned an unexpected response');
        } else {
          setFetchErrorMessage('Could not connect to server');
        }
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [retryCount]);

  // Re-fetch from DB whenever a new upload completes
  useEffect(() => {
    if (uploadCount > 0) {
      setRetryCount(c => c + 1);
    }
  }, [uploadCount]);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(file => 
        file.name.toLowerCase().includes(query) ||
        file.type.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (fileTypeFilter !== 'all') {
      result = result.filter(file => file.type === fileTypeFilter);
    }
    
    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size-asc':
          return parseSizeToBytes(a.size) - parseSizeToBytes(b.size);
        case 'size-desc':
          return parseSizeToBytes(b.size) - parseSizeToBytes(a.size);
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });
    
    return result;
  }, [files, fileTypeFilter, sortBy, searchQuery]);

  // Get unique file types for filter
  const fileTypes = useMemo(() => {
    const types = new Set(files.map(f => f.type));
    return Array.from(types).sort();
  }, [files]);

  return (
    <div className="h-full">
      {/* Top Section with Title and Cards */}
      <div className="flex justify-between items-start mb-4">
        {/* Left Side - Title and Filters */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-normal text-black mb-2">My Storage</h1>
          <p className="text-gray-600 text-sm mb-4">Manage and organize your files</p>
          
          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-black" />
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Types</option>
                {fileTypes.map(type => (
                  <option key={type} value={type}>
                    {type.toUpperCase()} Files
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-black" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="size-asc">Size (Smallest First)</option>
                <option value="size-desc">Size (Largest First)</option>
                <option value="date">Date Modified</option>
              </select>
            </div>
            
            <div className="text-sm text-black">
              {filteredAndSortedFiles.length} {filteredAndSortedFiles.length === 1 ? 'file' : 'files'}
            </div>

            {/* Toggle Switch */}
            <div className="relative ml-12">
              <input
                type="checkbox"
                id="viewToggle"
                className="hidden"
                checked={viewMode === 'grid'}
                onChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              />
              <label
                htmlFor="viewToggle"
                className="h-[44px] w-[88px] bg-white rounded-[22px] flex items-center cursor-pointer relative transition-transform duration-400 hover:[transform:perspective(100px)_rotateX(5deg)_rotateY(-5deg)] shadow-[inset_0_0_5px_4px_rgba(255,255,255,1),inset_0_0_20px_1px_rgba(0,0,0,0.488),10px_20px_30px_rgba(0,0,0,0.096),inset_0_0_0_3px_rgba(0,0,0,0.3)]"
                style={{
                  boxShadow: 'inset 0 0 5px 4px rgba(255, 255, 255, 1), inset 0 0 20px 1px rgba(0, 0, 0, 0.488), 10px 20px 30px rgba(0, 0, 0, 0.096), inset 0 0 0 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div
                  className={`absolute h-[30px] w-[30px] rounded-full shadow-[0_2px_1px_rgba(0,0,0,0.3),10px_10px_10px_rgba(0,0,0,0.3)] transition-all duration-400 ${
                    viewMode === 'grid'
                      ? 'left-[51px] bg-gradient-to-br from-black to-[#414141]'
                      : 'left-[7px] bg-gradient-to-br from-[#757272] via-white to-[#726f6f]'
                  } flex items-center justify-center`}
                  style={{
                    backgroundImage: viewMode === 'grid' 
                      ? 'linear-gradient(315deg, #000000 0%, #414141 70%)'
                      : 'linear-gradient(315deg, #efeeeeff 100%)'
                  }}
                >
                  {viewMode === 'list' ? (
                    <List size={16} className="text-black" />
                  ) : (
                    <LayoutGrid size={16} className="text-white" />
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Cards */}
        <div className="flex-shrink-0 -mt-6 mr-16">
          <div className="relative h-[170px] overflow-visible">
            <CardSwap
              width={180}
              height={115}
              cardDistance={22}
              verticalDistance={26}
              delay={5000}
              pauseOnHover={true}
            >
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center text-white">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 mb-1.5">
                    <Cloud size={20} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold mb-1 text-black">Secure Cloud Storage</h3>
                  <p className="text-black text-center text-[10px] leading-tight">
                    Store all your files securely with automatic backups.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center text-white">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-full p-2 mb-1.5">
                    <Lock size={20} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold mb-1 text-black">End-to-End Encryption</h3>
                  <p className="text-black text-center text-[10px] leading-tight">
                    Your data is protected with military-grade encryption.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center text-white">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 mb-1.5">
                    <Zap size={20} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold mb-1 text-black">Lightning Fast Access</h3>
                  <p className="text-black text-center text-[10px] leading-tight">
                    Access your files instantly from any device.
                  </p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-lg font-medium text-black mb-4">Files</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading files...</p>
            </div>
          </div>
        ) : fetchError ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <File size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium text-red-500 mb-1">{fetchErrorMessage}</p>
              <p className="text-xs text-gray-400 mb-4">Make sure the backend is running on port 5000</p>
              <button
                onClick={() => { setLoading(true); setFiles([]); setRetryCount(c => c + 1); }}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
              >Retry</button>
            </div>
          </div>
        ) : filteredAndSortedFiles.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="text-center">
              <File size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No files yet. Click <strong>New</strong> to upload your first file.</p>
            </div>
          </div>
        ) : (
          viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-base font-medium text-black w-1/2">Name</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Owner</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Last modified</th>
                  <th className="py-4 px-6 text-base font-medium text-black">File size</th>
                  <th className="py-4 px-6 text-base font-medium text-black"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFiles.map((file) => (
                  <tr 
                    key={file.id}
                    className="group"
                    onClick={() => setSelectedFile(file)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {getFileIcon(file.name)}
                        <span className="text-base text-black font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-base font-normal text-black">me</td>
                    <td className="py-4 px-6 text-base font-normal text-black">{file.date}</td>
                    <td className="py-4 px-6 text-base font-normal text-black">{file.size}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          className={`p-2 hover:bg-gray-200 rounded-full transition-all ${
                            file.isStarred ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                          }`}
                          onClick={(e) => toggleStar(file, e)}
                          title={file.isStarred ? 'Remove from starred' : 'Add to starred'}
                        >
                          <Star 
                            size={20} 
                            className={file.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-black'} 
                          />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveToTrash(file);
                          }}
                          title="Move to trash"
                        >
                          <Trash2 size={18} className="text-black" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsSpam(file);
                          }}
                          title="Mark as spam"
                        >
                          <AlertOctagon size={18} className="text-red-600" />
                        </button>
                        <div className="relative">
                          <button 
                            className="p-2 hover:bg-gray-200 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuFile(openMenuFile === file.name ? null : file.name);
                            }}
                          >
                            <MoreVertical size={20} className="text-black" />
                          </button>
                          {openMenuFile === file.name && (
                            <div
                              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveToTrash(file);
                                }}
                              >
                                <Trash2 size={16} className="text-black" />
                                <span className="text-black">Move to trash</span>
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsSpam(file);
                                }}
                              >
                                <Trash2 size={16} className="text-red-600" />
                                <span className="text-black">Mark as spam</span>
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(file);
                                }}
                              >
                                <Download size={16} className="text-black" />
                                <span className="text-black">Download</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAndSortedFiles.map((file, index) => {
              // Determine grid columns based on screen size
              const getColumnsCount = () => {
                if (window.innerWidth >= 1280) return 6; // xl
                if (window.innerWidth >= 1024) return 5; // lg
                if (window.innerWidth >= 768) return 4; // md
                if (window.innerWidth >= 640) return 3; // sm
                return 2; // default
              };
              const columnsCount = getColumnsCount();
              const isLeftSide = index % columnsCount < columnsCount / 2;
              
              return (
                <div 
                  key={file.id}
                  className="group relative"
                  onClick={() => setSelectedFile(file)}
                >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-4 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-black truncate mb-1" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-black">{file.size}</p>
                  </div>
                  <div className="absolute top-2 right-2">
                    {file.isStarred && (
                      <div className="absolute -top-1 -left-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    <button 
                      className="p-1.5 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuFile(openMenuFile === file.name ? null : file.name);
                      }}
                    >
                      <MoreVertical size={16} className="text-black" />
                    </button>
                    {openMenuFile === file.name && (
                      <div 
                        className={`absolute ${isLeftSide ? 'left-0' : 'right-0'} mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(file);
                            setOpenMenuFile(null);
                          }}
                        >
                          <Star 
                            size={16} 
                            className={file.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-black'} 
                          />
                          <span className="text-black">
                            {file.isStarred ? 'Remove from starred' : 'Add to starred'}
                          </span>
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveToTrash(file);
                          }}
                        >
                          <Trash2 size={16} className="text-black" />
                          <span className="text-black">Move to trash</span>
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(file);
                          }}
                        >
                          <Download size={16} className="text-black" />
                          <span className="text-black">Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );})}
          </div>
          )
        )}
      </div>
      {selectedFile && (
        <FilePreviewModal 
          file={selectedFile} 
          onDownload={downloadFile}
          onClose={() => setSelectedFile(null)} 
        />
      )}

      {/* Confirmation Modal — confirm trashing a starred file */}
      {confirmTrashFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={cancelMoveToTrash}>
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star size={24} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-2">This file is starred</h3>
                <p className="text-black">Do you want to move it to trash?</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelMoveToTrash}
                className="px-6 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmMoveToTrash}
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
