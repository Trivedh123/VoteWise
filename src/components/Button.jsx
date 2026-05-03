import React from 'react';
import clsx from 'clsx';
import './Button.css';

export const Button = ({ children, variant = 'primary', className, fullWidth, onClick, disabled, ...props }) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        { 'w-full': fullWidth },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
