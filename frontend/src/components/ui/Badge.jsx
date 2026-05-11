import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    accent: 'bg-accent-50 text-accent-700',
    danger: 'bg-red-50 text-red-700',
    neutral: 'bg-neutral-100 text-neutral-600',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
  };

  return (
    <span 
      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
