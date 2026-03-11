import React, { useState, useEffect, useMemo } from 'react';
import { Monitor, Smartphone, Laptop, MoreVertical, LayoutGrid, List, Filter, ArrowUpDown, Wifi, WifiOff, Server, Cloud } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';

interface ComputerItem {
  name: string;
  type: 'desktop' | 'laptop' | 'mobile' | 'tablet';
  lastConnected: string;
  status: 'online' | 'offline';
  osVersion: string;
  storageUsed: string;
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'desktop':
      return <Monitor size={24} className="text-blue-600" />;
    case 'laptop':
      return <Laptop size={24} className="text-purple-600" />;
    case 'mobile':
      return <Smartphone size={24} className="text-green-600" />;
    case 'tablet':
      return <Smartphone size={24} className="text-orange-600" />;
    default:
      return <Monitor size={24} className="text-black" />;
  }
};

const getRandomLastConnected = (): string => {
  const times = ['Just now', '5 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago', 'Today', 'Yesterday', '2 days ago', '1 week ago'];
  return times[Math.floor(Math.random() * times.length)];
};

const getRandomOsVersion = (type: string): string => {
  const osVersions: { [key: string]: string[] } = {
    desktop: ['Windows 11 Pro', 'Windows 10 Pro', 'macOS Ventura', 'Ubuntu 22.04'],
    laptop: ['Windows 11', 'macOS Monterey', 'Windows 10', 'Ubuntu 23.04'],
    mobile: ['iOS 17', 'Android 14', 'iOS 16', 'Android 13'],
    tablet: ['iPadOS 17', 'Android 14', 'iPadOS 16', 'Android 13'],
  };
  const versions = osVersions[type] || ['Unknown'];
  return versions[Math.floor(Math.random() * versions.length)];
};

const getStorageUsed = (): string => {
  const storage = ['45 GB / 256 GB', '120 GB / 512 GB', '78 GB / 256 GB', '234 GB / 1 TB', '89 GB / 512 GB', '156 GB / 256 GB'];
  return storage[Math.floor(Math.random() * storage.length)];
};

interface ComputersProps {
  searchQuery?: string;
}

