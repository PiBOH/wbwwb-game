import React, { useEffect, useRef, useCallback } from 'react';
import { Peep, StoryPhase, CapturedPhoto, Language } from '../types/game';
import { translations } from '../utils/translations';
import { soundManager } from '../utils/audio';

interface GameCanvasProps {
  phase: StoryPhase;
  mode: 'story' | 'sandbox' | 'gallery';
  language: Language;
  sandboxSpawnTrigger?: { shape: 'circle' | 'square', special?: 'hat' | 'crazed' | 'couple' | 'armed', id: number } | null;
  sandboxCrowdReset?: number;
  onPhotoTaken: (photo: CapturedPhoto) => void;
  onPhaseChange: (newPhase: StoryPhase) => void;
  onMassacreEnd: (deadPeeps: Peep[]) => void;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
const TV_X = CANVAS_WIDTH / 2 - 140;
const TV_Y = 40;
const TV_W = 280;
const TV_H = 200;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  phase,
  mode,
  language,
  sandboxSpawnTrigger,
  sandboxCrowdReset,
  onPhotoTaken,
  onPhaseChange,
  onMassacreEnd,
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game state refs
  const peepsRef = useRef<Peep[]>([]);
  const phaseRef = useRef<StoryPhase>(phase);
  const modeRef = useRef<'story' | 'sandbox' | 'gallery'>(mode);
  const latestPhotoRef = useRef<CapturedPhoto | null>(null);
  
