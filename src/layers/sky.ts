import { WorldData } from '../world';
import { ProfileConfig } from '../types';

/**
 * Renders the sky background container, celestial pulsing sun/moon, and twinkling stars.
 * 
 * @param world Current active world data.
 * @param config Profile layout configuration.
 * @returns SVG elements string.
 */
export function renderSkyLayer(world: WorldData, config: ProfileConfig): string {
  const starsMarkup = config.stars.map(s => 
    `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="#ffffff" class="twinkle" style="animation-delay: ${s.delay};" />`
  ).join('');

  return `
  <!-- Sky background -->
  <rect width="960" height="500" fill="url(#skyGrad)"/>
  
  <!-- Pulsing celestial sun/moon -->
  <circle cx="480" cy="180" r="75" fill="var(--sun-color)" class="sun" />
  
  <!-- Twinkling Stars -->
  ${starsMarkup}`;
}
