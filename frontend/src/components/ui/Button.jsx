import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed rounded-xl';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20',
    secondary: 'bg-white text-primary-600 border border-primary-100 hover:bg-primary-50',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 shadow-lg shadow-accent-500/20',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
