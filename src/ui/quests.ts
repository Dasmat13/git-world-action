import { WorldData } from '../world';
import { renderGlassPanel } from './glassPanel';

/**
 * Renders traveler quests structured like checkpoints along a mountain trekking path.
 */
export function renderQuests(world: WorldData): string {
  const defaultQuests = [
    { name: 'Base Camp', status: 'done' },
    { name: 'Pass C1', status: 'done' },
    { name: 'Ridge C2', status: 'active' },
    { name: 'Summit', status: 'todo' }
  ];

  let nodesMarkup = '';
  // Horizontal path line connecting all nodes
  nodesMarkup += `<line x1="20" y1="46" x2="380" y2="46" stroke="#4b5563" stroke-width="2" stroke-linecap="round" />`;
  // Completed segments progress line
  nodesMarkup += `<line x1="20" y1="46" x2="260" y2="46" stroke="#88A94D" stroke-width="2" stroke-linecap="round" />`;

  defaultQuests.forEach((q, idx) => {
    const x = 20 + idx * 120;
    const isDone = q.status === 'done';
    const isActive = q.status === 'active';
    
    let color = '#4b5563';
    let ring = '';
    if (isDone) color = '#88A94D';
    if (isActive) {
      color = '#e3b341';
      ring = `<circle cx="${x}" cy="46" r="8" fill="none" stroke="#e3b341" stroke-width="1.2" opacity="0.8" />`;
    }

    nodesMarkup += `
    <g>
      ${ring}
      <!-- Node circle -->
      <circle cx="${x}" cy="46" r="5" fill="${color}" />
      <!-- Node label text -->
      <text x="${x}" y="70" font-family="'Inter', sans-serif" font-weight="700" font-size="10" fill="#f1f5f9" text-anchor="middle">${q.name}</text>
      <text x="${x}" y="82" font-family="'Inter', sans-serif" font-weight="500" font-size="8" fill="#94a3b8" text-anchor="middle">${q.status.toUpperCase()}</text>
    </g>`;
  });

  const content = `
  <text x="0" y="8" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="15" fill="#4EC7E8">TREKKING ROUTE / QUESTS</text>
  <g>${nodesMarkup}</g>`;

  return renderGlassPanel(495, 1285, 435, 115, content);
}
