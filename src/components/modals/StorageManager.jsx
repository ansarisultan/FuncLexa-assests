import { useState } from 'react';
import { X, HardDrive, Trash2, Download, File, Image, Code, Clock } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

export default function StorageManager({ isOpen, onClose }) {
  const { items, removeItem, clearStorage, getTotalSize } = useStorage();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  const totalSize = getTotalSize();
  const formatSize = (size) => {
    if (size > 1024) return `${(size / 1024).toFixed(1)} MB`;
    return `${size.toFixed(1)} KB`;
  };

  const getIcon = (type) => {
    switch(type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div className="panel-3d max-w-3xl w-full max-h-[80vh] overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Storage Manager</h2>
              <p className="text-xs text-slate-400">
                {items.length} items • {formatSize(totalSize)} used
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('image')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'image' 
                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilter('code')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'code' 
                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Code
          </button>
          {items.length > 0 && (
            <button
              onClick={clearStorage}
              className="ml-auto text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>

        {/* Items */}
        <div className="overflow-y-auto p-4 max-h-[50vh] space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <HardDrive className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400">No items in storage</p>
              <p className="text-xs text-slate-500">Your saved files will appear here</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/5 hover:border-white/10 group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                      <span>{item.size}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1.5 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}