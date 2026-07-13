import { WorldData } from '../world';
import { renderGlassPanel } from './glassPanel';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the top Hero/Introduction panel.
 */
export function renderHero(world: WorldData): string {
  const username = escapeXml(world.username);
  const title = escapeXml(world.bio || 'Cloud Native Explorer');
  
  const content = `
  <!-- User Profile Avatar/旅行 Badge -->
  <g transform="translate(10, 5)">
    <circle cx="25" cy="25" r="25" fill="#4EC7E8" opacity="0.2" />
    <path d="M 15,36 C 15,29 20,26 25,26 C 30,26 35,29 35,36 Z" fill="#4EC7E8" />
    <circle cx="25" cy="18" r="6" fill="#4EC7E8" />
  </g>
  
  <!-- Info Text -->
  <g transform="translate(76, 20)">
    <text x="0" y="0" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="22" fill="#ffffff">${username}</text>
    <text x="0" y="18" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#94a3b8">${title}</text>
  </g>

  <!-- Expedition Status Tag -->
  <g transform="translate(710, 14)">
    <rect width="130" height="28" rx="14" fill="rgba(78, 199, 232, 0.15)" stroke="#4EC7E8" stroke-width="1.2" />
    <text x="65" y="18" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#4EC7E8" text-anchor="middle">ACTIVE TREKKER</text>
  </g>`;

  return renderGlassPanel(30, 50, 900, 100, content);
}
