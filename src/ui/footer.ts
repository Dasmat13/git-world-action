import { WorldData } from '../world';

/**
 * Renders a simple, clean brand signature footer.
 */
export function renderFooter(world: WorldData): string {
  return `
  <!-- Footer Brand Metadata Overlay -->
  <g transform="translate(480, 1422)">
    <text x="0" y="0" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="11" fill="#94a3b8" opacity="0.6" text-anchor="middle" letter-spacing="1.5">
      GITWORLD ENGINE • SPITI VALLEY EDITION
    </text>
  </g>`;
}
