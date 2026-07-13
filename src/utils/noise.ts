/**
 * Simple 1D pseudo-random hash value.
 * 
 * @param x Coordinate input.
 * @param seed Seed offset.
 * @returns Floating point between 0 and 1.
 */
function hash(x: number, seed: number): number {
  const sn = Math.sin(x + seed) * 43758.5453123;
  return sn - Math.floor(sn);
}

/**
 * 1D Value Noise with smoothstep interpolation.
 * 
 * @param x Input coordinate.
 * @param seed Random seed.
 * @returns Noise value between 0 and 1.
 */
export function noise1D(x: number, seed = 42): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3.0 - 2.0 * f); // smoothstep interpolation
  
  const a = hash(i, seed);
  const b = hash(i + 1, seed);
  return a + (b - a) * u;
}

/**
 * Fractal Brownian Motion (fBm) combining multiple octaves of noise.
 * Creates richer, more complex procedural details like rugged rock heights.
 * 
 * @param x Input coordinate.
 * @param octaves Complexity level.
 * @param seed Random seed.
 * @returns Compiled noise value.
 */
export function fBm1D(x: number, octaves = 4, seed = 42): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1.0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise1D(x * frequency, seed);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
