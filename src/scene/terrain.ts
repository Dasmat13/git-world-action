import { WorldData } from '../world';
import { getSeededRand, SeededRand } from '../utils/random';
import { Point } from '../utils/bezier';

export interface TerrainLayer {
  elevation: number;
  roughness: number;
  erosion: number;
  vegetation: number;
  color: string;
}

export function generateTerrain(): TerrainLayer[] {
  return [
    { elevation: 480, roughness: 0.12, erosion: 0.8, vegetation: 0.02, color: '#C7B08A' }, // Back Hill
    { elevation: 760, roughness: 0.20, erosion: 0.45, vegetation: 0.08, color: '#A88B66' }, // Mid Hill
    { elevation: 1040, roughness: 0.34, erosion: 0.22, vegetation: 0.15, color: '#8A6C4D' } // Fore Hill
  ];
}

/**
 * Generates an organic terrain hill path.
 */
function getTerrainPath(elevation: number, roughness: number, rand: SeededRand): string {
  const steps = 12;
  const pts: Point[] = [];
  pts.push({ x: -20, y: elevation });
  const wStep = 1000 / (steps - 1);
  for (let i = 0; i < steps; i++) {
    pts.push({
      x: i * wStep,
      y: elevation + rand.range(-40, 40) * roughness
    });
  }
  pts.push({ x: 980, y: 1450 });
  pts.push({ x: -20, y: 1450 });
  
  // Close shape using standard bezier format
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const cx = (pts[i].x + pts[i + 1].x) / 2;
    const cy = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${cx} ${cy}`;
  }
  d += ` L 980 1450 L -20 1450 Z`;
  return d;
}

/**
 * Draws organic rock shelves/plateaus with natural irregular edges.
 */
function renderRockShelf(x: number, y: number, w: number, h: number, rand: SeededRand): string {
  // Create an irregular polygon instead of a perfect rectangle
  const jag = () => rand.range(-3, 3);
  return `
  <path d="M ${x - 8 + jag()} ${y + jag()}
           Q ${x + w * 0.3} ${y - 6 + jag()} ${x + w * 0.6} ${y - 3 + jag()}
           L ${x + w + 12 + jag()} ${y + 2 + jag()}
           L ${x + w + 18 + jag()} ${y + h + jag()}
           Q ${x + w * 0.7} ${y + h + 5 + jag()} ${x + w * 0.3} ${y + h + 3 + jag()}
           L ${x - 14 + jag()} ${y + h + jag()} Z"
        fill="#8b7355" opacity="0.85" />
  <line x1="${x - 6}" y1="${y + 2}" x2="${x + w + 6}" y2="${y - 2}" stroke="#ffd8a8" stroke-width="2" stroke-opacity="0.4" />
  `;
}

/**
 * Draws dry grass paths.
 */
function renderDryGrass(rand: SeededRand, count: number, minY: number, maxY: number): string {
  let markup = '';
  const grassColors = ['#88A94D', '#769341', '#A5B95C'];
  for (let i = 0; i < count; i++) {
    const gx = rand.range(40, 920);
    const gy = rand.range(minY, maxY);
    const size = rand.range(5, 12);
    const color = rand.choice(grassColors);
    markup += `
    <path d="M ${gx} ${gy} Q ${gx - 2} ${gy - size} ${gx - 4} ${gy - size - 2} M ${gx} ${gy} Q ${gx} ${gy - size + 2} ${gx + 2} ${gy - size - 1} M ${gx} ${gy} Q ${gx + 4} ${gy - size + 4} ${gx + 8} ${gy - size}" 
          stroke="${color}" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.8" />`;
  }
  return markup;
}

/**
 * Generates larger foreground boulders.
 */
function renderBoulders(rand: SeededRand): string {
  let markup = '';
  const boulderCoords = [
    { x: 120, y: 1390, s: 28 },
    { x: 260, y: 1420, s: 22 },
    { x: 740, y: 1400, s: 30 },
    { x: 860, y: 1420, s: 24 }
  ];

  boulderCoords.forEach(b => {
    // Compile a boulder path using 5-8 points for a jagged look
    const pts: Point[] = [];
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const angle = (i * 2 * Math.PI) / steps;
      const r = b.s + rand.range(-4, 4);
      pts.push({
        x: b.x + r * Math.cos(angle),
        y: b.y + r * Math.sin(angle)
      });
    }
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    d += ' Z';

    markup += `
    <g filter="url(#shadow-soft)">
      <!-- Boulder face -->
      <path d="${d}" fill="#6b7280" stroke="#4b5563" stroke-width="1.5" />
      <!-- Shadow edge -->
      <path d="M ${pts[2].x} ${pts[2].y} L ${pts[3].x} ${pts[3].y} L ${pts[4].x} ${pts[4].y}" stroke="#374151" stroke-width="2" fill="none" opacity="0.6" />
      <!-- Highlight edge -->
      <path d="M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y}" stroke="#e5e7eb" stroke-width="1.8" fill="none" opacity="0.4" />
    </g>`;
  });
  return markup;
}

/**
 * Compiles all terrain scene elements.
 */
export function renderTerrain(world: WorldData): string {
  const rand = getSeededRand(world.username + '_terrain');
  const layers = generateTerrain();

  // 1. Back hill layer
  const backPath = getTerrainPath(layers[0].elevation, layers[0].roughness, rand);
  const backGrass = renderDryGrass(rand, 40, 480, 760);
  
  // 2. Middle hill layer
  const midPath = getTerrainPath(layers[1].elevation, layers[1].roughness, rand);
  const midGrass = renderDryGrass(rand, 50, 760, 1040);
  
  // 3. Foreground hill layer
  const forePath = getTerrainPath(layers[2].elevation, layers[2].roughness, rand);
  const foreGrass = renderDryGrass(rand, 60, 1040, 1440);

  // 4. Large boulders
  const boulders = renderBoulders(rand);

  // 5. Rock Shelf for Monastery foundation (upper only — removed the lower flat platform)
  const shelf1 = renderRockShelf(680, 310, 160, 24, rand);

  return `
  <!-- Back Foothill -->
  <g opacity="0.65" filter="url(#shadow-soft)">
    <path d="${backPath}" fill="${layers[0].color}" />
    ${backGrass}
  </g>
  
  <!-- Rock Shelf (Monastery Foundation) -->
  ${shelf1}

  <!-- Middle Foothill -->
  <g opacity="0.8" filter="url(#shadow-deep)">
    <path d="${midPath}" fill="${layers[1].color}" />
    ${midGrass}
  </g>

  <!-- Foreground Foothill -->
  <g opacity="1.0">
    <path d="${forePath}" fill="${layers[2].color}" />
    ${foreGrass}
    ${boulders}
  </g>
  `;
}
