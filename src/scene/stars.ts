import { WorldData } from '../world';
import { getSeededRand } from '../utils/random';

/**
 * Renders the space, star grid, Milky Way path, and shooting stars.
 */
export function renderStars(world: WorldData): string {
  const rand = getSeededRand(world.username + '_stars');
  
  // Star grid
  let starsMarkup = '';
  for (let i = 0; i < 180; i++) {
    const sx = rand.range(0, 960);
    const sy = rand.range(0, 480);
    const size = rand.range(0.8, 2.2);
    const op = rand.range(0.3, 0.95);
    const delay = rand.range(0, 3.5).toFixed(2);
    starsMarkup += `<circle cx="${sx}" cy="${sy}" r="${size}" fill="#ffffff" class="star-blink" style="animation-delay: ${delay}s; opacity: ${op};" />\n`;
  }
  
  // Milky Way band
  const milkyWay = `<path d="M 0,220 Q 300,100 600,180 T 960,80 L 960,180 Q 600,260 300,160 Z" fill="#93c5fd" opacity="0.06" filter="url(#haze-heavy)" />`;
  
  // Shooting Stars
  const shootingStars = `
    <line x1="0" y1="0" x2="-80" y2="40" stroke="#ffffff" stroke-width="1.5" class="shooting-star" stroke-linecap="round" />
  `;

  return `
  <!-- Space, starry sky and Milky Way band -->
  <g opacity="${world.timeOfDay === 'night' ? '1' : world.timeOfDay === 'dawn' || world.timeOfDay === 'dusk' ? '0.35' : '0'}">
    ${milkyWay}
    ${starsMarkup}
    ${shootingStars}
  </g>`;
}
