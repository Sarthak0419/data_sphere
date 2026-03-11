import React, { useState, useMemo } from 'react';
import { FileText, Image as ImageIcon, Video, Music, Archive, HardDrive, AlertCircle, Zap, Check, Cloud } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';

interface StorageItem {
  type: string;
  label: string;
  size: number;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StoragePage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'size' | 'count'>('size');

  const totalStorage = 15 * 1024; // 15 GB in MB
  const usedStorage = 4.2 * 1024; // 4.2 GB in MB

  const storageBreakdown: StorageItem[] = [
    {
      type: 'documents',
      label: 'Documents',
      size: 1024,
      count: 245,
      icon: <FileText size={24} className="text-blue-600" />,
      color: 'bg-blue-500',
    },
    {
      type: 'images',
      label: 'Images',
      size: 1843,
      count: 1823,
      icon: <ImageIcon size={24} className="text-purple-600" />,
      color: 'bg-purple-500',
    },
    {
      type: 'videos',
      label: 'Videos',
      size: 987,
      count: 42,
      icon: <Video size={24} className="text-red-600" />,
      color: 'bg-red-500',
    },
    {
      type: 'audio',
      label: 'Audio',
      size: 256,
      count: 184,
      icon: <Music size={24} className="text-green-600" />,
      color: 'bg-green-500',
    },
    {
      type: 'archives',
      label: 'Archives',
      size: 121,
      count: 32,
      icon: <Archive size={24} className="text-orange-600" />,
      color: 'bg-orange-500',
    },
  ];

  const sortedBreakdown = useMemo(() => {
    return [...storageBreakdown].sort((a, b) =>
      sortBy === 'size' ? b.size - a.size : b.count - a.count
    );
  }, [sortBy]);

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' GB';
    return bytes.toFixed(2) + ' MB';
  };

  const getPercentage = (bytes: number): number => {
    return Math.round((bytes / totalStorage) * 100);
  };

  const remainingStorage = totalStorage - usedStorage;

  return (
    <div className="h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-normal text-black mb-2">Storage</h1>
          <p className="text-gray-600 text-sm mb-4">Manage your cloud storage</p>
        </div>

        <div className="flex-shrink-0 -mt-6 mr-16">
          <div className="relative h-[170px] overflow-visible">
            <CardSwap width={180} height={115} cardDistance={22} verticalDistance={26} delay={5000} pauseOnHover={true}>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 mb-1.5"><HardDrive size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Manage Storage</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Keep track of your usage.</p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-full p-2 mb-1.5"><Zap size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Upgrade Plan</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Get more storage space.</p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 mb-1.5"><Cloud size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Unlimited Access</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Premium features await.</p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>

      {/* Main Storage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Storage Usage Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Storage Usage</h2>
            <HardDrive size={24} className="text-blue-600" />
          </div>

          <div className="mb-4">
            <p className="text-3xl font-bold text-black mb-2">{formatBytes(usedStorage)}</p>
            <p className="text-gray-600 text-sm">of {formatBytes(totalStorage)} used</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${getPercentage(usedStorage)}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            {formatBytes(remainingStorage)} available ({getPercentage(remainingStorage)}%)
          </p>

          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Upgrade Storage
          </button>
        </div>

        {/* Storage Plans Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Upgrade to Pro</h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-black font-medium">2 TB Storage</p>
                <p className="text-sm text-gray-600">132x more space</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-black font-medium">Advanced Security</p>
                <p className="text-sm text-gray-600">Enhanced protection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-black font-medium">Priority Support</p>
                <p className="text-sm text-gray-600">24/7 help available</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-900 font-semibold">$9.99/month</p>
            <p className="text-sm text-blue-700">Cancel anytime</p>
          </div>

          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Pro Now
          </button>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Storage Breakdown</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'size' | 'count')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="size">Size</option>
              <option value="count">Count</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {sortedBreakdown.map((item) => (
            <div key={item.type} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">{item.icon}</div>
                  <div>
                    <p className="text-black font-medium">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.count} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-black font-semibold">{formatBytes(item.size)}</p>
                  <p className="text-sm text-gray-600">{getPercentage(item.size)}%</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-300`}
                  style={{ width: `${getPercentage(item.size)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-black mb-2">Free Up Storage</h2>
            <p className="text-gray-600 text-sm">Follow these tips to manage your storage efficiently</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-black font-medium mb-2">Delete Duplicates</h3>
            <p className="text-sm text-gray-600 mb-3">Find and remove duplicate files to save space</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Find Duplicates →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-black font-medium mb-2">Empty Trash</h3>
            <p className="text-sm text-gray-600 mb-3">Permanently delete files from trash</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Go to Trash →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-black font-medium mb-2">Archive Old Files</h3>
            <p className="text-sm text-gray-600 mb-3">Move rarely used files to archive</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View Archive →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-black font-medium mb-2">Compress Files</h3>
            <p className="text-sm text-gray-600 mb-3">Reduce file size without losing quality</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Learn More →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-black font-medium mb-2">Clear Cache</h3>
            <p className="text-sm text-gray-600 mb-3">Remove temporary files and cache data</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Clear Cache →
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-black font-medium mb-2">Remove Old Versions</h3>
            <p className="text-sm text-gray-600 mb-3">Delete previous versions of files</p>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Manage Versions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoragePage;
