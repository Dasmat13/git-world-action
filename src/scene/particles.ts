import { WorldData } from '../world';

/**
 * Renders environment particles (weather and campfire animations).
 */
export function renderParticles(world: WorldData): string {
  // 1. Weather particles
  let weatherMarkup = '';
  if (world.weatherType === 'snow') {
    weatherMarkup = Array.from({ length: 24 }).map((_, i) => {
      const px = 20 + i * 40 + Math.sin(i) * 15;
      const delay = (i * 0.35).toFixed(2);
      const dur = (6 + (i % 4) * 1.5).toFixed(2);
      return `<circle class="snow" cx="${px}" cy="-10" r="3.2" fill="#ffffff" opacity="0.9" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('\n');
  } else if (world.weatherType === 'rain') {
    weatherMarkup = Array.from({ length: 26 }).map((_, i) => {
      const px = 15 + i * 38;
      const delay = (i * 0.15).toFixed(2);
      const dur = (1.1 + (i % 3) * 0.35).toFixed(2);
      return `<line class="raindrop" x1="${px}" y1="-20" x2="${px - 10}" y2="12" stroke="#7dd3fc" stroke-width="2" opacity="0.6" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('\n');
  } else {
    // Dry dust storms / wind sand particles
    weatherMarkup = Array.from({ length: 22 }).map((_, i) => {
      const px = 20 + i * 44;
      const delay = (i * 0.28).toFixed(2);
      const dur = (2.4 + (i % 4) * 0.6).toFixed(2);
      return `
      <g class="dust" style="animation-delay: ${delay}s; animation-duration: ${dur}s;">
        <circle cx="${px}" cy="-10" r="1.8" fill="#dfcbb5" opacity="0.45" />
      </g>`;
    }).join('\n');
  }

  // 2. Campfire (visible only at night, positioned at X = 500, Y = 1390)
  const isNight = world.timeOfDay === 'night';
  const campfire = isNight ? `
  <!-- Foreground Campfire Group -->
  <g transform="translate(500, 1385)">
    <!-- Ambient orange fire glow -->
    <circle cx="0" cy="0" r="28" fill="#f97316" fill-opacity="0.15" filter="url(#haze-heavy)" />
    
    <!-- Fire logs -->
    <line x1="-12" y1="8" x2="12" y2="-4" stroke="#451a03" stroke-width="5" stroke-linecap="round" />
    <line x1="12" y1="8" x2="-12" y2="-4" stroke="#451a03" stroke-width="5" stroke-linecap="round" />
    
    <!-- Animated flames -->
    <path d="M -8,4 Q 0,-24 8,4 Q 4,0 0,6 Q -4,0 -8,4 Z" fill="#ef4444" opacity="0.9">
      <animate attributeName="d" 
               values="M -8,4 Q 0,-24 8,4 Q 4,0 0,6 Q -4,0 -8,4 Z;
                       M -6,4 Q 2,-28 6,4 Q 2,2 0,6 Q -2,2 -6,4 Z;
                       M -8,4 Q -2,-22 8,4 Q 4,-1 0,6 Q -3,-1 -8,4 Z;
                       M -8,4 Q 0,-24 8,4 Q 4,0 0,6 Q -4,0 -8,4 Z" 
               dur="0.8s" repeatCount="indefinite" />
    </path>
    <path d="M -4,4 Q 0,-16 4,4 Q 2,2 0,6 Q -2,2 -4,4 Z" fill="#f97316">
      <animate attributeName="d" 
               values="M -4,4 Q 0,-16 4,4 Q 2,2 0,6 Q -2,2 -4,4 Z;
                       M -3,4 Q 1,-19 3,4 Q 1,3 0,6 Q -1,3 -3,4 Z;
                       M -4,4 Q -1,-14 4,4 Q 2,1 0,6 Q -2,1 -4,4 Z;
                       M -4,4 Q 0,-16 4,4 Q 2,2 0,6 Q -2,2 -4,4 Z" 
               dur="0.6s" repeatCount="indefinite" />
    </path>
    <path d="M -2,4 Q 0,-8 2,4 Z" fill="#fef08a" />
    
    <!-- Smoke rising from campfire -->
    <path d="M 0,-4 C -2,-12 2,-20 -2,-28 C -6,-36 -2,-44 -6,-52" fill="none" stroke="#78716c" stroke-width="1.8" stroke-linecap="round" opacity="0.35">
      <animateTransform attributeName="transform" type="translate" values="0,0; 1,-8; -2,-16" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.35; 0.6; 0" dur="2s" repeatCount="indefinite" />
    </path>
  </g>` : '';

  return `
  <!-- Weather particle fall animations -->
  <g id="weather-particles">
    ${weatherMarkup}
  </g>

  <!-- Night Campfire -->
  ${campfire}
  `;
}
