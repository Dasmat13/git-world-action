import { WorldData } from '../world';

/**
 * Renders the sun or moon corona and disc depending on the active time of day.
 */
export function renderSunMoon(world: WorldData): string {
  const isNight = world.timeOfDay === 'night';
  
  if (isNight) {
    return `
    <!-- Moon disc and radial corona -->
    <circle cx="480" cy="180" r="85" fill="url(#moonGlowGrad)" class="sun-glow" />
    <circle cx="480" cy="180" r="30" fill="#f8fafc" />
    <!-- Crescent shadow cast -->
    <circle cx="468" cy="180" r="30" fill="#071425" opacity="0.85" />`;
  }
  
  return `
  <!-- Sun disc and radial corona -->
  <circle cx="480" cy="180" r="85" fill="url(#sunGlowGrad)" class="sun-glow" />
  <circle cx="480" cy="180" r="40" fill="var(--sun-color)" />`;
}
