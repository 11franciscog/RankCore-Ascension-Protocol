import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_ITEM_ICON = '/resources/items/tile077.png';
const getItemImg = (item) => item?.iconUrl || item?.iconPath || DEFAULT_ITEM_ICON;

const SHOP_ITEMS = [
  {
    id: 'shop_sword_bronze',
    name: 'Espada de Bronze',
    description: 'Uma espada básica mas confiável',
    type: 'weapon',
    stats: { attack: 8 },
    price: 100,
    rarity: 'comum',
    story: 'Forjada por aprendizes, mas afiada o suficiente para a batalha.'
  },
  {
    id: 'shop_sword_steel',
    name: 'Espada de Aço',
    description: 'Uma lâmina de qualidade superior',
    type: 'weapon',
    stats: { attack: 15 },
    price: 250,
    rarity: 'raro',
    story: 'Temperada no fogo sagrado, corta através de armaduras como manteiga.'
  },
  {
    id: 'shop_shield_wood',
    name: 'Escudo de Madeira',
    description: 'Proteção básica contra ataques',
    type: 'shield',
    stats: { defense: 5 },
    price: 80,
    rarity: 'comum',
    story: 'Simples mas eficaz, salvou muitas vidas em batalha.'
  },
  {
    id: 'shop_shield_iron',
    name: 'Escudo de Ferro',
    description: 'Um escudo robusto e durável',
    type: 'shield',
    stats: { defense: 10 },
    price: 200,
    rarity: 'raro',
    story: 'Forjado com ferro puro das montanhas, quase indestrutível.'
  },
  {
    id: 'shop_armor_leather',
    name: 'Armadura de Couro',
    description: 'Proteção leve mas eficaz',
    type: 'armor',
    stats: { defense: 6 },
    price: 120,
    rarity: 'comum',
    story: 'Curtida com ervas especiais, flexível e resistente.'
  },
  {
    id: 'shop_armor_chain',
    name: 'Cota de Malha',
    description: 'Armadura de metal entrelaçado',
    type: 'armor',
    stats: { defense: 12 },
    price: 300,
    rarity: 'raro',
    story: 'Cada anel foi forjado individualmente por mestres ferreiros.'
  }
];

