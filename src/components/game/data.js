// Dados do Jogo
export const RANKS = ['Aprendiz', 'Novato', 'Aspirante', 'Trainee', 'Recruta', 'Estudante', 'Explorador'];
export const XP_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200];

// HISTÓRIA INICIAL - Cenas de Introdução
export const INTRO_SCENES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80',
    text: 'Há muito tempo, num mundo ainda jovem, quando os deuses caminhavam lado a lado com os homens e as escolhas moldavam os próprios céus, muitos guerreiros caíram.',
    subtitle: 'A Origem do RankCore'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80',
    text: 'Alguns sucumbiram em batalha, outros tropeçaram em decisões difíceis, e outros simplesmente não estavam prontos quando foram chamados a provar o seu valor. Eram os esquecidos.',
    subtitle: 'Os Rejeitados'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    text: 'Mas nem todos aceitaram esse veredito. Recusaram o silêncio e a resignação. E foi na união desses espíritos, feridos mas inquebráveis, que algo nasceu. Chamaram-lhe RankCore.',
    subtitle: 'O Pacto'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80',
    text: 'Não era um lugar, mas um ritual. Um pacto entre os que foram deixados para trás e os próprios deuses. Um caminho de desafios espalhado pelas terras mais antigas.',
    subtitle: 'O Ritual'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80',
    text: 'Cada passo dado é um voto de fé. Cada escolha feita é um espelho da alma. As provas do RankCore não existem para ver quem pode matar... mas para revelar quem merece continuar.',
    subtitle: 'O Caminho'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    text: 'Não te perguntamos o quão forte és. Queremos saber quem és quando ninguém está a ver. Ergue-te… e mostra ao mundo porque ainda estás aqui.',
    subtitle: 'A Ascensão Começa'
  }
];

