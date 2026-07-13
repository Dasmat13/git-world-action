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
    treesMarkup += `
    <g transform="translate(${t.x}, ${t.y}) scale(${t.s})" class="${delayClass}">
      <!-- Trunk -->
      <rect x="-1" y="0" width="2" height="28" fill="#4a3728" />
      <!-- Slender Poplar Crown (Flame shape) -->
      <path d="M 0,-65 C -9,-45 -8,-15 0,0 C 8,-15 9,-45 0,-65 Z" fill="#88A94D" fill-opacity="0.9" stroke="#769341" stroke-width="0.8" />
      <!-- Subtle internal leaf highlights -->
      <path d="M 0,-50 C -4,-35 -3,-10 0,0 C 3,-10 4,-35 0,-50 Z" fill="#A5B95C" fill-opacity="0.75" />
    </g>`;
  });

  // 2. Scattered dry alpine grass (already partly drawn in terrain, but let's add some more here near water edges)
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
