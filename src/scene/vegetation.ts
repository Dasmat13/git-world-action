import { WorldData } from '../world';
import { getSeededRand } from '../utils/random';

/**
 * Renders the poplars trees and dry grass tufts.
 * Poplars are narrow, tall trees clustered close to water.
 */
export function renderVegetation(world: WorldData): string {
  const rand = getSeededRand(world.username + '_vegetation');
  
  // 1. Slender Poplar trees (only near water, e.g. X = 320 to 600)
  const treeCoords = [
    { x: 310, y: 550, s: 0.65 },
    { x: 330, y: 565, s: 0.75 },
    { x: 390, y: 535, s: 0.60 },
    { x: 410, y: 545, s: 0.70 },
    { x: 470, y: 710, s: 0.85 },
    { x: 530, y: 740, s: 0.95 },
    { x: 580, y: 880, s: 1.10 },
    { x: 610, y: 895, s: 1.15 }
  ];

  let treesMarkup = '';
  treeCoords.forEach((t, i) => {
    const delayClass = i % 2 === 0 ? 'pine' : 'pine-delay';
    const trunkH = 22 + rand.range(0, 8);
    treesMarkup += `
    <g transform="translate(${t.x}, ${t.y}) scale(${t.s})" class="${delayClass}">
      <!-- Trunk with visible thickness -->
      <rect x="-2.5" y="0" width="5" height="${trunkH}" rx="1.5" fill="#5c3a21" />
      <!-- Trunk bark highlight -->
      <rect x="-1" y="2" width="2" height="${trunkH - 4}" rx="0.8" fill="#7a5230" opacity="0.5" />
      <!-- Slender Poplar Crown (Flame shape) -->
      <path d="M 0,-58 C -10,-40 -9,-12 0,2 C 9,-12 10,-40 0,-58 Z" fill="#88A94D" fill-opacity="0.92" />
      <!-- Subtle internal leaf highlights -->
      <path d="M 0,-46 C -5,-32 -4,-8 0,2 C 4,-8 5,-32 0,-46 Z" fill="#A5B95C" fill-opacity="0.65" />
      <!-- Light edge highlight -->
      <path d="M 0,-54 C -6,-40 -5,-18 0,0 C 2,-18 3,-40 0,-54 Z" fill="#c0d070" fill-opacity="0.25" />
    </g>`;
  });

  // 2. Scattered dry alpine grass tufts near water edges
  let grassMarkup = '';
  const grassColors = ['#88A94D', '#769341', '#A5B95C'];
  for (let i = 0; i < 40; i++) {
    const gx = rand.range(330, 680);
    const gy = rand.range(400, 1400);
    const color = rand.choice(grassColors);
    grassMarkup += `
    <g transform="translate(${gx}, ${gy})">
      <path d="M0,0 Q-4,-12 -8,-15 Q-2,-12 0,0 Q3,-14 6,-18 Q2,-10 0,0 Q8,-10 12,-12 Q5,-8 0,0" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.8" />
    </g>\n`;
  }

  return `
  <!-- Poplar groves near Spiti river banks -->
  <g id="poplar-groves">
    ${treesMarkup}
  </g>

  <!-- Water reeds and dry grass tufts -->
  <g id="river-grass">
    ${grassMarkup}
  </g>
  `;
}