// CAPÍTULOS E MISSÕES
export const CHAPTERS = [
  {
    id: 'chapter_1',
    number: 1,
    title: 'O Chamado',
    subtitle: 'Caminho do Despertar',
    description: 'Ativa o Pilar de Hir’Skaal e prova o teu valor perante o Core.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    storyIntro: 'Despertas no topo de uma colina esquecida. Não há inimigos à espreita — apenas o reflexo do teu próprio ser. Explora, observa, decide. Encontra o Pilar de Hir’Skaal e, se fores digno, ele despertará.',
    missions: [
      {
        id: 'm1_1',
        title: 'O Início da Trilha',
        description: 'Enfrenta os caminhos enevoados e as primeiras armadilhas da colina.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
        questions: [
          {
            text: 'Encontras três caminhos: raízes, pedras flutuantes ou silêncio. Um botão dourado brilha na relva. O que fazes?',
            choices: [
              { text: 'Segues pelas pedras flutuantes', consequence: 'xp', value: 12, resultText: 'Cruzaste com equilíbrio. Este era o caminho dos primeiros viajantes.' },
              { text: 'Pressionas o botão dourado', consequence: 'damage', value: 10, resultText: 'Um dardo dispara e fere-te no ombro. Era uma armadilha antiga.' },
              { text: 'Caminho das raízes escuras', consequence: 'xp', value: 8, resultText: 'As raízes afastam-se ao passar. Há dignidade neste trilho.' },
              { text: 'Caminho silencioso', consequence: 'gamble', value: { damage: 5, xp: 6 }, resultText: 'Perdes a noção do tempo. Saíste com a mente confusa.' }
            ]
          },
          {
            text: 'Um nevoeiro espesso surge. Como manténs o rumo?',
            choices: [
              { text: 'Confiar nos instintos mágicos', consequence: 'xp', value: 10, resultText: 'A tua essência guia-te através da bruma.' },
              { text: 'Correr às cegas', consequence: 'damage', value: 5, resultText: 'Tropeças em pedras afiadas e magoas-te.' },
              { text: 'Usar uma tocha improvisada', consequence: 'item', value: { xp: 5, item: { id: 'old_map', name: 'Mapa Velho', rarity: 'comum', type: 'item', description: 'Ajuda a encontrar caminhos' } }, resultText: 'Encontras um mapa antigo caído entre os arbustos.' }
            ]
          },
          {
            text: 'Uma criatura pequena e ferida bloqueia o passo. O que fazes?',
            choices: [
              { text: 'Ajudar a criatura', consequence: 'xp', value: 15, resultText: 'Ela foge, mas deixa uma energia calorosa na tua alma.' },
              { text: 'Espantar para longe', consequence: 'xp', value: 5, resultText: 'Segues caminho sem distrações.' }
            ]
          }
        ]
      },
      {
        id: 'm1_2',
        title: 'O Espelho do Vazio',
        description: 'Lida com a raiva e as visões que o espelho milenar projeta.',
        image: 'https://images.unsplash.com/photo-1519074063912-ad25b5ce4020?w=1200&q=80',
        questions: [
          {
            text: 'Vês-te no espelho com raiva nos olhos. Há um símbolo azul na moldura. O que fazes?',
            choices: [
              { text: 'Observar a própria raiva', consequence: 'xp', value: 12, resultText: 'A raiva desaparece. O espelho reflete serenidade e a porta abre-se.' },
              { text: 'Tocar o símbolo azul', consequence: 'xp', value: 8, resultText: 'Uma voz diz: "Reconhecer-se é o primeiro passo." Passagem aberta.' },
              { text: 'Quebrar o vidro', consequence: 'damage', value: 15, resultText: 'O vidro corta-te profundamente. O símbolo brilha em vermelho.' }
            ]
          },
          {
            text: 'O espelho começa a sussurrar os teus medos. Como reages?',
            choices: [
              { text: 'Gritar de volta', consequence: 'damage', value: 5, resultText: 'A tua própria voz fere os teus ouvidos como um eco divino.' },
              { text: 'Meditar em silêncio', consequence: 'xp', value: 10, resultText: 'Os sussurros tornam-se brisa. Ganhas clareza mental.' },
              { text: 'Procurar uma saída rápida', consequence: 'xp', value: 5, resultText: 'Consegues sair antes que a visão te consuma.' }
            ]
          }
        ]
      },
      {
        id: 'm1_3',
        title: 'A Encruzilhada Moral',
        description: 'Decide o destino das figuras estáticas que barram o teu avanço.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
        questions: [
          {
            text: 'Três figuras: uma sofre, uma dorme, uma sorri maliciosamente. Quem escolhes ajudar?',
            choices: [
              { text: 'O que está a sofrer', consequence: 'xp', value: 12, resultText: 'Ele transforma-se em luz e abre o caminho.' },
              { text: 'O que está a sorrir', consequence: 'damage', value: 20, resultText: 'Era uma ilusão. Ele morde-te ao ser tocado.' },
              { text: 'O que dorme em paz', consequence: 'xp', value: 6, resultText: 'Ele desaparece, mas nada acontece de imediato.' },
              { text: 'Atravessar sozinho pela lateral', consequence: 'xp', value: 8, resultText: 'Passas com esforço, mas sem confrontos.' }
            ]
          },
          {
            text: 'Uma runa antiga brilha no chão após a tua escolha. O que fazes?',
            choices: [
              { text: 'Absorver o poder da runa', consequence: 'item', value: { xp: 15, item: { id: 'iron_ring', name: 'Anel de Ferro', rarity: 'comum', type: 'armor', stats: { defense: 2 }, description: 'Aumenta ligeiramente a resistência.' } }, resultText: 'A runa cristaliza-se num anel de ferro!' },
              { text: 'Ignorar por segurança', consequence: 'xp', value: 5, resultText: 'A prudência mantém-te a salvo.' }
            ]
          }
        ]
      },
      {
        id: 'm1_5',
        title: 'O Ativar do Pilar',
        description: 'O teste final de Hir’Skaal. Canaliza a tua essência para o Core.',
        image: 'https://images.unsplash.com/photo-1518005020411-38b81210a7ab?w=1200&q=80',
        questions: [
          {
            text: 'O Pilar flutua com símbolos: fogo, vento, terra e espírito. Qual pressionas?',
            choices: [
              { text: 'Espírito', consequence: 'xp', value: 12, resultText: 'O Pilar treme e uma luz ascende ao céu. Escolha correta!' },
              { text: 'Fogo', consequence: 'damage', value: 25, resultText: 'As chamas queimam-te os braços. O pilar nem se mexe.' },
              { text: 'Vento', consequence: 'xp', value: 6, resultText: 'A energia dissipa-se sem efeito.' },
              { text: 'Terra', consequence: 'xp', value: 8, resultText: 'A plataforma estabiliza, mas não ativa o Core.' }
            ]
          },
          {
            text: 'O Pilar exige uma prova final de força. Como entregas a tua energia?',
            choices: [
              { text: 'Canalizar toda a alma', consequence: 'gamble', value: { damage: 20, xp: 40 }, resultText: 'Sentes uma dor imensa, mas o poder flui como nunca!' },
              { text: 'Toque suave e focado', consequence: 'item', value: { xp: 20, item: { id: 'divine_cloak', name: 'Manto Divino', rarity: 'raro', type: 'armor', stats: { defense: 5 }, description: 'Um manto tecido com a luz do Pilar.' } }, resultText: 'O Pilar reconhece a tua calma e oferece-te uma proteção divina.' }
            ]
          }
        ]
      }
    ]
  }
];