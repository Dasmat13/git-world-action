import { WorldData } from '../world';
import { renderGlassPanel } from './glassPanel';

/**
 * Renders the Observatory Telemetry Stats panel.
 */
export function renderStats(world: WorldData): string {
  const commits = world.stats?.commits ?? 1240;
  const stars = world.stats?.stars ?? 38;
  const prs = world.stats?.prs ?? 112;

  const content = `
  <text x="0" y="8" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="15" fill="#4EC7E8">OBSERVATORY TELEMETRY</text>
  
  <!-- Stat Columns -->
  <g transform="translate(0, 30)">
    <!-- Commits / Altitude -->
    <g transform="translate(0, 0)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-weight="700" font-size="10" fill="#94a3b8" letter-spacing="1">ALTITUDE (COMMITS)</text>
      <text x="0" y="20" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="15" fill="#ffffff">${commits} m</text>
    </g>
    
    <!-- Stars / Expedition -->
    <g transform="translate(145, 0)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-weight="700" font-size="10" fill="#94a3b8" letter-spacing="1">EXPEDITION (STARS)</text>
      <text x="0" y="20" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="15" fill="#ffffff">${stars} ★</text>
    </g>
    
    <!-- PRs / Journey -->
    <g transform="translate(290, 0)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-weight="700" font-size="10" fill="#94a3b8" letter-spacing="1">JOURNEY (PULLS)</text>
      <text x="0" y="20" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="15" fill="#ffffff">${prs} prs</text>
    </g>
  </g>`;

  return renderGlassPanel(495, 1150, 435, 115, content);
}
