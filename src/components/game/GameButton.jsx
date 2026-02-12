import React from 'react';
import { motion } from 'framer-motion';

export default function GameButton({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const variants = {
    primary: 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 shadow-lg shadow-amber-900/50 border-2 border-amber-500/40',
    secondary: 'bg-black/80 hover:bg-black/60 text-amber-200 border-2 border-amber-700/50',
    danger: 'bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-2 border-red-600/50',
    ghost: 'bg-transparent hover:bg-amber-950/20 text-amber-300 border border-amber-800/30'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 font-medium tracking-wide
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${variants[variant]}
        ${className}
      `}
      style={{
        clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}