import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Image as ImageIcon, File, MoreVertical, LayoutGrid, List, X, Download, Share2, Filter, ArrowUpDown, Star, Folder, Trash2, Clock } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';

interface FileItem {
  name: string;
  type: string;
  date: string;
  size: string;
  accessedTime: string;
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

const getFileSize = (): string => {
  const sizes = ['1.2 KB', '2.4 KB', '5.8 KB', '12.3 KB', '24.5 KB', '156 KB', '1.2 MB', '2.8 MB'];
  return sizes[Math.floor(Math.random() * sizes.length)];
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

const getRandomAccessTime = (): string => {
  const times = ['Just now', '5 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago', 'Today', 'Yesterday', '2 days ago', '3 days ago', 'Last week'];
  return times[Math.floor(Math.random() * times.length)];
};

const FilePreviewModal: React.FC<{ file: FileItem; onClose: () => void }> = ({ file, onClose }) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div 
        className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {getFileIcon(file.name)}
            <div>
              <h2 className="text-lg font-semibold text-black">{file.name}</h2>
              <p className="text-sm text-black">{file.size} • {file.date} • Accessed {file.accessedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Download">
              <Download size={20} className="text-black" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Share">
              <Share2 size={20} className="text-black" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Close">
              <X size={24} className="text-black" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center">
          {isImage ? (
            <img src={`/src/temp_dataset/${file.name}`} alt={file.name} className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
          ) : (
            <div className="text-center"><File size={64} className="text-black mx-auto mb-4" /><p className="text-black text-lg">File Preview</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RecentProps {
  starredFiles: Set<string>;
  onToggleStar: (fileName: string) => void;
  trashedFiles: Set<string>;
  onMoveToTrash: (fileName: string) => void;
  searchQuery?: string;
}

export const Recent: React.FC<RecentProps> = ({ starredFiles, onToggleStar, trashedFiles, onMoveToTrash, searchQuery = '' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'accessed' | 'name' | 'size-asc' | 'size-desc'>('accessed');
  const [openMenuFile, setOpenMenuFile] = useState<string | null>(null);
  const [confirmTrashFile, setConfirmTrashFile] = useState<string | null>(null);

  useEffect(() => {
    const recentFiles: FileItem[] = [
      'Notes_1.txt', 'Notes_2.txt', 'Notes_3.txt', 'Notes_4.txt', 'Notes_5.txt',
      'Document_1.docx', 'Document_2.docx', 'Document_3.docx',
      'Report_1.pdf', 'Report_2.pdf', 'Report_3.pdf',
      'Image_1.png', 'Image_2.png', 'Image_1.jpg', 'Image_2.jpg',
      'Sheet_1.xlsx', 'Sheet_2.xlsx', 'Slides_1.pptx', 'Slides_2.pptx',
    ].map(name => ({
      name,
      type: name.split('.').pop() || 'file',
      date: `Dec ${Math.floor(Math.random() * 27) + 1}, 2025`,
      size: getFileSize(),
      accessedTime: getRandomAccessTime(),
    }));
    setFiles(recentFiles);
  }, []);

  const filteredAndSortedFiles = useMemo(() => {
    let result = files.filter(file => !trashedFiles.has(file.name));
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(file => file.name.toLowerCase().includes(query) || file.type.toLowerCase().includes(query));
    }
    
    if (fileTypeFilter !== 'all') {
      result = result.filter(file => file.type === fileTypeFilter);
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'accessed':
          const accessedOrder = ['Just now', '5 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago', 'Today', 'Yesterday', '2 days ago', '3 days ago', 'Last week'];
          return accessedOrder.indexOf(a.accessedTime) - accessedOrder.indexOf(b.accessedTime);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size-asc':
          return parseSizeToBytes(a.size) - parseSizeToBytes(b.size);
        case 'size-desc':
          return parseSizeToBytes(b.size) - parseSizeToBytes(a.size);
        default:
          return 0;
      }
    });
    
    return result;
  }, [files, fileTypeFilter, sortBy, trashedFiles, searchQuery]);

  const fileTypes = useMemo(() => {
    const types = new Set(files.map(f => f.type));
    return Array.from(types).sort();
  }, [files]);

  const handleMoveToTrash = (fileName: string) => {
    if (starredFiles.has(fileName)) {
      setConfirmTrashFile(fileName);
    } else {
      onMoveToTrash(fileName);
    }
    setOpenMenuFile(null);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-normal text-black mb-2">Recent Files</h1>
          <p className="text-gray-600 text-sm mb-4">Files you've recently accessed</p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-black" />
              <select value={fileTypeFilter} onChange={(e) => setFileTypeFilter(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="all">All Types</option>
                {fileTypes.map(type => (<option key={type} value={type}>{type.toUpperCase()} Files</option>))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-black" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="accessed">Recently Accessed</option>
                <option value="name">Name</option>
                <option value="size-asc">Size (Smallest First)</option>
                <option value="size-desc">Size (Largest First)</option>
              </select>
            </div>
            
            <div className="text-sm text-black">{filteredAndSortedFiles.length} {filteredAndSortedFiles.length === 1 ? 'file' : 'files'}</div>

            <div className="relative ml-12">
              <input type="checkbox" id="viewToggle" className="hidden" checked={viewMode === 'grid'} onChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} />
              <label htmlFor="viewToggle" className="h-[44px] w-[88px] bg-white rounded-[22px] flex items-center cursor-pointer relative transition-transform duration-400 shadow-[inset_0_0_5px_4px_rgba(255,255,255,1),inset_0_0_20px_1px_rgba(0,0,0,0.488),10px_20px_30px_rgba(0,0,0,0.096),inset_0_0_0_3px_rgba(0,0,0,0.3)]">
                <div className={`absolute h-[30px] w-[30px] rounded-full shadow-[0_2px_1px_rgba(0,0,0,0.3),10px_10px_10px_rgba(0,0,0,0.3)] transition-all duration-400 ${viewMode === 'grid' ? 'left-[51px] bg-gradient-to-br from-black to-[#414141]' : 'left-[7px] bg-gradient-to-br from-[#757272] via-white to-[#726f6f]'} flex items-center justify-center`}>
                  {viewMode === 'list' ? <List size={16} className="text-black" /> : <LayoutGrid size={16} className="text-white" />}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 -mt-6 mr-16">
          <div className="relative h-[170px] overflow-visible">
            <CardSwap width={180} height={115} cardDistance={22} verticalDistance={26} delay={5000} pauseOnHover={true}>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 mb-1.5"><Clock size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Quick Access</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Your most recently accessed files are here.</p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-full p-2 mb-1.5"><Star size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Stay Organized</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Track and manage your recent activities.</p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 mb-1.5"><Folder size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Boost Productivity</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Access frequently used files in seconds.</p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>

      {/* Files Section */}
      <div>
        {filteredAndSortedFiles.length === 0 ? (
          <div className="text-center py-16">
            <Folder size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No recent files found</p>
            <p className="text-gray-500 text-sm mt-2">Start accessing files to see them here</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-base font-medium text-black w-1/2">Name</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Accessed</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Date</th>
                  <th className="py-4 px-6 text-base font-medium text-black">File size</th>
                  <th className="py-4 px-6 text-base font-medium text-black"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFiles.map((file) => (
                  <tr 
                    key={file.name} 
                    className="hover:bg-gray-50 border-b border-gray-100 last:border-none group cursor-pointer"
                    onClick={() => setSelectedFile(file)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                          {getFileIcon(file.name)}
                        </div>
                        <p className="text-base font-normal text-black truncate">{file.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-base font-normal text-black">{file.accessedTime}</td>
                    <td className="py-4 px-6 text-base font-normal text-black">{file.date}</td>
                    <td className="py-4 px-6 text-base font-normal text-black">{file.size}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onToggleStar(file.name); }} 
                          className={`p-2 rounded-full transition-colors ${starredFiles.has(file.name) ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 text-gray-600'}`}
                          title={starredFiles.has(file.name) ? 'Remove from starred' : 'Add to starred'}
                        >
                          <Star size={16} fill={starredFiles.has(file.name) ? 'currentColor' : 'none'} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuFile(openMenuFile === file.name ? null : file.name); }} 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            title="More options"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuFile === file.name && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                              <button onClick={(e) => { e.stopPropagation(); onToggleStar(file.name); setOpenMenuFile(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm flex items-center gap-2 border-b border-gray-100"><Star size={16} />{starredFiles.has(file.name) ? 'Remove from starred' : 'Add to starred'}</button>
                              <button onClick={(e) => { e.stopPropagation(); handleMoveToTrash(file.name); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm flex items-center gap-2"><Trash2 size={16} />Delete</button>
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
            {filteredAndSortedFiles.map((file, index) => (
              <div 
                key={file.name} 
                className="group bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer transition-all p-4 relative"
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
                    <p className="text-xs text-gray-600 mb-1">{file.size}</p>
                    <p className="text-xs text-gray-600">{file.accessedTime}</p>
                  </div>
                  <div className="absolute top-2 right-2">
                    {starredFiles.has(file.name) && (
                      <div className="absolute -top-1 -left-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    <div className="relative">
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
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                          <button onClick={(e) => { e.stopPropagation(); onToggleStar(file.name); setOpenMenuFile(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm flex items-center gap-2 border-b border-gray-100"><Star size={16} />{starredFiles.has(file.name) ? 'Remove from starred' : 'Add to starred'}</button>
                          <button onClick={(e) => { e.stopPropagation(); handleMoveToTrash(file.name); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm flex items-center gap-2"><Trash2 size={16} />Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFile && <FilePreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />}

      {confirmTrashFile && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-black mb-2">Delete starred file?</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete <span className="font-medium">{confirmTrashFile}</span>? This file is marked as starred.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmTrashFile(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => { onMoveToTrash(confirmTrashFile); setConfirmTrashFile(null); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recent;