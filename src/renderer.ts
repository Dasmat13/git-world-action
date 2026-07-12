import { WorldData, ColumnData, TileType } from './world';

const W       = 900;
const H       = 260;
const GROUND  = 195;   // y-coordinate of ground line
const TILE_W  = W / 52; // ≈ 17.3px per column

// ─── Main entry ────────────────────────────────────────────
export function renderSVG(world: WorldData, username: string): string {
  const t  = world.biomeTheme;
  const cols = world.columns;

  return `<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
     style="border-radius:12px;overflow:hidden">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${t.skyTop}"/>
      <stop offset="100%" stop-color="${t.skyBottom}"/>
    </linearGradient>
    <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${t.groundLine}"/>
      <stop offset="100%" stop-color="${t.groundColor}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="smoke">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2"/>
      <feDisplacementMap in="SourceGraphic" scale="4"/>
    </filter>
  </defs>

  ${renderSky(world)}
  ${renderStars(world)}
  ${renderMoon(world)}
  ${renderClouds(world)}
  ${renderWeather(world)}

  <!-- Ground -->
  <rect x="0" y="${GROUND}" width="${W}" height="${H - GROUND}" fill="url(#gnd)"/>

  <!-- Columns / Buildings -->
  ${cols.map(c => renderColumn(c, world)).join('\n  ')}

  <!-- Train -->
  ${renderTrain(world)}

  <!-- Vehicles -->
  ${renderVehicles(world)}

  <!-- Walking character -->
  ${renderCharacter(world)}

  <!-- Monsters (issues) -->
  ${renderMonsters(world)}

  <!-- Birds -->
  ${renderBirds(world)}

  <!-- HUD label -->
  ${renderHUD(world, username)}

  <style>${renderCSS(world)}</style>
</svg>`;
}

// ─── Sky & atmosphere ───────────────────────────────────────
function renderSky(w: WorldData): string {
  // 🌙 Day/Night cycle: override sky gradient stops based on timeOfDay
  const skyColors: Record<string, [string, string]> = {
    night: ['#020510', '#0a0f1e'],
    dawn:  ['#1a0a2e', '#ff7043'],
    day:   [w.biomeTheme.skyTop, w.biomeTheme.skyBottom],
    dusk:  ['#1a0533', '#c62828'],
  };
  const [top, bot] = skyColors[w.timeOfDay];
  return `<rect width="${W}" height="${H}" fill="url(#sky)"/>
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${top}"/>
    <stop offset="100%" stop-color="${bot}"/>
  </linearGradient></defs>`;
}

function renderStars(w: WorldData): string {
  const stars: string[] = [];
  // Deterministic star positions seeded by username chars
  const seed = w.username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = 0; i < 60; i++) {
    const x  = ((seed * (i + 1) * 997)  % W);
    const y  = ((seed * (i + 1) * 1009) % (GROUND - 40));
    const r  = i % 5 === 0 ? 1.5 : 0.8;
    const delay = (i * 0.3) % 4;
    stars.push(`<circle class="star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${w.biomeTheme.starColor}" style="animation-delay:${delay.toFixed(1)}s"/>`);
  }
  return stars.join('\n  ');
}

function renderMoon(w: WorldData): string {
  const dur = w.isMinorKey ? 20 : 30;
  return `
  <circle class="moon" r="12" fill="${w.isMinorKey ? '#c8d0e0' : '#f5d060'}"
    filter="url(#glow)" style="animation-duration:${dur}s">
    <animateMotion dur="${dur}s" repeatCount="indefinite"
      path="M -20,${GROUND - 20} Q ${W / 2},${-30} ${W + 20},${GROUND - 20}"/>
  </circle>`;
}

function renderClouds(w: WorldData): string {
  const color = w.isMinorKey ? 'rgba(180,180,200,0.18)' : 'rgba(255,255,255,0.12)';
  return [
    `<ellipse class="cloud1" cx="100" cy="35" rx="55" ry="16" fill="${color}"/>`,
    `<ellipse class="cloud1" cx="120" cy="28" rx="35" ry="12" fill="${color}"/>`,
    `<ellipse class="cloud2" cx="600" cy="50" rx="65" ry="18" fill="${color}"/>`,
    `<ellipse class="cloud2" cx="625" cy="40" rx="40" ry="13" fill="${color}"/>`,
  ].join('\n  ');
}

