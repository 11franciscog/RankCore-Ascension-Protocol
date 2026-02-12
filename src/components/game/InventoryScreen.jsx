import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameButton from './GameButton';

const DEFAULT_ITEM_ICON = '/resources/items/tile077.png';
const getItemImg = (item) => item?.iconUrl || item?.iconPath || DEFAULT_ITEM_ICON;

export default function InventoryScreen({ inventory, equipment, onBack, onEquip, onUnequip }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredInventory = inventory.filter(item => activeFilter === 'all' ? true : item.type === activeFilter);

  const getRarityColor = (rarity) => {
    const colors = { 'comum': 'from-stone-700 to-stone-600 border-stone-600', 'raro': 'from-blue-700 to-cyan-600 border-blue-600', 'épico': 'from-purple-700 to-violet-600 border-purple-600', 'lendário': 'from-amber-700 to-yellow-600 border-amber-600' };
    return colors[rarity] || colors['comum'];
  };

  const isEquippable = (item) => item.type && ['weapon', 'shield', 'armor'].includes(item.type);
  const isEquipped = (item) => item.type && equipment[item.type]?.id === item.id;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-black p-4 md:p-8" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 53, 15, 0.15) 0%, transparent 50%)' }}>
      <header className="flex flex-col mb-8">
        <GameButton onClick={onBack} variant="ghost" className="self-start mb-4 px-4 py-2 text-sm">← Voltar</GameButton>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h1 className="text-4xl font-bold text-amber-100 font-serif">Inventário</h1><p className="text-amber-500/60 font-serif">Gerencia os teus equipamentos e recursos</p></div>
          <div className="flex gap-2 bg-black/40 p-1 border border-amber-900/30 rounded-lg">{['all','weapon','shield','armor'].map(type => (<button key={type} onClick={() => setActiveFilter(type)} className={`text-[10px] md:text-xs px-4 py-2 font-serif transition-all rounded ${activeFilter===type ? 'bg-amber-700 text-amber-100 shadow-inner' : 'text-amber-700 hover:text-amber-500 hover:bg-amber-900/10'}`}>{type==='all'?'TUDO':type==='weapon'?'ARMAS':type==='shield'?'ESCUDOS':'ARMADURAS'}</button>))}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {['weapon','shield','armor'].map(slot => (
          <div key={slot} className="bg-black/60 border-2 border-amber-900/40 p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="w-10 h-10 flex items-center justify-center">
              {equipment[slot]?.iconUrl ? (
                <img src={getItemImg(equipment[slot])} alt={equipment[slot].name} className="w-8 h-8 object-contain" />
              ) : (
                <img src={DEFAULT_ITEM_ICON} alt={slot} className="w-8 h-8 object-contain opacity-40" />
              )}
            </div>
            <div className="flex-1"><p className="text-[10px] text-amber-700 font-bold uppercase">{slot}</p><p className="text-xs text-amber-100 font-serif truncate">{equipment[slot]?.name || 'Vazio'}</p></div>
            {equipment[slot] && <button onClick={() => onUnequip(slot)} className="bg-red-900/20 px-2 py-1 rounded text-[10px] text-red-500 hover:text-red-400 font-bold border border-red-900/50">REMOVER</button>}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><span className="h-px w-8 bg-amber-900"></span> Coleção de Itens</h2>
        {filteredInventory.length === 0 ? (<div className="text-center py-20 bg-black/20 border border-dashed border-amber-900/20"><p className="text-amber-800 font-serif italic">Nenhum item encontrado nesta categoria.</p></div>) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item, idx) => (
              <motion.div key={idx} layout onClick={() => setSelectedItem(item)} className={`bg-gradient-to-br ${getRarityColor(item.rarity)} p-6 border-2 shadow-lg hover:scale-[1.02] transition-all cursor-pointer relative`} style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                {isEquipped(item) && <div className="absolute top-2 right-2 bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded shadow-sm">ATIVO</div>}
                <div className="mb-4 flex justify-center">
                  <img src={getItemImg(item)} alt={item.name} className="w-16 h-16 object-contain" />
                </div>   
                  <h3 className="text-lg font-bold text-white text-center font-serif">{item.name}</h3>
                <div className="mt-3 flex justify-center gap-4 border-t border-white/10 pt-3">
                  {item.stats?.attack && <span className="text-red-200 text-xs font-bold">⚔️ +{item.stats.attack}</span>}
                  {item.stats?.defense && <span className="text-blue-200 text-xs font-bold">🛡️ +{item.stats.defense}</span>}
                  {item.stats?.spirit && <span className="text-purple-200 text-xs font-bold">✨ +{item.stats.spirit}</span>}
                  {item.stats?.healing && <span className="text-green-200 text-xs font-bold">💚 +{item.stats.healing}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border-4 border-amber-700 p-8 max-w-md w-full" onClick={e => e.stopPropagation()} style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <img src={getItemImg(selectedItem)} alt={selectedItem.name} className="w-24 h-24 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-amber-100 font-serif">{selectedItem.name}</h2>
                <p className="text-amber-500 text-xs mb-4 uppercase tracking-widest">{selectedItem.rarity}</p>
                <p className="text-slate-300 mb-6 font-serif italic">"{selectedItem.description}"</p>
                {selectedItem.story && <p className="text-slate-400 text-sm mb-6 font-serif italic leading-relaxed">{selectedItem.story}</p>}
                <div className="flex flex-col gap-3">
                  {isEquippable(selectedItem) && (!isEquipped(selectedItem) ? <GameButton onClick={() => { onEquip(selectedItem); setSelectedItem(null); }}>EQUIPAR</GameButton> : <GameButton onClick={() => { onUnequip(selectedItem.type); setSelectedItem(null); }} variant="secondary">REMOVER</GameButton>)}
                  <button onClick={() => setSelectedItem(null)} className="text-slate-500 hover:text-white text-xs uppercase font-bold tracking-tighter">Fechar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}