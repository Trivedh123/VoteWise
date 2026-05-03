import React from 'react';
import './Mascot.css';

export const Mascot = ({ message, emoji = '🗳️' }) => {
  return (
    <div className="mascot-container flex items-end gap-3 my-4">
      <div className="mascot-character bounce-animation text-4xl">
        {emoji}
      </div>
      <div className="mascot-bubble bg-surface p-3 rounded-2xl border-2 border-border relative flex-1 font-bold text-sm">
        {message}
      </div>
    </div>
  );
};