// ─── Column / Building ──────────────────────────────────────
function renderColumn(col: ColumnData, world: WorldData): string {
  const x    = col.weekIdx * TILE_W;
  const cw   = TILE_W - 1;

  if (col.tileType === 'grass') return renderGrassTile(x, cw, world);

  const bh   = col.height;
  const by   = GROUND - bh;
  const t    = world.biomeTheme;

  let parts = '';

  // ── Building body ──
  const darken = (hex: string, amt: number) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - amt);
    const g = Math.max(0, ((n >> 8) & 0xff) - amt);
    const b = Math.max(0, (n & 0xff) - amt);
    return `rgb(${r},${g},${b})`;
  };

  parts += `<rect x="${x.toFixed(1)}" y="${by}" width="${cw.toFixed(1)}" height="${bh}"
    fill="${t.buildingBase}" rx="1"/>`;

  // ── Roof detail per tile type ──
  if (col.tileType === 'house') {
    const mx = x + cw / 2;
    parts += `<polygon points="${x.toFixed(1)},${by} ${mx.toFixed(1)},${(by - 8).toFixed(1)} ${(x + cw).toFixed(1)},${by}"
      fill="${t.buildingAccent}"/>`;
  }

  if (col.tileType === 'castle' || col.tileType === 'skyscraper') {
    // Antenna
    const ax = x + cw / 2;
    parts += `<line x1="${ax.toFixed(1)}" y1="${by}" x2="${ax.toFixed(1)}" y2="${(by - 12).toFixed(1)}"
      stroke="${t.buildingAccent}" stroke-width="1.5"/>`;
    parts += `<circle class="blink" cx="${ax.toFixed(1)}" cy="${(by - 13).toFixed(1)}" r="2"
      fill="#ff4444" style="animation-delay:${(col.weekIdx * 0.17 % 2).toFixed(2)}s"/>`;
  }

  // ── Windows ──
  parts += renderWindows(col, x, by, cw, bh, t.windowColor);

  // ── Smoke ──
  if (col.hasSmoke) {
    const sx = x + cw * 0.3;
    parts += `<circle class="smoke" cx="${sx.toFixed(1)}" cy="${(by - 5).toFixed(1)}" r="4"
      fill="${t.smokeColor}" opacity="0.6"
      style="animation-delay:${(col.weekIdx * 0.4 % 3).toFixed(2)}s"/>`;
  }

  // ── Boss crown (PR) ──
  if (col.hasBoss) {
    const pts = [
      `${x.toFixed(1)},${by}`,
      `${(x + cw * 0.2).toFixed(1)},${(by - 10).toFixed(1)}`,
      `${(x + cw * 0.5).toFixed(1)},${(by - 6).toFixed(1)}`,
      `${(x + cw * 0.8).toFixed(1)},${(by - 10).toFixed(1)}`,
      `${(x + cw).toFixed(1)},${by}`,
    ].join(' ');
    parts += `<polygon points="${pts}" fill="#ffd700" filter="url(#glow)"/>`;
  }

  return `<g class="col" data-week="${col.weekIdx}">${parts}</g>`;
}

function renderGrassTile(x: number, cw: number, world: WorldData): string {
  const t   = world.biomeTheme;
  const gx  = x + cw * 0.3;
  // tiny tree
  return `<g>
    <rect x="${x.toFixed(1)}" y="${GROUND - 6}" width="${cw.toFixed(1)}" height="6" fill="${t.groundColor}"/>
    <rect x="${gx.toFixed(1)}" y="${GROUND - 6}" width="2" height="5" fill="#5a3a1a"/>
    <ellipse cx="${(gx + 1).toFixed(1)}" cy="${(GROUND - 8).toFixed(1)}" rx="4" ry="4" fill="${t.groundLine}"/>
  </g>`;
}

function renderWindows(col: ColumnData, x: number, by: number, cw: number, bh: number, wc: string): string {
  if (bh < 20) return '';
  const rows    = Math.max(1, Math.floor(bh / 12));
  const cols_w  = Math.max(1, Math.floor(cw / 5));
  const ww      = 2.5, wh = 2.5;
  const parts: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols_w; c++) {
      const wx    = x + 2 + c * 5;
      const wy    = by + 4 + r * 10;
      const delay = ((r * cols_w + c) * 0.3 % 5).toFixed(1);
      if (wy + wh > GROUND - 2) continue;
      // some windows are dark (off)
      const lit   = (r + c + col.weekIdx) % 3 !== 0;
      if (lit) {
        parts.push(`<rect class="win" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}"
          width="${ww}" height="${wh}" fill="${wc}" rx="0.5"
          style="animation-delay:${delay}s"/>`);
      }
    }
  }
  return parts.join('\n    ');
}

