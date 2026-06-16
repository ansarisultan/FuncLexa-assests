import { Menu, Search, Command } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="h-12 flex items-center px-6 border-b border-white/5 bg-[#050816]">
      <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white mr-4">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar – prominent */}
      <div className="flex-1 flex items-center max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets, components, or commands…"
            className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-9 pr-12 py-1.5 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-brand-500 outline-none"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side – maybe user avatar later, but we'll keep minimal */}
      <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-white/5 ml-4" />
    </header>
  );
}