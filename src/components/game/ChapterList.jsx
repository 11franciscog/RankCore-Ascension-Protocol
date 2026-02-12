import React from 'react';
import { motion } from 'framer-motion';
import GameButton from './GameButton';

export default function ChapterList({ chapters, completedMissions, onSelectChapter, onBack }) {
  const isChapterUnlocked = (chapterIndex) => {
    if (chapterIndex === 0) return true;
    const previousChapter = chapters[chapterIndex - 1];
    return previousChapter.missions.every(mission => completedMissions.includes(mission.id));
  };

  const getChapterProgress = (chapter) => {
    const completed = chapter.missions.filter(m => completedMissions.includes(m.id)).length;
    const total = chapter.missions.length;
    return { completed, total };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-black p-4 md:p-8" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 53, 15, 0.15) 0%, transparent 50%)' }}>
      <header className="flex items-center justify-between mb-8">
        <div>
          <GameButton onClick={onBack} variant="ghost" className="mb-2 px-4 py-2 text-sm">← Voltar</GameButton>
          <h1 className="text-3xl font-bold text-amber-100 font-serif">Capítulos</h1>
          <p className="text-amber-500/70 text-sm font-serif">A tua jornada pelo RankCore</p>
        </div>
      </header>
      <div className="max-w-4xl mx-auto grid gap-6">
        {chapters.map((chapter, idx) => {
          const isUnlocked = isChapterUnlocked(idx);
          const progress = getChapterProgress(chapter);
          const isCompleted = progress.completed === progress.total;
          return (
            <motion.button key={chapter.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: isUnlocked ? 1.01 : 1 }} onClick={() => isUnlocked && onSelectChapter(chapter)} disabled={!isUnlocked} className={`relative overflow-hidden p-6 text-left border-2 transition-all ${!isUnlocked ? 'bg-black/30 border-stone-700/50 opacity-40 cursor-not-allowed' : isCompleted ? 'bg-black/40 border-emerald-700/60 hover:border-emerald-600/80' : 'bg-black/60 border-amber-700/60 hover:border-amber-600/80'}`} style={{ clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)', backgroundImage: isUnlocked ? `url(${chapter.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className={`absolute inset-0 ${isUnlocked ? 'bg-black/85' : 'bg-black/95'}`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-amber-500/70 text-sm font-serif mb-1">Capítulo {chapter.number}</div>
                    <h2 className="text-2xl font-bold text-amber-100 mb-1 font-serif">{chapter.title}</h2>
                    <p className="text-amber-400/80 text-sm font-serif italic">{chapter.subtitle}</p>
                  </div>
                  {!isUnlocked && <div className="text-stone-400 text-3xl">🔒</div>}
                  {isCompleted && <div className="text-emerald-400 text-3xl">✓</div>}
                </div>
                <p className="text-amber-200/70 text-sm leading-relaxed mb-4 font-serif">{chapter.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-black/60 border border-amber-700/40 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(progress.completed / progress.total) * 100}%` }} className="h-full bg-gradient-to-r from-amber-600 to-amber-500" />
                  </div>
                  <span className="text-amber-400 text-sm font-bold">{progress.completed}/{progress.total}</span>
                </div>
                {!isUnlocked && <p className="text-xs text-stone-400 mt-3 font-serif">Completa o capítulo anterior para desbloquear</p>}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}