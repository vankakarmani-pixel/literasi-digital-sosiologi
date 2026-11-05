import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TitleScreen } from './components/TitleScreen';
import { ProfileSetupModal } from './components/modals/ProfileSetupModal';
import { SociologyGuideModal } from './components/modals/SociologyGuideModal';
import { DialogModal } from './components/modals/DialogModal';
import { Mission1CekFaktaModal } from './components/modals/Mission1CekFaktaModal';
import { Mission2EchoChamberModal } from './components/modals/Mission2EchoChamberModal';
import { Mission3PrivacySafeModal } from './components/modals/Mission3PrivacySafeModal';
import { Mission4CyberbullyingModal } from './components/modals/Mission4CyberbullyingModal';
import { Mission5CoopBridgeModal } from './components/modals/Mission5CoopBridgeModal';
import { QuizPortalModal } from './components/modals/QuizPortalModal';
import { TeacherDashboardModal } from './components/modals/TeacherDashboardModal';
import { ResultsCertificateModal } from './components/modals/ResultsCertificateModal';
import { BotanicalGardenModal } from './components/modals/BotanicalGardenModal';
import { ChatDrawer } from './components/hud/ChatDrawer';
import { EmoteWheel } from './components/hud/EmoteWheel';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/hud/GameHUD';
import { socket } from './game/socketClient';
import { sound } from './game/audio';
import { PlayerProfile, RemotePlayer, PillarScores, CoopState, ChatMessage, NPCData, InteractiveItem, Direction, CustomLook } from './game/types';

