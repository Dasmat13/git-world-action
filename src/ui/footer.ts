import { WorldData } from '../world';

/**
 * Renders a clean, visible brand signature footer.
 */
export function renderFooter(world: WorldData): string {
  return `
  <!-- Footer Brand Metadata -->
  <g transform="translate(480, 1418)">
    <!-- Semi-transparent background pill -->
    <rect x="-180" y="-12" width="360" height="22" rx="11" fill="rgba(0,0,0,0.35)" />
    <text x="0" y="4" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="10" fill="#e2e8f0" opacity="0.9" text-anchor="middle" letter-spacing="2">
      GITWORLD ENGINE · SPITI VALLEY EDITION
    </text>
  </g>`;
}
