import React from 'react';
import { motion } from 'framer-motion';
import GameButton from './GameButton';

export default function MissionList({ missions, completedMissions, missionCooldowns, onSelectMission, onBack, chapterTitle }) {
  const isMissionLocked = (missionIndex) => {
    if (missionIndex === 0) return false;
    return !completedMissions.includes(missions[missionIndex - 1].id);
  };

  const getMissionCooldownText = (missionId) => {
    const cooldownEnd = missionCooldowns[missionId];
    if (!cooldownEnd) return null;
    const now = Date.now();
    if (now >= cooldownEnd) return null;
    const remainingMs = cooldownEnd - now;
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    return `Bloqueado por ${remainingMinutes} min`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-black p-4 md:p-8" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 53, 15, 0.15) 0%, transparent 50%)' }}>
      <header className="flex items-center justify-between mb-8">
        <div>
          <GameButton onClick={onBack} variant="ghost" className="mb-2 px-4 py-2 text-sm">← Voltar aos Capítulos</GameButton>
          <h1 className="text-3xl font-bold text-amber-100 font-serif">{chapterTitle}</h1>
          <p className="text-amber-500/70 text-sm font-serif">Completa as missões por ordem</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto grid gap-4">
        {missions.map((mission, idx) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isLocked = isMissionLocked(idx);
          const cooldownText = getMissionCooldownText(mission.id);
          const isOnCooldown = !!cooldownText;
          const isDisabled = isCompleted || isLocked || isOnCooldown;

          return (
            <motion.button key={mission.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: isDisabled ? 1 : 1.01 }} onClick={() => !isDisabled && onSelectMission(mission)} disabled={isDisabled} className={`relative overflow-hidden p-6 text-left border-2 transition-all ${isCompleted ? 'bg-black/30 border-emerald-700/50 opacity-60 cursor-not-allowed' : isLocked ? 'bg-black/30 border-stone-700/50 opacity-40 cursor-not-allowed' : isOnCooldown ? 'bg-black/30 border-red-700/50 opacity-50 cursor-not-allowed' : 'bg-black/60 border-amber-700/60 hover:border-amber-600/80'}`} style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
              {isCompleted && <div className="absolute top-4 right-4 text-emerald-400 text-2xl">✓</div>}
              {isLocked && <div className="absolute top-4 right-4 text-stone-400 text-2xl">🔒</div>}
              {isOnCooldown && <div className="absolute top-4 right-4 text-red-400 text-xs">{cooldownText}</div>}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-800/40 border border-amber-700/60 flex items-center justify-center text-xl" style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}>⚔️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-100 mb-1 font-serif">{mission.title}</h3>
                  <p className="text-sm text-amber-500/70 line-clamp-2 font-serif">{mission.description}</p>
                  {isLocked && <p className="text-xs text-stone-400 mt-2 font-serif">Completa a missão anterior primeiro</p>}
                </div>
              </div>
            </motion.button>
          );
        })}

        {missions.every(m => completedMissions.includes(m.id)) && (
          <div className="text-center py-8">
            <p className="text-amber-400/70 font-serif">Capítulo completado!</p>
            <p className="text-sm text-amber-500/50 mt-2 font-serif">Avança para o próximo capítulo...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}