import { useRecent } from '../hooks/useStorage';
import { Clock, Trash2, ArrowRightLeft, Shrink, FileText, Sparkles } from 'lucide-react';

export default function Recent() {
  const { recent, clearRecent, removeRecent } = useRecent();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    if (type === 'svg') return <FileText className="w-4 h-4 text-orange-400" />;
    if (type === 'webp') return <Sparkles className="w-4 h-4 text-purple-400" />;
    return <ArrowRightLeft className="w-4 h-4 text-brand-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-cyber flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            FuncSilo Recent Activity
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your recent conversions and operations.
          </p>
        </div>
        {recent.length > 0 && (
          <button
            onClick={clearRecent}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All History
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="panel p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Clock className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
          <h3 className="text-base font-semibold text-white">No history yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Convert formats or compress images inside the Media Desk to start logging your workflow actions.
          </p>
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <div className="divide-y divide-white/5">
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    {getIcon(item.to)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate max-w-[250px] sm:max-w-[400px]">
                      {item.fileName}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                      <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                        {item.from} → {item.to}
                      </span>
                      <span>{item.size} KB</span>
                      {parseFloat(item.reduction) > 0 && (
                        <span className="text-green-400">{item.reduction}% Saved</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{formatTime(item.timestamp)}</span>
                  <button
                    onClick={() => removeRecent(item.id)}
                    className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