// ─── Character (explorer) ───────────────────────────────────
function renderCharacter(world: WorldData): string {
  const dur = (80 / world.tempo).toFixed(1);
  const cy  = GROUND - 10;
  const col = world.biomeTheme.windowColor;
  return `
  <g class="hero" style="animation-duration:${dur}s">
    <!-- body -->
    <circle cx="4" cy="${cy - 8}" r="4" fill="${col}"/>
    <line x1="4" y1="${cy - 4}" x2="4" y2="${cy}" stroke="${col}" stroke-width="2"/>
    <!-- legs (walk anim) -->
    <line class="leg-l" x1="4" y1="${cy}" x2="2" y2="${cy + 6}" stroke="${col}" stroke-width="1.5"/>
    <line class="leg-r" x1="4" y1="${cy}" x2="6" y2="${cy + 6}" stroke="${col}" stroke-width="1.5"/>
    <!-- arms -->
    <line x1="4" y1="${cy - 2}" x2="0" y2="${cy - 4}" stroke="${col}" stroke-width="1.5"/>
    <line x1="4" y1="${cy - 2}" x2="8" y2="${cy - 4}" stroke="${col}" stroke-width="1.5"/>
  </g>`;
}

// ─── Monsters (issues) ─────────────────────────────────────
function renderMonsters(world: WorldData): string {
  if (world.totalContributions === 0) return '';
  const monsters: string[] = [];
  world.columns.forEach((col, i) => {
    if (!col.hasMonster) return;
    const x  = col.weekIdx * TILE_W + TILE_W / 2;
    const my = GROUND - 14;
    monsters.push(`
  <g class="monster" style="animation-delay:${(i * 0.6 % 4).toFixed(1)}s">
    <ellipse cx="${x.toFixed(1)}" cy="${my}" rx="7" ry="6" fill="#8b0000"/>
    <circle cx="${(x - 2).toFixed(1)}" cy="${(my - 1).toFixed(1)}" r="1.5" fill="#ff0"/>
    <circle cx="${(x + 2).toFixed(1)}" cy="${(my - 1).toFixed(1)}" r="1.5" fill="#ff0"/>
    <path d="M ${(x - 3).toFixed(1)},${(my + 2).toFixed(1)} Q ${x.toFixed(1)},${(my + 5).toFixed(1)} ${(x + 3).toFixed(1)},${(my + 2).toFixed(1)}"
      stroke="#ff6666" stroke-width="1" fill="none"/>
    <line x1="${(x - 4).toFixed(1)}" y1="${(my - 7).toFixed(1)}" x2="${(x - 2).toFixed(1)}" y2="${(my - 5).toFixed(1)}" stroke="#8b0000" stroke-width="2"/>
    <line x1="${(x + 4).toFixed(1)}" y1="${(my - 7).toFixed(1)}" x2="${(x + 2).toFixed(1)}" y2="${(my - 5).toFixed(1)}" stroke="#8b0000" stroke-width="2"/>
  </g>`);
  });
  return monsters.join('');
}

// ─── Weather effects 🌧️ ────────────────────────────────────
function renderWeather(w: WorldData): string {
  if (w.weatherType === 'clear') return '';
  const drops: string[] = [];
  const seed = w.username.split('').reduce((a, c) => a + c.charCodeAt(0), 42);
  const count = 40;
  for (let i = 0; i < count; i++) {
    const x     = ((seed * (i + 3) * 613)  % W);
    const y     = ((seed * (i + 7) * 719)  % GROUND);
    const delay = ((i * 0.15) % 2).toFixed(2);
    const dur   = (0.6 + (i % 5) * 0.15).toFixed(2);
    if (w.weatherType === 'rain') {
      drops.push(`<line class="rain" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x+2).toFixed(1)}" y2="${(y+10).toFixed(1)}" stroke="#7ec8e3" stroke-width="1" opacity="0.7" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`);
    } else {
      drops.push(`<circle class="snow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#ddeeff" opacity="0.8" style="animation-delay:${delay}s;animation-duration:${(parseFloat(dur)*2).toFixed(2)}s"/>`);
    }
  }
  return drops.join('\n  ');
}

