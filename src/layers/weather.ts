import { WorldData } from '../world';
import { ProfileConfig } from '../types';

/**
 * Renders procedural weather particles (falling snow, rain, or diagonal wind dust)
 * based on the active world weather type.
 * 
 * @param world Active world metadata.
 * @param config Card layout profile config.
 * @returns SVG elements string.
 */
export function renderWeatherLayer(world: WorldData, config: ProfileConfig): string {
  let particles = '';
  if (world.weatherType === 'snow') {
    particles = Array.from({ length: 16 }).map((_, i) => {
      const px = 40 + (i * 58) + (Math.sin(i) * 20);
      const delay = (i * 0.4).toFixed(1);
      const dur = (5 + (i % 3) * 1.5).toFixed(1);
      return `<circle class="snow" cx="${px}" cy="-15" r="4.0" fill="#ffffff" fill-opacity="0.9" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('\n');
  } else if (world.weatherType === 'rain') {
    particles = Array.from({ length: 18 }).map((_, i) => {
      const px = 30 + (i * 54);
      const delay = (i * 0.2).toFixed(1);
      const dur = (1.2 + (i % 3) * 0.4).toFixed(1);
      return `<line class="raindrop" x1="${px}" y1="-25" x2="${px - 12}" y2="10" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" opacity="0.6" />`;
    }).join('\n');
  } else {
    // cold desert wind dust / sand particles
    particles = Array.from({ length: 18 }).map((_, i) => {
      const px = 30 + (i * 54);
      const delay = (i * 0.3).toFixed(1);
      const dur = (2.2 + (i % 3) * 0.8).toFixed(1);
      return `<g class="dust" style="animation-delay: ${delay}s; animation-duration: ${dur}s;"><circle cx="${px}" cy="-10" r="2.0" fill="#C7B08A" opacity="0.6" /></g>`;
    }).join('\n');
  }
  return particles;
}
