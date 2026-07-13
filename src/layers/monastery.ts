import { WorldData } from '../world';
import { ProfileConfig } from '../types';

/**
 * Renders a detailed vector representation of Key Monastery on the mountain slopes.
 * Positional coordinates are offset by config.monasteryPos.
 * 
 * @param world Active world metadata.
 * @param config Card layout profile config.
 * @returns SVG elements string.
 */
export function renderMonasteryLayer(world: WorldData, config: ProfileConfig): string {
  const { x, y } = config.monasteryPos;
  return `
  <!-- Key Monastery vectors -->
  <g transform="translate(${x}, ${y})">
    <!-- Main block -->
    <rect x="-8" y="12" width="85" height="50" rx="2" fill="#fafaf9" stroke="#e7e5e4" stroke-width="1" />
    <!-- Stacked Upper Blocks -->
    <rect x="10" y="-8" width="55" height="24" rx="2" fill="#f5f5f4" stroke="#e7e5e4" stroke-width="1" />
    <rect x="25" y="-24" width="30" height="18" rx="2" fill="#e7e5e4" stroke="#d6d3d1" stroke-width="0.8" />
    
    <!-- Flat Dark Red bands representing monastery parapets -->
    <rect x="-8" y="15" width="85" height="5" fill="#991b1b" />
    <rect x="10" y="-5" width="55" height="4" fill="#991b1b" />
    <rect x="25" y="-21" width="30" height="3" fill="#991b1b" />
    
    <!-- Gold Roof Spires -->
    <polygon points="40,-34 37,-24 43,-24" fill="#fbbf24" />
    <polygon points="18,-15 16,-8 20,-8" fill="#fbbf24" />
    <polygon points="62,-15 60,-8 64,-8" fill="#fbbf24" />
    
    <!-- Tiny windows -->
    <rect x="0" y="26" width="5" height="7" rx="0.5" fill="#292524" />
    <rect x="14" y="26" width="5" height="7" rx="0.5" fill="#292524" />
    <rect x="28" y="26" width="5" height="7" rx="0.5" fill="#292524" />
    <rect x="42" y="26" width="5" height="7" rx="0.5" fill="#292524" />
    <rect x="56" y="26" width="5" height="7" rx="0.5" fill="#292524" />
    <rect x="20" y="2" width="4" height="5" rx="0.5" fill="#292524" />
    <rect x="34" y="2" width="4" height="5" rx="0.5" fill="#292524" />
    <rect x="48" y="2" width="4" height="5" rx="0.5" fill="#292524" />
    
    <!-- Small prayer flags strung to the cliff -->
    <line x1="-30" y1="35" x2="-8" y2="25" stroke="#a8a29e" stroke-width="0.8" stroke-dasharray="2,2" />
    <polygon points="-24,32 -20,36 -20,30" fill="#3b82f6" />
    <polygon points="-17,29 -13,33 -13,27" fill="#ef4444" />
  </g>`;
}
