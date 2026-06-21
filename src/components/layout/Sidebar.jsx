import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Layers, Palette, Wand2, Clock, Star, HardDrive, 
  Sparkles, Zap, Shield, Cpu, Globe, Box, Plus, Download, Upload
} from 'lucide-react';
import { useFavorites, useRecent, useStorage } from '../../hooks/useStorage';

const mainNav = [
  { to: '/', label: 'Assets', icon: Layers },
  { to: '/library', label: 'Library', icon: Palette },
  { to: '/studio', label: 'Studio', icon: Wand2 },
];

export default function Sidebar({ onClose }) {

  const { favorites } = useFavorites();
  const { recent } = useRecent();
  const { items: storageItems } = useStorage();
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    switch(action) {
      case 'new-component':
        navigate('/studio');
        onClose();
        break;
      case 'generate-theme':
        navigate('/library');
        onClose();
        break;
      case 'export-assets': {
        const getLocalStorageItem = (newKey, oldKey) => {
          return localStorage.getItem(newKey) || localStorage.getItem(oldKey);
        };
        const exportData = {
          favorites: getLocalStorageItem('funcsilo_favorites', 'funclexa_favorites') ? JSON.parse(getLocalStorageItem('funcsilo_favorites', 'funclexa_favorites')) : [],
          recent: getLocalStorageItem('funcsilo_recent', 'funclexa_recent') ? JSON.parse(getLocalStorageItem('funcsilo_recent', 'funclexa_recent')) : [],
          storageItems: getLocalStorageItem('funcsilo_storage', 'funclexa_storage') ? JSON.parse(getLocalStorageItem('funcsilo_storage', 'funclexa_storage')) : [],
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
        onClose();
        break;
      }
      case 'upload-assets': {
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
        onClose();
        break;
      }
      default:
        break;
    }
  };

  return (
    <aside className="sidebar-3d">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 mb-8 preserve-3d">
        <img src="/logo.png" alt="FuncLexa Logo" className="w-12 h-12 object-contain flex-shrink-0" />
        <div>
          <span className="text-4xl font-bold text-gradient-animated-funclexa block leading-none">FuncLexa</span>
          <span className="text-[10px] font-normal text-slate-400 tracking-wider uppercase mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-ping" />
            Assets Suite
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="space-y-1">
        {mainNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-item-3d ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-white/5" />

      {/* Secondary nav */}
      <nav className="space-y-1">
        <NavLink 
          to="/recent"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-item-3d w-full text-left flex items-center justify-between group ${isActive ? 'active' : ''}`
          }
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4" />
            <span>Recent</span>
          </div>
          {recent.length > 0 && (
            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full group-hover:bg-white/10 transition">
              {recent.length}
            </span>
          )}
        </NavLink>
        <NavLink 
          to="/favorites"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-item-3d w-full text-left flex items-center justify-between group ${isActive ? 'active' : ''}`
          }
        >
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </div>
          {favorites.length > 0 && (
            <span className="text-[10px] text-warm-400 bg-warm-500/10 px-2 py-0.5 rounded-full group-hover:bg-warm-500/20 transition">
              {favorites.length}
            </span>
          )}
        </NavLink>
        <NavLink 
          to="/storage"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-item-3d w-full text-left flex items-center justify-between group ${isActive ? 'active' : ''}`
          }
        >
          <div className="flex items-center gap-3">
            <HardDrive className="w-4 h-4" />
            <span>Storage</span>
          </div>
          {storageItems.length > 0 && (
            <span className="text-[10px] text-secondary-400 bg-secondary-500/10 px-2 py-0.5 rounded-full group-hover:bg-secondary-500/20 transition">
              {storageItems.length}
            </span>
          )}
        </NavLink>
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-white/5" />

      {/* Quick Actions */}
      <div className="px-3 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium flex items-center gap-2">
          <Zap className="w-3 h-3" />
          Quick Actions
        </span>
        <button 
          onClick={() => handleQuickAction('new-component')}
          className="sidebar-item-3d w-full text-left text-xs group"
        >
          <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
          New Component
        </button>
        <button 
          onClick={() => handleQuickAction('generate-theme')}
          className="sidebar-item-3d w-full text-left text-xs group"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
          Generate Theme
        </button>
        <button 
          onClick={() => handleQuickAction('export-assets')}
          className="sidebar-item-3d w-full text-left text-xs group"
        >
          <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
          Export Assets
        </button>
        <button 
          onClick={() => handleQuickAction('upload-assets')}
          className="sidebar-item-3d w-full text-left text-xs group"
        >
          <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          Upload Assets
        </button>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="px-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>System ready</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Shield className="w-3 h-3" />
            <span>Secure</span>
          </div>
        </div>
      </div>


    </aside>
  );
}