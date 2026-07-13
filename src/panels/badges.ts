import { SkillBadge } from '../types';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders a list of skill badges in a responsive 4-column layout grid.
 * 
 * @param skills List of skill badges.
 * @returns SVG elements string.
 */
export function renderSkillsGrid(skills: SkillBadge[]): string {
  const bxs = [70, 280, 490, 700];
  const BR = [836, 896, 956];
  
  return skills.map((s, i) => {
    const bx = bxs[i % 4];
    const by = BR[Math.floor(i / 4)];
    const safeName = escapeXml(s.n);
    return `
    <g>
      <!-- Pill base -->
      <rect x="${bx}" y="${by}" width="180" height="30" rx="15" fill="${s.bg}" fill-opacity="0.15" stroke="${s.bg}" stroke-opacity="0.3" stroke-width="1.2" />
      <text x="${bx + 90}" y="${by + 19}" font-family="'Space Grotesk', sans-serif" font-size="11.5" fill="#0f172a" font-weight="900" text-anchor="middle">${safeName.toUpperCase()}</text>
    </g>`;
  }).join('\n');
}
