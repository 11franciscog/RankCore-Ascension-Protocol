import React from 'react';
import { motion } from 'framer-motion';

export default function GameLogo({ size = 'large' }) {
  const sizeClasses = { small: 'w-32 md:w-40', medium: 'w-48 md:w-64', large: 'w-64 md:w-96' };
  return (
    <div className="flex justify-center">
      <motion.img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698b6bc22468e8d5e020880b/5185ba1dd_ed966575-5e6e-45a2-9aa1-231958f0ed22-Photoroom.png"
        alt="RankCore: Ascension Protocol"
        className={`${sizeClasses[size]} object-contain drop-shadow-2xl`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}