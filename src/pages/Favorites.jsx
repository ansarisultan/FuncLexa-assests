import { useFavorites } from '../hooks/useStorage';
import { Star, Copy, Check, Eye } from 'lucide-react';
import ComponentCard from '../components/component-library/ComponentCard';

export default function Favorites() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Filter themes from favorites
  const favoriteThemes = favorites.filter(f => f.type === 'theme');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gradient-cyber flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          FuncSilo Saved Favorites
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          A collection of design styles and code structures you have saved.
        </p>
      </div>

      {favoriteThemes.length === 0 ? (
        <div className="panel p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Star className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
          <h3 className="text-base font-semibold text-white">No favorites saved</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Tweak card presets inside the Design System Library and star them to keep track of your favorites.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteThemes.map((theme) => (
            <ComponentCard
              key={theme.id}
              component={theme}
              isTheme={true}
              isFavorite={isFavorite(theme.name, 'theme')}
              onToggleFavorite={() => toggleFavorite(theme)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
