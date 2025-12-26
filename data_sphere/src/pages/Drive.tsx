import React from 'react';
import { Folder, FileText, Image, MoreVertical } from 'lucide-react';

const suggestedFiles = [
  { name: 'Project Proposal.docx', type: 'doc', date: 'You opened today' },
  { name: 'Budget 2025.xlsx', type: 'sheet', date: 'You edited yesterday' },
  { name: 'Team Photo.jpg', type: 'image', date: 'You uploaded last week' },
];

const folders = [
  { name: 'Documents', items: 12 },
  { name: 'Images', items: 45 },
  { name: 'Work', items: 8 },
  { name: 'Personal', items: 2 },
];

const files = [
  { name: 'Meeting Notes.txt', owner: 'me', date: 'Dec 20, 2025', size: '2 KB' },
  { name: 'Design Specs.pdf', owner: 'me', date: 'Dec 18, 2025', size: '4.5 MB' },
  { name: 'Logo.png', owner: 'me', date: 'Dec 15, 2025', size: '1.2 MB' },
  { name: 'Q4 Report.pdf', owner: 'me', date: 'Dec 10, 2025', size: '2.1 MB' },
];

export const Drive: React.FC = () => {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-gray-700">My Drive</h1>
        <div className="flex items-center gap-2">
           {/* View toggle buttons could go here */}
        </div>
      </div>

      {/* Suggested Section */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Suggested</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suggestedFiles.map((file) => (
            <div key={file.name} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-2">
                <FileText size={20} className="text-blue-600" />
                <span className="text-xs text-gray-500">{file.type}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{file.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Folders Section */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Folders</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folders.map((folder) => (
            <div key={folder.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <Folder size={20} className="text-gray-600 fill-gray-600" />
              <span className="text-sm font-medium text-gray-700 truncate">{folder.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-sm font-medium text-gray-600 mb-3">Files</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-medium text-gray-600 w-1/2">Name</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600">Owner</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600">Last modified</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600">File size</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.name} className="hover:bg-gray-50 border-b border-gray-100 last:border-none group">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <FileText size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{file.owner}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{file.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{file.size}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
