import { WorldData, TimeOfDay, WeatherType } from './world';

/**
 * Palette containing colors for a specific time of day in a biome.
 */
export interface BiomePalette {
  sky: [string, string, string];
  sunColor: string;
  mountainFill1: string;
  mountainFill2: string;
  hill1: string;
  hill2: string;
  hill3: string;
  waterColor: string;
}

/**
 * Skill badge data layout.
 */
export interface SkillBadge {
  n: string;
  bg: string;
}

/**
 * Active quest items.
 */
export interface QuestItem {
  t: string;
  s: string;
  bg: string;
}

/**
 * Stats HUD cards.
 */
export interface StatItem {
  icon: string;
  lbl: string;
  val: string;
  sub: string;
  bg: string;
}

/**
 * Externalized layout and profile content config.
 */
export interface ProfileConfig {
  name: string;
  tagline: string;
  contact: string;
  email: string;
  skills: SkillBadge[];
  quests: QuestItem[];
  stats?: (world: WorldData) => StatItem[];
  repoLink: string;
  
  // Vector coordinates
  monasteryPos: { x: number; y: number };
  poplars: Array<{ x: number; y: number; s: number; delay: 'pine' | 'pine-delay' }>;
  grass: Array<{ x: number; y: number }>;
  stars: Array<{ cx: number; cy: number; r: number; delay: string }>;
  prayerFlagsPos: { x: number; y: number };
  marqueeText: string;
}
