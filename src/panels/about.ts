import { ProfileConfig } from '../types';
import { renderGlassPanel } from './glassPanel';
import { escapeXml } from '../utils/xml-sanitizer';

/**
 * Renders the traveler's detail info panel.
 * 
 * @param config Profile layout configuration.
 * @returns SVG elements string.
 */
export function renderAboutPanel(config: ProfileConfig): string {
  const safeEmail = escapeXml(config.email);
  const safeContact = escapeXml(config.contact);

  return `
  <!-- ═══ ABOUT ME PANEL ═══ -->
  ${renderGlassPanel(480, 170, '⚡  ABOUT THE TRAVELER', '#4EC7E8')}
  <text x="70" y="530" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#1e293b">CORE INTERESTS:</tspan> Infrastructure automation, Cloud-Native scaling, Self-healing architectures
  </text>
  <text x="70" y="575" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#1e293b">CONTRIBUTING TO:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="70" y="620" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#1e293b">CONTACT:</tspan> ${safeEmail}   ·   ⚡  ${safeContact}
  </text>`;
}
