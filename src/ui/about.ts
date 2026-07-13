import { WorldData } from '../world';
import { renderGlassPanel } from './glassPanel';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the traveler's bio / Logbook panel.
 */
export function renderAbout(world: WorldData): string {
  const bio = escapeXml(world.bio || 'Scaling Cloud Infrastructure from high-altitude bases.');
  const location = escapeXml(world.location || 'Kibber, Spiti (4205m)');
  
  const content = `
  <text x="0" y="8" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="15" fill="#4EC7E8">TRAVEL LOG / BIO</text>
  
  <!-- Bio lines -->
  <text x="0" y="32" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#f1f5f9">${bio}</text>
  
  <!-- Location Details tag -->
  <g transform="translate(0, 68)">
    <path d="M 0,-12 C -4,-16 -6,-16 -6,-12 C -6,-8 0,0 0,0 C 0,0 6,-8 6,-12 C 6,-16 4,-16 0,-12 Z" fill="#D96C5F" />
    <circle cx="0" cy="-12" r="2.5" fill="#ffffff" />
    <text x="14" y="-3" font-family="'Inter', sans-serif" font-weight="600" font-size="12" fill="#94a3b8">${location}</text>
  </g>`;

  return renderGlassPanel(30, 1150, 435, 115, content);
}
