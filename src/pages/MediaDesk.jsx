import { useState } from 'react';
import FormatConverter from '../components/media/FormatConverter';
import ImageCompressor from '../components/media/ImageCompressor';
import SvgPurifier from '../components/media/SvgPurifier';
import { useRecent, useStorage } from '../hooks/useStorage';
import { HardDrive, Clock, Layers, Star, Trash2, Download, Eye } from 'lucide-react';

export default function MediaDesk() {
  const [activeTool, setActiveTool] = useState('converter');
  const { recent, addRecent, clearRecent } = useRecent();
  const { addItem } = useStorage();
  const [showRecentModal, setShowRecentModal] = useState(false);

  const handleComplete = (conv) => {
    addRecent(conv);
    addItem({
      name: conv.fileName,
      size: `${conv.size} KB`,
      type: 'image',
      format: conv.to,
    });
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'converter':
        return <FormatConverter onComplete={handleComplete} />;
      case 'compressor':
        return <ImageCompressor onComplete={handleComplete} />;
      case 'svg':
        return <SvgPurifier />;
      default:
        return null;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Tool switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-[#0F172A] rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setActiveTool('converter')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTool === 'converter'
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Converter
          </button>
          <button
            onClick={() => setActiveTool('compressor')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTool === 'compressor'
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Compressor
          </button>
          <button
            onClick={() => setActiveTool('svg')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTool === 'svg'
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            SVG → React
          </button>
        </div>
        
        {recent.length > 0 && (
          <button
            onClick={() => setShowRecentModal(true)}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            View All Recent
          </button>
        )}
      </div>

      {/* Tool content */}
      <div className="col-span-2">
        {renderTool()}
      </div>

      {/* Bottom row – Recent Conversions & Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Conversions */}
        <div className="panel p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Recent Conversions
            </h3>
            {recent.length > 0 && (
              <button
                onClick={clearRecent}
                className="text-xs text-slate-500 hover:text-red-400 transition"
              >
                Clear All
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No recent conversions yet</p>
              <p className="text-xs text-slate-600">Convert an image to see it here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recent.slice(0, 5).map((conv, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white truncate">{conv.fileName}</span>
                      <span className="text-slate-400 text-xs flex-shrink-0">{conv.from} → {conv.to}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-500">{conv.size} KB</span>
                      <span className="text-xs text-brand-400">{conv.reduction}% saved</span>
                      <span className="text-xs text-slate-500">{formatTime(conv.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tools */}
        <div className="panel p-4 space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3 h-3" />
            Quick Tools
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTool('compressor')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 group"
            >
              <HardDrive className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition" />
              <div>
                <div className="text-sm text-white">Image Compressor</div>
                <div className="text-xs text-slate-400">Reduce image size</div>
              </div>
            </button>
            <button 
              onClick={() => setActiveTool('svg')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 group"
            >
              <Clock className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition" />
              <div>
                <div className="text-sm text-white">SVG to React</div>
                <div className="text-xs text-slate-400">Convert SVG to React component</div>
              </div>
            </button>
            <button 
              onClick={() => setActiveTool('converter')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 group"
            >
              <Layers className="w-4 h-4 text-slate-400 group-hover:text-brand-400 transition" />
              <div>
                <div className="text-sm text-white">Image Resizer</div>
                <div className="text-xs text-slate-400">Resize to custom dimensions</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Modal */}
      {showRecentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowRecentModal(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0F172A] border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-bold text-white">Recent Conversions</h2>
                <span className="text-xs text-slate-400">{recent.length} items</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearRecent}
                  className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
                <button onClick={() => setShowRecentModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-4 max-h-[60vh]">
              {recent.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No recent conversions</div>
              ) : (
                <div className="space-y-2">
                  {recent.map((conv, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#0F172A]/50 border border-white/5 rounded-lg hover:border-white/10 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{conv.fileName}</span>
                          <span className="text-xs text-slate-400">{conv.from} → {conv.to}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs">
                          <span className="text-slate-500">{conv.size} KB</span>
                          <span className="text-brand-400">{conv.reduction}% saved</span>
                          <span className="text-slate-500">{formatTime(conv.timestamp)}</span>
                        </div>
                      </div>
                      <button className="p-1.5 rounded hover:bg-white/5 transition text-slate-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}