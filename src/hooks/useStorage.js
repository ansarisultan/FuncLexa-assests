import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  FAVORITES: 'funclexa_favorites',
  RECENT: 'funclexa_recent',
  STORAGE: 'funclexa_storage',
};

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = (item) => {
    const updated = [...favorites, { ...item, id: Date.now(), timestamp: Date.now() }];
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  };

  const toggleFavorite = (item) => {
    const existing = favorites.find(f => f.name === item.name && f.type === item.type);
    if (existing) {
      removeFavorite(existing.id);
      return false;
    } else {
      addFavorite(item);
      return true;
    }
  };

  const isFavorite = (name, type) => {
    return favorites.some(f => f.name === name && f.type === type);
  };

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}

export function useRecent() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT);
    if (stored) {
      try {
        setRecent(JSON.parse(stored));
      } catch {
        setRecent([]);
      }
    }
  }, []);

  const addRecent = (item) => {
    const newItem = { ...item, id: Date.now(), timestamp: Date.now() };
    const filtered = recent.filter(r => !(r.name === item.name && r.type === item.type));
    const updated = [newItem, ...filtered].slice(0, 20);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify([]));
  };

  const removeRecent = (id) => {
    const updated = recent.filter(r => r.id !== id);
    setRecent(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
  };

  return { recent, addRecent, clearRecent, removeRecent };
}

export function useStorage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.STORAGE);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const addItem = (item) => {
    const newItem = { 
      ...item, 
      id: Date.now(), 
      timestamp: Date.now(),
      size: item.size || '0 KB',
      type: item.type || 'file',
      format: item.format || 'unknown'
    };
    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem(STORAGE_KEYS.STORAGE, JSON.stringify(updated));
    return newItem;
  };

  const removeItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem(STORAGE_KEYS.STORAGE, JSON.stringify(updated));
  };

  const clearStorage = () => {
    setItems([]);
    localStorage.setItem(STORAGE_KEYS.STORAGE, JSON.stringify([]));
  };

  const getTotalSize = () => {
    return items.reduce((total, item) => {
      const size = parseFloat(item.size);
      return total + (isNaN(size) ? 0 : size);
    }, 0);
  };

  const getItemsByType = (type) => {
    return items.filter(item => item.type === type);
  };

  return { 
    items, 
    addItem, 
    removeItem, 
    clearStorage, 
    getTotalSize, 
    getItemsByType 
  };
}