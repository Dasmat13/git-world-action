import { WorldData } from '../world';
import { renderGlassPanel } from './glassPanel';
import { getSeededRand } from '../utils/random';

/**
 * Renders the traveler's contribution grid styled like agricultural terraced fields.
 * Slanted polygon shapes filled with soil, grass, or flowers depending on contribution activity.
 */
export function renderContribution(world: WorldData): string {
  const rand = getSeededRand(world.username + '_contrib');
  
  let gridMarkup = '';
  const cellWidth = 44;
  const cellHeight = 12;
  
  // Generate 4 rows by 16 columns of terraced steps
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 16; col++) {
      const cx = col * 50 + row * 4;
      const cy = row * 16 + 10;
      
      const activity = rand.next();
      let color = '#d6d3d1'; // Cold winter soil
      if (activity > 0.88) {
        color = '#ef4444'; // Red alpine flowers
      } else if (activity > 0.55) {
        color = '#88A94D'; // Lush high-altitude green grass
      } else if (activity > 0.22) {
        color = '#A5B95C'; // Pale early-spring yellow-green grass
      }
      
      // Slanted agricultural step polygon
      gridMarkup += `
      <polygon points="${cx},${cy} ${cx + cellWidth},${cy - 2} ${cx + cellWidth - 3},${cy + cellHeight} ${cx - 3},${cy + cellHeight}" 
               fill="${color}" stroke="#a8a29e" stroke-width="0.6" opacity="0.85" />`;
    }
  }

  const content = `
  <text x="0" y="0" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="14" fill="#4EC7E8">TERRACED VALLEY FIELDS / CONTRIBUTIONS</text>
  <g transform="translate(18, 22)">
    ${gridMarkup}
  </g>`;

  return renderGlassPanel(30, 995, 900, 125, content);
}
