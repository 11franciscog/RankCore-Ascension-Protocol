import React from 'react';
import { motion } from 'framer-motion';
import GameButton from './GameButton';
import { INTRO_SCENES } from './data';

export default function IntroScene({ scene, onNext, isLast, onSkip }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen relative flex flex-col items-center justify-end p-6 pb-20" style={{ backgroundImage: `url(${scene.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative z-10 max-w-2xl text-center">
        <p className="text-amber-400/70 text-sm tracking-widest mb-4 uppercase font-serif">{scene.subtitle}</p>
        <p className="text-xl md:text-2xl text-amber-100 leading-relaxed mb-12 font-serif">{scene.text}</p>
        <div className="flex gap-4 justify-center">
          <GameButton onClick={onNext}>{isLast ? 'Começar Jornada' : 'Continuar'}</GameButton>
          <GameButton onClick={onSkip} variant="ghost">Saltar História</GameButton>
        </div>
      </motion.div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {INTRO_SCENES.map((_, idx) => (
          <div key={idx} className={`w-2 h-2 transition-all ${idx === scene.id - 1 ? 'bg-amber-500 w-6' : 'bg-amber-600/30'}`} />
        ))}
      </div>
    </motion.div>
  );
}