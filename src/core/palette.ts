import { TimeOfDay } from '../world';

/**
 * Spiti Valley specific colors.
 */
export const SPITI_COLORS = {
  dryClay: '#C7B08A',
  silt: '#A88B66',
  deepRock: '#54483C',
  slate: '#6C6458',
  lightSand: '#C9B08C',
  pebbleSand: '#B49572',
  shadowDark: '#3b1c05',
  monasteryRed: '#7d1d1d',
  monasteryWhite: '#faf9f6',
  monasteryGold: '#f6c948',
  glacialBlue: '#37c6ee',
  skyBlueDay: '#3b82f6',
  grassGreen: '#88A94D',
  grassBright: '#A5B95C',
  grassDark: '#769341',
  prayerBlue: '#3b82f6',
  prayerWhite: '#ffffff',
  prayerRed: '#ef4444',
  prayerGreen: '#10b981',
  prayerYellow: '#fbbf24'
};

/**
 * Color palettes mapped per TimeOfDay for the Spiti Valley biome.
 */
export interface TimeOfDayPalette {
  skyTop: string;
  skyBottom: string;
  sunColor: string;
  sunGlow: string;
  hazeColor: string;
  riverTop: string;
  riverBottom: string;
  monasteryShadow: string;
}

export const TIME_PALETTES: Record<TimeOfDay, TimeOfDayPalette> = {
  day: {
    skyTop: '#3b82f6',
    skyBottom: '#93c5fd',
    sunColor: '#f97316',
    sunGlow: 'rgba(249, 115, 22, 0.25)',
    hazeColor: '#cbd5e1',
    riverTop: '#b9f2ff',
    riverBottom: '#37c6ee',
    monasteryShadow: 'rgba(15, 23, 42, 0.1)'
  },
  dusk: {
    skyTop: '#881337',
    skyBottom: '#fb7185',
    sunColor: '#fbbf24',
    sunGlow: 'rgba(251, 191, 36, 0.3)',
    hazeColor: '#f43f5e',
    riverTop: '#fbcfe8',
    riverBottom: '#ec4899',
    monasteryShadow: 'rgba(88, 28, 135, 0.2)'
  },
  night: {
    skyTop: '#060814',
    skyBottom: '#1c2242',
    sunColor: '#ffffff',
    sunGlow: 'rgba(255, 255, 255, 0.4)',
    hazeColor: '#090d1a',
    riverTop: '#1e3a8a',
    riverBottom: '#1d4ed8',
    monasteryShadow: 'rgba(2, 6, 23, 0.4)'
  },
  dawn: {
    skyTop: '#f472b6',
    skyBottom: '#fef08a',
    sunColor: '#fbbf24',
    sunGlow: 'rgba(251, 191, 36, 0.2)',
    hazeColor: '#fed7aa',
    riverTop: '#e0f2fe',
    riverBottom: '#38bdf8',
    monasteryShadow: 'rgba(67, 20, 7, 0.15)'
  }
};
