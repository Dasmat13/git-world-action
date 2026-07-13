import { TimeOfDay } from './world';
import { BiomePalette } from './types';

/**
 * Color palettes mapped per TimeOfDay for the Spiti Valley biome.
 */
export const themePalettes: Record<TimeOfDay, BiomePalette> = {
  night: {
    sky: ['#060814', '#0d1127', '#1c2242'],
    sunColor: '#ffffff',
    mountainFill1: '#1b1429',
    mountainFill2: '#2c223a',
    hill1: '#211a18',
    hill2: '#16100d',
    hill3: '#0c0806',
    waterColor: '#1d4ed8'
  },
  dawn: {
    sky: ['#f472b6', '#fb923c', '#fef08a'],
    sunColor: '#fbbf24',
    mountainFill1: '#584670',
    mountainFill2: '#6e5741',
    hill1: '#bfa780',
    hill2: '#a8916b',
    hill3: '#8c7653',
    waterColor: '#38bdf8'
  },
  day: {
    sky: ['#3b82f6', '#60a5fa', '#93c5fd'],
    sunColor: '#f97316',
    mountainFill1: '#5D6670',
    mountainFill2: '#7A624A',
    hill1: '#C7B08A',
    hill2: '#b8a27c',
    hill3: '#9e8863',
    waterColor: '#4EC7E8'
  },
  dusk: {
    sky: ['#881337', '#be123c', '#fb7185'],
    sunColor: '#fbbf24',
    mountainFill1: '#431962',
    mountainFill2: '#532470',
    hill1: '#78430c',
    hill2: '#63360f',
    hill3: '#3b1c05',
    waterColor: '#ec4899'
  }
};

/**
 * Retrieves the theme palette for the active time of day.
 * Throws a strict error if an invalid or unmapped time of day is requested.
 * 
 * @param timeOfDay Active time of day.
 * @returns Correct biome color palette.
 */
export function getPalette(timeOfDay: TimeOfDay): BiomePalette {
  const palette = themePalettes[timeOfDay];
  if (!palette) {
    throw new Error(`Exhaustive check failure: Invalid TimeOfDay key "${timeOfDay}"`);
  }
  return palette;
}
