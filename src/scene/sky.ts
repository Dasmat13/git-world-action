import { WorldData } from '../world';
import { getSeededRand } from '../utils/random';

/**
 * Renders the high-fidelity atmosphere: space gradients, star fields, Milky Way path,
 * volumetric clouds, god rays, and the sun/moon.
 * 
 * @param world Active GitWorld environment data.
 * @returns SVG elements string.
 */
export function renderSky(world: WorldData): string {
  const rand = getSeededRand(world.username + '_sky');
  
  // Generate 250 twinkling stars
  let starsMarkup = '';
  for (let i = 0; i < 200; i++) {
    const sx = rand.range(0, 960);
    const sy = rand.range(0, 480);
    const size = rand.range(0.8, 2.2);
    const op = rand.range(0.3, 0.9);
    const delay = rand.range(0, 3).toFixed(2);
    starsMarkup += `<circle cx="${sx}" cy="${sy}" r="${size}" fill="#ffffff" class="star-blink" style="animation-delay: ${delay}s; opacity: ${op};" />\n`;
  }
  
  // Milky Way path
  const milkyWay = `<path d="M 0,220 Q 300,100 600,180 T 960,80 L 960,180 Q 600,260 300,160 Z" fill="#93c5fd" opacity="0.06" filter="url(#haze-heavy)" />`;

  // Shooting Stars
  const shootingStars = `
    <line x1="0" y1="0" x2="-80" y2="40" stroke="#ffffff" stroke-width="1.5" class="shooting-star" stroke-linecap="round" />
  `;

  // God rays (visible in dawn/dusk)
  const isTwilight = world.timeOfDay === 'dawn' || world.timeOfDay === 'dusk';
  const godRays = isTwilight ? `
  <g opacity="0.18">
    <polygon points="480,180 200,480 300,480" fill="#FFECC2" filter="url(#haze-medium)" />
    <polygon points="480,180 380,480 480,480" fill="#FFECC2" filter="url(#haze-medium)" />
    <polygon points="480,180 600,480 700,480" fill="#FFECC2" filter="url(#haze-medium)" />
    <polygon points="480,180 750,480 900,480" fill="#FFECC2" filter="url(#haze-medium)" />
  </g>
  ` : '';

  // Volumetric Clouds (slow drifting blobs with displacement filter)
  let cloudBlobs = '';
  const cloudRand = getSeededRand(world.username + '_clouds');
  for (let i = 0; i < 35; i++) {
    const cx = cloudRand.range(50, 910);
    const cy = cloudRand.range(80, 240);
    const rx = cloudRand.range(40, 100);
    const ry = cloudRand.range(25, 50);
    cloudBlobs += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" fill-opacity="0.18" />\n`;
  }
  
  // Sun / Moon Phase logic
  const isNight = world.timeOfDay === 'night';
  const sunMoon = isNight ? `
  <!-- Moon disc and corona -->
  <circle cx="480" cy="180" r="85" fill="url(#moonGlowGrad)" class="sun-glow" />
  <circle cx="480" cy="180" r="30" fill="#f8fafc" />
  <!-- Moon Shadow to form crescent -->
  <circle cx="468" cy="180" r="30" fill="#071425" opacity="0.85" />
  ` : `
  <!-- Sun disc and corona -->
  <circle cx="480" cy="180" r="85" fill="url(#sunGlowGrad)" class="sun-glow" />
  <circle cx="480" cy="180" r="40" fill="var(--sun-color)" />
  `;

  return `
  <!-- Atmosphere backdrop -->
  <rect width="960" height="500" fill="url(#skyGrad)" />
  
  <!-- Starry space -->
  <g opacity="${world.timeOfDay === 'night' ? '1' : world.timeOfDay === 'dawn' || world.timeOfDay === 'dusk' ? '0.35' : '0'}">
    ${milkyWay}
    ${starsMarkup}
    ${shootingStars}
  </g>

  <!-- God Rays -->
  ${godRays}

  <!-- Sun / Moon -->
  ${sunMoon}

  <!-- Volumetric Clouds -->
  <g filter="url(#volumetric-cloud)" class="cloud-slow">
    ${cloudBlobs}
  </g>`;
}
