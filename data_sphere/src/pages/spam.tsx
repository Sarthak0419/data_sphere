import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Image as ImageIcon, File, MoreVertical, LayoutGrid, List, X, Download, Share2, Filter, ArrowUpDown, AlertOctagon, RotateCcw, Trash2 } from 'lucide-react';

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

interface SpamProps {
  spamFiles: Set<string>;
  onMarkNotSpam: (fileName: string) => void;
  onDeleteSpam: (fileName: string) => void;
}

export const Spam: React.FC<SpamProps> = ({ spamFiles, onMarkNotSpam, onDeleteSpam }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'size-asc' | 'size-desc' | 'date'>('name');
  const [openMenuFile, setOpenMenuFile] = useState<string | null>(null);

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

  // Filter to only show spam files and apply sorting
  const filteredAndSortedFiles = useMemo(() => {
    let result = files.filter(file => spamFiles.has(file.name));

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
  }, [files, spamFiles, fileTypeFilter, sortBy]);

  // Get unique file types for filter
  const fileTypes = useMemo(() => {
    const spamFilesList = files.filter(f => spamFiles.has(f.name));
    const types = new Set(spamFilesList.map(f => f.type));
    return Array.from(types).sort();
  }, [files, spamFiles]);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-normal text-black mb-2">Spam</h1>
          <p className="text-gray-600 text-sm">Review and manage files marked as spam</p>
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

      {/* Filter and Sort Controls */}
      {filteredAndSortedFiles.length > 0 && (
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
      )}

      {/* Files Section */}
      <div>
        {filteredAndSortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertOctagon size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-black mb-2">No spam files</h2>
            <p className="text-gray-500">Files marked as spam will appear here</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-medium text-black mb-4">Spam Files</h2>

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
                              className="p-2 hover:bg-gray-200 rounded-full transition-all opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkNotSpam(file.name);
                              }}
                              title="Mark as not spam"
                            >
                              <RotateCcw size={20} className="text-black" />
                            </button>
                            <div className="relative">
                              <button
                                className="p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                                      onMarkNotSpam(file.name);
                                      setOpenMenuFile(null);
                                    }}
                                  >
                                    <RotateCcw size={16} className="text-black" />
                                    <span className="text-black">Mark as not spam</span>
                                  </button>
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteSpam(file.name);
                                      setOpenMenuFile(null);
                                    }}
                                  >
                                    <Trash2 size={16} className="text-red-600" />
                                    <span className="text-red-600">Delete</span>
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
                  const getColumnsCount = () => {
                    if (window.innerWidth >= 1280) return 6;
                    if (window.innerWidth >= 1024) return 5;
                    if (window.innerWidth >= 768) return 4;
                    if (window.innerWidth >= 640) return 3;
                    return 2;
                  };
                  const columnsCount = getColumnsCount();
                  const isLeftSide = index % columnsCount < columnsCount / 2;

                  return (
                    <div
                      key={file.name}
                      className="group bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer transition-all p-4 relative"
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
                                  onMarkNotSpam(file.name);
                                  setOpenMenuFile(null);
                                }}
                              >
                                <RotateCcw size={16} className="text-black" />
                                <span className="text-black">Mark as not spam</span>
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSpam(file.name);
                                  setOpenMenuFile(null);
                                }}
                              >
                                <Trash2 size={16} className="text-red-600" />
                                <span className="text-red-600">Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
