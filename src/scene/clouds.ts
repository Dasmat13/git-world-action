import { WorldData } from '../world';
import { getSeededRand } from '../utils/random';

/**
 * Renders volumetric clouds using multiple overlapping ellipse blobs 
 * distorted by the SVG volumetric displacement filter.
 */
export function renderClouds(world: WorldData): string {
  const rand = getSeededRand(world.username + '_clouds');
  let cloudBlobs = '';

  for (let i = 0; i < 30; i++) {
    const cx = rand.range(0, 960);
    const cy = rand.range(60, 260);
    const rx = rand.range(50, 110);
    const ry = rand.range(20, 45);
    cloudBlobs += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" fill-opacity="0.18" />\n`;
  }

  return `
  <!-- Volumetric Clouds with displacement filter mapping -->
  <g filter="url(#volumetric-cloud)" class="cloud-slow">
    ${cloudBlobs}
  </g>`;
}
