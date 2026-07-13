import { ProfileConfig } from '../types';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the header greeting card with dynamic name and tagline configurations.
 * 
 * @param config Profile layout configuration.
 * @returns SVG elements string.
 */
export function renderHeaderPanel(config: ProfileConfig): string {
  const safeName = escapeXml(config.name);
  const safeTagline = escapeXml(config.tagline);

  return `
  <!-- ═══ HERO HEADER (Apple Glass style) ═══ -->
  <g transform="translate(180, 320)">
    <!-- Glassmorphic Main Box -->
    <rect x="0" y="0" width="600" height="120" rx="28" fill="#ffffff" fill-opacity="0.28" style="backdrop-filter: blur(14px);" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.2"/>
    
    <!-- Left accent pill stripe -->
    <rect x="4" y="4" width="8" height="112" rx="4" fill="#4EC7E8" fill-opacity="0.8" />

    <text x="310" y="55" font-family="'Space Grotesk', sans-serif" font-size="34" fill="#0f172a" text-anchor="middle" font-weight="900">HI, I'M ${safeName.toUpperCase()} ⚡</text>
    <text x="310" y="88" font-family="'Inter', sans-serif" font-size="13" fill="#334155" font-weight="700" text-anchor="middle" letter-spacing="0.5">
      ${safeTagline.toUpperCase()}
    </text>
  </g>`;
}
