import { WorldData } from '../world';

/**
 * Renders Spiti Valley wildlife: circling Himalayan eagles, blue sheep, and marmots.
 */
export function renderWildlife(world: WorldData): string {
  // 1. Himalayan Eagle circling slowly in the sky (center: 480, 180)
  const eagle = `
  <!-- Himalayan Eagle circling overhead -->
  <g transform="translate(480, 160)">
    <g>
      <!-- Eagle path offset from center to create flight circle -->
      <path d="M 220,0 C 218,-8 210,-12 205,-6 C 200,-10 192,-8 190,0 C 196,4 204,6 210,1 C 216,6 220,4 220,0 Z" fill="#1e293b">
        <!-- Flapping wings slight scale animation -->
        <animateTransform attributeName="transform" type="scale" values="1,1; 1,0.92; 1,1" dur="1.2s" repeatCount="indefinite" additive="sum" />
      </path>
      <!-- Circle rotation -->
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="50s" repeatCount="indefinite" />
    </g>
  </g>`;

  // 2. Blue Sheep (Bharal) standing on rock shelf (X = 220, Y = 718)
  const blueSheep = `
  <!-- Blue Sheep (Bharal) on Lower Rock Shelf -->
  <g transform="translate(200, 715) scale(0.55)" fill="#4b5563">
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="10" ry="7" />
    <!-- Head -->
    <ellipse cx="-8" cy="-8" rx="4" ry="3.5" />
    <!-- Neck -->
    <path d="M -7, -2 L -9, -7 L -5, -8 L -3, -3 Z" />
    <!-- Horns curving backwards -->
    <path d="M -9, -10 Q -14, -14 -10, -5 Q -8, -10 -9, -10 Z" fill="#1f2937" />
    <!-- Legs -->
    <line x1="-5" y1="6" x2="-6" y2="12" stroke="#4b5563" stroke-width="2" />
    <line x1="-2" y1="6" x2="-1" y2="12" stroke="#4b5563" stroke-width="2" />
    <line x1="3" y1="6" x2="2" y2="12" stroke="#4b5563" stroke-width="2" />
    <line x1="6" y1="6" x2="7" y2="12" stroke="#4b5563" stroke-width="2" />
  </g>`;

  // 3. Tiny Marmots near foreground rocks (X = 750, Y = 1395)
  const marmot = `
  <!-- Alpine Marmots near boulders -->
  <g transform="translate(775, 1395) scale(0.4)" fill="#78350f">
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="5" ry="3.5" />
    <!-- Head -->
    <circle cx="-5" cy="-3" r="2.2" />
    <!-- Animation to peek and hide -->
    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0; 0,0; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
  </g>`;

  return `
  <!-- Circle Eagle -->
  ${eagle}
  
  <!-- Cliffside Blue Sheep -->
  ${blueSheep}
  
  <!-- Rock Marmots -->
  ${marmot}
  `;
}
