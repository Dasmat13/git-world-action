import { Point } from './bezier';

/**
 * Linearly interpolates a Y coordinate along a list of points ordered by X.
 * Permits attaching vegetation, monastery foundations, or flags directly to the terrain line.
 * 
 * @param x Horizontal search point.
 * @param points Array of coordinates forming a boundary ridge.
 * @returns Interpolated Y coordinate.
 */
export function interpolateY(x: number, points: Point[]): number {
  if (points.length === 0) return 0;
  if (x <= points[0].x) return points[0].y;
  if (x >= points[points.length - 1].x) return points[points.length - 1].y;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (x >= p1.x && x <= p2.x) {
      const t = (x - p1.x) / (p2.x - p1.x);
      return p1.y + (p2.y - p1.y) * t;
    }
  }
  return points[points.length - 1].y;
}
