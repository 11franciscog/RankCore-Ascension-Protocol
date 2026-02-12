import React from 'react';
import { motion } from 'framer-motion';
import GameLogo from './GameLogo';
import RankBadge from './RankBadge';
import GameButton from './GameButton';
import XPBar from './XPBar';
import { RANKS, XP_THRESHOLDS } from './data';

const DEFAULT_ITEM_ICON = '/resources/items/default_item.png';
const getItemImg = (item) => item?.iconUrl || item?.iconPath || DEFAULT_ITEM_ICON;

export default function PlayerHub({ playerData, onChapters, onEvents, onShop, onInventory, onSave }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-4 md:p-8 bg-cover bg-center" style={{ backgroundImage: 'url(https://i.imgur.com/oPIlxv0.png)' }}>
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <GameLogo size="small" />
        <div className="flex items-center gap-4">
          <RankBadge rank={playerData.rank} />
          <GameButton onClick={onSave} variant="ghost" className="text-sm px-4 py-2">🚪 Sair</GameButton>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-sm p-6 md:p-8 border-4 border-amber-800/60 mb-6 relative" style={{ clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)', boxShadow: 'inset 0 0 30px rgba(120, 53, 15, 0.3), 0 0 50px rgba(0, 0, 0, 0.8)' }}>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/80" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-600/80" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-600/80" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/80" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-3xl font-bold text-amber-100 shadow-lg shadow-black/50 border-2 border-amber-600/60" style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>{playerData.name.charAt(0)}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-amber-100 mb-1 font-serif">{playerData.name}</h2>
              <p className="text-amber-500/70 text-sm font-serif">Guerreiro Rejeitado</p>
            </div>
          </div>

          <div className="grid gap-4">
            <XPBar current={playerData.xp} threshold={XP_THRESHOLDS[RANKS.indexOf(playerData.rank) + 1] || 9999} />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-amber-800/40">
            <div className="text-center"><p className="text-2xl font-bold text-amber-200">{playerData.missionsCompleted}</p><p className="text-xs text-amber-500/70 font-serif">Missões</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-amber-200">{playerData.victories}</p><p className="text-xs text-amber-500/70 font-serif">Vitórias</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-amber-200">{playerData.gold}</p><p className="text-xs text-amber-500/70 font-serif">Ouro</p></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onChapters} className="bg-black/70 backdrop-blur-sm p-6 border-2 border-amber-700/60 transition-all group relative overflow-hidden" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
            <div className="text-4xl mb-3 relative z-10">📖</div>
            <h3 className="text-lg font-semibold text-amber-100 mb-1 relative z-10 font-serif">Capítulos</h3>
            <p className="text-sm text-amber-500/70 relative z-10 font-serif">A tua jornada</p>
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onEvents} className="bg-black/70 backdrop-blur-sm p-6 border-2 border-purple-700/60 transition-all group relative overflow-hidden" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent" />
            <div className="text-4xl mb-3 relative z-10">🌟</div>
            <h3 className="text-lg font-semibold text-amber-100 mb-1 relative z-10 font-serif">Eventos</h3>
            <p className="text-sm text-amber-500/70 relative z-10 font-serif">Desafios especiais</p>
          </motion.button>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onShop} className="bg-black/70 backdrop-blur-sm p-6 border-2 border-amber-700/60 transition-all group relative overflow-hidden" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
            <div className="text-4xl mb-3 relative z-10">🏪</div>
            <h3 className="text-lg font-semibold text-amber-100 mb-1 relative z-10 font-serif">Loja</h3>
            <p className="text-sm text-amber-500/70 relative z-10 font-serif">Equipamentos</p>
          </motion.button>
        </div>

        <div className="mt-4">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onInventory} className="w-full bg-black/70 backdrop-blur-sm p-6 border-2 border-amber-700/60 transition-all group relative overflow-hidden" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
            <div className="text-4xl mb-3 relative z-10">🎒</div>
            <h3 className="text-lg font-semibold text-amber-100 mb-1 relative z-10 font-serif">Inventário</h3>
            <p className="text-sm text-amber-500/70 relative z-10 font-serif">{playerData.inventory.length} {playerData.inventory.length === 1 ? 'item' : 'itens'}</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}