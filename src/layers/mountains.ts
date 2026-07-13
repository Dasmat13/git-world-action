import { WorldData } from '../world';
import { ProfileConfig } from '../types';

/**
 * Renders the steep barren peaks and snowcaps of Spiti Valley.
 * All shapes use var(--mt1) and var(--mt2) to reference clean animated values.
 * 
 * @param world Active world metadata.
 * @param config Card layout profile config.
 * @returns SVG elements string.
 */
export function renderMountainsLayer(world: WorldData, config: ProfileConfig): string {
  return `
  <!-- Layer 1 (Distant back peak left) -->
  <polygon points="260,180 50,344 470,344" fill="var(--mt1)" />
  <!-- Layer 2 (Distant back peak right) -->
  <polygon points="700,190 480,344 920,344" fill="var(--mt1)" />
  
  <!-- Layer 3 (Highest peak center-left with Snow Cap) -->
  <g>
    <polygon points="380,120 120,344 380,344" fill="var(--mt2)" />
    <polygon points="380,120 380,344 640,344" fill="var(--mt1)" />
    <polygon points="380,120 330,180 380,180" fill="#ffffff" />
    <polygon points="380,120 380,180 430,180" fill="#f1f5f9" />
  </g>
  
  <!-- Layer 4 (Mid Peak Right supporting Key Monastery) -->
  <g>
    <polygon points="760,140 500,344 760,344" fill="var(--mt2)" />
    <polygon points="760,140 760,344 1020,344" fill="var(--mt1)" />
    <polygon points="760,140 720,190 760,190" fill="#ffffff" />
    <polygon points="760,140 760,190 800,190" fill="#f1f5f9" />
  </g>`;
}
