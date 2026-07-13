import { StatItem } from '../types';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the bottom stats HUD cards.
 * 
 * @param stats HUD stat cards data array.
 * @returns SVG elements string.
 */
export function renderStatCards(stats: StatItem[]): string {
  const cardW = 260, cardGap = 30, cardY = 1315, cardH = 82;

  return stats.map((s, i) => {
    const cx = 60 + i * (cardW + cardGap);
    const safeIcon = escapeXml(s.icon);
    const safeLabel = escapeXml(s.lbl);
    const safeVal = escapeXml(s.val);
    const safeSub = escapeXml(s.sub);
    
    return `
    <g>
      <!-- Glassmorphic stat card -->
      <rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="18" fill="#ffffff" fill-opacity="0.28" style="backdrop-filter: blur(10px);" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.2" />
      <text x="${cx + 16}" y="${cardY + 22}" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#334155" font-weight="900" letter-spacing="1">${safeIcon}  ${safeLabel}</text>
      <text x="${cx + 16}" y="${cardY + 48}" font-family="'Space Grotesk', sans-serif" font-size="19" fill="#0f172a" font-weight="900">${safeVal}</text>
      <text x="${cx + 16}" y="${cardY + 68}" font-family="'Inter', sans-serif" font-size="10" fill="#334155" font-weight="700" opacity="0.8">${safeSub}</text>
    </g>`;
  }).join('\n');
}
