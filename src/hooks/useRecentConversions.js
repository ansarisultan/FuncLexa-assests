import { useState, useEffect } from 'react';

const STORAGE_KEY = 'funclexa_recent';

export function useRecentConversions() {
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
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