import { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import { HardDrive, Trash2, Download, Upload, File, FileImage, Search } from 'lucide-react';

export default function Storage() {
  const { items, addItem, removeItem, clearStorage, getTotalSize } = useStorage();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      addItem({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        format: file.name.split('.').pop() || 'unknown',
      });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || item.format.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const formatsList = ['All', ...new Set(items.map(item => item.format.toUpperCase()))];

  const getFileIcon = (format) => {
    const f = format.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(f)) {
      return <FileImage className="w-5 h-5 text-brand-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const totalSizeKB = getTotalSize().toFixed(1);
  const percentUsed = Math.min((totalSizeKB / 10240) * 100, 100).toFixed(1); // 10MB limit mockup

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gradient-cyber flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-indigo-400" />
            FuncLexa Storage Drive
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and manage files processed or uploaded to your workspace drive.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 bg-brand-500 text-white font-medium rounded-lg text-xs hover:bg-brand-600 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" /> Upload File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          {items.length > 0 && (
            <button
              onClick={clearStorage}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Drive
            </button>
          )}
        </div>
      </div>

      {/* Storage stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel p-4 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Disk Capacity</span>
            <div className="text-2xl font-bold text-white mt-1">{totalSizeKB} KB <span className="text-xs text-slate-500">/ 10 MB limit</span></div>
          </div>
          <div className="w-full">
            <div className="bg-white/5 h-2 rounded-full overflow-hidden">
              <div style={{ width: `${percentUsed}%` }} className="bg-brand-500 h-full rounded-full transition-all duration-300" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>{percentUsed}% capacity used</span>
              <span>10.0 MB free</span>
            </div>
          </div>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">File Counter</span>
            <div className="text-2xl font-bold text-white mt-1">{items.length}</div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Files added automatically on successful conversions.
          </p>
        </div>

        <div className="panel p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">File Types</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {formatsList.filter(f => f !== 'ALL').slice(0, 4).map(fmt => (
                <span key={fmt} className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                  {fmt} ({items.filter(i => i.format.toUpperCase() === fmt).length})
                </span>
              ))}
              {formatsList.length === 1 && (
                <span className="text-[10px] text-slate-500">No types present</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-brand-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Format:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
          >
            {formatsList.map(fmt => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* File Explorer Grid */}
      {filteredItems.length === 0 ? (
        <div className="panel p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
          <File className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
          <h3 className="text-base font-semibold text-white">No files found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {search || filterType !== 'All' ? 'Try adjusting your search filters.' : 'Upload files or convert formats to populate your drive.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="panel p-4 hover:border-white/20 transition group flex flex-col justify-between h-36">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(item.format)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate max-w-[130px]" title={item.name}>
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 uppercase font-mono mt-0.5 block">
                      {item.format} File
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mt-4">
                <div>
                  <div className="text-xs font-semibold text-white font-mono">{item.size}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
