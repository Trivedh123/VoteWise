import React from 'react';
import clsx from 'clsx';
import './Card.css';

export const Card = ({ children, className, onClick, ...props }) => {
  return (
    <div 
      className={clsx('card', { 'card-clickable': !!onClick }, className)} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
