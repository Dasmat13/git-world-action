import { WorldData } from '../world';
import { ProfileConfig } from '../types';

/**
 * Renders the poplars trees and scattered desert grass tufts in the valley.
 * 
 * @param world Active world metadata.
 * @param config Card layout profile config.
 * @returns SVG elements string.
 */
export function renderVegetationLayer(world: WorldData, config: ProfileConfig): string {
  const poplarsMarkup = config.poplars.map(t => `
  <g transform="translate(${t.x}, ${t.y}) scale(${t.s})" class="${t.delay}">
    <!-- Trunk -->
    <rect x="-1" y="0" width="2" height="24" fill="#5c4033" />
    <!-- Slender Poplar Crown -->
    <path d="M 0,-56 C -11,-36 -9,-10 0,0 C 9,-10 11,-36 0,-56 Z" fill="#88A94D" fill-opacity="0.9" />
  </g>
  `).join('\n');

  const grassMarkup = config.grass.map(g => `
  <g transform="translate(${g.x}, ${g.y})">
    <path d="M0,0 Q-4,-12 -8,-15 Q-2,-12 0,0 Q3,-14 6,-18 Q2,-10 0,0 Q8,-10 12,-12 Q5,-8 0,0" fill="#88A94D" fill-opacity="0.8" />
  </g>
  `).join('\n');

  return `
  <!-- Poplar Trees -->
  ${poplarsMarkup}
  
  <!-- Grass Tufts -->
  ${grassMarkup}`;
}