// ─── Train 🚂 ────────────────────────────────────────────────
function renderTrain(w: WorldData): string {
  const ty  = GROUND - 12;
  const dur = (30 / (w.tempo / 10)).toFixed(1);
  const col = w.biomeTheme.buildingAccent;
  const acc = w.biomeTheme.buildingBase;
  // engine + 2 cars
  return `
  <g class="train" style="animation-duration:${dur}s">
    <!-- Engine -->
    <rect x="0" y="${ty}" width="22" height="10" fill="${col}" rx="2"/>
    <rect x="16" y="${ty-4}" width="6" height="4" fill="${col}" rx="1"/>
    <circle cx="4" cy="${ty+10}" r="3" fill="#333"/>
    <circle cx="16" cy="${ty+10}" r="3" fill="#333"/>
    <!-- Smoke puff -->
    <circle class="train-smoke" cx="21" cy="${ty-6}" r="3" fill="${w.biomeTheme.smokeColor}" opacity="0.7"/>
    <!-- Car 1 -->
    <rect x="-28" y="${ty+1}" width="20" height="9" fill="${acc}" rx="1"/>
    <circle cx="-22" cy="${ty+10}" r="2.5" fill="#333"/>
    <circle cx="-12" cy="${ty+10}" r="2.5" fill="#333"/>
    <!-- Car 2 -->
    <rect x="-54" y="${ty+1}" width="20" height="9" fill="${acc}" rx="1"/>
    <circle cx="-48" cy="${ty+10}" r="2.5" fill="#333"/>
    <circle cx="-38" cy="${ty+10}" r="2.5" fill="#333"/>
  </g>`;
}

// ─── Vehicles 🚗 ─────────────────────────────────────────────
function renderVehicles(w: WorldData): string {
  const vy   = GROUND - 8;
  const dur1 = (22 / (w.tempo / 10)).toFixed(1);
  const dur2 = (35 / (w.tempo / 10)).toFixed(1);
  const c1   = w.biomeTheme.buildingBase;
  const c2   = w.biomeTheme.windowColor;
  return `
  <!-- Car 1 -->
  <g class="car1" style="animation-duration:${dur1}s">
    <rect x="0" y="${vy}" width="18" height="7" fill="${c1}" rx="2"/>
    <rect x="4" y="${vy-4}" width="10" height="5" fill="${c1}" rx="1"/>
    <rect x="5" y="${vy-3}" width="4" height="3" fill="${c2}" rx="0.5" opacity="0.8"/>
    <rect x="10" y="${vy-3}" width="3" height="3" fill="${c2}" rx="0.5" opacity="0.8"/>
    <circle cx="4"  cy="${vy+7}" r="2.5" fill="#222"/>
    <circle cx="14" cy="${vy+7}" r="2.5" fill="#222"/>
  </g>
  <!-- Car 2 RTL -->
  <g class="car2" style="animation-duration:${dur2}s">
    <rect x="0" y="${vy+2}" width="16" height="6" fill="#e53935" rx="2"/>
    <rect x="3" y="${vy-2}" width="9" height="5" fill="#e53935" rx="1"/>
    <rect x="4" y="${vy-1}" width="3" height="3" fill="${c2}" rx="0.5" opacity="0.8"/>
    <rect x="9" y="${vy-1}" width="3" height="3" fill="${c2}" rx="0.5" opacity="0.8"/>
    <circle cx="3"  cy="${vy+8}" r="2.5" fill="#222"/>
    <circle cx="13" cy="${vy+8}" r="2.5" fill="#222"/>
  </g>`;
}

// ─── Birds 🎮 pixel-art ──────────────────────────────────────
function renderBirds(w: WorldData): string {
  const seed = w.username.split('').reduce((a, c) => a + c.charCodeAt(0), 7);
  const birds: string[] = [];
  const count = w.timeOfDay === 'night' ? 0 : 3;
  for (let i = 0; i < count; i++) {
    const by    = 20 + ((seed * (i + 2) * 331) % 60);
    const delay = (i * 3.5).toFixed(1);
    const dur   = (18 + i * 5).toFixed(1);
    birds.push(`<g class="bird" style="animation-delay:${delay}s;animation-duration:${dur}s">
      <path d="M0,${by} Q3,${by-3} 6,${by} Q9,${by-3} 12,${by}" stroke="${w.biomeTheme.starColor}" stroke-width="1.2" fill="none"/>
    </g>`);
  }
  return birds.join('\n  ');
}

