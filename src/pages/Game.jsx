import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// RANKCORE: ASCENSION PROTOCOL (R:AP)
// Jogo Narrativo Interativo
// ============================================

// Dados do Jogo
const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'Ascendant'];
const XP_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];

const INTRO_SCENES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80',
    text: 'Há muito tempo, os deuses olhavam para os mortais como crianças... Crianças para serem guiadas, protegidas, ou destruídas conforme a sua vontade.',
    subtitle: 'Nas eras antigas...'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80',
    text: 'Mas entre os mortais, nasceu um guerreiro diferente. Forte demais para ser ignorado. Orgulhoso demais para se ajoelhar. Os deuses rejeitaram-no, temendo o que ele poderia tornar-se.',
    subtitle: 'O Rejeitado'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    text: 'Agora, sem bênçãos divinas, sem piedade no coração, ele ergue-se. Não para servir os deuses... mas para os desafiar. Este é o teu caminho. Este é o Protocolo da Ascensão.',
    subtitle: 'A Ascensão Começa'
  }
];

const MISSIONS = [
  {
    id: 'mission_1',
    title: 'O Primeiro Teste',
    description: 'Uma figura sombria bloqueia o teu caminho numa floresta antiga. Os seus olhos brilham com malícia.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    questions: [
      {
        text: 'Como te aproximas do inimigo?',
        choices: [
          {
            text: 'Atacar de frente com toda a força',
            consequence: 'damage',
            value: 15,
            resultText: 'O teu ataque direto é bloqueado. Sofres um golpe no ombro.'
          },
          {
            text: 'Aproximar-se cautelosamente',
            consequence: 'xp',
            value: 10,
            resultText: 'A tua cautela permite-te estudar melhor o inimigo.'
          }
        ]
      },
      {
        text: 'O inimigo prepara-se para atacar. O que fazes?',
        choices: [
          {
            text: 'Desviar e contra-atacar',
            consequence: 'xp',
            value: 15,
            resultText: 'O teu reflexo rápido surpreende o inimigo! Ganhas vantagem.'
          },
          {
            text: 'Bloquear com toda a tua força',
            consequence: 'damage',
            value: 10,
            resultText: 'O impacto do bloqueio abala os teus braços, mas resistes.'
          }
        ]
      },
      {
        text: 'É hora do golpe final. Como terminas a luta?',
        choices: [
          {
            text: 'Usar o ambiente a teu favor',
            consequence: 'item',
            value: { xp: 20, item: { id: 'iron_sword', name: 'Espada de Ferro', description: 'Uma lâmina simples mas eficaz', rarity: 'comum', type: 'weapon', stats: { attack: 5 }, story: 'Forjada nas profundezas da floresta antiga por um ferreiro esquecido. A lâmina ainda guarda o eco das batalhas passadas.' } },
            resultText: 'Empurras o inimigo contra uma árvore. Ele cai derrotado, deixando cair a sua espada!'
          },
          {
            text: 'Golpe direto e decisivo',
            consequence: 'xp',
            value: 25,
            resultText: 'Com um movimento preciso, derrotas o inimigo. Vitória conquistada!'
          }
        ]
      }
    ]
  },
  {
    id: 'mission_2',
    title: 'O Mercador Misterioso',
    description: 'Um mercador oferece-te uma poção estranha. "Bebe isto e ficarás mais forte... ou talvez não sobrevivas."',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80',
    questions: [
      {
        text: 'O mercador estende a poção. Qual é a tua primeira reação?',
        choices: [
          {
            text: 'Examinar a poção cuidadosamente',
            consequence: 'xp',
            value: 8,
            resultText: 'Observas o líquido brilhante. Parece perigoso, mas talvez valioso.'
          },
          {
            text: 'Perguntar sobre a origem',
            consequence: 'xp',
            value: 12,
            resultText: 'O mercador sorri misteriosamente. "Das profundezas esquecidas..."'
          }
        ]
      },
      {
        text: 'O mercador insiste: "Decide agora, viajante!" O que fazes?',
        choices: [
          {
            text: 'Aceitar e beber a poção',
            consequence: 'gamble',
            value: { damage: 25, xp: 35 },
            resultText: 'O líquido queima as tuas entranhas... mas o poder flui pelas tuas veias!'
          },
          {
            text: 'Recusar educadamente',
            consequence: 'xp',
            value: 10,
            resultText: 'A prudência é uma virtude. O mercador acena com a cabeça.'
          }
        ]
      },
      {
        text: 'Antes de partir, o mercador oferece algo mais. Aceitas?',
        choices: [
          {
            text: 'Aceitar o presente misterioso',
            consequence: 'item',
            value: { xp: 15, item: { id: 'leather_shield', name: 'Escudo de Couro', description: 'Um escudo reforçado com tiras de metal', rarity: 'comum', type: 'shield', stats: { defense: 3 }, story: 'Usado por guardas de caravanas há décadas. As marcas de batalha contam histórias de sobrevivência.' } },
            resultText: 'O mercador entrega-te um escudo resistente. "Isto te protegerá melhor."'
          },
          {
            text: 'Agradecer e seguir caminho',
            consequence: 'xp',
            value: 12,
            resultText: 'Partes com sabedoria e experiência adquirida.'
          }
        ]
      }
    ]
  },
  {
    id: 'mission_3',
    title: 'Eco dos Deuses',
    description: 'Uma voz divina ressoa na tua mente: "Ajoelha-te, mortal, e serás perdoado."',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    questions: [
      {
        text: 'A voz divina ecoa na tua mente. Como respondes?',
        choices: [
          {
            text: 'Desafiar a voz com coragem',
            consequence: 'xp',
            value: 20,
            resultText: '"Nunca me ajoelharei!" A tua determinação ressoa nos céus.'
          },
          {
            text: 'Ignorar completamente',
            consequence: 'xp',
            value: 10,
            resultText: 'O silêncio é a tua resposta. Continuas firme.'
          }
        ]
      },
      {
        text: 'A pressão divina aumenta. Sentes o peso do poder celestial.',
        choices: [
          {
            text: 'Resistir com toda a tua força',
            consequence: 'damage',
            value: 20,
            resultText: 'A pressão é esmagadora, mas não te quebra!'
          },
          {
            text: 'Canalizar a pressão como poder',
            consequence: 'gamble',
            value: { damage: 15, xp: 30 },
            resultText: 'A dor transforma-se em força! És mais resiliente agora.'
          }
        ]
      },
      {
        text: 'Um artefato divino materializa-se diante de ti. O que fazes?',
        choices: [
          {
            text: 'Reivindicar o artefato como teu',
            consequence: 'item',
            value: { xp: 35, item: { id: 'divine_armor', name: 'Armadura Celestial', description: 'Uma armadura imbuída com poder divino roubado', rarity: 'épico', type: 'armor', stats: { defense: 8 }, story: 'Forjada pelos próprios deuses e agora arrancada das suas mãos. Cada placa de metal canta com energia celestial roubada, um testemunho da tua audácia.' } },
            resultText: 'Tomas o artefato! Os deuses rugem de raiva, mas és vitorioso!'
          },
          {
            text: 'Absorver apenas a sua energia',
            consequence: 'xp',
            value: 45,
            resultText: 'Absorves o poder celestial. A tua essência fortalece-se!'
          }
        ]
      }
    ]
  }
];