const GameButton = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 shadow-lg shadow-amber-900/50 border-2 border-amber-500/40',
    secondary: 'bg-black/80 hover:bg-black/60 text-amber-200 border-2 border-amber-700/50',
    ghost: 'bg-transparent hover:bg-amber-950/20 text-amber-300 border border-amber-800/30'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 font-medium tracking-wide
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${variants[variant]}
        ${className}
      `}
      style={{
        clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default function ShopScreen({ playerGold, inventory, onBuy, onBack }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // Novo Estado

  // Lógica de Filtragem
  const filteredShopItems = SHOP_ITEMS.filter(item => activeFilter === 'all' ? true : item.type === activeFilter);

  const getRarityColor = (rarity) => {
    const colors = {
      'comum': 'from-stone-700 to-stone-600 border-stone-600',
      'raro': 'from-blue-700 to-cyan-600 border-blue-600',
      'épico': 'from-purple-700 to-violet-600 border-purple-600',
      'lendário': 'from-amber-700 to-yellow-600 border-amber-600'
    };
    return colors[rarity] || colors['comum'];
  };

  const canAfford = (item) => playerGold >= item.price;
  const alreadyOwned = (item) => inventory.some(i => i.id === item.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black p-4 md:p-8"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(120, 53, 15, 0.15) 0%, transparent 50%)',
      }}
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <GameButton onClick={onBack} variant="ghost" className="mb-2 px-4 py-2 text-sm">
            ← Voltar
          </GameButton>
          <h1 className="text-3xl font-bold text-amber-100 font-serif">Loja</h1>
          <p className="text-amber-500/70 text-sm font-serif">Equipamentos de combate</p>
        </div>
        <div className="bg-black/60 border-2 border-amber-700/60 px-6 py-3"
             style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>
          <p className="text-amber-400 text-sm font-serif">Ouro</p>
          <p className="text-2xl font-bold text-amber-200">{playerGold}</p>
        </div>
      </header>

      <div className="flex justify-center gap-2 mb-8 bg-black/40 p-1 border border-amber-900/30 rounded-lg w-fit mx-auto">
        {['all', 'weapon', 'shield', 'armor'].map(type => (
          <button 
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`text-[10px] md:text-xs px-4 py-2 font-serif transition-all rounded ${
              activeFilter === type 
              ? 'bg-amber-700 text-amber-100 shadow-inner' 
              : 'text-amber-700 hover:text-amber-500 hover:bg-amber-900/10'
            }`}
          >
            {type === 'all' ? 'TUDO' : type === 'weapon' ? 'ARMAS' : type === 'shield' ? 'ESCUDOS' : 'ARMADURAS'}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShopItems.map((item, idx) => {
            const affordable = canAfford(item);
            const owned = alreadyOwned(item);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => !owned && setSelectedItem(item)}
                className={`
                  bg-gradient-to-br ${getRarityColor(item.rarity)}
                  p-6 border-2 shadow-lg shadow-black/60
                  transition-transform cursor-pointer
                  relative
                  ${owned ? 'opacity-50' : 'hover:scale-105'}
                `}
                style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {owned && (
                  <div className="absolute top-2 right-2 text-emerald-400 text-sm font-bold bg-black/70 px-2 py-1 rounded z-10">
                    COMPRADO
                  </div>
                )}
                <div className="mb-4 flex justify-center">
                  <img src={getItemImg(item)} alt={item.name} className="w-16 h-16 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-amber-50 mb-2 text-center relative z-10 font-serif" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{item.name}</h3>
                <p className="text-amber-100/90 text-sm text-center mb-3 relative z-10 font-serif">{item.description}</p>
                {item.stats && (
                  <div className="text-center mb-3 relative z-10">
                    {item.stats.attack && <p className="text-red-300 text-xs">⚔️ Ataque: +{item.stats.attack}</p>}
                    {item.stats.defense && <p className="text-blue-300 text-xs">🛡️ Defesa: +{item.stats.defense}</p>}
                  </div>
                )}
                <div className="text-center relative z-10">
                  <p className={`text-lg font-bold ${affordable ? 'text-amber-200' : 'text-red-400'}`}>
                    💰 {item.price} Ouro
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/90 border-4 border-amber-700/70 p-8 max-w-2xl w-full"
              style={{
                clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
              }}
            >
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <img src={getItemImg(selectedItem)} alt={selectedItem.name} className="w-24 h-24 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-amber-100 mb-2 font-serif">{selectedItem.name}</h2>
                <span className={`inline-block px-4 py-1 text-xs uppercase tracking-wider font-semibold bg-gradient-to-r ${getRarityColor(selectedItem.rarity)}`}>
                  {selectedItem.rarity}
                </span>
              </div>

              <p className="text-amber-100/80 text-center mb-6 font-serif">{selectedItem.description}</p>

              {selectedItem.stats && (
                <div className="mb-6">
                  <h3 className="text-amber-300 font-bold mb-2 font-serif text-center">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem.stats.attack && (
                      <div className="bg-red-900/20 border border-red-700/40 p-3 text-center">
                        <p className="text-red-300 text-2xl font-bold">+{selectedItem.stats.attack}</p>
                        <p className="text-red-200/70 text-xs">Ataque</p>
                      </div>
                    )}
                    {selectedItem.stats.defense && (
                      <div className="bg-blue-900/20 border border-blue-700/40 p-3 text-center">
                        <p className="text-blue-300 text-2xl font-bold">+{selectedItem.stats.defense}</p>
                        <p className="text-blue-200/70 text-xs">Defesa</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-6 text-center">
                <p className="text-2xl font-bold text-amber-200">💰 {selectedItem.price} Ouro</p>
                <p className="text-sm text-amber-500/70 mt-1">Tens: {playerGold} ouro</p>
              </div>

              <div className="flex gap-4 justify-center">
                <GameButton 
                  onClick={() => {
                    onBuy(selectedItem);
                    setSelectedItem(null);
                  }}
                  disabled={!canAfford(selectedItem)}
                >
                  {canAfford(selectedItem) ? 'Comprar' : 'Ouro Insuficiente'}
                </GameButton>
                <GameButton onClick={() => setSelectedItem(null)} variant="ghost">
                  Cancelar
                </GameButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}