/**
 * Generates SVG filter templates for atmospheric haze, building shadows, and soft glow effects.
 * 
 * @returns SVG filter elements markup string.
 */
export function renderSVGFilters(): string {
  return `
  <!-- Atmospheric Perspective and Soft Glow Filters -->
  <filter id="haze-heavy" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="8" />
  </filter>
  <filter id="haze-medium" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="4" />
  </filter>
  <filter id="haze-light" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="2" />
  </filter>
  <filter id="mist-blur" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="12" />
  </filter>
  
  <!-- Soft Ambient Occlusion / Drop Shadow Filters -->
  <filter id="shadow-soft" x="-10%" y="-10%" width="120%" height="120%">
    <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.18" />
  </filter>
  <filter id="shadow-deep" x="-15%" y="-15%" width="130%" height="130%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#090d16" flood-opacity="0.28" />
  </filter>
  `;
}
