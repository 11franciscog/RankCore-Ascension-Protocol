import React from 'react';
import { motion } from 'framer-motion';
import GameButton from './GameButton';

export default function ChapterIntro({ chapter, completedMissions = [], onStart, onBack }) {
  const total = chapter.missions?.length || 0;
  const done = chapter.missions ? chapter.missions.filter(m => completedMissions.includes(m.id)).length : 0;
  const isCompleted = done === total && total > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen relative flex flex-col items-center justify-center p-6" style={{ backgroundImage: `url(${chapter.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-3xl bg-black/80 backdrop-blur-sm p-8 md:p-12 border-4 border-amber-800/70" style={{ clipPath: 'polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)' }}>
        <div className="text-center mb-8">
          <p className="text-amber-500/70 text-sm tracking-widest mb-2 uppercase font-serif">Capítulo {chapter.number}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-2 font-serif">{chapter.title}</h1>
          <p className="text-amber-400/80 text-lg font-serif italic">{chapter.subtitle}</p>
        </div>
        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-amber-200/90 leading-relaxed whitespace-pre-line font-serif text-center">{chapter.storyIntro}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <GameButton onClick={onBack} variant="secondary">← Voltar</GameButton>
          {!isCompleted ? (
            <GameButton onClick={onStart}>Prosseguir</GameButton>
          ) : (
            <GameButton onClick={onStart} variant="ghost">Rever Missões / Repetir</GameButton>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}