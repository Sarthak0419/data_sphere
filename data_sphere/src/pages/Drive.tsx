import React, { useState, useEffect, useMemo } from 'react';
import { Folder, FileText, Image as ImageIcon, File, MoreVertical, LayoutGrid, List, X, Download, Share2, Filter, ArrowUpDown } from 'lucide-react';

interface FileItem {
  name: string;
  type: string;
  date: string;
  size: string;
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

export const Drive: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'size-asc' | 'size-desc' | 'date'>('name');

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-normal text-black">My Storage</h1>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-600 hover:text-black'
            }`}
            title="List view"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-600 hover:text-black'
            }`}
            title="Grid view"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
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
        
        <div className="ml-auto text-sm text-black">
          {filteredAndSortedFiles.length} {filteredAndSortedFiles.length === 1 ? 'file' : 'files'}
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
                      <button 
                        className="p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical size={20} className="text-black" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAndSortedFiles.map((file) => (
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
                  <button 
                    className="absolute top-2 right-2 p-1.5 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical size={16} className="text-black" />
                  </button>
                </div>
              </div>
            ))}
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
