import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GameButton = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 shadow-lg shadow-amber-900/50 border-2 border-amber-500/40',
    secondary: 'bg-black/80 hover:bg-black/60 text-amber-200 border-2 border-amber-700/50'
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
};

export default function NameSelectionScreen({ onConfirm }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-amber-950/95" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 max-w-md w-full bg-black/80 backdrop-blur-sm p-8 border-4 border-amber-800/70"
        style={{
          clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
          boxShadow: 'inset 0 0 30px rgba(120, 53, 15, 0.3), 0 0 50px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/80" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-600/80" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-600/80" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/80" />

        <h1 className="text-3xl font-bold text-amber-100 mb-2 text-center font-serif">Quem és tu?</h1>
        <p className="text-amber-500/70 text-center mb-8 font-serif">Escolhe o nome do teu guerreiro</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Guerreiro"
              maxLength={20}
              className="w-full px-4 py-3 bg-black/60 border-2 border-amber-700/60 text-amber-100 placeholder-amber-500/50 focus:border-amber-600 focus:outline-none font-serif"
              style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
              autoFocus
            />
            <p className="text-amber-500/50 text-xs mt-2 text-right font-serif">{name.length}/20</p>
          </div>

          <GameButton type="submit" disabled={!name.trim()} className="w-full">
            Começar Jornada
          </GameButton>
        </form>
      </motion.div>
    </motion.div>
  );
}