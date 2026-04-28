import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, icon: Icon, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />}
        <input 
          className={twMerge(
            'w-full bg-slate-50 border-2 border-transparent focus:border-primary-100 focus:bg-white rounded-2xl outline-none transition-all font-semibold py-4',
            Icon ? 'pl-12 pr-6' : 'px-6',
            error ? 'border-red-100 bg-red-50' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
};

export default Input;
