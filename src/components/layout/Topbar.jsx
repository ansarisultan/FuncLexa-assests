import { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, Bell, Sparkles, 
  Zap, Clock, Star, HardDrive,
  Layers, Palette, Wand2,
  Command, Globe, Shield, Plus,
  Download, Upload, Settings, User, X,
  TrendingUp, Clock as ClockIcon, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites, useRecent, useStorage } from '../../hooks/useStorage';
import SearchModal from '../modals/SearchModal';
import KeyboardShortcuts from '../modals/KeyboardShortcuts';
import { useWorkbench } from '../../context/WorkbenchContext';

export default function Topbar({ onMenuClick, onAssistantClick }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const { state: workbenchState, dispatch: workbenchDispatch } = useWorkbench();
  const { favorites } = useFavorites();
  const { recent } = useRecent();
  const { items: storageItems } = useStorage();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const quickActionsRef = useRef(null);
  const profileRef = useRef(null);

  // Generate recommendations when search is focused (no query)
  useEffect(() => {
    if (isSearchFocused && searchQuery.length === 0) {
      const recs = [
        // Recent items
        ...recent.slice(0, 3).map(r => ({ 
          ...r, 
          type: 'recent', 
          icon: Clock, 
          label: r.fileName || r.name,
          subtitle: `${r.from} → ${r.to} • ${r.size} KB`,
          badge: 'Recent'
        })),
        // Favorites
        ...favorites.slice(0, 2).map(f => ({ 
          ...f, 
          type: 'favorite', 
          icon: Star, 
          label: f.name,
          subtitle: f.type,
          badge: 'Favorite'
        })),
        // Popular actions
        {
          id: 'popular-1',
          label: 'Convert Image to WebP',
          type: 'action',
          icon: Zap,
          subtitle: 'Quick conversion',
          badge: 'Popular',
          action: () => { navigate('/'); }
        },
        {
          id: 'popular-2',
          label: 'Create Glassmorphism Theme',
          type: 'action',
          icon: Sparkles,
          subtitle: 'Design system',
          badge: 'Trending',
          action: () => { navigate('/library'); }
        },
        {
          id: 'popular-3',
          label: 'New Component from Studio',
          type: 'action',
          icon: Wand2,
          subtitle: 'Start designing',
          badge: 'New',
          action: () => { navigate('/studio'); }
        },
      ];
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [isSearchFocused, searchQuery, recent, favorites, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
        setIsQuickActionsOpen(false);
        setIsProfileOpen(false);
        setIsSearchFocused(false);
        setSearchQuery('');
      }
      // ⌘? for shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target)) {
        setIsQuickActionsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search
  useEffect(() => {
    if (searchQuery.length > 0) {
      const allItems = [
        ...recent.map(r => ({ ...r, type: 'recent', icon: Clock, label: r.fileName || r.name })),
        ...favorites.map(f => ({ ...f, type: 'favorite', icon: Star, label: f.name })),
        ...storageItems.map(s => ({ ...s, type: 'storage', icon: HardDrive, label: s.name })),
        // Quick actions as search results
        { 
          id: 'popular-1', 
          label: 'Convert Image to WebP', 
          type: 'action', 
          icon: Zap, 
          subtitle: 'Quick conversion', 
          action: () => { navigate('/'); } 
        },
        { 
          id: 'popular-2', 
          label: 'Create Glassmorphism Theme', 
          type: 'action', 
          icon: Sparkles, 
          subtitle: 'Design system', 
          action: () => { navigate('/library'); } 
        },
        { 
          id: 'popular-3', 
          label: 'New Component from Studio', 
          type: 'action', 
          icon: Wand2, 
          subtitle: 'Start designing', 
          action: () => { navigate('/studio'); } 
        },
        { 
          id: 'action-1', 
          label: 'New Component', 
          type: 'action', 
          icon: Plus, 
          subtitle: 'Create a new component', 
          action: () => { navigate('/studio'); } 
        },
        { 
          id: 'action-2', 
          label: 'Generate Theme', 
          type: 'action', 
          icon: Sparkles, 
          subtitle: 'Create a new design theme', 
          action: () => { navigate('/library'); } 
        },
        { 
          id: 'action-3', 
          label: 'Export Assets', 
          type: 'action', 
          icon: Download, 
          subtitle: 'Export all your assets', 
          action: () => {
            // Trigger export assets JSON download
            const exportData = {
              favorites,
              recent,
              storageItems,
              timestamp: Date.now()
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `funcsilo-workspace-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } 
        },
      ];
      
      const filtered = allItems.filter(item => 
        item.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);
      
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, recent, favorites, storageItems, navigate]);

  const quickActions = [
    { 
      label: 'New Component', 
      icon: Plus, 
      action: () => { navigate('/studio'); setIsQuickActionsOpen(false); },
      shortcut: '⌘N',
      color: 'from-primary-500 to-secondary-500'
    },
    { 
      label: 'Generate Theme', 
      icon: Sparkles, 
      action: () => { navigate('/library'); setIsQuickActionsOpen(false); },
      shortcut: '⌘T',
      color: 'from-warm-500 to-warm-400'
    },
    { 
      label: 'Export Assets', 
      icon: Download, 
      action: () => { 
        const exportData = {
          favorites,
          recent,
          storageItems,
          timestamp: Date.now()
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `funcsilo-workspace-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsQuickActionsOpen(false);
      },
      shortcut: '⌘E',
      color: 'from-accent-500 to-accent-400'
    },
    { 
      label: 'Upload Assets', 
      icon: Upload, 
      action: () => { 
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const data = JSON.parse(event.target.result);
                if (data.favorites) localStorage.setItem('funcsilo_favorites', JSON.stringify(data.favorites));
                if (data.recent) localStorage.setItem('funcsilo_recent', JSON.stringify(data.recent));
                if (data.storageItems) localStorage.setItem('funcsilo_storage', JSON.stringify(data.storageItems));
                alert('🎉 Workspace restored successfully!');
                window.location.reload();
              } catch (err) {
                alert('❌ Invalid JSON workspace file.');
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
        setIsQuickActionsOpen(false);
      },
      shortcut: '⌘I',
      color: 'from-primary-500 to-primary-400'
    },
    { 
      label: 'Go to Assets', 
      icon: Layers, 
      action: () => { navigate('/'); setIsQuickActionsOpen(false); },
      shortcut: '⌘1',
      color: 'from-primary-500 to-secondary-500'
    },
    { 
      label: 'Go to Library', 
      icon: Palette, 
      action: () => { navigate('/library'); setIsQuickActionsOpen(false); },
      shortcut: '⌘2',
      color: 'from-warm-500 to-warm-400'
    },
    { 
      label: 'Go to Studio', 
      icon: Wand2, 
      action: () => { navigate('/studio'); setIsQuickActionsOpen(false); },
      shortcut: '⌘3',
      color: 'from-accent-500 to-accent-400'
    },
    { 
      label: 'Keyboard Shortcuts', 
      icon: Command, 
      action: () => { setShowShortcuts(true); setIsQuickActionsOpen(false); },
      shortcut: '⌘?',
      color: 'from-slate-500 to-slate-400'
    },
  ];

  const notifications = [
    { 
      id: 1, 
      title: 'New Theme Added', 
      description: 'Cyberpunk Glow has been added to the Library',
      time: '2 min ago',
      icon: Sparkles,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10'
    },
    { 
      id: 2, 
      title: 'Conversion Complete', 
      description: 'image-optimized.webp (428 KB)',
      time: '15 min ago',
      icon: Zap,
      color: 'text-secondary-400',
      bg: 'bg-secondary-500/10'
    },
    { 
      id: 3, 
      title: 'Storage Update', 
      description: 'You have 5 items in storage',
      time: '1 hour ago',
      icon: HardDrive,
      color: 'text-warm-400',
      bg: 'bg-warm-500/10'
    },
  ];

  // Handle search result click
  const handleSearchResultClick = (item) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (item.action) {
      item.action();
    } else if (item.type === 'recent' || item.type === 'storage') {
      const format = item.format || item.to || 'webp';
      const mockFile = {
        name: item.name || item.fileName || 'unnamed_file',
        size: parseFloat(item.size) * 1024 || 2048,
        type: format === 'svg' ? 'image/svg+xml' : 'image/webp',
        format: format,
        isMock: true
      };
      
      workbenchDispatch({ type: 'SET_MEDIA_FILE', payload: mockFile });
      
      if (format === 'svg') {
        workbenchDispatch({ type: 'SET_ACTIVE_TOOL', payload: 'svg' });
      } else {
        workbenchDispatch({ type: 'SET_ACTIVE_TOOL', payload: 'converter' });
      }
      
      navigate('/');
    } else if (item.type === 'favorite') {
      navigate('/library');
    } else if (item.type === 'action') {
      // Handle specific actions
      if (item.label.includes('Component')) {
        workbenchDispatch({ type: 'SET_ACTIVE_TOOL', payload: 'svg' });
        navigate('/studio');
      } else if (item.label.includes('Theme')) {
        navigate('/library');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white transition">
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo & Brand in Navbar */}
          <div className="flex items-center gap-2 mr-2 flex-shrink-0">
            {/* <img src="/logo.png" alt="FuncLexa Logo" className="w-10 h-10 object-contain" /> */}
          <span
  className="
    hidden sm:flex
    items-center
    gap-2
    text-lg
    font-bold
    uppercase
    tracking-[0.25em]
    text-slate-300
  "
>
  <span className="h-[2px] w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
  Assets Suite
</span>
          </div>
        </div>

        {/* Search bar with live results and recommendations */}
        <div className="hidden md:flex flex-1 items-center max-w-xl mx-auto relative px-2">
          <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300">
              <Search className={`w-4 h-4 ${isSearchFocused ? 'text-primary-400' : 'text-slate-500'}`} />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search FuncSilo Assets... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className={`w-full bg-[#12121A] border rounded-xl pl-9 pr-14 py-2.5 text-sm text-white 
                         placeholder-slate-500 outline-none transition-all duration-300
                         ${isSearchFocused 
                           ? 'border-primary-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)]' 
                           : 'border-white/10 hover:border-white/20'
                         }`}
            />
            
            {/* Search results dropdown - Shows recommendations when focused with no query */}
            {(isSearchFocused) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F172A] border border-white/10 rounded-xl shadow-3d backdrop-blur-xl overflow-hidden z-50 animate-slide-up">
                {searchQuery.length === 0 ? (
                  // Recommendations
                  <div>
                    <div className="px-3 py-2 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3" />
                        FuncSilo Suggestions
                      </div>
                      <span className="text-[10px] text-slate-500">⌘K to search</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {recommendations.length > 0 ? (
                        recommendations.map((item, idx) => (
                          <button
                            key={idx}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-left group"
                            onClick={() => {
                              if (item.action) {
                                item.action();
                              } else {
                                handleSearchResultClick(item);
                              }
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                item.type === 'recent' ? 'bg-primary-500/10' :
                                item.type === 'favorite' ? 'bg-warm-500/10' :
                                'bg-secondary-500/10'
                              }`}>
                              <item.icon className={`w-4 h-4 ${
                                  item.type === 'recent' ? 'text-primary-400' :
                                  item.type === 'favorite' ? 'text-warm-400' :
                                  'text-secondary-400'
                                }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white truncate">{item.label}</span>
                                {item.badge && (
                                  <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                      item.badge === 'Recent' ? 'bg-primary-500/20 text-primary-400' :
                                      item.badge === 'Favorite' ? 'bg-warm-500/20 text-warm-400' :
                                      item.badge === 'Popular' ? 'bg-secondary-500/20 text-secondary-400' :
                                      item.badge === 'Trending' ? 'bg-accent-500/20 text-accent-400' :
                                      'bg-green-500/20 text-green-400'
                                    }`}>
                                      {item.badge}
                                    </span>
                                )}
                              </div>
                              {item.subtitle && (
                                <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition">
                              →
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                            <Search className="w-6 h-6 text-slate-500" />
                          </div>
                          <p className="text-sm">No recommendations available</p>
                          <p className="text-xs text-slate-500">Start typing to search</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  // Search results
                  <div>
                    <div className="px-3 py-2 flex items-center justify-between border-b border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Results for "{searchQuery}"
                      </span>
                      <span className="text-[10px] text-slate-500">{searchResults.length} found</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-left group"
                          onClick={() => handleSearchResultClick(item)}
                        >
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">
                              {item.label || item.fileName || item.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 capitalize">{item.type}</span>
                              {item.subtitle && (
                                <span className="text-xs text-slate-500">• {item.subtitle}</span>
                              )}
                            </div>
                          </div>
                          <kbd className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            ↵
                          </kbd>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // No results
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-400">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-slate-500 mt-1">Try searching for something else</p>
                  </div>
                )}
                
                {/* Footer with tips */}
                <div className="border-t border-white/5 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>↑↓ to navigate</span>
                    <span>↵ to select</span>
                    <span>esc to close</span>
                  </div>
                  <span>⌘? for shortcuts</span>
                </div>
              </div>
            )}
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Search Button (Mobile only) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 md:hidden"
            title="Search"
          >
            <Search className="w-4.5 h-4.5 text-slate-400 hover:text-white transition" />
          </button>

          {/* Quick Actions Button */}
          <div className="relative" ref={quickActionsRef}>
            <button 
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 relative group"
              title="Quick Actions"
            >
              <Zap className="w-4 h-4 text-slate-400 group-hover:text-warm-400 transition" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-warm-400 animate-pulse" />
            </button>
            
            {isQuickActionsOpen && (
              <div className="fixed left-4 right-4 top-14 mt-2 md:absolute md:left-auto md:right-0 md:top-full md:w-72 bg-[#0F172A] border border-white/10 rounded-xl shadow-3d backdrop-blur-xl overflow-hidden z-50 animate-slide-up">
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Quick Actions</span>
                    <span className="text-[8px] text-slate-500">⌘ + key</span>
                  </div>
                  <div className="space-y-1">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center flex-shrink-0`}>
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm text-white group-hover:text-primary-400 transition">
                            {action.label}
                          </div>
                          <div className="text-xs text-slate-400">{action.shortcut}</div>
                        </div>
                        <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition">
                          →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 relative group"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            </button>
            
            {isNotificationOpen && (
              <div className="fixed left-4 right-4 top-14 mt-2 md:absolute md:left-auto md:right-0 md:top-full md:w-80 bg-[#0F172A] border border-white/10 rounded-xl shadow-3d backdrop-blur-xl overflow-hidden z-50 animate-slide-up">
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="text-xs text-slate-400">3 new</span>
                </div>
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition">
                      <div className={`w-8 h-8 rounded-lg ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                        <notif.icon className={`w-4 h-4 ${notif.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white">{notif.title}</div>
                        <div className="text-xs text-slate-400 truncate">{notif.description}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 p-2">
                  <button className="w-full text-center text-xs text-primary-400 hover:text-primary-300 transition">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sparkles - AI Assistant */}
          <button 
            id="btn-ai-assistant"
            onClick={onAssistantClick}
            className="p-2 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 hover:from-primary-500/30 hover:to-secondary-500/30 transition border border-white/10 hover:scale-110 duration-300 group"
            title="AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-gradient-cyber group-hover:animate-spin-slow" />
          </button>

          {/* Keyboard Shortcuts Button */}
          <button 
            onClick={() => setShowShortcuts(true)}
            className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 hidden sm:flex"
            title="Keyboard Shortcuts (⌘?)"
          >
            <Command className="w-4 h-4 text-slate-400 hover:text-white transition" />
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 rounded-xl bg-gradient-main flex items-center justify-center text-white text-xs font-bold shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-110 cursor-pointer animate-float-slow"
              title="Profile"
            >
              FX
            </button>
            
            {/* {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-white/10 rounded-xl shadow-3d backdrop-blur-xl overflow-hidden z-50 animate-slide-up">
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-main flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                      FX
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">FuncSilo User</div>
                      <div className="text-xs text-slate-400">Developer • Creator</div>
                    </div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">Privacy</span>
                  </button>
                </div>
                <div className="border-t border-white/5 p-2">
                  <button className="w-full text-center text-xs text-accent-400 hover:text-accent-300 transition">
                    Sign Out
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}