import React from 'react';
import { motion } from 'framer-motion';
import GameLogo from './GameLogo';
import GameButton from './GameButton';

export default function CreditsScreen({ onBack }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <GameLogo size="medium" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 text-center max-w-md">
        <h2 className="text-xl font-semibold text-amber-200 mb-6 font-serif">Créditos</h2>
        <div className="space-y-4 text-amber-300/70 font-serif">
          <p><span className="text-amber-200">Conceito & Design:</span> RankCore Studios</p>
          <p><span className="text-amber-200">Desenvolvimento:</span> Base44</p>
          <p><span className="text-amber-200">Narrativa:</span> O Guerreiro Rejeitado</p>
        </div>
        <div className="mt-8 pt-8 border-t border-amber-700/30">
          <p className="text-sm text-amber-500/60 mb-6 font-serif">Um jogo sobre coragem, desafio e ascensão.</p>
          <GameButton onClick={onBack} variant="secondary">Voltar ao Menu</GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
}