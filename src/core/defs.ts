import { TimeOfDay } from '../world';
import { renderSVGFilters } from './filters';
import { renderSVGGradients } from './gradients';

/**
 * Renders the full SVG <defs> block, grouping gradients, filters, masks, and clips.
 * 
 * @param activeTime Current active time of day.
 * @returns Fully compiled defs XML string.
 */
export function renderDefs(activeTime: TimeOfDay): string {
  const filters = renderSVGFilters();
  const gradients = renderSVGGradients(activeTime);

  return `
  <defs>
    <!-- Core filters -->
    ${filters}

    <!-- Core gradients -->
    ${gradients}

    <!-- Sun Glow / Corona Radial Gradient -->
    <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="25%" stop-color="#fbbf24" stop-opacity="0.6" />
      <stop offset="70%" stop-color="#f97316" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
    </radialGradient>

    <!-- Moon Corona Radial Gradient -->
    <radialGradient id="moonGlowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#94a3b8" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>

    <!-- Cloud displacement filter for volumetric effects -->
    <filter id="volumetric-cloud" x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
    </filter>

    <!-- River reflection overlay gradient -->
    <linearGradient id="riverReflection" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="50%" stop-color="var(--sky-bot)" stop-opacity="0.15" />
      <stop offset="100%" stop-color="var(--sky-top)" stop-opacity="0.05" />
    </linearGradient>
  </defs>
  `;
}
