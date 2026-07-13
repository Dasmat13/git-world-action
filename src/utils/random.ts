/**
 * Hashing function to convert a string seed (e.g. username) into a 32-bit integer.
 * 
 * @param str Seed string.
 * @returns 32-bit unsigned integer.
 */
export function xxh32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Seedable pseudo-random number generator (Mulberry32).
 * 
 * @param seed Seed value as a 32-bit integer.
 * @returns PRNG function returning values in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let state = seed;
  return function() {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a helper object containing seedable random methods.
 */
export interface SeededRand {
  next: () => number;
  range: (min: number, max: number) => number;
  choice: <T>(arr: T[]) => T;
}

/**
 * Instantiate a seeded random helper based on a string seed.
 * 
 * @param seed String seed (e.g. username).
 * @returns Seeded random utility wrapper.
 */
export function getSeededRand(seed: string): SeededRand {
  const prng = mulberry32(xxh32(seed));
  return {
    next: prng,
    range: (min: number, max: number) => min + prng() * (max - min),
    choice: <T>(arr: T[]): T => arr[Math.floor(prng() * arr.length)]
  };
}
