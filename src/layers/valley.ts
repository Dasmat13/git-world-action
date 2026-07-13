import { WorldData } from '../world';
import { ProfileConfig } from '../types';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the cold desert terrain slopes, glacial Spiti River, and text marquee.
 * All layers use central CSS variable bindings.
 * 
 * @param world Active world metadata.
 * @param config Card layout profile config.
 * @returns SVG elements string.
 */
export function renderValleyLayer(world: WorldData, config: ProfileConfig): string {
  const safeMarquee = escapeXml(config.marqueeText);

  return `
  <!-- Dry desert valley background -->
  <rect x="0" y="340" width="960" height="1100" fill="var(--hill1)" />
  
  <!-- Spiti River (Glacial blue path winding diagonally) -->
  <path d="M 480,340 Q 300,550 720,850 T 150,1200 T 600,1440" fill="none" stroke="var(--water)" stroke-width="60" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 480,340 Q 300,550 720,850 T 150,1200 T 600,1440" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="15,20" stroke-linecap="round" />
  
  <!-- Cold Desert Middle foothill -->
  <path d="M -20,680 Q 400,640 980,720 L 980,1450 L -20,1450 Z" fill="var(--hill2)" />
  
  <!-- Cold Desert Foreground foothill -->
  <path d="M -20,980 Q 550,1030 980,950 L 980,1450 L -20,1450 Z" fill="var(--hill3)" />
  
  <!-- Shoreline Text Marquee - glassmorphic, outline-free -->
  <g class="marquee" transform="translate(0, 440)">
    <rect x="-10" y="0" width="980" height="32" fill="#ffffff" fill-opacity="0.25" style="backdrop-filter: blur(8px);" />
    <text font-family="'Space Grotesk', sans-serif" font-size="12.5" font-weight="800" fill="#0f172a" letter-spacing="1.5">
      ${safeMarquee}
    </text>
  </g>`;
}
