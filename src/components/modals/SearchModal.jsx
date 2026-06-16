import { useState, useEffect } from 'react';
import { Search, Layers, Palette, Wand2, Clock, Star, HardDrive, ArrowRight } from 'lucide-react';
import { useFavorites, useRecent, useStorage } from '../../hooks/useStorage';
import { useNavigate } from 'react-router-dom';
import { useWorkbench } from '../../context/WorkbenchContext';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { favorites } = useFavorites();
  const { recent } = useRecent();
  const { items: storageItems } = useStorage();
  const { dispatch: workbenchDispatch } = useWorkbench();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        const item = results[selectedIndex];
        if (item.action) item.action();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, selectedIndex]);

  if (!isOpen) return null;

  const results = [
    // Navigation
    { 
      id: 'nav-assets', 
      label: 'Go to Assets', 
      icon: Layers, 
      category: 'Navigation',
      action: () => navigate('/'),
      shortcut: '⌘1'
    },
    { 
      id: 'nav-library', 
      label: 'Go to Library', 
      icon: Palette, 
      category: 'Navigation',
      action: () => navigate('/library'),
      shortcut: '⌘2'
    },
    { 
      id: 'nav-studio', 
      label: 'Go to Studio', 
      icon: Wand2, 
      category: 'Navigation',
      action: () => navigate('/studio'),
      shortcut: '⌘3'
    },
    // Quick Actions
    { 
      id: 'new-component', 
      label: 'Create New Component', 
      icon: Layers, 
      category: 'Actions',
      action: () => { navigate('/studio'); },
      shortcut: '⌘N'
    },
    { 
      id: 'generate-theme', 
      label: 'Generate New Theme', 
      icon: Palette, 
      category: 'Actions',
      action: () => { navigate('/library'); },
    },
    // Recent items
    ...recent.slice(0, 3).map(r => ({
      id: `recent-${r.id}`,
      label: r.fileName,
      subtitle: `${r.from} → ${r.to} • ${r.size} KB`,
      icon: Clock,
      category: 'Recent',
      action: () => {
        const mockFile = {
          name: r.fileName,
          size: parseFloat(r.size) * 1024 || 2048,
          type: r.to === 'svg' ? 'image/svg+xml' : 'image/webp',
          format: r.to,
          isMock: true
        };
        workbenchDispatch({ type: 'SET_MEDIA_FILE', payload: mockFile });
        workbenchDispatch({ type: 'SET_ACTIVE_TOOL', payload: r.to === 'svg' ? 'svg' : 'converter' });
        navigate('/');
      },
    })),
    // Favorites
    ...favorites.slice(0, 3).map(f => ({
      id: `fav-${f.id}`,
      label: f.name,
      subtitle: f.type,
      icon: Star,
      category: 'Favorites',
      action: () => {
        navigate('/library');
      },
    })),
    // Storage
    ...storageItems.slice(0, 3).map(s => ({
      id: `storage-${s.id}`,
      label: s.name,
      subtitle: `${s.size} • ${s.type}`,
      icon: HardDrive,
      category: 'Storage',
      action: () => {
        const format = s.format || 'webp';
        const mockFile = {
          name: s.name,
          size: parseFloat(s.size) * 1024 || 2048,
          type: format === 'svg' ? 'image/svg+xml' : 'image/webp',
          format: format,
          isMock: true
        };
        workbenchDispatch({ type: 'SET_MEDIA_FILE', payload: mockFile });
        workbenchDispatch({ type: 'SET_ACTIVE_TOOL', payload: format === 'svg' ? 'svg' : 'converter' });
        navigate('/');
      },
    })),
  ].filter(item => 
    query === '' || 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div className="panel-3d max-w-2xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search everything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-slate-500"
            autoFocus
          />
          <kbd className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            ⌘K
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No results found</p>
              <p className="text-xs text-slate-500">Try searching for something else</p>
            </div>
          ) : (
            <>
              {['Navigation', 'Actions', 'Recent', 'Favorites', 'Storage'].map(category => {
                const items = results.filter(r => r.category === category);
                if (items.length === 0) return null;
                
                return (
                  <div key={category}>
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((item, idx) => {
                      const globalIdx = results.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { item.action(); onClose(); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                            selectedIndex === globalIdx 
                              ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/20' 
                              : 'hover:bg-white/5'
                          }`}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                        >
                          <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{item.label}</div>
                            {item.subtitle && (
                              <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                            )}
                          </div>
                          {item.shortcut && (
                            <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {item.shortcut}
                            </span>
                          )}
                          <ArrowRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}