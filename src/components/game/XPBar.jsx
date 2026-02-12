import React from 'react';
import { motion } from 'framer-motion';

export default function XPBar({ current, threshold }) {
  const percentage = Math.min(100, (current / threshold) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-amber-400/90 font-serif">Experiência</span>
        <span className="text-amber-200 font-bold">{current}/{threshold} XP</span>
      </div>
      <div className="h-3 bg-black/80 overflow-hidden border-2 border-amber-700/60"
           style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}