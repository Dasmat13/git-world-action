import { WorldData } from '../world';
import { getSeededRand } from '../utils/random';
import { Point, bezierOpen } from '../utils/bezier';

/**
 * Renders the winding mountain loop road and animated vehicle.
 */
export function renderRoads(world: WorldData): string {
  const rand = getSeededRand(world.username + '_roads');
  
  const roadPoints: Point[] = [
    { x: 750, y: 720 },
    { x: 890, y: 780 },
    { x: 800, y: 840 },
    { x: 250, y: 920 },
    { x: 120, y: 970 },
    { x: 220, y: 1040 },
    { x: 780, y: 1110 },
    { x: 880, y: 1170 }
  ];
  
  const roadPathD = bezierOpen(roadPoints);
  
  // Retaining walls
  let wallHashes = '';
  for (let i = 0; i < roadPoints.length - 1; i++) {
    const p1 = roadPoints[i];
    const p2 = roadPoints[i + 1];
    
    if (i % 2 === 0) {
      const steps = 15;
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        const rx = p1.x + (p2.x - p1.x) * t;
        const ry = p1.y + (p2.y - p1.y) * t;
        wallHashes += `<line x1="${rx}" y1="${ry}" x2="${rx}" y2="${ry + 8}" stroke="#4b5563" stroke-width="2.2" />\n`;
      }
    }
  }

  // Winding vehicle
  const vehicle = `
  <g>
    <rect x="-6" y="-3" width="12" height="6" rx="1.5" fill="#ef4444" />
    <rect x="0" y="-2.5" width="5" height="5" rx="0.5" fill="#ffffff" opacity="0.6" />
    <circle cx="-3" cy="3" r="1.5" fill="#1f2937" />
    <circle cx="3" cy="3" r="1.5" fill="#1f2937" />
    <animateMotion dur="25s" repeatCount="indefinite" rotate="auto" path="${roadPathD}" />
  </g>`;

  return `
  <!-- Winding dirt road base -->
  <path d="${roadPathD}" fill="none" stroke="#d7ccc8" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <path d="${roadPathD}" fill="none" stroke="#8d6e63" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2,5" stroke-opacity="0.3" />
  
  <!-- Retaining Walls -->
  <g>${wallHashes}</g>

  <!-- Moving vehicle -->
  ${vehicle}
  `;
}
