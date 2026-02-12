import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameButton from './GameButton';

export default function MissionScreen({ mission, onChoice, onFail, onBack, playerHealth, playerMaxHealth }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [missionStarted, setMissionStarted] = useState(false);
  const [tempHealth, setTempHealth] = useState(playerHealth ?? playerMaxHealth);

  useEffect(() => {
    setTempHealth(playerHealth ?? playerMaxHealth);
  }, [playerHealth, playerMaxHealth, mission?.id]);

  const currentQuestion = mission.questions[currentQuestionIndex];

  const handleChoice = (choice) => {
    setShowResult(choice);
    let newHealth = tempHealth;
    if (choice.consequence === 'damage') newHealth = Math.max(0, tempHealth - choice.value);
    else if (choice.consequence === 'gamble') newHealth = Math.max(0, tempHealth - choice.value.damage);
    setTempHealth(newHealth);
  };

  const confirmChoice = () => {
    if (tempHealth <= 0) { onFail(mission.id); return; }
    if (currentQuestionIndex < mission.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(null);
    } else {
      onChoice(showResult, mission.questions.map((_, idx) => (idx < currentQuestionIndex ? null : showResult)));
      setShowResult(null);
    }
  };

  const healthPercentage = Math.max(0, Math.min(100, (tempHealth / (playerMaxHealth || 1)) * 100));

  if (!missionStarted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen relative flex flex-col items-center justify-center p-4" style={{ backgroundImage: `url(${mission.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-2xl bg-black/80 backdrop-blur-sm p-8 border-4 border-amber-800/70">
          <h2 className="text-3xl font-bold text-amber-100 mb-4 text-center">{mission.title}</h2>
          <p className="text-amber-200/80 leading-relaxed mb-6 text-center">{mission.description}</p>
          <div className="mb-6 p-4 bg-amber-900/30 border-2 border-amber-700/50 rounded text-center">
            <p className="text-amber-300 text-sm">Esta missão contém {mission.questions.length} desafios. Prepara-te!</p>
          </div>
          <div className="flex gap-4 justify-center">
            <GameButton onClick={onBack} variant="secondary">← Voltar</GameButton>
            <GameButton onClick={() => setMissionStarted(true)}>Ver Missões</GameButton>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen relative flex flex-col" style={{ backgroundImage: `url(${mission.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />

      <div className="relative z-10 p-4 md:p-8 max-w-3xl mx-auto w-full">
        {/* Barra de vida */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400 font-serif">Vida</span>
            <span className="text-amber-200 font-bold">{tempHealth}/{playerMaxHealth}</span>
          </div>
          <div className="h-3 bg-black/80 overflow-hidden border-2 border-red-700/60">
            <motion.div initial={{ width: 0 }} animate={{ width: `${healthPercentage}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-red-600 to-red-400" />
          </div>
        </div>

        <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-black/80 backdrop-blur-sm p-6 md:p-8 border-4 border-amber-800/70 relative">
          <h2 className="text-xl font-bold text-amber-100 mb-6 font-serif">{currentQuestion.text}</h2>

          {!showResult ? (
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, idx) => (
                <motion.button key={idx} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handleChoice(choice)} className="w-full p-4 bg-black/70 border-2 border-amber-700/60 hover:border-amber-600/80 hover:bg-black/50 text-left transition-all relative">
                  <span className="text-amber-400 font-bold">{idx + 1}.</span>
                  <span className="text-amber-100 ml-2 font-serif">{choice.text}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-amber-200/80 leading-relaxed mb-6 font-serif">{showResult.resultText}</p>

              <div className="mb-6 py-4 px-6 bg-black/60 border-2 border-amber-700/60 inline-block">
                {showResult.consequence === 'damage' && <p className="text-red-400 font-medium">-{showResult.value} Vida</p>}
                {showResult.consequence === 'xp' && <p className="text-emerald-400 font-medium">+{showResult.value} XP</p>}
                {showResult.consequence === 'gamble' && <div><p className="text-red-400 font-medium">-{showResult.value.damage} Vida</p><p className="text-emerald-400 font-medium">+{showResult.value.xp} XP</p></div>}
                {showResult.consequence === 'item' && <div><p className="text-emerald-400 font-medium">+{showResult.value.xp} XP</p><p className="text-amber-400 font-medium mt-2">📜 Item obtido: {showResult.value.item.name}</p></div>}
              </div>

              <GameButton onClick={confirmChoice}>{currentQuestionIndex < mission.questions.length - 1 ? 'Próxima Pergunta' : 'Concluir Missão'}</GameButton>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}