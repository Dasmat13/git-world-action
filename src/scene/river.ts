import { WorldData } from '../world';
import { getSeededRand, SeededRand } from '../utils/random';
import { Point, bezierOpen } from '../utils/bezier';

export interface RiverPoint {
  x: number;
  y: number;
  width: number;
}

/**
 * Control coordinates for the Spiti River flow.
 */
export function generateRiver(): RiverPoint[] {
  return [
    { x: 480, y: 340, width: 14 },
    { x: 420, y: 440, width: 18 },
    { x: 350, y: 560, width: 24 },
    { x: 510, y: 730, width: 32 },
    { x: 630, y: 920, width: 40 },
    { x: 410, y: 1140, width: 56 },
    { x: 520, y: 1440, width: 78 }
  ];
}

/**
 * Helper to compute left and right parallel coordinates offset along the river path.
 */
function getRiverOffsets(points: RiverPoint[], pad = 0): { left: Point[]; right: Point[] } {
  const left: Point[] = [];
  const right: Point[] = [];
  
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    let dx = 0, dy = 0;
    if (i === 0) {
      dx = points[1].x - p.x;
      dy = points[1].y - p.y;
    } else if (i === points.length - 1) {
      dx = p.x - points[i - 1].x;
      dy = p.y - points[i - 1].y;
    } else {
      dx = points[i + 1].x - points[i - 1].x;
      dy = points[i + 1].y - points[i - 1].y;
    }
    
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    
    const halfW = (p.width / 2) + pad;
    left.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
    right.push({ x: p.x - nx * halfW, y: p.y - ny * halfW });
  }
  return { left, right };
}

/**
 * Compiles parallel offsets into a closed polygon path.
 */
function buildClosedArea(left: Point[], right: Point[]): string {
  let d = `M ${left[0].x} ${left[0].y}`;
  for (let i = 1; i < left.length; i++) {
    d += ` L ${left[i].x} ${left[i].y}`;
  }
  for (let i = right.length - 1; i >= 0; i--) {
    d += ` L ${right[i].x} ${right[i].y}`;
  }
  d += ' Z';
  return d;
}

/**
 * Renders the Spiti River, banks, pebbles, islands, bridge, and yaks.
 */
