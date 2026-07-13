import { WorldData } from '../world';
import { getSeededRand } from '../utils/random';
import { Point, bezierOpen } from '../utils/bezier';

/**
 * Renders the winding mountain loop road, guardrails, and animated vehicle.
 */
export function renderRoads(world: WorldData): string {
  const rand = getSeededRand(world.username + '_roads');
  
  const roadPoints: Point[] = [
    { x: 750, y: 720 },
    { x: 890, y: 780 },
    { x: 800, y: 840 },
    { x: 250, y: 920 },
    { x: 120, y: 970 },
    { x: 220, y: 1040 },
    { x: 780, y: 1110 },
    { x: 880, y: 1170 }
  ];
  
  const roadPathD = bezierOpen(roadPoints);
  
  // Helper to evaluate quadratic bezier
  const evalQuad = (p0: Point, p1: Point, p2: Point, t: number): Point => {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
    };
  };

  const mid = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  // Generate dense points along the Bezier spline to place guardrails precisely on the curve
  const splinePoints: Point[] = [];
  const numPointsPerSegment = 20;

  if (roadPoints.length >= 2) {
    // Segment 0
    const end0 = mid(roadPoints[1], roadPoints[2]);
    for (let j = 0; j < numPointsPerSegment; j++) {
      splinePoints.push(evalQuad(roadPoints[0], roadPoints[1], end0, j / numPointsPerSegment));
    }
    
    // Mid segments
    for (let i = 2; i < roadPoints.length - 1; i++) {
      const start = mid(roadPoints[i - 1], roadPoints[i]);
      const end = mid(roadPoints[i], roadPoints[i + 1]);
      for (let j = 0; j < numPointsPerSegment; j++) {
        splinePoints.push(evalQuad(start, roadPoints[i], end, j / numPointsPerSegment));
      }
    }
    
    // Last segment
    const startLast = mid(roadPoints[roadPoints.length - 2], roadPoints[roadPoints.length - 1]);
    const endLast = roadPoints[roadPoints.length - 1];
    for (let j = 0; j <= numPointsPerSegment; j++) {
      const t = j / numPointsPerSegment;
      splinePoints.push({
        x: startLast.x + (endLast.x - startLast.x) * t,
        y: startLast.y + (endLast.y - startLast.y) * t
      });
    }
  }

  // Draw guardrail posts and continuous handrail along steep outer cliff segments
  // We place guardrails on:
  // - Segment 0 (first loop on right): points index 0 to 20
  // - Segment 2 & 3 (long traverse and left loop): points index 35 to 80
  // - Segment 5 & 6 (bottom right slope): points index 100 to 140
  let wallHashes = '';
  const railPoints: Point[] = [];

  splinePoints.forEach((p, idx) => {
    // Decide if this index is a cliff-side segment that needs a guardrail
    const isGuardrailArea = 
      (idx >= 0 && idx <= 22) || 
      (idx >= 38 && idx <= 78) || 
      (idx >= 98 && idx <= 135);

    if (isGuardrailArea) {
      // Calculate tangent/normal to offset the rail to the downhill side
      let dx = 0;
      let dy = 0;
      if (idx < splinePoints.length - 1) {
        dx = splinePoints[idx + 1].x - p.x;
        dy = splinePoints[idx + 1].y - p.y;
      } else {
        dx = p.x - splinePoints[idx - 1].x;
        dy = p.y - splinePoints[idx - 1].y;
      }
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      // Downhill offset direction (we offset by 4px)
      // For Spiti road layout, downhill side is generally:
      // - Segment 0: y-positive (downwards)
      // - Segment 2-3: y-positive or leftwards
      // We can use the normal vector signed appropriately
      const side = (idx >= 38 && idx <= 78) ? -1 : 1;
      const rx = p.x + nx * 5 * side;
      const ry = p.y + ny * 5 * side;

      // Add a post every 4 points
      if (idx % 4 === 0) {
        wallHashes += `<line x1="${rx}" y1="${ry}" x2="${rx}" y2="${ry + 7}" stroke="#4b5563" stroke-width="1.8" stroke-linecap="round" />\n`;
      }
      railPoints.push({ x: rx, y: ry + 1 });
    } else {
      // If we exit a guardrail area, break the continuous rail path by adding a separator
      if (railPoints.length > 0 && railPoints[railPoints.length - 1].x !== -9999) {
        railPoints.push({ x: -9999, y: -9999 });
      }
    }
  });

  // Build the path for the continuous wooden/steel guardrail cable
  let railPathD = '';
  let active = false;
  railPoints.forEach(p => {
    if (p.x === -9999) {
      active = false;
    } else {
      if (!active) {
        railPathD += ` M ${p.x} ${p.y}`;
        active = true;
      } else {
        railPathD += ` L ${p.x} ${p.y}`;
      }
    }
  });

  // Winding vehicle
  const vehicle = `
  <g>
    <!-- Car shadow -->
    <rect x="-7" y="-2" width="13" height="7" rx="2" fill="#000000" opacity="0.25" />
    <!-- Car body -->
    <rect x="-6" y="-3" width="12" height="6" rx="1.5" fill="#ef4444" />
    <!-- Windshield -->
    <rect x="1" y="-2" width="3" height="4" rx="0.5" fill="#ffffff" opacity="0.7" />
    <!-- Wheels -->
    <circle cx="-3.5" cy="3" r="1.5" fill="#1f2937" />
    <circle cx="3.5" cy="3" r="1.5" fill="#1f2937" />
    <animateMotion dur="25s" repeatCount="indefinite" rotate="auto" path="${roadPathD}" />
  </g>`;

  return `
  <!-- Winding dirt road base -->
  <path d="${roadPathD}" fill="none" stroke="#d7ccc8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Wheel tracks/texture -->
  <path d="${roadPathD}" fill="none" stroke="#8d6e63" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2,5" stroke-opacity="0.25" />
  
  <!-- Guardrail Posts -->
  <g>${wallHashes}</g>

  <!-- Continuous Guardrail Cable -->
  ${railPathD ? `<path d="${railPathD}" fill="none" stroke="#6b7280" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />` : ''}

  <!-- Moving vehicle -->
  ${vehicle}
  `;
}
