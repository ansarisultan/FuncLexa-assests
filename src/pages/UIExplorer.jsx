import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

// Generate 100+ dummy UI cards with varied styles
const generateUICards = (count) => {
  const categories = ['Button', 'Card', 'Form', 'Modal', 'Navigation', 'Badge', 'Alert', 'Avatar', 'Progress', 'Slider'];
  const colors = ['#6366F1', '#3B82F6', '#06B6D4', '#F59E0B', '#F43F5E', '#8B5CF6', '#10B981', '#EC4899'];
  const cards = [];
  for (let i = 0; i < count; i++) {
    const cat = categories[i % categories.length];
    const bg = colors[i % colors.length];
    const textColor = i % 2 === 0 ? 'white' : 'black';
    cards.push({
      id: i,
      name: `${cat} ${Math.floor(i / categories.length) + 1}`,
      category: cat,
      description: `A ${cat.toLowerCase()} UI component with ${bg} accent.`,
      bgColor: bg,
      textColor: textColor,
      gradient: i % 3 === 0 ? `linear-gradient(135deg, ${bg}, ${colors[(i+3) % colors.length]})` : undefined,
    });
  }
  return cards;
};

const allCards = generateUICards(120);

export default function UIExplorer() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(allCards.map(c => c.category))];

  const filtered = allCards.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">UI Explorer</h1>
          <p className="text-slate-400 mt-1">Browse 100+ UI components with live previews and color palettes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-400 w-full md:w-56"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(card => (
          <div key={card.id} className="glass-panel p-4 hover:shadow-glow transition-all duration-300 group">
            <div 
              className="h-40 rounded-xl flex items-center justify-center text-white font-bold text-lg relative overflow-hidden"
              style={{ 
                background: card.gradient || card.bgColor,
                color: card.textColor,
              }}
            >
              <span className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">{card.name}</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 flex items-center justify-center">
                <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Preview</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-white">{card.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: card.bgColor }} />
                <span className="text-xs text-slate-500">{card.category}</span>
                <span className="text-xs text-slate-500 ml-auto">#{card.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-slate-400 py-12">No components found.</div>
      )}
    </div>
  );
}
