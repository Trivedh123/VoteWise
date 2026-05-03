import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import './Header.css';

export const Header = () => {
  const { location, isLoading, requestLocation } = useLocation();
  
  return (
    <header className="header bg-surface">
      <div className="header-content">
        <h1 className="header-logo text-primary">VoteWise</h1>
        
        <div className="header-stats flex items-center gap-3">
          <div className="stat-item flex items-center gap-1 font-bold text-danger">
            <span className="text-lg">🔥</span>
            <span>3</span>
          </div>
          <div className="stat-item flex items-center gap-1 font-bold text-secondary">
            <span className="text-lg">💎</span>
            <span>150</span>
          </div>
        </div>

        <div 
          className={`header-location flex items-center gap-1 text-muted ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={requestLocation}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          <span className="text-sm font-bold hidden-mobile">
            {isLoading ? 'Locating...' : (location || 'Set Location')}
          </span>
        </div>
      </div>
    </header>
  );
};