export default function App() {
  const [screen, setScreen] = useState<'title' | 'profile_setup' | 'playing'>('title');
  const [showGuide, setShowGuide] = useState(false);

  // Player and Room State
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    id: `local-${Date.now()}`,
    name: 'Siswa Agen',
    classGrade: 'XI IPS 1',
    avatarId: 1,
    roomCode: 'SOC202',
    isHost: true,
  });

  const [scores, setScores] = useState<PillarScores>({
    skills: 0,
    culture: 0,
    safety: 0,
    ethics: 0,
    total: 0,
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [collectedItemIds, setCollectedItemIds] = useState<string[]>([]);
  const [remotePlayers, setRemotePlayers] = useState<RemotePlayer[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('town');
  const [coopState, setCoopState] = useState<CoopState>({
    p1EthicalKeyFound: false,
    p2FirewallCleaned: false,
    bridgeBuilt: false,
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Active Modals
  const [activeNpcDialog, setActiveNpcDialog] = useState<NPCData | null>(null);
  const [activeMissionModal, setActiveMissionModal] = useState<string | null>(null);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showBotanyModal, setShowBotanyModal] = useState(false);
  const [catToast, setCatToast] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showEmote, setShowEmote] = useState(false);
  const [nearInteractableText, setNearInteractableText] = useState<string | null>(null);

  // WebSocket sync listeners
  useEffect(() => {
    const unsubRoomState = socket.on('room_state', (_event, data: any) => {
      if (data.players) {
        setRemotePlayers(data.players.filter((p: RemotePlayer) => p.id !== playerProfile.id));
      }
      if (data.coopBridge) {
        setCoopState(data.coopBridge);
      }
      if (data.chatMessages) {
        setChatMessages(data.chatMessages);
      }
    });

    const unsubPlayerJoined = socket.on('player_joined', (_event, data: any) => {
      if (data.player && data.player.id !== playerProfile.id) {
        setRemotePlayers((prev) => {
          const exists = prev.some((p) => p.id === data.player.id);
          if (exists) return prev.map((p) => (p.id === data.player.id ? data.player : p));
          return [...prev, data.player];
        });
      }
    });

    const unsubPlayerMoved = socket.on('player_moved', (_event, data: any) => {
      setRemotePlayers((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? { ...p, x: data.x, y: data.y, direction: data.direction, isMoving: data.isMoving }
            : p
        )
      );
    });

    const unsubPlayerLeft = socket.on('player_left', (_event, data: any) => {
      setRemotePlayers((prev) => prev.filter((p) => p.id !== data.id));
    });

    const unsubScoreUpdated = socket.on('player_score_updated', (_event, data: any) => {
      setRemotePlayers((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? { ...p, scores: data.scores, completedMissions: data.completedMissions }
            : p
        )
      );
    });

    const unsubProfileUpdated = socket.on('player_profile_updated', (_event, data: any) => {
      setRemotePlayers((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? { ...p, avatarId: data.avatarId, customLook: data.customLook }
            : p
        )
      );
    });

    const unsubChat = socket.on('chat_received', (_event, data: any) => {
      setChatMessages((prev) => [...prev.slice(-40), data]);
    });

    const unsubCoop = socket.on('coop_updated', (_event, data: any) => {
      setCoopState(data);
    });

    return () => {
      unsubRoomState();
      unsubPlayerJoined();
      unsubPlayerMoved();
      unsubPlayerLeft();
      unsubScoreUpdated();
      unsubProfileUpdated();
      unsubChat();
      unsubCoop();
    };
  }, [playerProfile.id]);

  const handleStartProfileSetup = () => {
    setScreen('profile_setup');
  };

  const handleStartGame = (profile: PlayerProfile) => {
    setPlayerProfile(profile);
    setScreen('playing');
    socket.joinRoom(profile.roomCode, profile);
  };

  const handlePlayerMove = useCallback(
    (x: number, y: number, direction: Direction, isMoving: boolean) => {
      socket.sendMove(x, y, direction, isMoving);
    },
    []
  );

  const handleInteractNPC = useCallback((npc: NPCData) => {
    setActiveNpcDialog(npc);
  }, []);

  const handleCollectItem = useCallback((item: InteractiveItem) => {
    setCollectedItemIds((prev) => {
      if (prev.includes(item.id)) return prev;
      return [...prev, item.id];
    });
  }, []);

  // Update scores and broadcast
  const addScore = (
    pillar: 'skills' | 'culture' | 'safety' | 'ethics',
    points: number,
    missionId: string
  ) => {
    setScores((prev) => {
      const updated = {
        ...prev,
        [pillar]: Math.min(1000, prev[pillar] + points),
      };
      updated.total = updated.skills + updated.culture + updated.safety + updated.ethics;

      const updatedCompleted = completedMissions.includes(missionId)
        ? completedMissions
        : [...completedMissions, missionId];

      setCompletedMissions(updatedCompleted);
      socket.updateScore(updated, updatedCompleted);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#8b5cf6', '#ec4899'],
        });
      } catch {
        // Confetti fallback
      }

      return updated;
    });
  };

  const handleDialogAction = () => {
    if (!activeNpcDialog) return;
    const mission = activeNpcDialog.associatedMission;
    setActiveNpcDialog(null);

    if (mission === 'mission1') setActiveMissionModal('mission1');
    else if (mission === 'mission2') setActiveMissionModal('mission2');
    else if (mission === 'mission3') setActiveMissionModal('mission3');
    else if (mission === 'mission4') setActiveMissionModal('mission4');
    else if (mission === 'coop') setActiveMissionModal('coop');
    else if (mission === 'quiz') setActiveMissionModal('quiz');
    else if (mission === 'botani') setShowBotanyModal(true);
  };

  const handleRoomChange = (roomId: string, spawnX: number, spawnY: number) => {
    setCurrentRoom(roomId);
  };

  const handleTriggerTerminalAction = (action: string) => {
    if (action === 'mission1') setActiveMissionModal('mission1');
    else if (action === 'mission2') setActiveMissionModal('mission2');
    else if (action === 'mission3') setActiveMissionModal('mission3');
    else if (action === 'mission4') setActiveMissionModal('mission4');
    else if (action === 'botanical_garden') setShowBotanyModal(true);
    else if (action === 'quiz') setActiveMissionModal('quiz');
    else if (action === 'pet_cat') {
      sound.playCozyClick();
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      setCatToast('🐾 Meow! Kucing siber mendengkur tenang... (+25 XP Kebijakan Mental)');
      setScores((prev) => ({
        ...prev,
        ethics: Math.min(1000, prev.ethics + 25),
        total: Math.min(4000, prev.total + 25),
      }));
      setTimeout(() => setCatToast(null), 3500);
    } else if (action === 'dialog_prof') {
      const prof = activeNpcDialog || {
        id: 'prof_sosio',
        name: 'Prof. Sosio',
        title: 'Guru Besar Sosiologi Digital',
        x: 1300,
        y: 1220,
        avatarColor: '#0284c7',
        icon: 'graduation-cap',
        associatedMission: 'intro',
        dialogueIntro: [
          'Selamat datang di mimbar agung Balai Kota Siber!',
          'Ingat prinsip Emile Durkheim: Kesadaran kolektif adalah kunci mencegah anomie siber.',
          'Teruslah menjadi agen perubahan sosial yang berdaya!',
        ],
        dialogueActionText: 'Tutup Dialog',
        dialogueCompleted: ['Harmoni sosial berhasil kita rawat bersama!'],
      };
      setActiveNpcDialog(prof);
    }
  };

  const handleSaveCustomLook = (newAvatarId: number, newLook: CustomLook) => {
    setPlayerProfile((prev) => ({
      ...prev,
      avatarId: newAvatarId,
      customLook: newLook,
    }));
    socket.updateProfile(newAvatarId, newLook);
  };

  const handleBotanyScoreReward = (pillar: 'skills' | 'ethics' | 'safety' | 'culture', points: number) => {
    setScores((prev) => {
      const updated = {
        ...prev,
        [pillar]: Math.min(1000, prev[pillar] + points),
        total: Math.min(4000, prev.total + points),
      };
      socket.updateScore(updated, completedMissions);
      return updated;
    });
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
  };

  const handleExitToTown = () => {
    sound.playDoorExit();
    setCurrentRoom('town');
  };

  const handleSendMessage = (text: string) => {
    socket.sendChat(text);
  };

  const handleSendEmote = (emote: string) => {
    socket.sendChat(`Mengirim reaksi [${emote}]`, emote);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      
      {/* 1. TITLE SCREEN */}
      {screen === 'title' && (
        <TitleScreen
          onStart={handleStartProfileSetup}
          onOpenGuide={() => setShowGuide(true)}
        />
      )}

      {/* 2. PROFILE SETUP MODAL */}
      <ProfileSetupModal
        isOpen={screen === 'profile_setup'}
        onStartGame={handleStartGame}
      />

      {/* 3. ACTIVE GAMEPLAY VIEWPORT */}
      {screen === 'playing' && (
        <div className="relative w-full h-full">
          {/* Main 2D Canvas */}
          <GameCanvas
            playerId={playerProfile.id}
            playerName={playerProfile.name}
            classGrade={playerProfile.classGrade}
            avatarId={playerProfile.avatarId}
            currentRoom={currentRoom}
            remotePlayers={remotePlayers}
            completedMissions={completedMissions}
            collectedItemIds={collectedItemIds}
            customLook={playerProfile.customLook}
            onPlayerMove={handlePlayerMove}
            onInteractNPC={handleInteractNPC}
            onCollectItem={handleCollectItem}
            onNearInteractableChange={setNearInteractableText}
            onRoomChange={handleRoomChange}
            onTriggerTerminalAction={handleTriggerTerminalAction}
          />

          {/* HUD Overlay */}
          <GameHUD
            playerName={playerProfile.name}
            classGrade={playerProfile.classGrade}
            roomCode={playerProfile.roomCode}
            isHost={playerProfile.isHost || false}
            currentRoom={currentRoom}
            scores={scores}
            completedMissions={completedMissions}
            collectedItemIds={collectedItemIds}
            remotePlayers={remotePlayers}
            nearInteractableText={nearInteractableText}
            onOpenTeacherDashboard={() => setShowTeacherDashboard(true)}
            onOpenCertificate={() => setShowCertificate(true)}
            onToggleChat={() => setShowChat((prev) => !prev)}
            onToggleEmote={() => setShowEmote((prev) => !prev)}
            onExitRoom={currentRoom !== 'town' ? handleExitToTown : undefined}
            onOpenBotany={() => setShowBotanyModal(true)}
          />

          {/* NPC Dialogue Modal */}
          <DialogModal
            npc={activeNpcDialog}
            isOpen={!!activeNpcDialog}
            isMissionCompleted={activeNpcDialog ? completedMissions.includes(activeNpcDialog.associatedMission) : false}
            onClose={() => setActiveNpcDialog(null)}
            onAction={handleDialogAction}
          />

          {/* Mission 1: Operasi Cek Fakta */}
          <Mission1CekFaktaModal
            isOpen={activeMissionModal === 'mission1'}
            onClose={() => setActiveMissionModal(null)}
            onComplete={(pts) => addScore('skills', pts, 'mission1')}
            fragmentsCollected={collectedItemIds.filter((id) => id.startsWith('frag_')).length}
          />

          {/* Mission 2: Memecah Gelembung Algoritma */}
          <Mission2EchoChamberModal
            isOpen={activeMissionModal === 'mission2'}
            onClose={() => setActiveMissionModal(null)}
            onComplete={(pts) => addScore('culture', pts, 'mission2')}
            cardsCollected={collectedItemIds.filter((id) => id.startsWith('card_')).length}
          />

          {/* Mission 3: Lorong Jejak Digital */}
          <Mission3PrivacySafeModal
            isOpen={activeMissionModal === 'mission3'}
            onClose={() => setActiveMissionModal(null)}
            onComplete={(pts) => addScore('safety', pts, 'mission3')}
            leakedDataCollected={collectedItemIds.filter((id) => id.startsWith('data_')).length}
          />

          {/* Mission 4: Kampanye Anti-Bullying */}
          <Mission4CyberbullyingModal
            isOpen={activeMissionModal === 'mission4'}
            onClose={() => setActiveMissionModal(null)}
            onComplete={(pts) => addScore('ethics', pts, 'mission4')}
          />

          {/* Mission 5: Jembatan Toleransi Siber */}
          <Mission5CoopBridgeModal
            isOpen={activeMissionModal === 'coop'}
            onClose={() => setActiveMissionModal(null)}
            onComplete={(pts) => {
              setScores((prev) => ({
                ...prev,
                skills: Math.min(1000, prev.skills + 250),
                culture: Math.min(1000, prev.culture + 250),
                total: prev.total + pts,
              }));
              setCompletedMissions((prev) => [...prev, 'coop']);
            }}
            coopState={coopState}
            isHost={playerProfile.isHost || false}
          />

          {/* Quiz Portal */}
          <QuizPortalModal
            isOpen={activeMissionModal === 'quiz'}
            onClose={() => setActiveMissionModal(null)}
            onComplete={(pts) => {
              setScores((prev) => ({
                ...prev,
                skills: Math.min(1000, prev.skills + Math.floor(pts / 2)),
                culture: Math.min(1000, prev.culture + Math.floor(pts / 2)),
                total: prev.total + pts,
              }));
              setCompletedMissions((prev) => [...prev, 'quiz']);
            }}
          />

          {/* Teacher Dashboard */}
          <TeacherDashboardModal
            isOpen={showTeacherDashboard}
            onClose={() => setShowTeacherDashboard(false)}
            roomCode={playerProfile.roomCode}
            isHost={playerProfile.isHost || false}
            currentLocalPlayer={{
              name: playerProfile.name,
              classGrade: playerProfile.classGrade,
              scores,
              completedMissions,
            }}
          />

          {/* Results Certificate */}
          <ResultsCertificateModal
            isOpen={showCertificate}
            onClose={() => setShowCertificate(false)}
            playerName={playerProfile.name}
            classGrade={playerProfile.classGrade}
            roomCode={playerProfile.roomCode}
            scores={scores}
          />

          {/* Realtime Classroom Chat Drawer */}
          <ChatDrawer
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            currentUserId={playerProfile.id}
          />

          {/* Emote Wheel */}
          <EmoteWheel
            isOpen={showEmote}
            onClose={() => setShowEmote(false)}
            onSelectEmote={handleSendEmote}
          />

          {/* Botanical Garden Modal (Menanam Tanaman & Eksperimen Air Positif vs Negatif) */}
          <BotanicalGardenModal
            isOpen={showBotanyModal}
            onClose={() => setShowBotanyModal(false)}
            onRewardScore={handleBotanyScoreReward}
          />

          {/* Cat Petting Wholesome Toast */}
          {catToast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-amber-950/95 border-3 border-amber-400 text-amber-100 font-pixel text-sm shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-2 pointer-events-none">
              <span>{catToast}</span>
            </div>
          )}
        </div>
      )}

      {/* Curriculum Guide Modal */}
      <SociologyGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />

    </div>
  );
}