export function renderRiver(world: WorldData): string {
  const rand = getSeededRand(world.username + '_river');
  const riverPts = generateRiver();
  
  // 1. River Banks (Sand and Gravel backgrounds)
  const sandArea = getRiverOffsets(riverPts, 35);
  const sandPath = buildClosedArea(sandArea.left, sandArea.right);
  
  const gravelArea = getRiverOffsets(riverPts, 18);
  const gravelPath = buildClosedArea(gravelArea.left, gravelArea.right);

  // Centerline for open highlights and shimmer lines
  const centerLinePoints: Point[] = riverPts.map(p => ({ x: p.x, y: p.y }));
  const centerD = bezierOpen(centerLinePoints);

  // 2. Pebble Generator (scatters 180 stones along the banks)
  let pebblesMarkup = '';
  const stoneColors = ['#b8aa93', '#c6b8a2', '#8f8270', '#786d5c'];
  for (let i = 0; i < 180; i++) {
    const segmentIdx = Math.floor(rand.range(0, riverPts.length - 1));
    const p1 = riverPts[segmentIdx];
    const p2 = riverPts[segmentIdx + 1];
    const t = rand.range(0, 1);
    
    // Interpolate center
    const cx = p1.x + (p2.x - p1.x) * t;
    const cy = p1.y + (p2.y - p1.y) * t;
    
    const side = rand.choice([-1, 1]);
    const offsetDistance = rand.range((p1.width / 2) + 2, (p1.width / 2) + 26);
    
    // Normal vector
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    
    const px = cx + side * nx * offsetDistance;
    const py = cy + (rand.range(-10, 10));
    
    const size = rand.range(1.5, 4.5);
    const color = rand.choice(stoneColors);
    
    if (rand.next() > 0.5) {
      pebblesMarkup += `<circle cx="${px}" cy="${py}" r="${size}" fill="${color}" opacity="0.85" />\n`;
    } else {
      const rx = size * 1.3;
      const ry = size * 0.7;
      const rot = Math.floor(rand.range(0, 180));
      pebblesMarkup += `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}" transform="rotate(${rot}, ${px}, ${py})" fill="${color}" opacity="0.85" />\n`;
    }
  }

  // 3. Small Gravel Islands
  let islandsMarkup = '';
  for (let i = 0; i < 3; i++) {
    const iy = 650 + i * 280;
    // Find closest river point
    const closest = riverPts.find(p => Math.abs(p.y - iy) < 150) || riverPts[3];
    islandsMarkup += `
    <g transform="translate(${closest.x + rand.range(-8, 8)}, ${iy})">
      <ellipse cx="0" cy="0" rx="${rand.range(8, 16)}" ry="${rand.range(4, 8)}" fill="#8f8270" opacity="0.9" />
      <ellipse cx="-2" cy="-1" rx="${rand.range(4, 7)}" ry="${rand.range(2, 4)}" fill="#ffffff" fill-opacity="0.3" />
    </g>`;
  }

  // 4. Wooden Footbridge crossing the narrow river segment near monastery (Y = 520)
  const bridgeX = 356;
  const bridgeY = 540;
  const bridgeWidth = 42;
  const bridge = `
  <!-- Wooden bridge group -->
  <g id="wooden-bridge">
    <!-- Shadow on water -->
    <line x1="${bridgeX - 45}" y1="${bridgeY + 4}" x2="${bridgeX + 45}" y2="${bridgeY + 4}" stroke="#1e293b" stroke-opacity="0.3" stroke-width="12" stroke-linecap="round" />
    
    <!-- Under planks support -->
    <line x1="${bridgeX - 40}" y1="${bridgeY}" x2="${bridgeX + 40}" y2="${bridgeY}" stroke="#5c3a21" stroke-width="6" stroke-linecap="round" />
    
    <!-- Wooden Planks -->
    <line x1="${bridgeX - 35}" y1="${bridgeY - 4}" x2="${bridgeX - 35}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX - 27}" y1="${bridgeY - 4}" x2="${bridgeX - 27}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX - 19}" y1="${bridgeY - 4}" x2="${bridgeX - 19}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX - 11}" y1="${bridgeY - 4}" x2="${bridgeX - 11}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX - 3}"  y1="${bridgeY - 4}" x2="${bridgeX - 3}"  y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX + 5}"  y1="${bridgeY - 4}" x2="${bridgeX + 5}"  y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX + 13}" y1="${bridgeY - 4}" x2="${bridgeX + 13}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX + 21}" y1="${bridgeY - 4}" x2="${bridgeX + 21}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX + 29}" y1="${bridgeY - 4}" x2="${bridgeX + 29}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    <line x1="${bridgeX + 37}" y1="${bridgeY - 4}" x2="${bridgeX + 37}" y2="${bridgeY + 4}" stroke="#8a5a36" stroke-width="3" />
    
    <!-- Rope handrails -->
    <path d="M ${bridgeX - 40},${bridgeY - 6} Q ${bridgeX},${bridgeY - 2} ${bridgeX + 40},${bridgeY - 6}" fill="none" stroke="#d6d3d1" stroke-width="1.5" />
    <path d="M ${bridgeX - 40},${bridgeY + 6} Q ${bridgeX},${bridgeY + 10} ${bridgeX + 40},${bridgeY + 6}" fill="none" stroke="#d6d3d1" stroke-width="1.5" />
  </g>`;

  // 5. Drinking Yak Silhouette (placed near riverbank grass)
  const yakX = 390;
  const yakY = 945;
  const yakSilhouette = `
  <!-- Yak silhouette near water bank -->
  <g class="yak-graze" transform="translate(${yakX}, ${yakY}) scale(0.65)" fill="#292524">
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="16" ry="10" />
    <!-- Hump -->
    <circle cx="-3" cy="-6" r="8" />
    <!-- Head leaning down -->
    <path d="M -12,-4 L -22,4 L -20,7 L -10,1 Z" />
    <!-- Horns -->
    <path d="M -16,-2 Q -22,-10 -15,-15 Q -14,-10 -13,-4 Z" />
    <!-- Tail -->
    <path d="M 14,-2 L 20,10 L 17,11 L 12,0 Z" />
    <!-- Shaggy hair legs -->
    <rect x="-8" y="8" width="5" height="7" rx="1" />
    <rect x="5" y="8" width="5" height="7" rx="1" />
  </g>`;

  // 6. River Dawn Mist (10% standard stdDeviation blur)
  const isDawn = world.timeOfDay === 'dawn';
  const riverMist = isDawn ? `
  <path d="${centerD}" stroke="#ffffff" stroke-width="90" stroke-opacity="0.1" fill="none" filter="url(#mist-blur)" />
  ` : '';

  // 7. Ripples
  let ripplesMarkup = '';
  for (let i = 0; i < 4; i++) {
    const rx = 340 + i * 160;
    const ry = 400 + i * 220;
    ripplesMarkup += `
    <ellipse cx="${rx}" cy="${ry}" rx="${8 + i}" ry="${3 + i / 2}" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.2" />`;
  }

  return `
  <!-- Sand Bank Base -->
  <path d="${sandPath}" fill="#dfd4bf" />
  
  <!-- Gravel Bank Base -->
  <path d="${gravelPath}" fill="#cbbfa8" />
  
  <!-- Scattered Pebbles -->
  ${pebblesMarkup}

  <!-- Small gravel islands -->
  ${islandsMarkup}
  
  <!-- Water Depth Layer 1: Dark Blue silt depth base -->
  <path d="${centerD}" stroke="#1e3a8a" stroke-width="32" stroke-linecap="round" fill="none" opacity="0.3" />
  
  <!-- Water Depth Layer 2: Main Glacier blue water channel -->
  <path d="${centerD}" stroke="url(#riverGradient)" stroke-width="26" stroke-linecap="round" fill="none" />
  
  <!-- Water Depth Layer 3: Sun/Sky Reflection Overlay -->
  <path d="${centerD}" stroke="url(#riverReflection)" stroke-width="20" stroke-linecap="round" fill="none" />
  
  <!-- Water Depth Layer 4: High-Contrast White Reflection Edge -->
  <path d="${centerD}" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.28" fill="none" />
  
  <!-- Water Depth Layer 5: Animated downstream shimmers -->
  <path d="${centerD}" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.7" fill="none" class="river-shimmer" />

  <!-- Concentric ripples -->
  ${ripplesMarkup}

  <!-- River Mist -->
  ${riverMist}

  <!-- Scenic Wooden Footbridge -->
  ${bridge}

  <!-- Wildlife Yak -->
  ${yakSilhouette}
  `;
}
