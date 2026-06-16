import { useState } from 'react';
import { Search, Grid, List, Layout, Layers, Sparkles, Star } from 'lucide-react';
import ComponentCard from '../components/component-library/ComponentCard';
import { useFavorites } from '../hooks/useStorage';

// Design themes with full details
const designThemes = [
  {
    id: 1,
    name: 'Glassmorphism',
    category: 'Morphism',
    type: 'Glass',
    description: 'Frosted glass effect with backdrop blur and transparency',
    preview: 'bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl',
    cssVariables: {
      '--glass-bg': 'rgba(255, 255, 255, 0.05)',
      '--glass-border': 'rgba(255, 255, 255, 0.1)',
      '--glass-blur': '24px',
      '--glass-radius': '16px',
      '--glass-shadow': '0 8px 32px rgba(0,0,0,0.3)',
    },
    tailwindClasses: {
      background: 'bg-white/5',
      border: 'border border-white/10',
      blur: 'backdrop-blur-xl',
      radius: 'rounded-2xl',
      shadow: 'shadow-xl',
    },
    usage: 'Modern, sleek interfaces with depth and transparency',
    bestFor: ['Dashboards', 'Profile Cards', 'Modals', 'Navigation'],
    code: `<div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6">
  <h3>Glass Card</h3>
  <p>Frosted glass effect</p>
</div>`
  },
  {
    id: 2,
    name: 'Neumorphism',
    category: 'Morphism',
    type: 'Soft UI',
    description: 'Soft shadows creating a subtle 3D extruded effect',
    preview: 'bg-[#0F172A] shadow-[8px_8px_16px_#0a0f1e,-8px_-8px_16px_#141f36] p-6 rounded-2xl',
    cssVariables: {
      '--neu-shadow-dark': '8px 8px 16px #0a0f1e',
      '--neu-shadow-light': '-8px -8px 16px #141f36',
      '--neu-bg': '#0F172A',
      '--neu-radius': '16px',
    },
    tailwindClasses: {
      background: 'bg-[#0F172A]',
      shadow: 'shadow-[8px_8px_16px_#0a0f1e,-8px_-8px_16px_#141f36]',
      radius: 'rounded-2xl',
    },
    usage: 'Soft, tactile interfaces with subtle depth',
    bestFor: ['Buttons', 'Cards', 'Toggle Switches', 'Sliders'],
    code: `<div class="bg-[#0F172A] shadow-[8px_8px_16px_#0a0f1e,-8px_-8px_16px_#141f36] rounded-2xl p-6">
  <h3>Neumorphic Card</h3>
  <p>Soft 3D effect</p>
</div>`
  },
  {
    id: 3,
    name: 'Minimalist',
    category: 'Design System',
    type: 'Clean',
    description: 'Pure, functional design with minimal visual noise',
    preview: 'bg-transparent border-b border-white/10 p-6',
    cssVariables: {
      '--minimal-border': 'rgba(255, 255, 255, 0.1)',
      '--minimal-spacing': '1.5rem',
      '--minimal-font': 'Inter, system-ui',
    },
    tailwindClasses: {
      background: 'bg-transparent',
      border: 'border-b border-white/10',
      padding: 'p-6',
      text: 'text-white',
    },
    usage: 'Content-focused interfaces with maximum readability',
    bestFor: ['Blogs', 'Documentation', 'Typographic Layouts', 'Settings'],
    code: `<div class="border-b border-white/10 p-6">
  <h3 class="text-white">Minimal Card</h3>
  <p class="text-slate-400">Clean, functional design</p>
</div>`
  },
  {
    id: 4,
    name: 'Gradient Flow',
    category: 'Design System',
    type: 'Vibrant',
    description: 'Dynamic gradients creating depth and energy',
    preview: 'bg-gradient-to-br from-brand-500/30 via-accent-cyan/20 to-transparent border border-white/10 p-6 rounded-2xl',
    cssVariables: {
      '--gradient-start': 'rgba(94, 106, 210, 0.3)',
      '--gradient-mid': 'rgba(6, 182, 212, 0.2)',
      '--gradient-end': 'transparent',
      '--gradient-angle': '135deg',
    },
    tailwindClasses: {
      background: 'bg-gradient-to-br from-brand-500/30 via-accent-cyan/20 to-transparent',
      border: 'border border-white/10',
      radius: 'rounded-2xl',
    },
    usage: 'Energetic, modern interfaces with visual depth',
    bestFor: ['Landing Pages', 'Hero Sections', 'Featured Content', 'Branding'],
    code: `<div class="bg-gradient-to-br from-brand-500/30 via-accent-cyan/20 to-transparent border border-white/10 rounded-2xl p-6">
  <h3>Gradient Card</h3>
  <p>Dynamic color flow</p>
</div>`
  },
  {
    id: 5,
    name: 'Frosted Panel',
    category: 'Morphism',
    type: 'Glass',
    description: 'Heavy glass effect with strong blur and glow',
    preview: 'bg-slate-900/40 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl shadow-glow',
    cssVariables: {
      '--frost-bg': 'rgba(15, 23, 42, 0.4)',
      '--frost-blur': '40px',
      '--frost-border': 'rgba(255, 255, 255, 0.2)',
      '--frost-glow': '0 0 40px rgba(94, 106, 210, 0.15)',
    },
    tailwindClasses: {
      background: 'bg-slate-900/40',
      blur: 'backdrop-blur-2xl',
      border: 'border border-white/20',
      radius: 'rounded-2xl',
      shadow: 'shadow-glow',
    },
    usage: 'Premium, luxury interfaces with strong visual impact',
    bestFor: ['Premium Features', 'Showcase Cards', 'Hero Sections', 'Brand Elements'],
    code: `<div class="bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-glow p-6">
  <h3>Frosted Panel</h3>
  <p>Heavy glass effect</p>
</div>`
  },
  {
    id: 6,
    name: 'Subtle Shadow',
    category: 'Design System',
    type: 'Depth',
    description: 'Minimal shadow for gentle elevation without distraction',
    preview: 'bg-[#0F172A] shadow-sm p-6 rounded-xl',
    cssVariables: {
      '--shadow-subtle': '0 2px 8px rgba(0,0,0,0.2)',
      '--shadow-radius': '8px',
      '--shadow-bg': '#0F172A',
    },
    tailwindClasses: {
      background: 'bg-[#0F172A]',
      shadow: 'shadow-sm',
      radius: 'rounded-xl',
    },
    usage: 'Clean, professional interfaces with gentle hierarchy',
    bestFor: ['Data Tables', 'List Items', 'Sidebar Sections', 'Tooltips'],
    code: `<div class="bg-[#0F172A] shadow-sm rounded-xl p-6">
  <h3>Subtle Card</h3>
  <p>Gentle elevation</p>
</div>`
  },
  {
    id: 7,
    name: 'Cyber Glow',
    category: 'Design System',
    type: 'Neon',
    description: 'Neon glow effects on dark surfaces for tech-forward interfaces',
    preview: 'bg-[#0F172A] border border-brand-500/30 shadow-glow p-6 rounded-xl',
    cssVariables: {
      '--glow-color': 'rgba(94, 106, 210, 0.3)',
      '--glow-spread': '30px',
      '--glow-border': 'rgba(94, 106, 210, 0.3)',
    },
    tailwindClasses: {
      background: 'bg-[#0F172A]',
      border: 'border border-brand-500/30',
      shadow: 'shadow-glow',
      radius: 'rounded-xl',
    },
    usage: 'Tech, futuristic interfaces with high visual impact',
    bestFor: ['Gaming UI', 'Tech Dashboards', 'Promotional Content', 'Developer Tools'],
    code: `<div class="bg-[#0F172A] border border-brand-500/30 shadow-glow rounded-xl p-6">
  <h3>Cyber Card</h3>
  <p>Neon glow effect</p>
</div>`
  },
  {
    id: 8,
    name: 'Embossed',
    category: 'Morphism',
    type: 'Texture',
    description: 'Raised/embossed effect creating tactile depth',
    preview: 'bg-[#0F172A] shadow-[inset_2px_2px_4px_#0a0f1e,inset_-2px_-2px_4px_#141f36] p-6 rounded-xl',
    cssVariables: {
      '--emboss-inner': 'inset 2px 2px 4px #0a0f1e',
      '--emboss-outer': 'inset -2px -2px 4px #141f36',
      '--emboss-bg': '#0F172A',
    },
    tailwindClasses: {
      background: 'bg-[#0F172A]',
      shadow: 'shadow-[inset_2px_2px_4px_#0a0f1e,inset_-2px_-2px_4px_#141f36]',
      radius: 'rounded-xl',
    },
    usage: 'Tactile, physical interfaces with subtle depth',
    bestFor: ['Buttons', 'Cards', 'Interactive Elements', 'Toggles'],
    code: `<div class="bg-[#0F172A] shadow-[inset_2px_2px_4px_#0a0f1e,inset_-2px_-2px_4px_#141f36] rounded-xl p-6">
  <h3>Embossed Card</h3>
  <p>Tactile depth</p>
</div>`
  }
];

