import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, glass = false, noPadding = false }) => {
  return (
    <div className={twMerge(
      'rounded-4xl border border-slate-100 transition-all duration-300',
      glass ? 'bg-white/70 backdrop-blur-xl shadow-glass' : 'bg-white shadow-soft',
      noPadding ? 'p-0' : 'p-8',
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
