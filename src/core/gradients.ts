import { TimeOfDay } from '../world';
import { TIME_PALETTES } from './palette';

/**
 * Returns SVG gradients definitions based on the active time of day.
 * 
 * @param activeTime Current time of day.
 * @returns SVG gradients markup.
 */
export function renderSVGGradients(activeTime: TimeOfDay): string {
  const p = TIME_PALETTES[activeTime];
  return `
  <!-- Sky Gradient -->
  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="var(--sky-top, ${p.skyTop})" />
    <stop offset="100%" stop-color="var(--sky-bot, ${p.skyBottom})" />
  </linearGradient>

  <!-- River Glacial Gradient -->
  <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${p.riverTop}" />
    <stop offset="40%" stop-color="${p.riverBottom}" />
    <stop offset="100%" stop-color="#1d4ed8" />
  </linearGradient>

  <!-- Cliffs Depth Gradient -->
  <linearGradient id="cliffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#C7B08A" />
    <stop offset="100%" stop-color="#8A6C4D" />
  </linearGradient>
  `;
}
