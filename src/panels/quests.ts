import { QuestItem } from '../types';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the traveler's list of current journeys and active quests.
 * 
 * @param quests List of quest items.
 * @returns SVG elements string.
 */
export function renderQuestsList(quests: QuestItem[]): string {
  return quests.map((q, i) => {
    const qy = 1084 + i * 38;
    const safeTitle = escapeXml(q.t);
    const safeStatus = escapeXml(q.s);
    return `
    <g transform="translate(60, ${qy})">
      <!-- Bullet Circle -->
      <circle cx="6" cy="0" r="4.5" fill="${q.bg}" />
      <text x="24" y="5" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
        ${safeTitle}
      </text>
      
      <!-- Status pill badge -->
      <g transform="translate(680, -11)">
        <rect x="0" y="0" width="130" height="22" rx="11" fill="${q.bg}" fill-opacity="0.15" stroke="${q.bg}" stroke-opacity="0.3" stroke-width="1" />
        <text x="65" y="14" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#0f172a" font-weight="900" text-anchor="middle" letter-spacing="0.5">
          ${safeStatus.toUpperCase()}
        </text>
      </g>
    </g>`;
  }).join('\n');
}
