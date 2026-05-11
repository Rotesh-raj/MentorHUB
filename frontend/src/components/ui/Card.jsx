import React from 'react';

const Card = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-3xl border border-neutral-100 shadow-premium overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
