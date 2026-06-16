import { NavLink } from 'react-router-dom';
import { Layers, Palette, Wand2, Clock, Star, HardDrive } from 'lucide-react';
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

  return (
    <aside className="h-full flex flex-col py-4 px-3">
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
          Fx
        </div>
        <span className="text-sm font-semibold text-white">FuncLexa</span>
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
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-white/5" />

      {/* Secondary - with counts */}
      <nav className="space-y-1">
        <NavLink
          to="/recent"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-item flex items-center justify-between ${isActive ? 'active' : ''}`
          }
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4" />
            <span>Recent</span>
          </div>
          {recent.length > 0 && (
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
              {recent.length}
            </span>
          )}
        </NavLink>
        <NavLink
          to="/favorites"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-item flex items-center justify-between ${isActive ? 'active' : ''}`
          }
        >
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </div>
          {favorites.length > 0 && (
            <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
              {favorites.length}
            </span>
          )}
        </NavLink>
        <NavLink
          to="/storage"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-item flex items-center justify-between ${isActive ? 'active' : ''}`
          }
        >
          <div className="flex items-center gap-3">
            <HardDrive className="w-4 h-4" />
            <span>Storage</span>
          </div>
          {storageItems.length > 0 && (
            <span className="text-xs text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded">
              {storageItems.length}
            </span>
          )}
        </NavLink>
      </nav>

      <div className="flex-1" />
    </aside>
  );
}