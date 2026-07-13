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
 * The river now begins as a thin glacial trickle high up in the
 * mountain snowfield and gradually widens as it descends.
 */
export function generateRiver(): RiverPoint[] {
  return [
    // Glacial origin — hidden behind snowcap, nearly zero width
    { x: 488, y: 295, width: 0 },
    // Snowmelt emergence — tiny trickle from under glacier
    { x: 486, y: 318, width: 3 },
    // Cascading down the rock face
    { x: 483, y: 345, width: 6 },
    // First visible pool at mountain base
    { x: 478, y: 375, width: 12 },
    // Gaining flow
    { x: 435, y: 445, width: 16 },
    // Through the narrow canyon
    { x: 350, y: 560, width: 24 },
    // Valley widening
    { x: 510, y: 730, width: 32 },
    // Broad mid-valley
    { x: 630, y: 920, width: 40 },
    // Wide lower valley
    { x: 410, y: 1140, width: 56 },
    // Exit at bottom of card
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
 * Compiles parallel offsets into a smooth closed bezier polygon path.
 */
function buildClosedArea(left: Point[], right: Point[]): string {
  // Forward along left bank
  let d = `M ${left[0].x.toFixed(1)} ${left[0].y.toFixed(1)}`;
  for (let i = 1; i < left.length; i++) {
    const prev = left[i - 1];
    const cur = left[i];
    const cpx = (prev.x + cur.x) / 2;
    const cpy = (prev.y + cur.y) / 2;
    d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${cpx.toFixed(1)} ${cpy.toFixed(1)}`;
  }
  d += ` L ${left[left.length - 1].x.toFixed(1)} ${left[left.length - 1].y.toFixed(1)}`;
  
  // Return along right bank (reversed)
  for (let i = right.length - 1; i >= 1; i--) {
    const prev = right[i];
    const cur = right[i - 1];
    const cpx = (prev.x + cur.x) / 2;
    const cpy = (prev.y + cur.y) / 2;
    d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${cpx.toFixed(1)} ${cpy.toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

/**
 * Renders the glacial origin — snowfield, ice shelf, meltwater cascade, and source pool.
 */
function renderGlacialSource(rand: SeededRand): string {
  // The glacier sits at the top of the river, behind the snowcap line.
  // We render: ice shelf → meltwater cascade → collecting pool.
  
  const glacierCx = 486;
  const glacierY = 290;
  
  let markup = '';
  
  // 1. Glacial ice shelf — a jagged white/blue-white mass tucked into the mountain saddle
  markup += `
  <g opacity="0.92">
    <!-- Ice shelf body -->
    <path d="M ${glacierCx - 28} ${glacierY + 8}
             Q ${glacierCx - 20} ${glacierY - 18} ${glacierCx - 5} ${glacierY - 22}
             Q ${glacierCx + 8} ${glacierY - 25} ${glacierCx + 22} ${glacierY - 15}
             Q ${glacierCx + 30} ${glacierY - 5} ${glacierCx + 26} ${glacierY + 12}
             Q ${glacierCx + 15} ${glacierY + 22} ${glacierCx} ${glacierY + 28}
             Q ${glacierCx - 18} ${glacierY + 20} ${glacierCx - 28} ${glacierY + 8} Z"
          fill="#d4ecf7" />
    <!-- Ice shelf highlight -->
    <path d="M ${glacierCx - 18} ${glacierY}
             Q ${glacierCx - 8} ${glacierY - 14} ${glacierCx + 5} ${glacierY - 16}
             Q ${glacierCx + 15} ${glacierY - 10} ${glacierCx + 18} ${glacierY + 2}
             Q ${glacierCx + 5} ${glacierY + 8} ${glacierCx - 10} ${glacierY + 6}
             Q ${glacierCx - 18} ${glacierY + 4} ${glacierCx - 18} ${glacierY} Z"
          fill="#eaf5fb" opacity="0.7" />
    <!-- Deep crevasse lines in the ice -->
    <line x1="${glacierCx - 12}" y1="${glacierY - 8}" x2="${glacierCx - 8}" y2="${glacierY + 12}" stroke="#8ec8e0" stroke-width="0.8" opacity="0.5" />
    <line x1="${glacierCx + 3}" y1="${glacierY - 14}" x2="${glacierCx + 5}" y2="${glacierY + 6}" stroke="#8ec8e0" stroke-width="0.6" opacity="0.4" />
    <line x1="${glacierCx + 14}" y1="${glacierY - 6}" x2="${glacierCx + 12}" y2="${glacierY + 10}" stroke="#8ec8e0" stroke-width="0.7" opacity="0.45" />
  </g>`;
  
  // 2. Meltwater cascade — thin animated white streaks falling from glacier snout
  const cascadeTop = glacierY + 20;
  const cascadeBottom = 375;
  const cascadeCx = glacierCx - 2;
  
  markup += `
  <g class="melt-cascade" opacity="0.85">
    <!-- Cascade stream 1 (left trickle) -->
    <path d="M ${cascadeCx - 3} ${cascadeTop}
             Q ${cascadeCx - 6} ${cascadeTop + 20} ${cascadeCx - 4} ${cascadeTop + 40}
             Q ${cascadeCx - 2} ${cascadeTop + 55} ${cascadeCx - 1} ${cascadeBottom - 10}"
          fill="none" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
    <!-- Cascade stream 2 (center) -->
    <path d="M ${cascadeCx} ${cascadeTop + 2}
             Q ${cascadeCx + 1} ${cascadeTop + 25} ${cascadeCx - 1} ${cascadeTop + 45}
             Q ${cascadeCx} ${cascadeTop + 60} ${cascadeCx} ${cascadeBottom - 8}"
          fill="none" stroke="#bae6fd" stroke-width="2.2" stroke-linecap="round" opacity="0.85" />
    <!-- Cascade stream 3 (right trickle) -->
    <path d="M ${cascadeCx + 4} ${cascadeTop + 4}
             Q ${cascadeCx + 5} ${cascadeTop + 22} ${cascadeCx + 3} ${cascadeTop + 42}
             Q ${cascadeCx + 2} ${cascadeTop + 56} ${cascadeCx + 1} ${cascadeBottom - 6}"
          fill="none" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />
    <!-- Tiny white splash drops at cascade base -->
    <circle cx="${cascadeCx - 4}" cy="${cascadeBottom - 4}" r="1.5" fill="#ffffff" opacity="0.6">
      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="${cascadeCx + 2}" cy="${cascadeBottom - 2}" r="1.2" fill="#ffffff" opacity="0.5">
      <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="${cascadeCx}" cy="${cascadeBottom}" r="2" fill="#ffffff" opacity="0.4">
      <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </g>`;
  
  // 3. Collecting pool — the small natural basin where cascading meltwater gathers
  //    before flowing downstream as the river
  const poolCx = 478;
  const poolCy = 378;
  
  markup += `
  <g opacity="0.9">
    <!-- Pool shadow/depth -->
    <ellipse cx="${poolCx}" cy="${poolCy}" rx="18" ry="8" fill="#1e3a5f" opacity="0.4" />
    <!-- Pool water surface -->
    <ellipse cx="${poolCx}" cy="${poolCy}" rx="16" ry="7" fill="#38bdf8" opacity="0.6" />
    <!-- Pool highlight reflection -->
    <ellipse cx="${poolCx - 4}" cy="${poolCy - 2}" rx="8" ry="3" fill="#ffffff" opacity="0.25" />
  </g>`;
  
  // 4. Boulders and rocks around the glacier snout and pool
  const sourceRocks = [
    { x: glacierCx - 30, y: glacierY + 14, r: 5, color: '#78716c' },
    { x: glacierCx + 28, y: glacierY + 8, r: 4, color: '#6b6560' },
    { x: glacierCx - 24, y: glacierY + 24, r: 3.5, color: '#8a8278' },
    { x: glacierCx + 24, y: glacierY + 20, r: 3, color: '#7c7570' },
    { x: poolCx - 20, y: poolCy + 2, r: 4, color: '#78716c' },
    { x: poolCx + 18, y: poolCy + 3, r: 3.5, color: '#6b6560' },
    { x: poolCx - 14, y: poolCy + 6, r: 2.5, color: '#8a8278' },
    { x: poolCx + 13, y: poolCy + 5, r: 2, color: '#78716c' },
  ];
  
  for (const rock of sourceRocks) {
    const rx = rock.r * (1 + rand.range(-0.2, 0.3));
    const ry = rock.r * (0.6 + rand.range(0, 0.3));
    markup += `<ellipse cx="${rock.x}" cy="${rock.y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${rock.color}" opacity="0.85" />
    `;
  }
  
  return markup;
}

/**
 * Renders the Spiti River, glacial source, banks, pebbles, islands, bridge, and yaks.
 */
export function renderRiver(world: WorldData): string {
  const rand = getSeededRand(world.username + '_river');
  const riverPts = generateRiver();
  
  // Skip the first 3 points (glacier/cascade region) for bank rendering —
  // those are handled by the glacial source renderer.
  const bankPts = riverPts.slice(2);
  
  // 1. River Banks (Sand and Gravel backgrounds)
  const sandArea = getRiverOffsets(bankPts, 32);
  const sandPath = buildClosedArea(sandArea.left, sandArea.right);
  
  const gravelArea = getRiverOffsets(bankPts, 16);
  const gravelPath = buildClosedArea(gravelArea.left, gravelArea.right);

  // Full centerline (used for thin highlights and shimmers)
  const centerLinePoints: Point[] = riverPts.map(p => ({ x: p.x, y: p.y }));
  const centerD = bezierOpen(centerLinePoints);
  
  // Main river body path (from the collecting pool downward only, skipping glacier/cascade)
  // Points 3+ are pool→valley→exit. The wide water strokes only use this.
  const bodyPoints: Point[] = riverPts.slice(3).map(p => ({ x: p.x, y: p.y }));
  const bodyD = bezierOpen(bodyPoints);

  // 2. Pebble Generator (scatters 180 stones along the banks)
  let pebblesMarkup = '';
  const stoneColors = ['#b8aa93', '#c6b8a2', '#8f8270', '#786d5c'];
  for (let i = 0; i < 180; i++) {
    const segmentIdx = Math.floor(rand.range(0, bankPts.length - 1));
    const p1 = bankPts[segmentIdx];
    const p2 = bankPts[segmentIdx + 1];
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
    const closest = riverPts.find(p => Math.abs(p.y - iy) < 150) || riverPts[5];
    islandsMarkup += `
    <g transform="translate(${closest.x + rand.range(-8, 8)}, ${iy})">
      <ellipse cx="0" cy="0" rx="${rand.range(8, 16)}" ry="${rand.range(4, 8)}" fill="#8f8270" opacity="0.9" />
      <ellipse cx="-2" cy="-1" rx="${rand.range(4, 7)}" ry="${rand.range(2, 4)}" fill="#ffffff" fill-opacity="0.3" />
    </g>`;
  }

  // 4. Wooden Footbridge crossing the narrow river segment near monastery (Y = 540)
  const bridgeX = 356;
  const bridgeY = 540;
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

  // 8. Glacial Source (rendered first, behind the river)
  const glacialSource = renderGlacialSource(rand);

  return `
  <!-- ═══════════ Glacial River Origin ═══════════ -->
  ${glacialSource}

  <!-- Sand Bank Base -->
  <path d="${sandPath}" fill="#dfd4bf" />
  
  <!-- Gravel Bank Base -->
  <path d="${gravelPath}" fill="#cbbfa8" />
  
  <!-- Scattered Pebbles -->
  ${pebblesMarkup}

  <!-- Small gravel islands -->
  ${islandsMarkup}
  
  <!-- Water Depth Layer 1: Dark Blue silt depth base (body only) -->
  <path d="${bodyD}" stroke="#1e3a8a" stroke-width="32" stroke-linecap="round" fill="none" opacity="0.3" />
  
  <!-- Water Depth Layer 2: Main Glacier blue water channel (body only) -->
  <path d="${bodyD}" stroke="url(#riverGradient)" stroke-width="26" stroke-linecap="round" fill="none" />
  
  <!-- Water Depth Layer 3: Sun/Sky Reflection Overlay (body only) -->
  <path d="${bodyD}" stroke="url(#riverReflection)" stroke-width="20" stroke-linecap="round" fill="none" />
  
  <!-- Water Depth Layer 4: High-Contrast White Reflection Edge (full path, thin) -->
  <path d="${centerD}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-opacity="0.22" fill="none" />
  
  <!-- Water Depth Layer 5: Animated downstream shimmers (full path, thin) -->
  <path d="${centerD}" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.55" fill="none" class="river-shimmer" />

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