  // Custom camera pointer coords
  const cameraPosRef = useRef<{ x: number, y: number }>({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const isMouseDownRef = useRef<boolean>(false);
  const flashAlphaRef = useRef<number>(0);
  const shakeTimeRef = useRef<number>(0);
  const climaxCutsceneTimerRef = useRef<number>(0);
  const tvImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const isInsideTV = (x: number, y: number, margin = 30) => {
    return (
      x >= TV_X - margin &&
      x <= TV_X + TV_W + margin &&
      y >= TV_Y - margin &&
      y <= TV_Y + TV_H + margin
    );
  };

  const getRandomTarget = useCallback(() => {
    let tx = 0;
    let ty = 0;
    let attempts = 0;
    do {
      tx = 80 + Math.random() * (CANVAS_WIDTH - 160);
      ty = 180 + Math.random() * (CANVAS_HEIGHT - 240);
      attempts++;
    } while (isInsideTV(tx, ty, 40) && attempts < 20);
    return { x: tx, y: ty };
  }, []);

  const createPeep = useCallback((
    shape: 'circle' | 'square', 
    special?: 'hat' | 'crazed' | 'couple' | 'armed' | 'cricket' | 'fancy' | 'docile'
  ): Peep => {
    const target = getRandomTarget();
    const spawnSide = Math.random();
    let sx = target.x;
    let sy = CANVAS_HEIGHT - 50;
    if (spawnSide < 0.3) {
      sx = 40;
      sy = 200 + Math.random() * 400;
    } else if (spawnSide < 0.6) {
      sx = CANVAS_WIDTH - 40;
      sy = 200 + Math.random() * 400;
    }

    const peep: Peep = {
      id: 'peep_' + Math.random().toString(36).substring(2, 9),
      shape,
      x: sx,
      y: sy,
      vx: 0,
      vy: 0,
      radius: special === 'cricket' ? 12 : 24,
      emotion: 'normal',
      hasHat: special === 'hat' || special === 'fancy' || special === 'docile',
      targetX: target.x,
      targetY: target.y,
      timer: Math.random() * 100,
      shouting: false,
      shoutTimer: 0,
      scaredTimer: 0,
      snubTimer: 0,
      isCricket: special === 'cricket',
      isFancy: special === 'fancy',
    };

    if (special === 'crazed') {
      peep.emotion = 'crazed';
    } else if (special === 'docile') {
      peep.emotion = 'docile';
    } else if (special === 'couple') {
      peep.emotion = 'in_love';
    } else if (special === 'armed') {
      peep.emotion = 'armed';
    } else if (special === 'fancy') {
      peep.emotion = 'normal';
    }

    return peep;
  }, [getRandomTarget]);

  // Initial Crowd setup
  const setupCrowd = useCallback(() => {
    const initialPeeps: Peep[] = [];

    // Add normal Circles
    for (let i = 0; i < 9; i++) {
      initialPeeps.push(createPeep('circle'));
    }

    // Add normal Squares
    for (let i = 0; i < 8; i++) {
      initialPeeps.push(createPeep('square'));
    }

    // Add The Snazzy Hat Man (Square)
    initialPeeps.push(createPeep('square', 'hat'));

    // Add The Couple
    const p1 = createPeep('circle', 'couple');
    const p2 = createPeep('square', 'couple');
    p1.partnerId = p2.id;
    p2.partnerId = p1.id;
    p1.x = CANVAS_WIDTH / 2 - 40;
    p1.y = CANVAS_HEIGHT - 100;
    p2.x = CANVAS_WIDTH / 2 + 40;
    p2.y = CANVAS_HEIGHT - 100;
    initialPeeps.push(p1, p2);

    // Add Cricket
    initialPeeps.push(createPeep('circle', 'cricket'));

    peepsRef.current = initialPeeps;
    latestPhotoRef.current = null;
    climaxCutsceneTimerRef.current = 0;
  }, [createPeep]);

  useEffect(() => {
    if (!sandboxSpawnTrigger) return;
    const newPeep = createPeep(sandboxSpawnTrigger.shape, sandboxSpawnTrigger.special);
    peepsRef.current = [...peepsRef.current, newPeep];
  }, [sandboxSpawnTrigger, createPeep]);

  useEffect(() => {
    if (!sandboxCrowdReset) return;
    setupCrowd();
  }, [sandboxCrowdReset, setupCrowd]);

  useEffect(() => {
    setupCrowd();
  }, [setupCrowd]);

  // --- MAIN SIMULATION & RENDER LOOP ---
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentPhase = phaseRef.current;
      const peeps = peepsRef.current;

      // Shake effect
      if (shakeTimeRef.current > 0) {
        shakeTimeRef.current -= 1;
        ctx.save();
        ctx.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
      }

      // 1. Clear & Draw Background
      ctx.fillStyle = (currentPhase === 'CLIMAX_MASSACRE' || currentPhase === 'CLIMAX_SHOT') ? '#e2d9db' : '#f1f5f9';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Street Floor line
      ctx.fillStyle = (currentPhase === 'CLIMAX_MASSACRE' || currentPhase === 'CLIMAX_SHOT') ? '#cbd5e1' : '#e2e8f0';
      ctx.fillRect(0, 160, CANVAS_WIDTH, CANVAS_HEIGHT - 160);

      // --- CLIMAX MASSACRE AUTOMATED SCRIPT ---
      if (currentPhase === 'CLIMAX_MASSACRE') {
        climaxCutsceneTimerRef.current += 1;

        // Ogni ~90 frame (~1.5s) inizia un nuovo "duello": un attaccante punta una vittima
        if (climaxCutsceneTimerRef.current % 90 === 0 && climaxCutsceneTimerRef.current < 1700) {
          const available = peeps.filter(p => 
            !p.isCricket && 
            p.emotion !== 'in_love' && 
            p.emotion !== 'dead' &&
            !p.attackingTargetId
          );
          if (available.length >= 2) {
            // Scegli attaccante (preferibilmente armato/folle) e vittima a caso
            const sorted = [...available].sort((a, b) => {
              const aArmed = (a.emotion === 'armed' || a.emotion === 'crazed') ? 0 : 1;
              const bArmed = (b.emotion === 'armed' || b.emotion === 'crazed') ? 0 : 1;
              return aArmed - bArmed;
            });
            const attacker = sorted[0];
            const victimCandidates = available.filter(p => p.id !== attacker.id);
            const victim = victimCandidates[Math.floor(Math.random() * victimCandidates.length)];
            
            if (victim) {
              attacker.attackingTargetId = victim.id;
              attacker.attackTimer = 0;
              attacker.attackPhase = 'approaching';
              if (attacker.emotion !== 'crazed') attacker.emotion = 'armed';
            }
          }
        }

        // Aggiorna gli attacchi in corso
        peeps.forEach(attacker => {
          if (!attacker.attackingTargetId || attacker.emotion === 'dead') return;
          const victim = peeps.find(p => p.id === attacker.attackingTargetId);
          if (!victim || victim.emotion === 'dead') {
            attacker.attackingTargetId = undefined;
            attacker.attackPhase = 'done';
            return;
          }

          attacker.attackTimer = (attacker.attackTimer || 0) + 1;

          if (attacker.attackPhase === 'approaching') {
            // Muoviti verso la vittima
            const adx = victim.x - attacker.x;
            const ady = victim.y - attacker.y;
            const adist = Math.hypot(adx, ady);
            if (adist > 50) {
              attacker.x += (adx / adist) * 3.2;
              attacker.y += (ady / adist) * 3.2;
              attacker.vx = adx / adist * 3.2;
              attacker.vy = ady / adist * 3.2;
            } else {
              // Vicino abbastanza: inizia lo swing
              attacker.attackPhase = 'swinging';
              attacker.attackTimer = 0;
              attacker.shouting = true;
              attacker.shoutTimer = 25;
              soundManager.playShout();
            }
          } else if (attacker.attackPhase === 'swinging') {
            // Animazione swing per 20 frame
            if (attacker.attackTimer === 12) {
              // Impatto: la vittima muore
              victim.emotion = 'dead';
              victim.bloodPool = 18 + Math.random() * 30;
              victim.killedById = attacker.id;
              victim.deathFlashTimer = 15;
              shakeTimeRef.current = 6;
              soundManager.playPop();
            }
            if (attacker.attackTimer >= 25) {
              attacker.attackPhase = 'done';
              attacker.attackingTargetId = undefined;
            }
          }
        });

        // Decremento del flash di morte
        peeps.forEach(p => {
          if (p.deathFlashTimer && p.deathFlashTimer > 0) {
            p.deathFlashTimer -= 1;
          }
        });

        // A frame 1850 (~30 sec) il massacro finisce e parte l'epilogo
        if (climaxCutsceneTimerRef.current === 1850) {
          soundManager.playBoom();
          const fallen = peeps.filter(p => p.emotion === 'dead');
          onMassacreEnd(fallen);
        }
      }

      // 2. Update & Draw Central TV
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.fillRect(TV_X + TV_W / 2 - 15, TV_Y + TV_H, 30, 40);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(TV_X + TV_W / 2 - 50, TV_Y + TV_H + 30, 100, 10);

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(TV_X, TV_Y, TV_W, TV_H, 16);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = (currentPhase === 'CLIMAX_MASSACRE') ? '#450a0a' : '#1e293b';
      ctx.beginPath();
      ctx.roundRect(TV_X + 10, TV_Y + 10, TV_W - 20, TV_H - 20, 8);
      ctx.fill();

      // TV Inner Screen Details
      const latestPhoto = latestPhotoRef.current;
      if (latestPhoto) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(TV_X + 10, TV_Y + 10, TV_W - 20, TV_H - 20, 8);
        ctx.clip();

        // Usa un'immagine memorizzata in cache per evitare sfarfallio (no new Image() ogni frame)
        if (tvImageRef.current && tvImageRef.current.complete) {
          ctx.drawImage(tvImageRef.current, TV_X + 10, TV_Y + 10, TV_W - 20, TV_H - 20);
        }
        ctx.restore();
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(t.story.tvDefault, TV_X + TV_W / 2, TV_Y + TV_H / 2);
        ctx.fillStyle = Math.sin(Date.now() * 0.005) > 0 ? '#ef4444' : '#991b1b';
        ctx.beginPath();
        ctx.arc(TV_X + TV_W / 2 - 70, TV_Y + TV_H / 2 - 4, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw Peeps (Sort by Y coordinate)
      peeps.sort((a, b) => a.y - b.y);

      peeps.forEach((peep) => {
        peep.timer += 0.03;

        // Draw Blood Pool if dead
        if (peep.emotion === 'dead') {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.fillStyle = '#991b1b'; // Dark blood
          ctx.beginPath();
          const pRad = peep.bloodPool || 25;
          ctx.ellipse(0, 10, pRad, pRad * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Dead stick figure lying down
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 5;
          ctx.fillStyle = '#cbd5e1';
          if (peep.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(15, 5, peep.radius * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.rect(5, -10, peep.radius * 1.5, peep.radius);
            ctx.fill();
            ctx.stroke();
          }
          // Dead eyes X X
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('X', 12, 8);
          ctx.restore();
          return;
        }

        // --- AI MOVEMENT FOR LIVING PEEPS ---
        if (!peep.targetX || !peep.targetY) {
          const newT = getRandomTarget();
          peep.targetX = newT.x;
          peep.targetY = newT.y;
        }

        const dx = peep.targetX - peep.x;
        const dy = peep.targetY - peep.y;
        const dist = Math.hypot(dx, dy);

        let speed = peep.isCricket ? 4 : 1.2;
        if (peep.emotion === 'crazed' || peep.emotion === 'armed' || currentPhase === 'CLIMAX_MASSACRE') {
          speed = 2.4;
        }

        // Behavior Modifiers
        if (currentPhase === 'HAT_FAD' && !peep.isCricket && peep.emotion === 'normal' && Math.random() < 0.005) {
          peep.hasHat = true;
          peep.emotion = 'hat_happy';
        }

        if (currentPhase === 'CRAZED_APPEARS' && peep.emotion === 'crazed') {
          if (Math.random() < 0.02 && !peep.shouting) {
            peep.shouting = true;
            peep.shoutTimer = 40;
            soundManager.playShout();
          }
        }

        if (currentPhase === 'FEAR_SPREADS' && peep.shape === 'circle' && !peep.isCricket) {
          const nearSquare = peeps.find(p => p.shape === 'square' && p.emotion !== 'dead' && Math.hypot(p.x - peep.x, p.y - peep.y) < 120);
          if (nearSquare) {
            peep.emotion = 'scared';
            peep.scaredTimer = 60;
            const adx = peep.x - nearSquare.x;
            const ady = peep.y - nearSquare.y;
            const adist = Math.hypot(adx, ady);
            if (adist > 0) {
              peep.x += (adx / adist) * 2.5;
              peep.y += (ady / adist) * 2.5;
            }
          } else if (peep.scaredTimer > 0) {
            peep.scaredTimer--;
          } else if (peep.emotion === 'scared') {
            peep.emotion = 'normal';
          }
        }

        if (currentPhase === 'SNUB_SPREADS' && peep.shape === 'square' && !peep.isCricket) {
          const nearCircle = peeps.find(p => p.shape === 'circle' && p.emotion !== 'dead' && Math.hypot(p.x - peep.x, p.y - peep.y) < 120);
          if (nearCircle) {
            peep.emotion = 'snubbing';
            peep.snubTimer = 60;
          } else if (peep.snubTimer > 0) {
            peep.snubTimer--;
          } else if (peep.emotion === 'snubbing') {
            peep.emotion = 'normal';
          }
        }

        if (currentPhase === 'HATE_SPREADS' || currentPhase === 'CLIMAX_MASSACRE') {
          if (!peep.isCricket && Math.random() < 0.01 && !peep.shouting && peep.emotion !== 'in_love') {
            peep.shouting = true;
            peep.shoutTimer = 35;
            peep.emotion = 'angry';
            if (Math.random() < 0.3) {
              soundManager.playShout();
            }
          }
        }

        if (peep.shoutTimer > 0) {
          peep.shoutTimer--;
          if (peep.shoutTimer <= 0) {
            peep.shouting = false;
          }
        }

        // Salta la AI normale se sta attaccando: il movimento è gestito dallo script del massacro
        const isAttacking = peep.attackingTargetId && (peep.attackPhase === 'approaching' || peep.attackPhase === 'swinging');

        if (!isAttacking) {
          if (dist > 5 && !peep.shouting) {
            peep.vx = (dx / dist) * speed;
            peep.vy = (dy / dist) * speed;
            peep.x += peep.vx;
            peep.y += peep.vy;
          } else if (dist <= 5) {
            const newT = getRandomTarget();
            peep.targetX = newT.x;
            peep.targetY = newT.y;
            if (peep.isCricket) {
              soundManager.playCricket();
            }
          }
        }

        // Repulsion
        peeps.forEach(other => {
          if (other.id !== peep.id && other.emotion !== 'dead') {
            const rdx = peep.x - other.x;
            const rdy = peep.y - other.y;
            const rdist = Math.hypot(rdx, rdy);
            const minDist = peep.radius + other.radius + 6;
            if (rdist < minDist && rdist > 0) {
              const angle = Math.atan2(rdy, rdx);
              const push = (minDist - rdist) * 0.2;
              peep.x += Math.cos(angle) * push;
              peep.y += Math.sin(angle) * push;
            }
          }
        });

        peep.x = Math.max(peep.radius + 20, Math.min(CANVAS_WIDTH - peep.radius - 20, peep.x));
        peep.y = Math.max(180, Math.min(CANVAS_HEIGHT - peep.radius - 20, peep.y));

        // --- RENDER LIVING PEEP ---
        ctx.save();
        ctx.translate(peep.x, peep.y);

        const isMoving = Math.hypot(peep.vx, peep.vy) > 0.2;
        const legSwing = isMoving ? Math.sin(peep.timer * 8) * 12 : 0;

        if (peep.isCricket) {
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.ellipse(0, -6, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#166534';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-6, -2);
          ctx.lineTo(-12, -12);
          ctx.lineTo(-16, -2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(6, -10);
          ctx.lineTo(12, -18);
          ctx.stroke();
          ctx.restore();
          return;
        }

        // Draw Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath();
        ctx.ellipse(0, peep.radius + 4, peep.radius * 0.8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Legs
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, peep.radius - 2);
        ctx.lineTo(-8 + legSwing, peep.radius + 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, peep.radius - 2);
        ctx.lineTo(8 - legSwing, peep.radius + 12);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;

        if (peep.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, peep.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.roundRect(-peep.radius, -peep.radius, peep.radius * 2, peep.radius * 2, 8);
          ctx.fill();
          ctx.stroke();
        }

        if (peep.emotion === 'in_love') {
          ctx.fillStyle = '#ec4899';
          ctx.font = '18px sans-serif';
          ctx.fillText('❤️', 0, -peep.radius - 15 + Math.sin(peep.timer * 5) * 4);
        }

        // Draw Faces
        ctx.fillStyle = '#0f172a';
        let eyeOffset = peep.vx > 0 ? 3 : peep.vx < 0 ? -3 : 0;
        
        if (peep.emotion === 'crazed') {
          ctx.beginPath();
          ctx.arc(-6 + Math.random() * 4 - 2, -4, 4, 0, Math.PI * 2);
          ctx.arc(6 + Math.random() * 4 - 2, -4, 3, 0, Math.PI * 2);
          ctx.fill();
          // Crazed Spiky Hair
          ctx.beginPath();
          ctx.moveTo(-peep.radius, -peep.radius);
          ctx.lineTo(-peep.radius + 10, -peep.radius - 18);
          ctx.lineTo(-peep.radius + 22, -peep.radius - 6);
          ctx.lineTo(peep.radius - 10, -peep.radius - 22);
          ctx.lineTo(peep.radius, -peep.radius);
          ctx.fill();
        } else if (peep.emotion === 'docile') {
          // Docile spiky guy wearing hat and cute smile
          ctx.beginPath();
          ctx.arc(-6, -4, 3, 0, Math.PI * 2);
          ctx.arc(6, -4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 2, 6, 0, Math.PI);
          ctx.stroke();
        } else if (peep.emotion === 'scared') {
          ctx.beginPath();
          ctx.arc(-6, -4, 5, 0, Math.PI * 2);
          ctx.arc(6, -4, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-6, -4, 2, 0, Math.PI * 2);
          ctx.arc(6, -4, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(peep.radius + 4, -8, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (peep.emotion === 'snubbing') {
          ctx.beginPath();
          ctx.arc(-6, -8, 3, 0, Math.PI * 2);
          ctx.arc(6, -8, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-4, 4);
          ctx.lineTo(4, 2);
          ctx.stroke();
        } else if (peep.emotion === 'angry') {
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-12, -10);
          ctx.lineTo(-4, -4);
          ctx.moveTo(12, -10);
          ctx.lineTo(4, -4);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(-6, -2, 2.5, 0, Math.PI * 2);
          ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(-6 + eyeOffset, -4, 3, 0, Math.PI * 2);
          ctx.arc(6 + eyeOffset, -4, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        if (peep.shouting) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.ellipse(eyeOffset, 6, 8, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 4;
          const waveDir = eyeOffset >= 0 ? 1 : -1;
          ctx.beginPath();
          ctx.arc(waveDir * 25, 6, 15, -Math.PI/3, Math.PI/3);
          ctx.arc(waveDir * 35, 6, 25, -Math.PI/3, Math.PI/3);
          ctx.stroke();
        } else if (peep.emotion === 'happy' || peep.emotion === 'hat_happy' || peep.emotion === 'in_love') {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(eyeOffset, 2, 8, 0, Math.PI);
          ctx.stroke();
        }

        // Draw Bowler Hat
        if (peep.hasHat) {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(-peep.radius - 8, -peep.radius - 4, (peep.radius + 8) * 2, 6, 3);
          ctx.fill();
          ctx.beginPath();
          ctx.roundRect(-peep.radius * 0.7, -peep.radius - 22, (peep.radius * 0.7) * 2, 20, [12, 12, 0, 0]);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-peep.radius * 0.7, -peep.radius - 8, (peep.radius * 0.7) * 2, 4);
        }

        // Draw Gun if Fancy guy during Climax Shot
        if (currentPhase === 'CLIMAX_SHOT' && peep.isFancy) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(peep.radius - 2, -10, 28, 8);
          ctx.fillRect(peep.radius - 2, -2, 8, 12);
        }

        // Draw Weapons if armed (con animazione swing durante l'attacco)
        if (peep.emotion === 'armed' || peep.emotion === 'crazed') {
          ctx.save();
          // Angolo del bastone: di base in diagonale, durante swing ruota velocemente
          let weaponAngle = Math.PI / 4;
          if (peep.attackPhase === 'swinging') {
            const t = (peep.attackTimer || 0) / 25;
            // Swing: parte alzato indietro, scatta in avanti al frame 12, poi torna
            if (t < 0.48) {
              weaponAngle = -Math.PI / 2 + t * 1.5; // alzato indietro
            } else {
              weaponAngle = Math.PI / 1.5 - (t - 0.48) * 1.2; // colpo in avanti
            }
          }
          // Direzione verso la vittima
          const victim = peep.attackingTargetId ? peeps.find(p => p.id === peep.attackingTargetId) : null;
          const facingRight = victim ? victim.x > peep.x : peep.vx >= 0;
          if (!facingRight) {
            ctx.scale(-1, 1);
          }
          ctx.rotate(weaponAngle);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(peep.radius - 5, -28, 8, 38);
          // Estremità del bastone più scura
          ctx.fillStyle = '#451a03';
          ctx.fillRect(peep.radius - 7, -32, 12, 8);
          ctx.restore();
        }

        // Lampo bianco di "impatto" sopra la vittima appena uccisa
        if (peep.deathFlashTimer && peep.deathFlashTimer > 0) {
          const alpha = peep.deathFlashTimer / 15;
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(0, 0, peep.radius + 12, 0, Math.PI * 2);
          ctx.fill();
          // "BAM!" text
          if (peep.deathFlashTimer > 8) {
            ctx.fillStyle = '#fef08a';
            ctx.strokeStyle = '#7f1d1d';
            ctx.lineWidth = 3;
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.strokeText('BAM!', 0, -peep.radius - 18);
            ctx.fillText('BAM!', 0, -peep.radius - 18);
          }
        }

        ctx.restore();
      });

      // 4. Update & Draw Camera Viewfinder
      if (currentPhase !== 'EPILOGUE') {
        const cam = cameraPosRef.current;
        const camSize = 220;
        const halfCam = camSize / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
        ctx.beginPath();
        ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.roundRect(cam.x - halfCam, cam.y - halfCam, camSize, camSize, 16);
        ctx.fill('evenodd');

        ctx.strokeStyle = isMouseDownRef.current ? '#ef4444' : '#fde047';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(cam.x - halfCam, cam.y - halfCam, camSize, camSize, 16);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        const cornerLen = 24;
        ctx.beginPath();
        ctx.moveTo(cam.x - halfCam + cornerLen, cam.y - halfCam);
        ctx.lineTo(cam.x - halfCam, cam.y - halfCam);
        ctx.lineTo(cam.x - halfCam, cam.y - halfCam + cornerLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cam.x + halfCam - cornerLen, cam.y - halfCam);
        ctx.lineTo(cam.x + halfCam, cam.y - halfCam);
        ctx.lineTo(cam.x + halfCam, cam.y - halfCam + cornerLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cam.x - halfCam + cornerLen, cam.y - halfCam + camSize);
        ctx.lineTo(cam.x - halfCam, cam.y - halfCam + camSize);
        ctx.lineTo(cam.x - halfCam, cam.y - halfCam + camSize - cornerLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cam.x + halfCam - cornerLen, cam.y - halfCam + camSize);
        ctx.lineTo(cam.x + halfCam, cam.y - halfCam + camSize);
        ctx.lineTo(cam.x + halfCam, cam.y - halfCam + camSize - cornerLen);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cam.x, cam.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        if (flashAlphaRef.current > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlphaRef.current})`;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          flashAlphaRef.current -= 0.08;
        }

        if (currentPhase === 'CLIMAX_MASSACRE') {
          const grad = ctx.createRadialGradient(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 200, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH/2);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, 'rgba(153, 27, 27, 0.55)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [t, onMassacreEnd]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current === 'EPILOGUE') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    cameraPosRef.current = { x, y };
  };

  const handlePointerDown = () => {
    if (phaseRef.current === 'EPILOGUE') return;
    isMouseDownRef.current = true;
  };

  // --- PHOTO CAPTURE & PROGRESSION LOGIC ---
  const handlePointerUp = () => {
    if (phaseRef.current === 'EPILOGUE') return;
    isMouseDownRef.current = false;
    flashAlphaRef.current = 1.0;
    shakeTimeRef.current = 10;
    soundManager.playShutter();

    const cam = cameraPosRef.current;
    const camSize = 220;
    const halfCam = camSize / 2;
    const box = {
      x: cam.x - halfCam,
      y: cam.y - halfCam,
      w: camSize,
      h: camSize,
    };

    const peeps = peepsRef.current;

    const capturedPeeps = peeps.filter(peep => {
      return (
        peep.x + peep.radius >= box.x &&
        peep.x - peep.radius <= box.x + box.w &&
        peep.y + peep.radius >= box.y &&
        peep.y - peep.radius <= box.y + box.h
      );
    });

    const canvas = canvasRef.current;
    let snippetDataUrl = '';
    if (canvas) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 300;
      offCanvas.height = 300;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(
          canvas,
          Math.max(0, box.x),
          Math.max(0, box.y),
          box.w,
          box.h,
          0,
          0,
          300,
          300
        );
        snippetDataUrl = offCanvas.toDataURL('image/jpeg', 0.85);
      }
    }

    // --- EVALUATE CAPTURED EVENT ---
    let headline = t.story.boringHeadline;
    let subheadline = t.story.boringSub;
    let isImportant = false;
    const tags: string[] = [];
    const currentPhase = phaseRef.current;
    let nextPhase: StoryPhase = currentPhase;

    const hasCricket = capturedPeeps.some(p => p.isCricket);
    const hasHat = capturedPeeps.some(p => p.hasHat);
    const hasCrazed = capturedPeeps.some(p => p.emotion === 'crazed');
    const hasDocile = capturedPeeps.some(p => p.emotion === 'docile');
    const hasCouple = capturedPeeps.some(p => p.emotion === 'in_love');
    const hasShoutingCircle = capturedPeeps.some(p => p.shape === 'circle' && p.shouting);
    const hasShoutingSquare = capturedPeeps.some(p => p.shape === 'square' && p.shouting);
    const hasScaredCircle = capturedPeeps.some(p => p.shape === 'circle' && p.emotion === 'scared');
    const hasSnubbingSquare = capturedPeeps.some(p => p.shape === 'square' && p.emotion === 'snubbing');
    const hasArmed = capturedPeeps.some(p => p.emotion === 'armed');
    const hasFancy = capturedPeeps.some(p => p.isFancy);

    if (hasCricket && capturedPeeps.length === 1) {
      headline = t.story.cricketHeadline;
      subheadline = t.story.cricketSub;
    } else if (hasCouple && (currentPhase === 'HATE_SPREADS' || hasDocile || hasCrazed)) {
      // Capturing couple trying to make peace -> "Who tunes in to watch people get along?" / "Peace is Boring"
      headline = t.story.peaceIsBoringHeadline;
      subheadline = t.story.peaceIsBoringSub;
      isImportant = true;
      soundManager.playOminousNews();
    } else if (hasCouple) {
      headline = t.story.coupleHeadline;
      subheadline = t.story.coupleSub;
      isImportant = true;
    } else if (currentPhase === 'INTRO' && hasHat) {
      headline = t.story.niceHatHeadline;
      subheadline = t.story.niceHatSub;
      isImportant = true;
      nextPhase = 'HAT_FAD';
      soundManager.playNewsJingle();
      peepsRef.current.push(createPeep('square', 'crazed'));
    } else if (currentPhase === 'HAT_FAD' && hasHat && capturedPeeps.length >= 1) {
      headline = t.story.hatsOverHeadline;
      subheadline = t.story.hatsOverSub;
      isImportant = true;
      nextPhase = 'CRAZED_APPEARS';
      soundManager.playOminousNews();
      peepsRef.current.forEach(p => p.hasHat = false);
    } else if (currentPhase === 'CRAZED_APPEARS' && hasCrazed && capturedPeeps.some(p => p.shape === 'circle')) {
      headline = t.story.crazedHeadline;
      subheadline = t.story.crazedSub;
      isImportant = true;
      nextPhase = 'FEAR_SPREADS';
      soundManager.playOminousNews();
    } else if (currentPhase === 'FEAR_SPREADS' && hasScaredCircle) {
      headline = t.story.fearHeadline;
      subheadline = t.story.fearSub;
      isImportant = true;
      nextPhase = 'SNUB_SPREADS';
      soundManager.playOminousNews();
    } else if (currentPhase === 'SNUB_SPREADS' && hasSnubbingSquare) {
      headline = t.story.snubHeadline;
      subheadline = t.story.snubSub;
      isImportant = true;
      nextPhase = 'HATE_SPREADS';
      soundManager.playOminousNews();
      // Add Fancy Circle guy for the Climax
      peepsRef.current.push(
        createPeep('circle', 'fancy'),
        createPeep('square', 'crazed')
      );
    } else if (currentPhase === 'HATE_SPREADS' && (hasShoutingCircle || hasShoutingSquare || hasFancy)) {
      headline = t.story.hateHeadline;
      subheadline = t.story.hateSub;
      isImportant = true;
      nextPhase = 'CLIMAX_SHOT';
      soundManager.playOminousNews();
      // Move Fancy guy to shoot spiky square
      const fancyGuy = peepsRef.current.find(p => p.isFancy);
      const spikyGuy = peepsRef.current.find(p => p.emotion === 'crazed');
      if (fancyGuy && spikyGuy) {
        fancyGuy.targetX = spikyGuy.x - 80;
        fancyGuy.targetY = spikyGuy.y;
      }
    } else if (currentPhase === 'CLIMAX_SHOT') {
      headline = t.story.climaxShotHeadline;
      subheadline = t.story.climaxShotSub;
      isImportant = true;
      nextPhase = 'CLIMAX_MASSACRE';
      soundManager.playBoom();
      // The formerly crazed square dies instantly
      const spikyGuy = peepsRef.current.find(p => p.emotion === 'crazed');
      if (spikyGuy) {
        spikyGuy.emotion = 'dead';
        spikyGuy.bloodPool = 45;
      }
      // Everyone grabs weapons or goes crazy
      peepsRef.current.forEach(p => {
        if (!p.isCricket && p.emotion !== 'in_love' && p.emotion !== 'dead') {
          p.emotion = Math.random() < 0.5 ? 'armed' : 'crazed';
        }
      });
    } else if (currentPhase === 'CLIMAX_MASSACRE' && (hasArmed || hasShoutingCircle || hasShoutingSquare)) {
      headline = t.story.climaxHeadline;
      subheadline = t.story.climaxSub;
      isImportant = true;
      soundManager.playBoom();
    }

    const newPhoto: CapturedPhoto = {
      id: 'photo_' + Date.now(),
      timestamp: Date.now(),
      headline,
      subheadline,
      phase: nextPhase,
      imageData: snippetDataUrl,
      isImportant,
      tags,
    };

    latestPhotoRef.current = newPhoto;
    // Carica l'immagine in cache una sola volta (evita sfarfallio sulla TV)
    const cachedImg = new Image();
    cachedImg.src = snippetDataUrl;
    tvImageRef.current = cachedImg;
    onPhotoTaken(newPhoto);

    if (nextPhase !== currentPhase) {
      onPhaseChange(nextPhase);
    }
  };

  return (
    <div className="relative w-full aspect-video max-h-[80vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex items-center justify-center select-none touch-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="w-full h-full object-contain cursor-none"
      />

      {phase !== 'EPILOGUE' && (
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 flex items-center space-x-2 text-xs font-bold text-slate-300 pointer-events-none shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span>{t.cameraTip}</span>
        </div>
      )}
    </div>
  );
};
