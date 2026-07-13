import { WorldData } from '../world';
import { renderGlassPanel } from './glassPanel';

/**
 * Renders the traveler's skill tags styled like climbing equipment labels.
 */
export function renderTech(world: WorldData): string {
  const skills = [
    { name: 'Kubernetes', icon: '🏔' },
    { name: 'Docker', icon: '🏕' },
    { name: 'GoLang', icon: '🧭' },
    { name: 'Linux', icon: '🥾' },
    { name: 'AWS Cloud', icon: '🛰' },
    { name: 'Terraform', icon: '⛰' }
  ];

  let tagsMarkup = '';
  skills.forEach((s, idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const tx = col * 135;
    const ty = 28 + row * 34;
    
    tagsMarkup += `
    <g transform="translate(${tx}, ${ty})">
      <!-- Label tag container -->
      <rect width="124" height="25" rx="6" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="0.8" />
      <text x="8" y="16" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#f1f5f9">${s.icon} ${s.name}</text>
    </g>`;
  });

  const content = `
  <text x="0" y="8" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="15" fill="#4EC7E8">EXPEDITION GEAR / STACK</text>
  <g>${tagsMarkup}</g>`;

  return renderGlassPanel(30, 1285, 435, 115, content);
}
