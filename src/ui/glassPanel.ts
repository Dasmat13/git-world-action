/**
 * Generates an Apple Vision Pro style frosted glass panel using 7 layers:
 * Outer glow, base tint glass, diagonal highlight, edge borders, and content clipping.
 * 
 * @param x Horizontal translation.
 * @param y Vertical translation.
 * @param w Width.
 * @param h Height.
 * @param content Inside XML elements.
 * @returns Fully compiled glass panel markup.
 */
export function renderGlassPanel(x: number, y: number, w: number, h: number, content: string): string {
  return `
  <!-- Vision Pro Floating Glass Panel -->
  <g transform="translate(${x}, ${y})">
    <!-- Layer 1: Floating shadow & Ambient drop -->
    <rect x="0" y="0" width="${w}" height="${h}" rx="16" fill="#090d16" opacity="0.16" filter="url(#shadow-deep)" />
    
    <!-- Layer 2: Thick Frosted Glass Refraction Base -->
    <rect x="0" y="0" width="${w}" height="${h}" rx="16" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.20)" stroke-width="1" />
    
    <!-- Layer 3: Diagonal Internal Reflection (Refraction Angle) -->
    <path d="M 0,0 L ${w},${h}" stroke="#ffffff" stroke-width="1" stroke-opacity="0.05" stroke-linecap="round" />
    
    <!-- Layer 4: Edge Lighting Top Highlight (white 35%) -->
    <path d="M 12,0.5 L ${w - 12},0.5 C ${w - 4},0.5 ${w - 0.5},4.5 ${w - 0.5},12" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1" />
    
    <!-- Layer 5: Edge Lighting Bottom Shadow (black 8%) -->
    <path d="M ${w - 12},${h - 0.5} L 12,${h - 0.5} C 4,${h - 0.5} 0.5,${h - 4.5} 0.5,${h - 12}" fill="none" stroke="#000000" stroke-opacity="0.08" stroke-width="1" />
    
    <!-- Layer 6 & 7: Inner Content and reflection shine -->
    <g transform="translate(18, 22)">
      ${content}
    </g>
  </g>`;
}
