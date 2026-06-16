import { useState } from 'react';
import { X, Star, Trash2, Layers, Palette, Wand2, Clock } from 'lucide-react';
import { useFavorites } from '../../hooks/useStorage';

export default function FavoritesManager({ isOpen, onClose }) {
  const { favorites, removeFavorite } = useFavorites();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredItems = filter === 'all' 
    ? favorites 
    : favorites.filter(f => f.type === filter);

  const getIcon = (type) => {
    switch(type) {
      case 'theme': return <Palette className="w-4 h-4" />;
      case 'component': return <Layers className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'theme': return 'text-primary-400 bg-primary-500/10 border-primary-500/20';
      case 'component': return 'text-secondary-400 bg-secondary-500/10 border-secondary-500/20';
      default: return 'text-warm-400 bg-warm-500/10 border-warm-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div className="panel-3d max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm-500 to-warm-400 flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Favorites</h2>
              <p className="text-xs text-slate-400">{favorites.length} items saved</p>
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
            onClick={() => setFilter('theme')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'theme' 
                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Themes
          </button>
          <button
            onClick={() => setFilter('component')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === 'component' 
                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Components
          </button>
        </div>

        {/* Items */}
        <div className="overflow-y-auto p-4 max-h-[50vh] space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400">No favorites yet</p>
              <p className="text-xs text-slate-500">Star items you love to save them here</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/5 hover:border-white/10 group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0`}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white truncate">{item.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeFavorite(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}