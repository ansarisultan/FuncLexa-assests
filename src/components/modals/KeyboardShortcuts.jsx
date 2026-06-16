import { X, Command, Search, Layers, Palette, Wand2, Plus, Download, Sparkles } from 'lucide-react';

export default function KeyboardShortcuts({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Open search', icon: Search },
    { keys: ['⌘', '?'], description: 'Keyboard shortcuts', icon: Command },
    { keys: ['⌘', '1'], description: 'Go to Assets', icon: Layers },
    { keys: ['⌘', '2'], description: 'Go to Library', icon: Palette },
    { keys: ['⌘', '3'], description: 'Go to Studio', icon: Wand2 },
    { keys: ['⌘', 'N'], description: 'New Component', icon: Plus },
    { keys: ['⌘', 'T'], description: 'Generate Theme', icon: Sparkles },
    { keys: ['⌘', 'E'], description: 'Export Assets', icon: Download },
    { keys: ['esc'], description: 'Close modal / Cancel', icon: X },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div className="panel-3d max-w-lg w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-slate-400">Boost your productivity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition">
                  <shortcut.icon className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm text-slate-300">{shortcut.description}</span>
              </div>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd key={i} className="text-xs font-mono text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 shadow-sm">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Pro tip: ⌘K to search from anywhere</span>
          <span className="text-[10px]">v2.0</span>
        </div>
      </div>
    </div>
  );
}