const categories = ['All', ...new Set(designThemes.map(d => d.category))];
const types = ['All', ...new Set(designThemes.map(d => d.type))];

export default function ComponentLibrary() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filtered = designThemes.filter(theme => {
    const matchSearch = theme.name.toLowerCase().includes(search.toLowerCase()) || 
                       theme.description.toLowerCase().includes(search.toLowerCase()) ||
                       theme.type.toLowerCase().includes(search.toLowerCase()) ||
                       theme.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || theme.category === filterCategory;
    const matchType = filterType === 'All' || theme.type === filterType;
    const matchFavorites = showFavorites ? isFavorite(theme.name, 'theme') : true;
    return matchSearch && matchCategory && matchType && matchFavorites;
  });

  // Get favorite count for themes
  const favoriteThemes = favorites.filter(f => f.type === 'theme');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Design System Library
            <span className="text-xs font-normal text-slate-400">{designThemes.length} themes</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {filtered.length} matching • {favoriteThemes.length} favorited
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              showFavorites 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavorites ? 'fill-yellow-400' : ''}`} />
            {showFavorites ? 'Favorites' : 'Show Favorites'}
            {favoriteThemes.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/10 rounded text-[10px]">
                {favoriteThemes.length}
              </span>
            )}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none w-48 sm:w-64"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="flex bg-[#0F172A] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0F172A] border border-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-brand-400">{designThemes.length}</div>
          <div className="text-xs text-slate-400">Total Themes</div>
        </div>
        <div className="bg-[#0F172A] border border-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-cyan">{designThemes.filter(t => t.category === 'Morphism').length}</div>
          <div className="text-xs text-slate-400">Morphism Styles</div>
        </div>
        <div className="bg-[#0F172A] border border-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-cyan">{designThemes.filter(t => t.category === 'Design System').length}</div>
          <div className="text-xs text-slate-400">Design Systems</div>
        </div>
        <div className="bg-[#0F172A] border border-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{favoriteThemes.length}</div>
          <div className="text-xs text-slate-400">Favorites</div>
        </div>
      </div>

      {/* Grid/List */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
        {filtered.map(theme => (
          <ComponentCard 
            key={theme.id} 
            component={theme} 
            isTheme={true}
            isFavorite={isFavorite(theme.name, 'theme')}
            onToggleFavorite={() => toggleFavorite({ 
              name: theme.name, 
              type: 'theme',
              category: theme.category,
              preview: theme.preview,
              description: theme.description
            })}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">
            {showFavorites ? 'No favorite themes yet. Star themes to save them!' : 'No themes found matching your search.'}
          </p>
        </div>
      )}
    </div>
  );
}