// ─── HUD ────────────────────────────────────────────────────
function renderHUD(world: WorldData, username: string): string {
  const t  = world.biomeTheme;
  return `
  <g>
    <rect x="8" y="8" width="200" height="22" rx="4" fill="rgba(0,0,0,0.5)"/>
    <text x="14" y="22" font-family="monospace" font-size="10" fill="${t.starColor}">
      🌍 ${username}'s GitWorld · ${world.totalContributions} commits
    </text>
  </g>
  <g>
    <rect x="${W - 118}" y="8" width="110" height="22" rx="4" fill="rgba(0,0,0,0.5)"/>
    <text x="${W - 112}" y="22" font-family="monospace" font-size="10" fill="${t.starColor}">
      🔥 ${world.streak}d streak
    </text>
  </g>`;
}

// ─── CSS animations ─────────────────────────────────────────
function renderCSS(world: WorldData): string {
  const dur = (80 / world.tempo).toFixed(1);
  return `
    .star { animation: twinkle 3s ease-in-out infinite alternate; }
    @keyframes twinkle { 0%{opacity:.2} 100%{opacity:1} }

    .moon { }

    .cloud1 { animation: drift1 25s linear infinite; }
    .cloud2 { animation: drift2 35s linear infinite; }
    @keyframes drift1 { from{transform:translateX(-200px)} to{transform:translateX(${W + 200}px)} }
    @keyframes drift2 { from{transform:translateX(${W + 200}px)} to{transform:translateX(-200px)} }

    .blink { animation: blink 1.2s ease-in-out infinite; }
    @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }

    .win { animation: flicker 8s ease-in-out infinite alternate; }
    @keyframes flicker { 0%,90%{opacity:1} 92%,94%{opacity:.1} 96%{opacity:1} }

    .smoke {
      animation: rise 3s ease-out infinite;
      transform-origin: center;
    }
    @keyframes rise {
      0%   { transform:translateY(0) scale(1);   opacity:.6; }
      100% { transform:translateY(-20px) scale(2); opacity:0; }
    }

    .hero {
      animation: walk ${dur}s linear infinite;
      transform-origin: 4px center;
    }
    @keyframes walk { from{transform:translateX(-10px)} to{transform:translateX(${W + 10}px)} }

    .leg-l { animation: leg-l ${(parseFloat(dur) * 0.1).toFixed(2)}s ease-in-out infinite alternate; transform-origin: 4px ${GROUND}px; }
    .leg-r { animation: leg-r ${(parseFloat(dur) * 0.1).toFixed(2)}s ease-in-out infinite alternate; transform-origin: 4px ${GROUND}px; }
    @keyframes leg-l { from{transform:rotate(-20deg)} to{transform:rotate(20deg)} }
    @keyframes leg-r { from{transform:rotate(20deg)} to{transform:rotate(-20deg)} }

    .monster { animation: hover 2s ease-in-out infinite alternate; }
    @keyframes hover { from{transform:translateY(0)} to{transform:translateY(-4px)} }

    /* 🌧️ Weather */
    .rain { animation: fall linear infinite; }
    @keyframes fall { from{transform:translateY(-20px)} to{transform:translateY(${GROUND}px)} }
    .snow { animation: drift ease-in-out infinite; }
    @keyframes drift {
      0%   { transform:translate(0,0); opacity:.8; }
      50%  { transform:translate(6px,${GROUND/2}px); opacity:.6; }
      100% { transform:translate(-4px,${GROUND}px); opacity:0; }
    }

    /* 🚂 Train */
    .train { animation: train-move linear infinite; transform-origin: 0 0; }
    @keyframes train-move { from{transform:translateX(-80px)} to{transform:translateX(${W+80}px)} }
    .train-smoke { animation: rise 2s ease-out infinite; transform-origin: center; }

    /* 🚗 Vehicles */
    .car1 { animation: car-ltr linear infinite; }
    @keyframes car-ltr { from{transform:translateX(-30px)} to{transform:translateX(${W+30}px)} }
    .car2 { animation: car-rtl linear infinite; }
    @keyframes car-rtl { from{transform:translateX(${W+30}px)} to{transform:translateX(-30px)} }

    /* 🎮 Birds */
    .bird { animation: fly linear infinite; }
    @keyframes fly {
      from { transform:translateX(-20px); }
      to   { transform:translateX(${W+20}px); }
    }
  `;
}
