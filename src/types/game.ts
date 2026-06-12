export type ShapeType = 'circle' | 'square';

export type EmotionState = 
  | 'normal' 
  | 'happy' 
  | 'hat_happy'
  | 'in_love' 
  | 'bored'
  | 'crazed' 
  | 'docile' // crazed square after getting hat from couple
  | 'scared' 
  | 'angry' 
  | 'snubbing' 
  | 'protesting' // Couple advocating peace
  | 'armed'
  | 'dead';

export interface Peep {
  id: string;
  shape: ShapeType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  emotion: EmotionState;
  hasHat: boolean;
  targetX?: number;
  targetY?: number;
  timer: number;
  interactTargetId?: string;
  shouting: boolean;
  shoutTimer: number;
  scaredTimer: number;
  snubTimer: number;
  partnerId?: string;
  isCricket?: boolean;
  isFancy?: boolean; // The guy who shoots at the climax
  deadAlpha?: number;
  bloodPool?: number;
}

export type StoryPhase =
  | 'INTRO' // Snap anything or Hat Man
  | 'HAT_FAD' // Hats become popular -> Snap hat to kill fad
  | 'CRAZED_APPEARS' // Crazed square appears -> Snap him screaming
  | 'FEAR_SPREADS' // Circles fear squares -> Snap fearful circle
  | 'SNUB_SPREADS' // Squares snub circles -> Snap snubbing square
  | 'HATE_SPREADS' // Active shouting -> Snap mutual shouting
  | 'CLIMAX_SHOT' // Fancy guy points gun and shoots spiky guy
  | 'CLIMAX_MASSACRE' // "BE SCARED BE ANGRY" absolute massacre
  | 'EPILOGUE'; // Zoom out to TV, Couple mourning in front of memorial with candles

export interface CapturedPhoto {
  id: string;
  timestamp: number;
  headline: string;
  subheadline: string;
  phase: StoryPhase;
  imageData: string;
  isImportant: boolean;
  tags: string[];
}

export type GameMode = 'story' | 'sandbox' | 'gallery';

export type Language = 'it' | 'en';
