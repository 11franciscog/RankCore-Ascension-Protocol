import React from 'react';
import { motion } from 'framer-motion';
import GameLogo from './GameLogo';
import GameButton from './GameButton';

export default function MainMenu({ onStart, onContinue, onCredits, hasSave }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen relative flex flex-col items-center justify-center p-6" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-amber-950/95" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-amber-400/20 rounded-full" initial={{ x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600) }} animate={{ y: [null, -100], opacity: [0, 1, 0] }} transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }} />
        ))}
      </div>
      <div className="relative z-10 text-center">
        <GameLogo />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-amber-300/60 mt-6 mb-12 max-w-md mx-auto text-sm md:text-base font-serif">
          Um guerreiro rejeitado pelos deuses. Um caminho de poder e vingança.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col gap-4 items-center">
          <GameButton onClick={onStart} className="w-64">Iniciar Jornada</GameButton>
          <GameButton onClick={onContinue} variant="secondary" className="w-64" disabled={!hasSave}>Continuar {!hasSave && '(Sem dados)'}</GameButton>
          <GameButton onClick={onCredits} variant="ghost" className="w-64">Créditos</GameButton>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-amber-600/40 text-xs mt-16 font-serif">v2.0 • RankCore: Ascension Protocol</motion.p>
      </div>
    </motion.div>
  );
}