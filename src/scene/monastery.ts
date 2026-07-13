import { WorldData } from '../world';
import { getSeededRand, SeededRand } from '../utils/random';

export interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  roof: 'flat' | 'gold' | 'temple';
  floors: number;
}

/**
 * Generates the terraced buildings layout for Key Monastery using a seeded random.
 */
function generateBuildings(rand: SeededRand): Building[] {
  const buildings: Building[] = [];
  let currentY = 0;

  for (let terrace = 0; terrace < 8; terrace++) {
    // 5 to 10 buildings per terrace layer
    const count = 5 + Math.floor(rand.range(0, 6));
    for (let i = 0; i < count; i++) {
      buildings.push({
        x: terrace * 15 + i * 16 + rand.range(-6, 6),
        y: currentY + rand.range(-3, 3),
        width: 14 + rand.range(0, 16),
        height: 12 + rand.range(0, 15),
        floors: 1 + Math.floor(rand.range(0, 3)),
        roof: rand.next() > 0.88 ? 'gold' : 'flat'
      });
    }
    // Step up for the next terrace
    currentY -= 14;
  }
  return buildings;
}

/**
 * Renders windows for a building based on floors.
 */
function renderWindows(b: Building): string {
  let out = '';
  const cols = Math.max(2, Math.floor(b.width / 6));
  for (let r = 0; r < b.floors; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = 3 + c * 5 + (b.width - cols * 5) / 2;
      const wy = 5 + r * 6;
      out += `<rect x="${wx}" y="${wy}" width="2.2" height="3" fill="#1f2937" rx="0.3" />\n`;
    }
  }
  return out;
}

/**
 * Renders monastery roof spires.
 */
function renderRoof(b: Building): string {
  if (b.roof === 'gold') {
    return `
    <polygon points="0,0 ${b.width / 2},-6 ${b.width},0" fill="#f6c948" />
    <line x1="${b.width / 2}" y1="-6" x2="${b.width / 2}" y2="-12" stroke="#f6c948" stroke-width="1.2" />
    <circle cx="${b.width / 2}" cy="-12" r="1.5" fill="#f6c948" />`;
  }
  return '';
}

/**
 * Renders a single modular building.
 */
function renderBuilding(b: Building): string {
  return `
  <g transform="translate(${b.x}, ${b.y})">
    <!-- Ambient occlusion base shadow -->
    <rect x="-1" y="-1" width="${b.width + 2}" height="${b.height + 2}" rx="2.5" fill="var(--monastery-shadow)" />
    
    <!-- White washed brick walls -->
    <rect width="${b.width}" height="${b.height}" rx="2" fill="#faf9f6" stroke="#e5e5e5" stroke-width="0.8" />
    
    <!-- Red monastery band (parapet top) -->
    <rect y="2" width="${b.width}" height="3" fill="#7d1d1d" />
    
    <!-- Dynamic windows and roofs -->
    ${renderWindows(b)}
    ${renderRoof(b)}
    
    <!-- Sunlight top highlight -->
    <line x1="1" y1="0.5" x2="${b.width - 1}" y2="0.5" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.8" />
  </g>`;
}

/**
 * Compiles and renders the procedural Key Monastery.
 */
export function renderMonastery(world: WorldData): string {
  const rand = getSeededRand(world.username + '_monastery');
  const buildings = generateBuildings(rand);

  // Group building markup
  const buildingsMarkup = buildings.map(b => renderBuilding(b)).join('\n');

  // Generate stairs connecting terraces
  let stairsMarkup = '';
  for (let i = 0; i < 7; i++) {
    const sx = 40 + i * 22;
    const sy = -i * 14 + 10;
    stairsMarkup += `
    <g transform="translate(${sx}, ${sy})" stroke="#78716c" stroke-width="1.2">
      <!-- Staircase lines -->
      <line x1="0" y1="0" x2="10" y2="-8" />
      <line x1="2" y1="-2" x2="12" y2="-10" />
      <line x1="4" y1="-4" x2="14" y2="-12" />
    </g>`;
  }

  // Rooftop prayer flags
  let flagsMarkup = '';
  for (let i = 0; i < buildings.length - 1; i += 2) {
    const b1 = buildings[i];
    const b2 = buildings[i + 1];
    
    const x1 = b1.x + b1.width / 2;
    const y1 = b1.y - (b1.roof === 'gold' ? 8 : 0);
    const x2 = b2.x + b2.width / 2;
    const y2 = b2.y - (b2.roof === 'gold' ? 8 : 0);
    
    const colors = ['#3b82f6', '#ffffff', '#ef4444', '#10b981', '#fbbf24'];
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 + 6; // drape drop
    
    flagsMarkup += `
    <g class="flag-flutter">
      <path d="M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}" fill="none" stroke="#a8a29e" stroke-width="0.8" stroke-dasharray="1.5,1.5" />
      <polygon points="${midX - 4},${midY - 1} ${midX - 1},${midY + 3} ${midX - 2},${midY - 3}" fill="${colors[0]}" />
      <polygon points="${midX},${midY - 1} ${midX + 3},${midY + 3} ${midX + 2},${midY - 3}" fill="${colors[2]}" />
    </g>`;
  }

  // Kitchen smoke using animateTransform
  const smoke = `
  <!-- Kitchen smoke vents -->
  <g transform="translate(100, -100)" opacity="0.35">
    <path d="M 0,0 C -5,-15 -2,-30 -8,-45 C -12,-60 -8,-75 -15,-90" fill="none" stroke="#e5e5e5" stroke-width="5" stroke-linecap="round" filter="url(#haze-light)">
      <animateTransform attributeName="transform" type="translate" values="0,0; 2,-15; -4,-30" dur="4s" repeatCount="indefinite" />
    </path>
  </g>`;

  return `
  <!-- Key Monastery procedural container located on the rock shelf -->
  <g id="key-monastery" transform="translate(680, 310)">
    <!-- Cliff blending backdrop shadow -->
    <ellipse cx="60" cy="20" rx="90" ry="25" fill="#4a3728" opacity="0.45" filter="url(#haze-medium)" />
    
    <!-- Staircases -->
    ${stairsMarkup}

    <!-- Stacked terraced structures -->
    ${buildingsMarkup}
    
    <!-- Kitchen smoke -->
    ${smoke}

    <!-- Rooftop Prayer Flags -->
    ${flagsMarkup}
  </g>`;
}
