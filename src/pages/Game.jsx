import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import ShopScreen from '../components/game/ShopScreen';
import NameSelectionScreen from '../components/game/NameSelectionScreen';

import {
  GameLogo,
  GameButton,
  XPBar,
  RankBadge,
  MainMenu,
  IntroScene,
  PlayerHub,
  ChapterList,
  ChapterIntro,
  MissionList,
  MissionScreen,
  InventoryScreen,
  CreditsScreen
} from '../components/game';

import { RANKS, XP_THRESHOLDS, INTRO_SCENES, CHAPTERS } from '../components/game/data';

// COMPONENTE PRINCIPAL DO JOGO
export default function Game() {
  // Estados do jogo
  const [gameState, setGameState] = useState('menu'); 
  const [introScene, setIntroScene] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentMission, setCurrentMission] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showChapterIntro, setShowChapterIntro] = useState(false);

  // Dados do jogador
  const [playerData, setPlayerData] = useState({
    name: 'Guerreiro',
    health: 100,
    maxHealth: 100,
    xp: 0,
    rank: 'Aprendiz',
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
    missionCooldowns: {},
    completedEvents: []
  });

  // Verificar se há save guardado
  const [hasSave, setHasSave] = useState(false);

  // Buscar eventos ativos
  const { data: activeEvents = [] } = useQuery({
    queryKey: ['activeEvents'],
    queryFn: async () => {
      const events = await base44.entities.ActiveEvent.filter({ is_active: true });
      return events.filter(e => new Date(e.active_until) > new Date());
    },
    refetchInterval: 60000,
    initialData: []
  });

  // Carregar dados guardados ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('rankcore_save');
    if (savedData) {
      setHasSave(true);
    }
  }, []);

  // Função para guardar progresso (auto-save)
  const saveGame = useCallback(() => {
    localStorage.setItem('rankcore_save', JSON.stringify(playerData));
    setHasSave(true);
  }, [playerData]);

  // Auto-save quando dados do jogador mudam
  useEffect(() => {
    if (gameState !== 'menu' && gameState !== 'name_selection' && gameState !== 'intro' && gameState !== 'credits') {
      saveGame();
    }
  }, [playerData, gameState, saveGame]);

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

  // Processar escolha de missão ou evento
  const handleMissionChoice = useCallback((lastChoice, allChoices, isEvent = false) => {
    let newHealth = playerData.health;
    let newXP = playerData.xp;
    let newGold = playerData.gold;
    let newInventory = [...playerData.inventory];

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
          // support single item or array
          const mainItem = lastChoice.value.item;
          if (Array.isArray(mainItem)) {
            newInventory.push(...mainItem);
          } else if (mainItem) {
            newInventory.push(mainItem);
          }
          // extra drop chance: 60% chance to drop a common potion
          if (!lastChoice.value.extraItems && Math.random() < 0.6) {
            newInventory.push({ id: 'healing_potion', name: 'Poção Curativa', description: 'Restaura 20 PV', rarity: 'comum', type: 'consumable', stats: { healing: 20 } });
          }
          // if extraItems provided, include them
          if (lastChoice.value.extraItems && Array.isArray(lastChoice.value.extraItems)) {
            newInventory.push(...lastChoice.value.extraItems);
          }
        }
        break;
    }

    const newRank = checkRankUp(newXP);

    if (isEvent) {
      const newCompletedEvents = [...playerData.completedEvents, currentEvent.event_id];
      
      base44.entities.EventCompletion.create({
        event_id: currentEvent.event_id,
        completed_at: new Date().toISOString()
      });

      setPlayerData(prev => ({
        ...prev,
        health: newHealth,
        xp: newXP,
        gold: newGold + 100,
        rank: newRank,
        inventory: newInventory,
        completedEvents: newCompletedEvents
      }));
      
      setGameState('events');
      setCurrentEvent(null);
    } else {
      const newCompletedMissions = [...playerData.completedMissions, currentMission.id];

      setPlayerData(prev => ({
        ...prev,
        health: newHealth,
        xp: newXP,
        gold: newGold + 50,
        rank: newRank,
        inventory: newInventory,
        missionsCompleted: prev.missionsCompleted + 1,
        victories: lastChoice.consequence === 'xp' || lastChoice.consequence === 'item' ? prev.victories + 1 : prev.victories,
        completedMissions: newCompletedMissions
      }));

      setGameState('missions');
      setCurrentMission(null);
    }
  }, [playerData, currentMission, currentEvent, checkRankUp]);

  // Handle mission failure
  const handleMissionFail = useCallback((missionId) => {
    const cooldownEnd = Date.now() + (60 * 60 * 1000);
    
    setPlayerData(prev => ({
      ...prev,
      health: prev.maxHealth,
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

  // Comprar item da loja
  const buyShopItem = useCallback((item) => {
    if (playerData.gold >= item.price) {
      setPlayerData(prev => ({
        ...prev,
        gold: prev.gold - item.price,
        inventory: [...prev.inventory, item]
      }));
    }
  }, [playerData.gold]);

  // Reiniciar jogo
  const restartGame = useCallback(() => {
    localStorage.removeItem('rankcore_save');
    setHasSave(false);
    setPlayerData({
      name: 'Guerreiro',
      health: 100,
      maxHealth: 100,
      xp: 0,
      rank: 'Aprendiz',
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
      missionCooldowns: {},
      completedEvents: []
    });
    setGameState('name_selection');
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
            onStart={restartGame}
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
            onSkip={() => { setGameState('hub'); setIntroScene(0); }}
          />
        )}

        {gameState === 'name_selection' && (
          <NameSelectionScreen
            key="name_selection"
            onConfirm={(name) => {
              setPlayerData(prev => ({ ...prev, name }));
              setGameState('intro');
            }}
          />
        )}

        {gameState === 'hub' && (
          <PlayerHub
            key="hub"
            playerData={playerData}
            onChapters={() => setGameState('chapters')}
            onEvents={() => setGameState('events')}
            onShop={() => setGameState('shop')}
            onInventory={() => setGameState('inventory')}
            onSave={() => setGameState('menu')}
          />
        )}

        {gameState === 'chapters' && (
          <ChapterList
            key="chapters"
            chapters={CHAPTERS}
            completedMissions={playerData.completedMissions}
            onSelectChapter={(chapter) => {
              setCurrentChapter(chapter);
              setShowChapterIntro(true);
              setGameState('chapter_intro');
            }}
            onBack={() => setGameState('hub')}
          />
        )}

        {gameState === 'chapter_intro' && currentChapter && showChapterIntro && (
          <ChapterIntro
            key="chapter_intro"
            chapter={currentChapter}
            completedMissions={playerData.completedMissions}
            onStart={() => {
              setShowChapterIntro(false);
              setGameState('missions');
            }}
            onBack={() => {
              setCurrentChapter(null);
              setShowChapterIntro(false);
              setGameState('chapters');
            }}
          />
        )}

        {gameState === 'missions' && currentChapter && (
          <MissionList
            key="missions"
            missions={currentChapter.missions}
            completedMissions={playerData.completedMissions}
            missionCooldowns={playerData.missionCooldowns}
            onSelectMission={(mission) => {
              setCurrentMission(mission);
              setGameState('mission');
            }}
            onBack={() => {
              setCurrentChapter(null);
              setGameState('chapters');
            }}
            chapterTitle={currentChapter.title}
          />
        )}

        {gameState === 'events' && (
          <MissionList
            key="events"
            missions={activeEvents.map(e => ({
              id: e.event_id,
              title: e.title,
              description: e.description,
              image: e.image,
              questions: e.questions
            }))}
            completedMissions={playerData.completedEvents}
            missionCooldowns={{}}
            onSelectMission={(event) => {
              setCurrentEvent(event);
              setGameState('event');
            }}
            onBack={() => setGameState('hub')}
            chapterTitle="Eventos Especiais"
          />
        )}

        {gameState === 'event' && currentEvent && (
          <MissionScreen
            key="event"
            mission={currentEvent}
            playerHealth={playerData.health}
            playerMaxHealth={playerData.maxHealth}
            onChoice={(lastChoice, allChoices) => handleMissionChoice(lastChoice, allChoices, true)}
            onFail={(eventId) => {
              setPlayerData(prev => ({ ...prev, health: prev.maxHealth }));
              setGameState('events');
              setCurrentEvent(null);
            }}
            onBack={() => {
              setCurrentEvent(null);
              setGameState('events');
            }}
          />
        )}

        {gameState === 'shop' && (
          <ShopScreen
            key="shop"
            playerGold={playerData.gold}
            inventory={playerData.inventory}
            onBuy={buyShopItem}
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
            onBack={() => {
              setCurrentMission(null);
              setGameState('missions');
            }}
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