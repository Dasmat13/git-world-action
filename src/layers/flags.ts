import { WorldData } from '../world';
import { ProfileConfig } from '../types';

/**
 * Renders the Buddhist prayer flags strand with waving animation.
 * 
 * @param world Active world metadata.
 * @param config Card layout profile config.
 * @returns SVG elements string.
 */
export function renderFlagsLayer(world: WorldData, config: ProfileConfig): string {
  const { x, y } = config.prayerFlagsPos;
  return `
  <!-- Buddhist prayer flags -->
  <g class="flags-wave" transform="translate(${x}, ${y})">
    <path d="M 0,20 Q 100,45 200,30" fill="none" stroke="#78716c" stroke-width="1.2" opacity="0.75" />
    <!-- Small flag triangles -->
    <polygon points="20,24 28,34 32,26" fill="#3b82f6" />
    <polygon points="50,29 58,39 62,31" fill="#ffffff" />
    <polygon points="80,33 88,43 92,35" fill="#ef4444" />
    <polygon points="110,34 118,44 122,36" fill="#10b981" />
    <polygon points="140,32 148,42 152,34" fill="#fbbf24" />
    <polygon points="170,29 178,39 182,31" fill="#3b82f6" />
  </g>`;
}
