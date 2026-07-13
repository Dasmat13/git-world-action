/**
 * Point representation in 2D space.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Converts a series of points into a smooth closed SVG path representing a mountain layer.
 * Extends the bottom edge to the canvas base to create a fillable solid shape.
 * 
 * @param points Mountain ridge points.
 * @param width Width of the canvas (default: 960).
 * @param height Height of the canvas (default: 1440).
 * @returns SVG path string.
 */
export function bezier(points: Point[], width = 960, height = 1440): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const next = points[i + 1];
    const cx = (p.x + next.x) / 2;
    const cy = (p.y + next.y) / 2;
    d += ` Q ${p.x} ${p.y} ${cx} ${cy}`;
  }
  
  // Close shape to bottom of canvas
  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}

/**
 * Converts points into an open smooth curve (for rivers, ridges, and paths).
 * 
 * @param points Array of coordinates.
 * @returns SVG path string.
 */
export function bezierOpen(points: Point[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const next = points[i + 1];
    const cx = (p.x + next.x) / 2;
    const cy = (p.y + next.y) / 2;
    d += ` Q ${p.x} ${p.y} ${cx} ${cy}`;
  }
  
  // Connect to the final point
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}
