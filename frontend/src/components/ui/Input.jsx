import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-bold pl-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
