import { WorldData } from '../world';

/**
 * Renders Spiti Valley wildlife: circling Himalayan eagles, blue sheep, and marmots.
 */
export function renderWildlife(world: WorldData): string {
  // 1. Himalayan Eagle circling slowly in the sky
  //    Larger silhouette, positioned in clear sky area away from the sun
  const eagle = `
  <!-- Himalayan Eagle circling overhead -->
  <g transform="translate(300, 200)">
    <g>
      <!-- Eagle silhouette — larger, more visible -->
      <g fill="#1e293b" opacity="0.85">
        <!-- Left wing -->
        <path d="M 0,0 C -6,-3 -18,-5 -28,-2 C -22,-5 -14,-8 -6,-4 Z" />
        <!-- Right wing -->
        <path d="M 0,0 C 6,-3 18,-5 28,-2 C 22,-5 14,-8 6,-4 Z" />
        <!-- Body -->
        <ellipse cx="0" cy="1" rx="3" ry="5" />
        <!-- Tail -->
        <path d="M -2,5 L 0,12 L 2,5 Z" />
      </g>
      <!-- Flapping animation -->
      <animateTransform attributeName="transform" type="scale" values="1,1; 1,0.94; 1,1" dur="1.5s" repeatCount="indefinite" additive="sum" />
      <!-- Circle rotation -->
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="55s" repeatCount="indefinite" />
    </g>
  </g>`;

  // 2. Blue Sheep (Bharal) standing on the mountain slope (moved from floating platform)
  const blueSheep = `
  <!-- Blue Sheep (Bharal) on mountain slope -->
  <g transform="translate(180, 680) scale(0.6)" fill="#4b5563">
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="12" ry="7" />
    <!-- Head -->
    <ellipse cx="-10" cy="-7" rx="4.5" ry="3.5" />
    <!-- Neck -->
    <path d="M -6,-2 L -8,-6 L -5,-7 L -3,-3 Z" />
    <!-- Horns curving backwards -->
    <path d="M -11,-9 Q -16,-14 -11,-5 Q -9,-9 -11,-9 Z" fill="#1f2937" />
    <!-- Legs -->
    <line x1="-5" y1="6" x2="-6" y2="14" stroke="#4b5563" stroke-width="2.2" stroke-linecap="round" />
    <line x1="-1" y1="6" x2="-1" y2="14" stroke="#4b5563" stroke-width="2.2" stroke-linecap="round" />
    <line x1="4" y1="6" x2="3" y2="14" stroke="#4b5563" stroke-width="2.2" stroke-linecap="round" />
    <line x1="8" y1="6" x2="8" y2="14" stroke="#4b5563" stroke-width="2.2" stroke-linecap="round" />
    <!-- White belly patch -->
    <ellipse cx="-1" cy="3" rx="6" ry="3" fill="#9ca3af" opacity="0.4" />
  </g>`;

  // 3. Second sheep (companion)
  const blueSheep2 = `
  <!-- Second Bharal -->
  <g transform="translate(215, 690) scale(0.45)" fill="#6b7280">
    <ellipse cx="0" cy="0" rx="10" ry="6" />
    <ellipse cx="-8" cy="-6" rx="3.5" ry="3" />
    <path d="M -5,-2 L -7,-5 L -4,-6 L -2,-3 Z" />
    <line x1="-4" y1="5" x2="-5" y2="12" stroke="#6b7280" stroke-width="2" stroke-linecap="round" />
    <line x1="0" y1="5" x2="0" y2="12" stroke="#6b7280" stroke-width="2" stroke-linecap="round" />
    <line x1="4" y1="5" x2="3" y2="12" stroke="#6b7280" stroke-width="2" stroke-linecap="round" />
  </g>`;

  // 4. Tiny Marmots near foreground rocks
  const marmot = `
  <!-- Alpine Marmots near boulders -->
  <g transform="translate(775, 1390) scale(0.5)" fill="#78350f">
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="6" ry="4" />
    <!-- Head -->
    <circle cx="-6" cy="-3" r="2.8" />
    <!-- Ears -->
    <circle cx="-7" cy="-5" r="1" fill="#92400e" />
    <!-- Tail -->
    <path d="M 5,0 Q 10,2 8,5" stroke="#78350f" stroke-width="1.5" fill="none" />
    <!-- Animation to peek and hide -->
    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0; 0,0; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
  </g>`;

  return `
  <!-- Circling Eagle -->
  ${eagle}
  
  <!-- Cliffside Blue Sheep pair -->
  ${blueSheep}
  ${blueSheep2}
  
  <!-- Rock Marmots -->
  ${marmot}
  `;
}
