import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders an Apple-style Glassmorphic panel container with a title badge.
 * 
 * @param y Vertical Y offset.
 * @param h Height of the card panel.
 * @param title Header title of the card.
 * @param badgeBg Fill color of the title badge.
 * @returns SVG elements string.
 */
export function renderGlassPanel(y: number, h: number, title: string, badgeBg = '#4EC7E8'): string {
  const rx = 28, x = 40, w = 960 - 80;
  const badgeW = title.length * 8.5 + 24;
  const badgeH = 28;
  const safeTitle = escapeXml(title);

  return `
  <g class="panel">
    <!-- Card Main Box with Apple-style Frosted Glassmorphism -->
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#ffffff" fill-opacity="0.28" style="backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.2" />
    
    <!-- Badge Main (Soft rounded pill) -->
    <rect x="${x + 31}" y="${y - 14}" width="${badgeW}" height="${badgeH}" rx="14" fill="${badgeBg}" fill-opacity="0.85" />
    <text x="${x + 31 + badgeW / 2}" y="${y + 4}" font-family="'Space Grotesk', sans-serif" font-size="11.5" fill="#ffffff" font-weight="900" text-anchor="middle" letter-spacing="1">${safeTitle}</text>
  </g>`;
}
