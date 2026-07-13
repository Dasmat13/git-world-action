import { WorldData } from '../world';
import { getSeededRand, SeededRand } from '../utils/random';
import { Point, bezier } from '../utils/bezier';

export interface MountainLayer {
  peaks: number;
  baseY: number;
  minHeight: number;
  maxHeight: number;
  color: string;
  snow: boolean;
  opacity: number;
  blurFilter: string;
}

/**
 * Generates peaks for a mountain layer.
 */
function generatePeaks(
  width: number,
  peaks: number,
  baseY: number,
  minHeight: number,
  maxHeight: number,
  random: SeededRand
): Point[] {
  const pts: Point[] = [];
  pts.push({ x: 0, y: baseY });
  const step = width / (peaks - 1);
  for (let i = 0; i < peaks; i++) {
    pts.push({
      x: i * step,
      y: baseY - random.range(minHeight, maxHeight)
    });
  }
  pts.push({ x: width, y: baseY });
  return pts;
}

/**
 * Generates snow cap paths hugging the mountain top peaks.
 */
function generateSnowcaps(points: Point[], thresholdY: number, random: SeededRand): string {
  let snowPaths = '';
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    if (p.y < thresholdY) {
      const prev = points[i - 1];
      const next = points[i + 1];
      
      const xStart = (prev.x + p.x) / 2;
      const yStart = (prev.y + p.y) / 2;
      const xEnd = (p.x + next.x) / 2;
      const yEnd = (p.y + next.y) / 2;
      
      const bottomY = p.y + random.range(15, 32);
      
      snowPaths += `
      <path d="M ${xStart} ${yStart} 
               Q ${p.x} ${p.y} ${xEnd} ${yEnd}
               L ${xEnd} ${yEnd + 4}
               Q ${p.x} ${bottomY} ${xStart} ${yStart + 4} Z" 
            fill="#ffffff" fill-opacity="0.95" />`;
    }
  }
  return snowPaths;
}

/**
 * Generates horizontal sediment layers / erosion lines.
 */
function renderErosionLines(points: Point[], random: SeededRand, color: string): string {
  let out = '';
  for (let i = 0; i < 55; i++) {
    const startIdx = Math.floor(random.range(1, points.length - 2));
    const p1 = points[startIdx];
    const p2 = points[startIdx + 1];
    
    const t = random.range(0.1, 0.9);
    const x = p1.x + (p2.x - p1.x) * t;
    const y = p1.y + (p2.y - p1.y) * t + random.range(10, 100);
    
    const length = random.range(40, 150);
    const angle = random.range(-12, 12) * Math.PI / 180;
    const x2 = x + length * Math.cos(angle);
    const y2 = y + length * Math.sin(angle);
    
    out += `
    <line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" 
          stroke="${color}" stroke-opacity="0.12" stroke-width="${random.range(1, 2.5)}" 
          stroke-linecap="round" />`;
  }
  return out;
}

/**
 * Renders a single mountain layer, including erosion lines and snow caps.
 */
export function renderMountain(layer: MountainLayer, random: SeededRand): string {
  const pts = generatePeaks(
    960,
    layer.peaks,
    layer.baseY,
    layer.minHeight,
    layer.maxHeight,
    random
  );

  const pathD = bezier(pts);
  const filterAttr = layer.blurFilter ? `filter="url(${layer.blurFilter})"` : '';
  
  // Tracing snow cap line if snow is enabled
  const thresholdHeightY = layer.baseY - (layer.minHeight + (layer.maxHeight - layer.minHeight) * 0.45);
  const snowMarkup = layer.snow ? generateSnowcaps(pts, thresholdHeightY, random) : '';
  const sedimentLines = renderErosionLines(pts, random, '#ffffff');

  return `
  <g opacity="${layer.opacity}" ${filterAttr}>
    <!-- Main Peak Polygon -->
    <path d="${pathD}" fill="${layer.color}" />
    <!-- Sedimentary Rock Layers -->
    ${sedimentLines}
    <!-- Snowcapped Peak Covers -->
    ${snowMarkup}
  </g>`;
}

/**
 * Renders all 4 mountain ranges in atmospheric perspective.
 */
export function renderMountains(world: WorldData): string {
  const rand = getSeededRand(world.username + '_mountains');

  return `
  <!-- Layer 1: Distant Background Peaks (Lightest, Bluer, Blurrier) -->
  ${renderMountain({
    peaks: 7,
    baseY: 380,
    minHeight: 80,
    maxHeight: 160,
    color: '#D8DCE6',
    opacity: 0.35,
    snow: false,
    blurFilter: '#haze-heavy'
  }, rand)}

  <!-- Layer 2: Mid-Distant Background Peaks (Medium Blur) -->
  ${renderMountain({
    peaks: 8,
    baseY: 430,
    minHeight: 140,
    maxHeight: 260,
    color: '#BCC2CF',
    opacity: 0.55,
    snow: true,
    blurFilter: '#haze-medium'
  }, rand)}

  <!-- Layer 3: Middle Peaks (Light Blur) -->
  ${renderMountain({
    peaks: 9,
    baseY: 520,
    minHeight: 180,
    maxHeight: 330,
    color: '#9C9488',
    opacity: 0.75,
    snow: true,
    blurFilter: '#haze-light'
  }, rand)}

  <!-- Layer 4: Foreground Peaks (Sharp, High Contrast, Deep Brown) -->
  ${renderMountain({
    peaks: 11,
    baseY: 610,
    minHeight: 220,
    maxHeight: 420,
    color: '#6C6458',
    opacity: 1.0,
    snow: true,
    blurFilter: ''
  }, rand)}
  `;
}