export const Computers: React.FC<ComputersProps> = ({ searchQuery = '' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [computers, setComputers] = useState<ComputerItem[]>([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'connected' | 'storage'>('name');
  const [openMenuDevice, setOpenMenuDevice] = useState<string | null>(null);

  useEffect(() => {
    const deviceList: ComputerItem[] = [
      { name: 'MacBook Pro 14"', type: 'laptop', lastConnected: 'Just now', status: 'online', osVersion: 'macOS Ventura', storageUsed: '234 GB / 512 GB' },
      { name: 'Windows Desktop', type: 'desktop', lastConnected: 'Just now', status: 'online', osVersion: 'Windows 11 Pro', storageUsed: '156 GB / 1 TB' },
      { name: 'iPhone 15 Pro', type: 'mobile', lastConnected: '5 minutes ago', status: 'online', osVersion: 'iOS 17', storageUsed: '78 GB / 256 GB' },
      { name: 'iPad Air', type: 'tablet', lastConnected: '30 minutes ago', status: 'offline', osVersion: 'iPadOS 17', storageUsed: '45 GB / 128 GB' },
      { name: 'HP Laptop', type: 'laptop', lastConnected: '1 hour ago', status: 'online', osVersion: 'Windows 11', storageUsed: '120 GB / 512 GB' },
      { name: 'Samsung Galaxy S24', type: 'mobile', lastConnected: '2 hours ago', status: 'offline', osVersion: 'Android 14', storageUsed: '89 GB / 256 GB' },
      { name: 'Work Desktop', type: 'desktop', lastConnected: 'Today', status: 'offline', osVersion: 'Windows 10 Pro', storageUsed: '234 GB / 512 GB' },
      { name: 'Ubuntu Server', type: 'desktop', lastConnected: 'Yesterday', status: 'online', osVersion: 'Ubuntu 22.04', storageUsed: '156 GB / 500 GB' },
    ];
    setComputers(deviceList);
  }, []);

  const filteredAndSortedDevices = useMemo(() => {
    let result = computers;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(device => 
        device.name.toLowerCase().includes(query) ||
        device.osVersion.toLowerCase().includes(query) ||
        device.status.toLowerCase().includes(query)
      );
    }
    
    if (deviceTypeFilter !== 'all') {
      result = result.filter(device => device.type === deviceTypeFilter);
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'connected':
          const connectionOrder = ['Just now', '5 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago', 'Today', 'Yesterday', '2 days ago', '1 week ago'];
          return connectionOrder.indexOf(a.lastConnected) - connectionOrder.indexOf(b.lastConnected);
        case 'storage':
          const getStorageBytes = (storage: string) => {
            const match = storage.match(/(\d+)\s*GB/);
            return match ? parseInt(match[1]) : 0;
          };
          return getStorageBytes(b.storageUsed) - getStorageBytes(a.storageUsed);
        default:
          return 0;
      }
    });
    
    return result;
  }, [computers, deviceTypeFilter, sortBy, searchQuery]);

  const deviceTypes = useMemo(() => {
    const types = new Set(computers.map(c => c.type));
    return Array.from(types).sort();
  }, [computers]);

  return (
    <div className="h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-normal text-black mb-2">Computers</h1>
          <p className="text-gray-600 text-sm mb-4">Your connected devices</p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-black" />
              <select value={deviceTypeFilter} onChange={(e) => setDeviceTypeFilter(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="all">All Devices</option>
                <option value="desktop">Desktops</option>
                <option value="laptop">Laptops</option>
                <option value="mobile">Mobile Phones</option>
                <option value="tablet">Tablets</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-black" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="name">Device Name</option>
                <option value="connected">Last Connected</option>
                <option value="storage">Storage Used</option>
              </select>
            </div>
            
            <div className="text-sm text-black">{filteredAndSortedDevices.length} {filteredAndSortedDevices.length === 1 ? 'device' : 'devices'}</div>

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
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 mb-1.5"><Server size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Sync Everywhere</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Access your files across all devices.</p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-full p-2 mb-1.5"><Wifi size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Always Connected</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Real-time sync across devices.</p>
                </div>
              </Card>
              <Card>
                <div className="w-full h-full p-3 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 mb-1.5"><Cloud size={20} className="text-white" /></div>
                  <h3 className="text-xs font-bold mb-1 text-black">Cloud Sync</h3>
                  <p className="text-black text-center text-[10px] leading-tight">Manage devices from cloud.</p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>

      {/* Devices Section */}
      <div>
        {filteredAndSortedDevices.length === 0 ? (
          <div className="text-center py-16">
            <Laptop size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No devices found</p>
            <p className="text-gray-500 text-sm mt-2">Your connected devices will appear here</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-base font-medium text-black w-1/2">Device</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Last Connected</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Storage</th>
                  <th className="py-4 px-6 text-base font-medium text-black">Status</th>
                  <th className="py-4 px-6 text-base font-medium text-black"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedDevices.map((device) => (
                  <tr 
                    key={device.name} 
                    className="hover:bg-gray-50 border-b border-gray-100 last:border-none group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <p className="text-base font-normal text-black truncate">{device.name}</p>
                          <p className="text-sm text-gray-600">{device.osVersion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-base font-normal text-black">{device.lastConnected}</td>
                    <td className="py-4 px-6 text-base font-normal text-black">{device.storageUsed}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {device.status === 'online' ? (
                          <>
                            <Wifi size={16} className="text-green-600" />
                            <span className="text-base font-normal text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <WifiOff size={16} className="text-gray-400" />
                            <span className="text-base font-normal text-gray-600">Offline</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(openMenuDevice === device.name ? null : device.name); }} 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            title="More options"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuDevice === device.name && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                              <button onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm flex items-center gap-2 border-b border-gray-100">View Details</button>
                              <button onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm flex items-center gap-2 border-b border-gray-100">Rename</button>
                              <button onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm flex items-center gap-2">Remove Device</button>
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
            {filteredAndSortedDevices.map((device) => (
              <div 
                key={device.name} 
                className="group bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer transition-all p-4 relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-4 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-black truncate mb-1" title={device.name}>
                      {device.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">{device.osVersion}</p>
                    <p className="text-xs text-gray-600 mb-1">{device.storageUsed}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {device.status === 'online' ? (
                        <>
                          <Wifi size={12} className="text-green-600" />
                          <p className="text-xs text-green-600">Online</p>
                        </>
                      ) : (
                        <>
                          <WifiOff size={12} className="text-gray-400" />
                          <p className="text-xs text-gray-600">Offline</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="relative">
                      <button 
                        className="p-1.5 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuDevice(openMenuDevice === device.name ? null : device.name);
                        }}
                      >
                        <MoreVertical size={16} className="text-black" />
                      </button>
                      {openMenuDevice === device.name && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                          <button onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm flex items-center gap-2 border-b border-gray-100">View Details</button>
                          <button onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black text-sm flex items-center gap-2 border-b border-gray-100">Rename</button>
                          <button onClick={(e) => { e.stopPropagation(); setOpenMenuDevice(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm flex items-center gap-2">Remove Device</button>
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
    </div>
  );
};

export default Computers;
