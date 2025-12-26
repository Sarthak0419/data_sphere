import React from 'react';
import { Folder, FileText, Image, MoreVertical } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-normal text-gray-800">My Drive</h1>
        <div className="flex items-center gap-2">
           {/* View toggle buttons could go here */}
        </div>
      </div>

      {/* Folders Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Folders</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folders.map((folder) => (
            <div key={folder.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <Folder size={24} className="text-gray-700 fill-gray-700" />
              <span className="text-base font-medium text-gray-800 truncate">{folder.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Files</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-base font-medium text-gray-700 w-1/2">Name</th>
                <th className="py-4 px-6 text-base font-medium text-gray-700">Owner</th>
                <th className="py-4 px-6 text-base font-medium text-gray-700">Last modified</th>
                <th className="py-4 px-6 text-base font-medium text-gray-700">File size</th>
                <th className="py-4 px-6 text-base font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.name} className="hover:bg-gray-50 border-b border-gray-100 last:border-none group">
                  <td className="py-4 px-6 flex items-center gap-4">
                    <FileText size={24} className="text-gray-600 stroke-[2.5px]" />
                    <span className="text-base text-gray-800 font-medium">{file.name}</span>
                  </td>
                  <td className="py-4 px-6 text-base font-normal text-gray-700">{file.owner}</td>
                  <td className="py-4 px-6 text-base font-normal text-gray-700">{file.date}</td>
                  <td className="py-4 px-6 text-base font-normal text-gray-700">{file.size}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={20} className="text-gray-700" />
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
