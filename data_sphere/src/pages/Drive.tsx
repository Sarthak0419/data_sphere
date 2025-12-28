import React, { useState, useEffect, useMemo } from 'react';
import { Folder, FileText, Image as ImageIcon, File, MoreVertical, LayoutGrid, List, X, Download, Share2, Filter, ArrowUpDown, Star, Cloud, Lock, Zap } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';

interface FileItem {
  name: string;
  type: string;
  date: string;
  size: string;
  starred?: boolean;
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

const getFileSize = (filename: string): string => {
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

const FilePreviewModal: React.FC<{ file: FileItem; onClose: () => void }> = ({ file, onClose }) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');
  const isPDF = ext === 'pdf';
  const isExcel = ['xlsx', 'xls'].includes(ext || '');
  const isText = ext === 'txt';

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-900">
          <img 
            src={`/src/temp_dataset/${file.name}`}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = 
                '<div class="text-white text-center"><p class="text-lg mb-2">Image Preview</p><p class="text-gray-400">' + file.name + '</p></div>';
            }}
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
            <div className="flex items-center justify-center mb-6">
              <File size={64} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-4">PDF Document</h3>
            <p className="text-black text-center mb-6">{file.name}</p>
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="space-y-3 text-black">
                <p className="flex items-center justify-between">
                  <span className="font-medium">File size:</span>
                  <span>{file.size}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="font-medium">Last modified:</span>
                  <span>{file.date}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="font-medium">Type:</span>
                  <span>PDF Document</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-black text-center mt-6">
              PDF preview available in full implementation
            </p>
          </div>
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
      const sampleText = `This is a sample text file: ${file.name}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Key Points:
• First important note
• Second important note  
• Third important note

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

      return (
        <div className="flex flex-col h-full bg-white">
          <div className="flex-1 overflow-auto p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
              <p className="text-black">Text Document</p>
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <pre className="font-mono text-sm text-black whitespace-pre-wrap">{sampleText}</pre>
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
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Download">
              <Download size={20} className="text-black" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Share">
              <Share2 size={20} className="text-black" />
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
  starredFiles: Set<string>;
  onToggleStar: (fileName: string) => void;
}

export const Drive: React.FC<DriveProps> = ({ starredFiles, onToggleStar }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'size-asc' | 'size-desc' | 'date'>('name');
  const [openMenuFile, setOpenMenuFile] = useState<string | null>(null);

  const toggleStar = (fileName: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onToggleStar(fileName);
  };

  useEffect(() => {
    // Load files from temp_dataset
    const tempFiles: FileItem[] = [
      'Notes_1.txt', 'Notes_2.txt', 'Notes_3.txt', 'Notes_4.txt', 'Notes_5.txt',
      'Document_1.docx', 'Document_2.docx', 'Document_3.docx', 'Document_4.docx', 'Document_5.docx',
      'Report_1.pdf', 'Report_2.pdf', 'Report_3.pdf', 'Report_4.pdf', 'Report_5.pdf',
      'Image_1.png', 'Image_2.png', 'Image_3.png', 'Image_4.png', 'Image_5.png',
      'Image_1.jpg', 'Image_2.jpg', 'Image_3.jpg', 'Image_4.jpg', 'Image_5.jpg',
      'Sheet_1.xlsx', 'Sheet_2.xlsx', 'Sheet_3.xlsx', 'Sheet_4.xlsx', 'Sheet_5.xlsx',
      'Slides_1.pptx', 'Slides_2.pptx', 'Slides_3.pptx', 'Slides_4.pptx', 'Slides_5.pptx',
    ].map(name => ({
      name,
      type: name.split('.').pop() || 'file',
      date: `Dec ${Math.floor(Math.random() * 27) + 1}, 2025`,
      size: getFileSize(name),
    }));
    
    setFiles(tempFiles);
  }, []);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];
    
    // Apply filter
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
  }, [files, fileTypeFilter, sortBy]);

  // Get unique file types for filter
  const fileTypes = useMemo(() => {
    const types = new Set(files.map(f => f.type));
    return Array.from(types).sort();
  }, [files]);

  return (
    <div className="h-full">
      {/* Top Section with Title and Cards */}
      <div className="flex justify-between items-start mb-8">
        {/* Left Side - Title and Filters */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-normal text-black mb-2">My Storage</h1>
          <p className="text-gray-600 text-sm mb-4">Manage and organize your files</p>
          
          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-4">
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
            <div className="relative ml-8">
              <input
                type="checkbox"
                id="viewToggle"
                className="hidden"
                checked={viewMode === 'grid'}
                onChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              />
              <label
                htmlFor="viewToggle"
                className="h-[60px] w-[120px] bg-white rounded-[30px] flex items-center cursor-pointer relative transition-transform duration-400 hover:[transform:perspective(100px)_rotateX(5deg)_rotateY(-5deg)] shadow-[inset_0_0_5px_4px_rgba(255,255,255,1),inset_0_0_20px_1px_rgba(0,0,0,0.488),10px_20px_30px_rgba(0,0,0,0.096),inset_0_0_0_3px_rgba(0,0,0,0.3)]"
                style={{
                  boxShadow: 'inset 0 0 5px 4px rgba(255, 255, 255, 1), inset 0 0 20px 1px rgba(0, 0, 0, 0.488), 10px 20px 30px rgba(0, 0, 0, 0.096), inset 0 0 0 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div
                  className={`absolute h-[40px] w-[40px] rounded-full shadow-[0_2px_1px_rgba(0,0,0,0.3),10px_10px_10px_rgba(0,0,0,0.3)] transition-all duration-400 ${
                    viewMode === 'grid'
                      ? 'left-[70px] bg-gradient-to-br from-black to-[#414141]'
                      : 'left-[10px] bg-gradient-to-br from-[#757272] via-white to-[#726f6f]'
                  } flex items-center justify-center`}
                  style={{
                    backgroundImage: viewMode === 'grid' 
                      ? 'linear-gradient(315deg, #000000 0%, #414141 70%)'
                      : 'linear-gradient(315deg, #efeeeeff 100%)'
                  }}
                >
                  {viewMode === 'list' ? (
                    <List size={20} className="text-black" />
                  ) : (
                    <LayoutGrid size={20} className="text-white" />
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Cards */}
        <div className="flex-shrink-0 -mt-2 mr-16">
          <div className="relative h-[200px] overflow-visible">
            <CardSwap
              width={200}
              height={130}
              cardDistance={25}
              verticalDistance={30}
              delay={5000}
              pauseOnHover={true}
            >
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center text-white">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 mb-1.5">
                    <Cloud size={20} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold mb-1">Secure Cloud Storage</h3>
                  <p className="text-gray-300 text-center text-[10px] leading-tight">
                    Store all your files securely with automatic backups.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center text-white">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-full p-2 mb-1.5">
                    <Lock size={20} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold mb-1">End-to-End Encryption</h3>
                  <p className="text-gray-300 text-center text-[10px] leading-tight">
                    Your data is protected with military-grade encryption.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center text-white">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 mb-1.5">
                    <Zap size={20} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold mb-1">Lightning Fast Access</h3>
                  <p className="text-gray-300 text-center text-[10px] leading-tight">
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
        
        {viewMode === 'list' ? (
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
                    key={file.name} 
                    className="hover:bg-gray-50 border-b border-gray-100 last:border-none group cursor-pointer"
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
                            starredFiles.has(file.name) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          onClick={(e) => toggleStar(file.name, e)}
                          title={starredFiles.has(file.name) ? 'Remove from starred' : 'Add to starred'}
                        >
                          <Star 
                            size={20} 
                            className={starredFiles.has(file.name) ? 'text-yellow-500 fill-yellow-500' : 'text-black'} 
                          />
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreVertical size={20} className="text-black" />
                        </button>
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
                    <p className="text-xs text-black">{file.size}</p>
                  </div>
                  <div className="absolute top-2 right-2">
                    {starredFiles.has(file.name) && (
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
                            toggleStar(file.name);
                            setOpenMenuFile(null);
                          }}
                        >
                          <Star 
                            size={16} 
                            className={starredFiles.has(file.name) ? 'text-yellow-500 fill-yellow-500' : 'text-black'} 
                          />
                          <span className="text-black">
                            {starredFiles.has(file.name) ? 'Remove from starred' : 'Add to starred'}
                          </span>
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuFile(null);
                          }}
                        >
                          <Download size={16} className="text-black" />
                          <span className="text-black">Download</span>
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuFile(null);
                          }}
                        >
                          <Share2 size={16} className="text-black" />
                          <span className="text-black">Share</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedFile && (
        <FilePreviewModal 
          file={selectedFile} 
          onClose={() => setSelectedFile(null)} 
        />
      )}
    </div>
  );
};
