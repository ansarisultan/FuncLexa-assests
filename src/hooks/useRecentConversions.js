import { useState, useEffect } from 'react';

const STORAGE_KEY = 'funcsilo_recent';

const getLocalStorageItem = (key) => {
  const val = localStorage.getItem(key);
  if (val) return val;
  const oldKey = key.replace('funcsilo_', 'funclexa_');
  return localStorage.getItem(oldKey);
};

export function useRecentConversions() {
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    const stored = getLocalStorageItem(STORAGE_KEY);
    if (stored) {
      try {
        setConversions(JSON.parse(stored));
      } catch {
        setConversions([]);
      }
    }
  }, []);

  const addConversion = (entry) => {
    const updated = [entry, ...conversions].slice(0, 10); // keep last 10
    setConversions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { conversions, addConversion };
}