import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '/api';

export const useProgress = (storageKey, initialValue) => {
  const [progress, setProgress] = useState(initialValue);
  const [syncedData, setSyncedData] = useState(null); // Full stats like gems/streak
  const { getAuthHeader, isAuthenticated } = useAuth();

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`${API_URL}/user/progress`, {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.current_step);
        setSyncedData(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress', error);
    }
  }, [isAuthenticated, getAuthHeader]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateProgress = async (newProgressFn) => {
    const nextVal = typeof newProgressFn === 'function' ? newProgressFn(progress) : newProgressFn;
    
    // Optimistic UI update
    setProgress(nextVal);
    
    if (isAuthenticated) {
      try {
        const res = await fetch(`${API_URL}/user/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ current_step: nextVal })
        });
        if (res.ok) {
          // Re-fetch to get updated gems etc.
          fetchProgress();
        }
      } catch (error) {
        console.error('Failed to update progress', error);
      }
    }
  };

  return [progress, updateProgress, syncedData];
};