// Componente: Logo do Jogo
const GameLogo = ({ size = 'large' }) => {
  const sizeClasses = {
    small: 'w-32 md:w-40',
    medium: 'w-48 md:w-64',
    large: 'w-64 md:w-96'
  };
  
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
};

// Componente: Botão Estilizado
const GameButton = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 shadow-lg shadow-amber-900/50 border-2 border-amber-500/40',
    secondary: 'bg-black/80 hover:bg-black/60 text-amber-200 border-2 border-amber-700/50',
    danger: 'bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-2 border-red-600/50',
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

// Componente: Barra de Vida
const HealthBar = ({ current, max }) => {
  const percentage = Math.max(0, (current / max) * 100);
  const getColor = () => {
    if (percentage > 60) return 'from-emerald-600 to-green-500';
    if (percentage > 30) return 'from-amber-600 to-yellow-500';
    return 'from-red-700 to-rose-600';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-amber-400/90 font-serif">Vida</span>
        <span className="text-amber-200 font-bold">{current}/{max}</span>
      </div>
      <div className="h-4 bg-black/80 overflow-hidden border-2 border-amber-700/60 relative"
           style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getColor()} relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

// Componente: Barra de XP
const XPBar = ({ current, threshold, rank }) => {
  const percentage = Math.min(100, (current / threshold) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-amber-400/90 font-serif">Experiência</span>
        <span className="text-amber-200 font-bold">{current}/{threshold} XP</span>
      </div>
      <div className="h-3 bg-black/80 overflow-hidden border-2 border-amber-700/60"
           style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};

// Componente: Badge de Rank
const RankBadge = ({ rank }) => {
  const getRankColor = () => {
    const colors = {
      'E': 'from-stone-700 to-stone-600 border-stone-500',
      'D': 'from-emerald-700 to-emerald-600 border-emerald-500',
      'C': 'from-blue-700 to-blue-600 border-blue-500',
      'B': 'from-purple-700 to-purple-600 border-purple-500',
      'A': 'from-amber-700 to-amber-600 border-amber-500',
      'S': 'from-rose-700 to-rose-600 border-rose-500',
      'Ascendant': 'from-violet-700 via-purple-600 to-pink-600 border-violet-500'
    };
    return colors[rank] || colors['E'];
  };

  return (
    <div 
      className={`
        inline-flex items-center justify-center
        px-4 py-2
        bg-gradient-to-br ${getRankColor()}
        border-2 shadow-lg shadow-black/50
        font-bold text-amber-50 tracking-wider
        relative
      `}
      style={{
        clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      <span className="text-xs mr-1 opacity-70 relative z-10">RANK</span>
      <span className="text-lg relative z-10">{rank}</span>
    </div>
  );
};

// Componente: Ecrã de Menu Principal
const MainMenu = ({ onStart, onContinue, onCredits, hasSave }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-amber-950/95" />
      
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center">
        <GameLogo />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-amber-300/60 mt-6 mb-12 max-w-md mx-auto text-sm md:text-base font-serif"
        >
          Um guerreiro rejeitado pelos deuses. Um caminho de poder e vingança.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-4 items-center"
        >
          <GameButton onClick={onStart} className="w-64">
            Iniciar Jornada
          </GameButton>
          
          <GameButton 
            onClick={onContinue} 
            variant="secondary" 
            className="w-64"
            disabled={!hasSave}
          >
            Continuar {!hasSave && '(Sem dados)'}
          </GameButton>
          
          <GameButton onClick={onCredits} variant="ghost" className="w-64">
            Créditos
          </GameButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-amber-600/40 text-xs mt-16 font-serif"
        >
          v1.0 • RankCore: Ascension Protocol
        </motion.p>
      </div>
    </motion.div>
  );
};

// Componente: Ecrã de Introdução
const IntroScene = ({ scene, onNext, isLast }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-end p-6 pb-20"
      style={{
        backgroundImage: `url(${scene.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      
      {/* Conteúdo da cena */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-2xl text-center"
      >
        <p className="text-amber-400/70 text-sm tracking-widest mb-4 uppercase font-serif">
          {scene.subtitle}
        </p>
        
        <p className="text-xl md:text-2xl text-amber-100 leading-relaxed mb-12 font-serif">
          {scene.text}
        </p>
        
        <GameButton onClick={onNext}>
          {isLast ? 'Começar Jornada' : 'Continuar'}
        </GameButton>
      </motion.div>

      {/* Indicador de cena */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {INTRO_SCENES.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 transition-all ${
              idx === scene.id - 1 
                ? 'bg-amber-500 w-6' 
                : 'bg-amber-600/30'
            }`}
            style={{ clipPath: 'polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)' }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Componente: Hub Principal do Jogador
const PlayerHub = ({ playerData, onMissions, onInventory, onSave }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-4 md:p-8"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <GameLogo size="small" />
        <div className="flex items-center gap-4">
          <RankBadge rank={playerData.rank} />
          <GameButton onClick={onSave} variant="ghost" className="text-sm px-4 py-2">
            💾 Guardar
          </GameButton>
        </div>
      </header>

      {/* Painel do Jogador */}
      <div className="max-w-4xl mx-auto">
        {/* Card Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-sm p-6 md:p-8 border-4 border-amber-800/60 mb-6 relative"
          style={{
            clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
            boxShadow: 'inset 0 0 30px rgba(120, 53, 15, 0.3), 0 0 50px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Cantos decorativos */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/80" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-600/80" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-600/80" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/80" />
          {/* Info do Jogador */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            {/* Avatar */}
            <div 
              className="w-20 h-20 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-3xl font-bold text-amber-100 shadow-lg shadow-black/50 border-2 border-amber-600/60"
              style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
            >
              {playerData.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-amber-100 mb-1 font-serif">{playerData.name}</h2>
              <p className="text-amber-500/70 text-sm font-serif">Guerreiro Rejeitado • Nível {Math.floor(playerData.xp / 50) + 1}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:gap-6">
            <XPBar 
              current={playerData.xp} 
              threshold={XP_THRESHOLDS[RANKS.indexOf(playerData.rank) + 1] || 9999}
              rank={playerData.rank}
            />
          </div>

          {/* Stats secundários */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-amber-800/40">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-200">{playerData.missionsCompleted}</p>
              <p className="text-xs text-amber-500/70 font-serif">Missões</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-200">{playerData.victories}</p>
              <p className="text-xs text-amber-500/70 font-serif">Vitórias</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-200">{playerData.gold}</p>
              <p className="text-xs text-amber-500/70 font-serif">Ouro</p>
            </div>
          </div>
        </motion.div>

        {/* Menu de Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMissions}
            className="bg-black/70 backdrop-blur-sm p-6 border-2 border-amber-700/60 transition-all group relative overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
            <div className="text-4xl mb-3 relative z-10">⚔️</div>
            <h3 className="text-lg font-semibold text-amber-100 mb-1 relative z-10 font-serif">Missões</h3>
            <p className="text-sm text-amber-500/70 relative z-10 font-serif">Desafiar o destino</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInventory}
            className="bg-black/70 backdrop-blur-sm p-6 border-2 border-amber-700/60 transition-all group relative overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent" />
            <div className="text-4xl mb-3 relative z-10">🎒</div>
            <h3 className="text-lg font-semibold text-amber-100 mb-1 relative z-10 font-serif">Inventário</h3>
            <p className="text-sm text-amber-500/70 relative z-10 font-serif">{playerData.inventory.length} {playerData.inventory.length === 1 ? 'item' : 'itens'}</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente: Lista de Missões
const MissionList = ({ missions, completedMissions, missionCooldowns, onSelectMission, onBack }) => {
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
          <h1 className="text-3xl font-bold text-amber-100 font-serif">Missões</h1>
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
            <motion.button
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: isDisabled ? 1 : 1.01 }}
              onClick={() => !isDisabled && onSelectMission(mission)}
              disabled={isDisabled}
              className={`
                relative overflow-hidden p-6 text-left
                border-2 transition-all
                ${isCompleted 
                  ? 'bg-black/30 border-emerald-700/50 opacity-60 cursor-not-allowed' 
                  : isLocked
                  ? 'bg-black/30 border-stone-700/50 opacity-40 cursor-not-allowed'
                  : isOnCooldown
                  ? 'bg-black/30 border-red-700/50 opacity-50 cursor-not-allowed'
                  : 'bg-black/60 border-amber-700/60 hover:border-amber-600/80'
                }
              `}
              style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 text-emerald-400 text-2xl">✓</div>
              )}
              {isLocked && (
                <div className="absolute top-4 right-4 text-stone-400 text-2xl">🔒</div>
              )}
              {isOnCooldown && (
                <div className="absolute top-4 right-4 text-red-400 text-xs">{cooldownText}</div>
              )}
              
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 bg-amber-800/40 border border-amber-700/60 flex items-center justify-center text-xl"
                  style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
                >
                  ⚔️
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-100 mb-1 font-serif">{mission.title}</h3>
                  <p className="text-sm text-amber-500/70 line-clamp-2 font-serif">{mission.description}</p>
                  {isLocked && (
                    <p className="text-xs text-stone-400 mt-2 font-serif">Completa a missão anterior primeiro</p>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}

        {missions.length === completedMissions.length && (
          <div className="text-center py-8">
            <p className="text-amber-400/70 font-serif">Todas as missões completadas!</p>
            <p className="text-sm text-amber-500/50 mt-2 font-serif">Mais desafios em breve...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Componente: Ecrã de Missão
const MissionScreen = ({ mission, onChoice, onFail, playerHealth, playerMaxHealth }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [missionStarted, setMissionStarted] = useState(false);
  const [tempHealth, setTempHealth] = useState(playerHealth);

  const currentQuestion = mission.questions[currentQuestionIndex];

  const handleChoice = (choice) => {
    setShowResult(choice);
    
    // Calculate temporary health
    let newHealth = tempHealth;
    if (choice.consequence === 'damage') {
      newHealth = Math.max(0, tempHealth - choice.value);
    } else if (choice.consequence === 'gamble') {
      newHealth = Math.max(0, tempHealth - choice.value.damage);
    }
    setTempHealth(newHealth);
  };

  const confirmChoice = () => {
    // Check if health reached 0
    if (tempHealth <= 0) {
      onFail(mission.id);
      return;
    }

    // If there are more questions, move to next
    if (currentQuestionIndex < mission.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(null);
    } else {
      // Mission complete
      onChoice(showResult, mission.questions.map((_, idx) => 
        idx < currentQuestionIndex ? null : showResult
      ));
      setShowResult(null);
    }
  };

  if (!missionStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen relative flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage: `url(${mission.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-2xl bg-black/80 backdrop-blur-sm p-8 border-4 border-amber-800/70"
          style={{
            clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
          }}
        >
          <h2 className="text-3xl font-bold text-amber-100 mb-4 font-serif text-center">{mission.title}</h2>
          <p className="text-amber-200/80 leading-relaxed mb-8 font-serif text-center">{mission.description}</p>
          
          <div className="mb-6 p-4 bg-amber-900/30 border-2 border-amber-700/50 rounded">
            <p className="text-amber-300 text-sm font-serif text-center">
              Esta missão contém {mission.questions.length} desafios. Prepara-te!
            </p>
          </div>

          <div className="flex justify-center">
            <GameButton onClick={() => setMissionStarted(true)}>
              Iniciar Missão
            </GameButton>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: `url(${mission.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />
      
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-amber-400 text-sm font-serif">
            Pergunta {currentQuestionIndex + 1} de {mission.questions.length}
          </div>
          <div className="w-64">
            <HealthBar current={tempHealth} max={playerMaxHealth} />
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-sm p-6 md:p-8 border-4 border-amber-800/70 relative"
            style={{
              clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)',
              boxShadow: 'inset 0 0 30px rgba(120, 53, 15, 0.3), 0 0 50px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/80" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-600/80" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-600/80" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/80" />
            
            <h2 className="text-xl font-bold text-amber-100 mb-6 font-serif">{currentQuestion.text}</h2>

            {!showResult ? (
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full p-4 bg-black/70 border-2 border-amber-700/60
                             hover:border-amber-600/80 hover:bg-black/50
                             text-left transition-all relative"
                    style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                  >
                    <span className="text-amber-400 font-bold">{idx + 1}.</span>
                    <span className="text-amber-100 ml-2 font-serif">{choice.text}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-amber-200/80 leading-relaxed mb-6 font-serif">{showResult.resultText}</p>
                
                <div className="mb-6 py-4 px-6 bg-black/60 border-2 border-amber-700/60 inline-block"
                     style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>
                  {showResult.consequence === 'damage' && (
                    <p className="text-red-400 font-medium">-{showResult.value} Vida</p>
                  )}
                  {showResult.consequence === 'xp' && (
                    <p className="text-emerald-400 font-medium">+{showResult.value} XP</p>
                  )}
                  {showResult.consequence === 'gamble' && (
                    <div>
                      <p className="text-red-400 font-medium">-{showResult.value.damage} Vida</p>
                      <p className="text-emerald-400 font-medium">+{showResult.value.xp} XP</p>
                    </div>
                  )}
                  {showResult.consequence === 'item' && (
                    <div>
                      <p className="text-emerald-400 font-medium">+{showResult.value.xp} XP</p>
                      <p className="text-amber-400 font-medium mt-2">📜 Item obtido: {showResult.value.item.name}</p>
                    </div>
                  )}
                </div>

                <GameButton onClick={confirmChoice}>
                  {currentQuestionIndex < mission.questions.length - 1 ? 'Próxima Pergunta' : 'Concluir Missão'}
                </GameButton>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Componente: Ecrã de Derrota
const DefeatScreen = ({ onRestart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">💀</div>
        <h1 className="text-4xl font-bold text-red-600 mb-4 font-serif">Derrotado</h1>
        <p className="text-amber-400/60 mb-8 max-w-md font-serif">
          O teu corpo cai, mas o teu espírito persiste. A morte é apenas outro começo para aqueles que se recusam a desistir.
        </p>
        <GameButton onClick={onRestart} variant="danger">
          Tentar Novamente
        </GameButton>
      </motion.div>
    </motion.div>
  );
};

// Componente: Inventário
const InventoryScreen = ({ inventory, equipment, onBack, onEquip, onUnequip }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState('items'); // 'items' or 'equipment'

  const getRarityColor = (rarity) => {
    const colors = {
      'comum': 'from-stone-700 to-stone-600 border-stone-600',
      'raro': 'from-blue-700 to-cyan-600 border-blue-600',
      'épico': 'from-purple-700 to-violet-600 border-purple-600',
      'lendário': 'from-amber-700 to-yellow-600 border-amber-600'
    };
    return colors[rarity] || colors['comum'];
  };

  const getItemIcon = (item) => {
    if (item.type === 'weapon') return '⚔️';
    if (item.type === 'shield') return '🛡️';
    if (item.type === 'armor') return '🦾';
    return '📜';
  };

  const isEquippable = (item) => {
    return item.type && ['weapon', 'shield', 'armor'].includes(item.type);
  };

  const isEquipped = (item) => {
    if (!item.type) return false;
    return equipment[item.type]?.id === item.id;
  };

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
          <h1 className="text-3xl font-bold text-amber-100 font-serif">Inventário</h1>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setView('items')}
              className={`px-4 py-2 font-serif transition-all ${
                view === 'items' 
                  ? 'text-amber-100 border-b-2 border-amber-500' 
                  : 'text-amber-500/70 hover:text-amber-400'
              }`}
            >
              Itens ({inventory.length})
            </button>
            <button
              onClick={() => setView('equipment')}
              className={`px-4 py-2 font-serif transition-all ${
                view === 'equipment' 
                  ? 'text-amber-100 border-b-2 border-amber-500' 
                  : 'text-amber-500/70 hover:text-amber-400'
              }`}
            >
              Equipamento
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        {view === 'items' && (
          <>
            {inventory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🎒</div>
                <p className="text-amber-300/70 text-lg font-serif">O teu inventário está vazio</p>
                <p className="text-amber-500/50 text-sm mt-2 font-serif">Completa missões para obter itens</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                    className={`
                      bg-gradient-to-br ${getRarityColor(item.rarity)}
                      p-6 border-2 shadow-lg shadow-black/60
                      hover:scale-105 transition-transform cursor-pointer
                      relative
                      ${selectedItem?.id === item.id ? 'ring-4 ring-amber-400' : ''}
                    `}
                    style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    {isEquipped(item) && (
                      <div className="absolute top-2 right-2 text-emerald-400 text-sm font-bold bg-black/70 px-2 py-1 rounded z-10">
                        EQUIPADO
                      </div>
                    )}
                    <div className="text-5xl mb-4 text-center relative z-10">{getItemIcon(item)}</div>
                    <h3 className="text-lg font-bold text-amber-50 mb-2 text-center relative z-10 font-serif" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{item.name}</h3>
                    <p className="text-amber-100/90 text-sm text-center mb-3 relative z-10 font-serif">{item.description}</p>
                    {item.stats && (
                      <div className="text-center mb-3 relative z-10">
                        {item.stats.attack && <p className="text-red-300 text-xs">⚔️ Ataque: +{item.stats.attack}</p>}
                        {item.stats.defense && <p className="text-blue-300 text-xs">🛡️ Defesa: +{item.stats.defense}</p>}
                      </div>
                    )}
                    <div className="text-center relative z-10">
                      <span className="text-xs uppercase tracking-wider text-amber-200/70 font-semibold">
                        {item.rarity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Item Details Modal */}
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
                      <div className="text-6xl mb-4">{getItemIcon(selectedItem)}</div>
                      <h2 className="text-2xl font-bold text-amber-100 mb-2 font-serif">{selectedItem.name}</h2>
                      <span className={`inline-block px-4 py-1 text-xs uppercase tracking-wider font-semibold bg-gradient-to-r ${getRarityColor(selectedItem.rarity)}`}>
                        {selectedItem.rarity}
                      </span>
                    </div>

                    {selectedItem.story && (
                      <div className="mb-6 p-4 bg-amber-900/20 border-2 border-amber-700/40">
                        <h3 className="text-amber-300 font-bold mb-2 font-serif">História</h3>
                        <p className="text-amber-100/80 text-sm leading-relaxed font-serif italic">
                          {selectedItem.story}
                        </p>
                      </div>
                    )}

                    {selectedItem.stats && (
                      <div className="mb-6">
                        <h3 className="text-amber-300 font-bold mb-2 font-serif">Estatísticas</h3>
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

                    <div className="flex gap-4 justify-center">
                      {isEquippable(selectedItem) && (
                        <>
                          {!isEquipped(selectedItem) ? (
                            <GameButton onClick={() => {
                              onEquip(selectedItem);
                              setSelectedItem(null);
                            }}>
                              Equipar
                            </GameButton>
                          ) : (
                            <GameButton onClick={() => {
                              onUnequip(selectedItem.type);
                              setSelectedItem(null);
                            }} variant="secondary">
                              Desequipar
                            </GameButton>
                          )}
                        </>
                      )}
                      <GameButton onClick={() => setSelectedItem(null)} variant="ghost">
                        Fechar
                      </GameButton>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {view === 'equipment' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weapon Slot */}
              <div className="bg-black/60 border-2 border-amber-700/60 p-6" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
                <h3 className="text-amber-300 font-bold mb-4 text-center font-serif">Arma</h3>
                {equipment.weapon ? (
                  <div className="text-center">
                    <div className="text-5xl mb-3">⚔️</div>
                    <h4 className="text-amber-100 font-bold font-serif">{equipment.weapon.name}</h4>
                    <p className="text-red-300 text-sm mt-2">Ataque: +{equipment.weapon.stats.attack}</p>
                  </div>
                ) : (
                  <div className="text-center text-amber-500/50 py-8">
                    <div className="text-4xl mb-2">⚔️</div>
                    <p className="text-sm font-serif">Sem arma</p>
                  </div>
                )}
              </div>

              {/* Shield Slot */}
              <div className="bg-black/60 border-2 border-amber-700/60 p-6" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
                <h3 className="text-amber-300 font-bold mb-4 text-center font-serif">Escudo</h3>
                {equipment.shield ? (
                  <div className="text-center">
                    <div className="text-5xl mb-3">🛡️</div>
                    <h4 className="text-amber-100 font-bold font-serif">{equipment.shield.name}</h4>
                    <p className="text-blue-300 text-sm mt-2">Defesa: +{equipment.shield.stats.defense}</p>
                  </div>
                ) : (
                  <div className="text-center text-amber-500/50 py-8">
                    <div className="text-4xl mb-2">🛡️</div>
                    <p className="text-sm font-serif">Sem escudo</p>
                  </div>
                )}
              </div>

              {/* Armor Slot */}
              <div className="bg-black/60 border-2 border-amber-700/60 p-6" style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}>
                <h3 className="text-amber-300 font-bold mb-4 text-center font-serif">Armadura</h3>
                {equipment.armor ? (
                  <div className="text-center">
                    <div className="text-5xl mb-3">🦾</div>
                    <h4 className="text-amber-100 font-bold font-serif">{equipment.armor.name}</h4>
                    <p className="text-blue-300 text-sm mt-2">Defesa: +{equipment.armor.stats.defense}</p>
                  </div>
                ) : (
                  <div className="text-center text-amber-500/50 py-8">
                    <div className="text-4xl mb-2">🦾</div>
                    <p className="text-sm font-serif">Sem armadura</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Componente: Ecrã de Créditos
const CreditsScreen = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black flex flex-col items-center justify-center p-6"
    >
      <GameLogo size="medium" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center max-w-md"
      >
        <h2 className="text-xl font-semibold text-amber-200 mb-6 font-serif">Créditos</h2>
        
        <div className="space-y-4 text-amber-300/70 font-serif">
          <p><span className="text-amber-200">Conceito & Design:</span> RankCore Studios</p>
          <p><span className="text-amber-200">Desenvolvimento:</span> Base44</p>
          <p><span className="text-amber-200">Narrativa:</span> O Guerreiro Rejeitado</p>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-700/30">
          <p className="text-sm text-amber-500/60 mb-6 font-serif">
            Um jogo sobre coragem, desafio e ascensão.
          </p>
          
          <GameButton onClick={onBack} variant="secondary">
            Voltar ao Menu
          </GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL DO JOGO
// ============================================
export default function Game() {
  // Estados do jogo
  const [gameState, setGameState] = useState('menu'); // menu, intro, hub, missions, mission, defeat, credits, inventory
  const [introScene, setIntroScene] = useState(0);
  const [currentMission, setCurrentMission] = useState(null);
  
  // Dados do jogador
  const [playerData, setPlayerData] = useState({
    name: 'Guerreiro',
    health: 100,
    maxHealth: 100,
    xp: 0,
    rank: 'E',
    gold: 50,
    missionsCompleted: 0,
    victories: 0,
    completedMissions: [],
    inventory: [],
    equipment: {
      weapon: null,
      shield: null,
      armor: null
    },
    missionCooldowns: {}
  });

  // Verificar se há save guardado
  const [hasSave, setHasSave] = useState(false);

  // Carregar dados guardados ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('rankcore_save');
    if (savedData) {
      setHasSave(true);
    }
  }, []);

  // Função para guardar progresso
  const saveGame = useCallback(() => {
    localStorage.setItem('rankcore_save', JSON.stringify(playerData));
    setHasSave(true);
  }, [playerData]);

  // Função para carregar progresso
  const loadGame = useCallback(() => {
    const savedData = localStorage.getItem('rankcore_save');
    if (savedData) {
      setPlayerData(JSON.parse(savedData));
      setGameState('hub');
    }
  }, []);

  // Função para verificar e atualizar rank
  const checkRankUp = useCallback((newXP) => {
    const currentRankIndex = RANKS.indexOf(playerData.rank);
    const nextThreshold = XP_THRESHOLDS[currentRankIndex + 1];
    
    if (nextThreshold && newXP >= nextThreshold) {
      return RANKS[currentRankIndex + 1];
    }
    return playerData.rank;
  }, [playerData.rank]);

  // Processar escolha de missão
  const handleMissionChoice = useCallback((lastChoice, allChoices) => {
    let newHealth = playerData.health;
    let newXP = playerData.xp;
    let newInventory = [...playerData.inventory];

    // Process all choices from the mission
    const allMissionChoices = currentMission.questions.map((q, idx) => {
      if (idx === currentMission.questions.length - 1) return lastChoice;
      return null; // We'll need to track all choices if needed
    });

    // For now, just process the last choice since we're tracking cumulative effects
    switch (lastChoice.consequence) {
      case 'damage':
        newHealth = Math.max(0, playerData.health - lastChoice.value);
        break;
      case 'xp':
        newXP = playerData.xp + lastChoice.value;
        break;
      case 'gamble':
        newHealth = Math.max(0, playerData.health - lastChoice.value.damage);
        newXP = playerData.xp + lastChoice.value.xp;
        break;
      case 'item':
        newXP = playerData.xp + lastChoice.value.xp;
        if (newHealth > 0) {
          newInventory.push(lastChoice.value.item);
        }
        break;
    }

    const newRank = checkRankUp(newXP);
    const newCompletedMissions = [...playerData.completedMissions, currentMission.id];

    setPlayerData(prev => ({
      ...prev,
      health: newHealth,
      xp: newXP,
      rank: newRank,
      inventory: newInventory,
      missionsCompleted: prev.missionsCompleted + 1,
      victories: lastChoice.consequence === 'xp' || lastChoice.consequence === 'item' ? prev.victories + 1 : prev.victories,
      completedMissions: newCompletedMissions
    }));

    setGameState('missions');
    setCurrentMission(null);
  }, [playerData, currentMission, checkRankUp]);

  // Handle mission failure (health reached 0)
  const handleMissionFail = useCallback((missionId) => {
    const cooldownEnd = Date.now() + (60 * 60 * 1000); // 1 hour from now
    
    setPlayerData(prev => ({
      ...prev,
      health: prev.maxHealth, // Reset health
      missionCooldowns: {
        ...prev.missionCooldowns,
        [missionId]: cooldownEnd
      }
    }));

    setGameState('missions');
    setCurrentMission(null);
  }, []);

  // Equipar item
  const equipItem = useCallback((item) => {
    setPlayerData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [item.type]: item
      }
    }));
  }, []);

  // Desequipar item
  const unequipItem = useCallback((type) => {
    setPlayerData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [type]: null
      }
    }));
  }, []);

  // Reiniciar jogo
  const restartGame = useCallback(() => {
    setPlayerData({
      name: 'Guerreiro',
      health: 100,
      maxHealth: 100,
      xp: 0,
      rank: 'E',
      gold: 50,
      missionsCompleted: 0,
      victories: 0,
      completedMissions: [],
      inventory: [],
      equipment: {
        weapon: null,
        shield: null,
        armor: null
      },
      missionCooldowns: {}
    });
    setGameState('hub');
  }, []);

  // Avançar introdução
  const handleIntroNext = useCallback(() => {
    if (introScene < INTRO_SCENES.length - 1) {
      setIntroScene(prev => prev + 1);
    } else {
      setGameState('hub');
      setIntroScene(0);
    }
  }, [introScene]);

  // Renderização baseada no estado
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <MainMenu
            key="menu"
            onStart={() => setGameState('intro')}
            onContinue={loadGame}
            onCredits={() => setGameState('credits')}
            hasSave={hasSave}
          />
        )}

        {gameState === 'intro' && (
          <IntroScene
            key={`intro-${introScene}`}
            scene={INTRO_SCENES[introScene]}
            onNext={handleIntroNext}
            isLast={introScene === INTRO_SCENES.length - 1}
          />
        )}

        {gameState === 'hub' && (
          <PlayerHub
            key="hub"
            playerData={playerData}
            onMissions={() => setGameState('missions')}
            onInventory={() => setGameState('inventory')}
            onSave={saveGame}
          />
        )}

        {gameState === 'missions' && (
          <MissionList
            key="missions"
            missions={MISSIONS}
            completedMissions={playerData.completedMissions}
            missionCooldowns={playerData.missionCooldowns}
            onSelectMission={(mission) => {
              setCurrentMission(mission);
              setGameState('mission');
            }}
            onBack={() => setGameState('hub')}
          />
        )}

        {gameState === 'mission' && currentMission && (
          <MissionScreen
            key="mission"
            mission={currentMission}
            playerHealth={playerData.health}
            playerMaxHealth={playerData.maxHealth}
            onChoice={handleMissionChoice}
            onFail={handleMissionFail}
          />
        )}

        {gameState === 'inventory' && (
          <InventoryScreen
            key="inventory"
            inventory={playerData.inventory}
            equipment={playerData.equipment}
            onBack={() => setGameState('hub')}
            onEquip={equipItem}
            onUnequip={unequipItem}
          />
        )}

        {gameState === 'defeat' && (
          <DefeatScreen
            key="defeat"
            onRestart={restartGame}
          />
        )}

        {gameState === 'credits' && (
          <CreditsScreen
            key="credits"
            onBack={() => setGameState('menu')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}