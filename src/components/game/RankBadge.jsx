import React from 'react';

export default function RankBadge({ rank }) {
  const getRankColor = () => {
    const colors = {
      'Aprendiz': 'from-stone-700 to-stone-600 border-stone-500',
      'Novato': 'from-emerald-700 to-emerald-600 border-emerald-500',
      'Aspirante': 'from-blue-700 to-blue-600 border-blue-500',
      'Trainee': 'from-purple-700 to-purple-600 border-purple-500',
      'Recruta': 'from-amber-700 to-amber-600 border-amber-500',
      'Estudante': 'from-rose-700 to-rose-600 border-rose-500',
      'Explorador': 'from-violet-700 via-purple-600 to-pink-600 border-violet-500'
    };
    return colors[rank] || colors['Aprendiz'];
  };

  return (
    <div className={`inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br ${getRankColor()} border-2 shadow-lg shadow-black/50 font-bold text-amber-50 tracking-wider relative`}
         style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      <span className="text-lg relative z-10">{rank}</span>
    </div>
  );
}