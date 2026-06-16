import { useState } from 'react';
import { Search, Grid, List, Layout, Layers, Sparkles, Star, Filter, X } from 'lucide-react';
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
    image: '/glass.jpg',
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
    image: '/neuo.png',
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
    image: '/minimal.png',
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
    preview: 'bg-gradient-to-br from-primary-500/30 via-secondary-500/20 to-transparent border border-white/10 p-6 rounded-2xl',
    image: '/gradientflow.png',
    cssVariables: {
      '--gradient-start': 'rgba(99, 102, 241, 0.3)',
      '--gradient-mid': 'rgba(6, 182, 212, 0.2)',
      '--gradient-end': 'transparent',
      '--gradient-angle': '135deg',
    },
    tailwindClasses: {
      background: 'bg-gradient-to-br from-primary-500/30 via-secondary-500/20 to-transparent',
      border: 'border border-white/10',
      radius: 'rounded-2xl',
    },
    usage: 'Energetic, modern interfaces with visual depth',
    bestFor: ['Landing Pages', 'Hero Sections', 'Featured Content', 'Branding'],
    code: `<div class="bg-gradient-to-br from-primary-500/30 via-secondary-500/20 to-transparent border border-white/10 rounded-2xl p-6">
  <h3>Gradient Card</h3>
  <p>Dynamic color flow</p>
</div>`
  },
  {
    id: 5,
    name: 'Cyberpunk Glow',
    category: 'Design System',
    type: 'Neon',
    description: 'Neon glow effects on dark surfaces for tech-forward interfaces',
    preview: 'bg-[#0F172A] border border-primary-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] p-6 rounded-xl',
    image: '/cyberpunkglow.jpg',
    cssVariables: {
      '--glow-color': 'rgba(99, 102, 241, 0.3)',
      '--glow-spread': '40px',
      '--glow-border': 'rgba(99, 102, 241, 0.3)',
    },
    tailwindClasses: {
      background: 'bg-[#0F172A]',
      border: 'border border-primary-500/30',
      shadow: 'shadow-[0_0_40px_rgba(99,102,241,0.15)]',
      radius: 'rounded-xl',
    },
    usage: 'Tech, futuristic interfaces with high visual impact',
    bestFor: ['Gaming UI', 'Tech Dashboards', 'Promotional Content', 'Developer Tools'],
    code: `<div class="bg-[#0F172A] border border-primary-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] rounded-xl p-6">
  <h3>Cyber Card</h3>
  <p>Neon glow effect</p>
</div>`
  },
  {
    id: 6,
    name: 'Frosted Panel',
    category: 'Morphism',
    type: 'Glass',
    description: 'Heavy glass effect with strong blur and glow',
    preview: 'bg-slate-900/40 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)]',
    image: '/frostedpanel.webp',
    cssVariables: {
      '--frost-bg': 'rgba(15, 23, 42, 0.4)',
      '--frost-blur': '40px',
      '--frost-border': 'rgba(255, 255, 255, 0.2)',
      '--frost-glow': '0 0 40px rgba(99, 102, 241, 0.1)',
    },
    tailwindClasses: {
      background: 'bg-slate-900/40',
      blur: 'backdrop-blur-2xl',
      border: 'border border-white/20',
      radius: 'rounded-2xl',
      shadow: 'shadow-[0_0_40px_rgba(99,102,241,0.1)]',
    },
    usage: 'Premium, luxury interfaces with strong visual impact',
    bestFor: ['Premium Features', 'Showcase Cards', 'Hero Sections', 'Brand Elements'],
    code: `<div class="bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.1)] p-6">
  <h3>Frosted Panel</h3>
  <p>Heavy glass effect</p>
</div>`
  },
  {
    id: 7,
    name: 'Warm Minimal',
    category: 'Design System',
    type: 'Clean',
    description: 'Warm, inviting design with subtle earthy tones',
    preview: 'bg-[#1A1A2E] border border-warm-500/20 p-6 rounded-xl',
    image: '/warm minimal.webp',
    cssVariables: {
      '--warm-bg': '#1A1A2E',
      '--warm-border': 'rgba(245, 158, 11, 0.2)',
      '--warm-radius': '12px',
    },
    tailwindClasses: {
      background: 'bg-[#1A1A2E]',
      border: 'border border-warm-500/20',
      radius: 'rounded-xl',
    },
    usage: 'Warm, inviting interfaces with personality',
    bestFor: ['Creative Portfolios', 'Agency Sites', 'Brand Showcases', 'Editorial'],
    code: `<div class="bg-[#1A1A2E] border border-warm-500/20 rounded-xl p-6">
  <h3>Warm Card</h3>
  <p>Inviting design</p>
</div>`
  },
  {
    id: 8,
    name: '3D Depth',
    category: 'Morphism',
    type: '3D',
    description: 'Three-dimensional depth with perspective transforms',
    preview: 'bg-[#0F172A] border border-white/10 p-6 rounded-2xl transform perspective-1000 rotateX-2 rotateY-2 shadow-3d',
    cssVariables: {
      '--3d-perspective': '1000px',
      '--3d-rotate-x': '2deg',
      '--3d-rotate-y': '2deg',
      '--3d-shadow': '0 20px 60px rgba(0,0,0,0.6)',
    },
    tailwindClasses: {
      background: 'bg-[#0F172A]',
      border: 'border border-white/10',
      transform: 'perspective-1000 rotateX-2 rotateY-2',
      shadow: 'shadow-3d',
      radius: 'rounded-2xl',
    },
    usage: 'Immersive, engaging interfaces with physical depth',
    bestFor: ['Product Cards', 'Showcase Items', 'Interactive Elements', 'Gaming'],
    code: `<div class="bg-[#0F172A] border border-white/10 p-6 rounded-2xl perspective-1000 rotateX-2 rotateY-2 shadow-3d">
  <h3>3D Card</h3>
  <p>Physical depth effect</p>
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
  const [showFilters, setShowFilters] = useState(false);
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

  const favoriteThemes = favorites.filter(f => f.type === 'theme');
  const clearFilters = () => {
    setFilterCategory('All');
    setFilterType('All');
    setSearch('');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="glass-gradient p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl animate-float-medium" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-cyber flex items-center gap-3">
              FuncLexa Design System Library
              <span className="text-xs font-normal text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {designThemes.length} themes
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-primary-400">{filtered.length}</span> matching • 
              <span className="text-warm-400">{favoriteThemes.length}</span> favorited
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                showFavorites 
                  ? 'bg-gradient-to-r from-warm-500/20 to-warm-400/20 text-warm-400 border border-warm-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavorites ? 'fill-warm-400' : ''}`} />
              {showFavorites ? 'Favorites' : 'Show Favorites'}
              {favoriteThemes.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/10 rounded-full text-[10px]">
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
                className="pl-9 pr-4 py-2 bg-[#0F172A]/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-48 sm:w-64 transition-all duration-300"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border transition-all duration-300 ${
                showFilters 
                  ? 'bg-primary-500/20 border-primary-500/30 text-primary-400' 
                  : 'bg-[#0F172A]/50 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            
            <div className="flex bg-[#0F172A]/50 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="relative mt-4 pt-4 border-t border-white/5 animate-slide-up">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#0F172A]/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#0F172A]/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {(filterCategory !== 'All' || filterType !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="panel-3d p-4 text-center">
          <div className="text-2xl font-bold text-gradient-primary">{designThemes.length}</div>
          <div className="text-xs text-slate-400">Total Themes</div>
        </div>
        <div className="panel-3d p-4 text-center">
          <div className="text-2xl font-bold text-secondary-400">{designThemes.filter(t => t.category === 'Morphism').length}</div>
          <div className="text-xs text-slate-400">Morphism Styles</div>
        </div>
        <div className="panel-3d p-4 text-center">
          <div className="text-2xl font-bold text-accent-400">{designThemes.filter(t => t.category === 'Design System').length}</div>
          <div className="text-xs text-slate-400">Design Systems</div>
        </div>
        <div className="panel-3d p-4 text-center">
          <div className="text-2xl font-bold text-warm-400">{favoriteThemes.length}</div>
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
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400">
            {showFavorites ? 'No favorite themes yet. Star themes to save them!' : 'No themes found matching your search.'}
          </p>
          {showFavorites && (
            <button
              onClick={() => setShowFavorites(false)}
              className="mt-2 text-sm text-primary-400 hover:text-primary-300 transition"
            >
              Show all themes
            </button>
          )}
        </div>
      )}
    </div>
  );
}