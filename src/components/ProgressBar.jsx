import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="progress-container">
      <div 
        className="progress-fill" 
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      >
        <div className="progress-highlight"></div>
      </div>
    </div>
  );
};
