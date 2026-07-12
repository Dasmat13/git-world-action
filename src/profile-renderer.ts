/**
 * Profile Card Renderer — Aesthetic Edition
 * 900 × 1080px pixel-art game-UI profile card.
 * Sections: Hero, About, World State, Tech Stack, Active Quests, Stats HUD
 */

import { WorldData } from './world';

const W = 900;
const H = 1080;

export function renderProfileCard(world: WorldData): string {
  const t  = world.biomeTheme;

  // Sky colours per time of day
  const skyPalettes: Record<string, [string, string, string]> = {
    night: ['#010408', '#060d1f', '#0d1a3a'],
    dawn:  ['#0d0520', '#6b1f4a', '#ff7043'],
    day:   [t.skyTop, t.skyBottom, t.groundColor],
    dusk:  ['#0d0220', '#5b0e6e', '#c62828'],
  };
  const [s0, s1, s2] = skyPalettes[world.timeOfDay];

  const ac  = t.buildingBase;       // accent (bright)
  const ac2 = t.buildingAccent;     // accent dark
  const tx  = t.starColor;          // text / star colour
  const fc  = '#fff';
  const mono = 'monospace';
  const seed = world.username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  // ── Stars ────────────────────────────────────────────────────
  const stars = Array.from({ length: 80 }, (_, i) => {
    const x = ((seed * (i + 1) * 997)  % W).toFixed(1);
    const y = ((seed * (i + 1) * 1009) % 260).toFixed(1);
    const r = i % 7 === 0 ? 2 : i % 3 === 0 ? 1.2 : 0.7;
    const d = ((i * 0.28) % 5).toFixed(1);
    const op = (0.4 + (i % 5) * 0.12).toFixed(2);
    return `<circle class="star" cx="${x}" cy="${y}" r="${r}" fill="${tx}" opacity="${op}" style="animation-delay:${d}s"/>`;
  }).join('\n  ');

  // ── Shooting stars ───────────────────────────────────────────
  const shoots = [0, 1, 2].map(i => {
    const sx = 80 + ((seed * (i + 5) * 311) % 600);
    const sy = 20 + ((seed * (i + 3) * 229) % 100);
    const d  = (i * 4 + 2).toFixed(0);
    return `<line class="shoot" x1="${sx}" y1="${sy}" x2="${sx + 60}" y2="${sy + 20}"
      stroke="${tx}" stroke-width="1.5" opacity="0.7" style="animation-delay:${d}s"/>`;
  }).join('\n  ');

  // ── Mini skyline (silhouette strip) ──────────────────────────
  const skyline = world.columns.slice(0, 52).map((col, i) => {
    if (col.tileType === 'grass') return '';
    const cw = W / 52;
    const bh = col.height * 0.45;
    const bx = (i * cw).toFixed(1);
    const by = (295 - bh).toFixed(1);
    const win = bh > 18 ? `<rect x="${(i * cw + 2).toFixed(1)}" y="${(295 - bh + 5).toFixed(1)}" width="3" height="2" fill="${ac}" opacity="0.6"/>` : '';
    return `<rect x="${bx}" y="${by}" width="${(cw - 1.5).toFixed(1)}" height="${bh.toFixed(1)}" fill="${ac2}" opacity="0.55" rx="1"/>${win}`;
  }).join('');

  // ── Panel helper ─────────────────────────────────────────────
  const panel = (x: number, y: number, w: number, h: number, label: string) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"
    fill="url(#panelGrad)" stroke="url(#borderGrad)" stroke-width="1.5"/>
  <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="1.5" rx="1"
    fill="${ac}" opacity="0.15"/>
  <!-- Corner accents -->
  <path d="M${x + 10},${y} L${x},${y} L${x},${y + 10}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M${x + w - 10},${y} L${x + w},${y} L${x + w},${y + 10}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M${x},${y + h - 10} L${x},${y + h} L${x + 10},${y + h}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M${x + w},${y + h - 10} L${x + w},${y + h} L${x + w - 10},${y + h}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.7"/>
  <!-- Section label -->
  <rect x="${x + 18}" y="${y - 9}" width="${label.length * 7.5 + 16}" height="17" rx="4" fill="${ac2}" opacity="0.9"/>
  <text x="${x + 26}" y="${y + 4}" font-family="${mono}" font-size="9.5" fill="${ac}"
    font-weight="bold" letter-spacing="2">${label}</text>`;

  // ── Tech badges ──────────────────────────────────────────────
  const skills = [
    { n: 'Kubernetes', c: '#326CE5' }, { n: 'Docker',     c: '#2496ED' },
    { n: 'TypeScript', c: '#3178C6' }, { n: 'Go',         c: '#00ADD8' },
    { n: 'Node.js',    c: '#339933' }, { n: 'Terraform',  c: '#7B42BC' },
    { n: 'Python',     c: '#3776AB' }, { n: 'AWS',        c: '#FF9900' },
    { n: 'Linux',      c: '#c8a000' }, { n: 'Grafana',    c: '#F46800' },
    { n: 'Prometheus', c: '#E6522C' }, { n: 'Backstage',  c: '#36BAA2' },
  ];
  const BW = 132, BH = 30, GAP_X = 10, GAP_Y = 10;
  const B0X = 28, B0Y = 626;
  const badges = skills.map((s, i) => {
    const bx = B0X + (i % 6) * (BW + GAP_X);
    const by = B0Y + Math.floor(i / 6) * (BH + GAP_Y);
    return `
  <rect x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="6"
    fill="${s.c}" opacity="0.15" stroke="${s.c}" stroke-width="1" stroke-opacity="0.6"/>
  <rect x="${bx + 1}" y="${by + 1}" width="${BW - 2}" height="2" rx="1" fill="${s.c}" opacity="0.4"/>
  <text x="${bx + BW / 2}" y="${by + 20}" font-family="${mono}" font-size="11.5"
    fill="${fc}" text-anchor="middle" font-weight="bold">${s.n}</text>`;
  }).join('');

  // ── Quest items ──────────────────────────────────────────────
  const quests = [
    { text: 'Topology-aware scheduling for LeaderWorkerSet (lws)', tag: 'IN PROGRESS', tc: '#7ee787' },
    { text: 'CompositePodGroup integration — KEP-893',             tag: 'IN PROGRESS', tc: '#7ee787' },
    { text: 'GitWorld Engine — GitHub profile as pixel-art world', tag: 'SHIPPED ✓',   tc: '#ffd700' },
    { text: 'Real-time weather auto-detection via Open-Meteo',     tag: 'SHIPPED ✓',   tc: '#ffd700' },
    { text: 'Node.js core contributions',                          tag: 'EXPLORING',   tc: '#58a6ff' },
    { text: 'Backstage plugin ecosystem',                          tag: 'EXPLORING',   tc: '#58a6ff' },
  ];
  const questItems = quests.map((q, i) => {
    const qy = 872 + i * 28;
    return `
  <text x="36" y="${qy}" font-family="${mono}" font-size="12.5" fill="${tx}">
    <tspan fill="${ac}" opacity="0.7">▶  </tspan>${q.text}
    <tspan dx="12" fill="${q.tc}" font-size="10" font-weight="bold">[ ${q.tag} ]</tspan>
  </text>`;
  }).join('');

  // ── Stats HUD ────────────────────────────────────────────────
  const stats = [
    { icon: '🔥', label: 'STREAK',        val: `${world.streak}d`,              sub: 'contribution days' },
    { icon: '🏗️', label: 'CONTRIBUTIONS', val: `${world.totalContributions}`,   sub: 'total commits' },
    { icon: '🌍', label: 'BIOME',         val: t.label,                         sub: world.timeOfDay },
    { icon: '🌦️', label: 'WEATHER',       val: world.weatherType.toUpperCase(), sub: 'live via Open-Meteo' },
  ];
  const statCards = stats.map((s, i) => {
    const sx = 22 + i * 217;
    return `
  <rect x="${sx}" y="992" width="208" height="68" rx="8"
    fill="url(#panelGrad)" stroke="${ac2}" stroke-width="1"/>
  <rect x="${sx + 1}" y="992" width="206" height="2" rx="1" fill="${ac}" opacity="0.3"/>
  <!-- corner accents -->
  <path d="M${sx + 6},992 L${sx},992 L${sx},998" stroke="${ac}" stroke-width="1.5" fill="none" opacity="0.5"/>
  <path d="M${sx + 208},998 L${sx + 208},992 L${sx + 202},992" stroke="${ac}" stroke-width="1.5" fill="none" opacity="0.5"/>
  <text x="${sx + 10}" y="1010" font-family="${mono}" font-size="9" fill="${tx}" opacity="0.5" letter-spacing="2">${s.icon}  ${s.label}</text>
  <text x="${sx + 10}" y="1037" font-family="${mono}" font-size="20" fill="${ac}" font-weight="bold">${s.val}</text>
  <text x="${sx + 10}" y="1052" font-family="${mono}" font-size="9" fill="${tx}" opacity="0.4">${s.sub}</text>`;
  }).join('');

  // ── Celestial body ────────────────────────────────────────────
  const isSun = world.timeOfDay === 'day' || world.timeOfDay === 'dawn';
  const sunRays = isSun ? Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const x1 = (Math.cos(angle) * 25).toFixed(1);
    const y1 = (Math.sin(angle) * 25).toFixed(1);
    const x2 = (Math.cos(angle) * 34).toFixed(1);
    const y2 = (Math.sin(angle) * 34).toFixed(1);
    return `<line class="ray" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f5d060" stroke-width="1.5" opacity="0.6"/>`;
  }).join('') : '';

  return `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
     style="border-radius:18px;overflow:hidden">
  <defs>
    <!-- Sky gradient -->
    <linearGradient id="pcSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${s0}"/>
      <stop offset="35%"  stop-color="${s1}"/>
      <stop offset="100%" stop-color="${s2}"/>
    </linearGradient>
    <!-- Panel fill -->
    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(10,15,30,0.82)"/>
      <stop offset="100%" stop-color="rgba(5,8,18,0.70)"/>
    </linearGradient>
    <!-- Panel border gradient -->
    <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="${ac}"  stop-opacity="0.6"/>
      <stop offset="50%"  stop-color="${ac2}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${ac}"  stop-opacity="0.5"/>
    </linearGradient>
    <!-- Glow filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Text glow -->
    <filter id="tglow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Soft glow for stars -->
    <filter id="sglow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
    </filter>
    <!-- Scan lines pattern -->
    <pattern id="scan" x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1" height="1" fill="rgba(0,0,0,0.08)"/>
    </pattern>
  </defs>

  <!-- ═══ BACKGROUND ════════════════════════════════════════════ -->
  <rect width="${W}" height="${H}" fill="url(#pcSky)"/>
  <!-- Scan line overlay — subtle retro feel -->
  <rect width="${W}" height="${H}" fill="url(#scan)" opacity="0.5"/>

  <!-- Stars glow layer -->
  <g filter="url(#sglow)" opacity="0.4">${stars}</g>
  <!-- Stars crisp layer -->
  ${stars}

  <!-- Shooting stars -->
  ${shoots}

  <!-- Celestial body -->
  <g filter="url(#glow)">
    ${sunRays}
    <circle r="${isSun ? 20 : 14}" fill="${isSun ? '#f5d060' : '#c8d8f0'}" opacity="0.95">
      <animateMotion dur="45s" repeatCount="indefinite"
        path="M -30,280 Q ${W / 2},-30 ${W + 30},280"/>
    </circle>
  </g>

  <!-- Skyline silhouette -->
  ${skyline}

  <!-- Ground strip -->
  <rect x="0" y="295" width="${W}" height="16" fill="${t.groundColor}" opacity="0.6"/>
  <rect x="0" y="295" width="${W}" height="2"  fill="${t.groundLine}"  opacity="0.8"/>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- HERO SECTION                                               -->
  <!-- ═══════════════════════════════════════════════════════════ -->

  <!-- Decorative scanline bar behind hero text -->
  <rect x="0" y="318" width="${W}" height="130" fill="rgba(0,0,0,0.25)"/>
  <rect x="0" y="318" width="${W}" height="1.5" fill="${ac}" opacity="0.3"/>
  <rect x="0" y="447" width="${W}" height="1.5" fill="${ac}" opacity="0.2"/>

  <!-- Player tag -->
  <text x="${W / 2}" y="346" font-family="${mono}" font-size="10" fill="${tx}"
    text-anchor="middle" opacity="0.45" letter-spacing="8">✦  PLAYER ONE  ✦</text>

  <!-- Main name -->
  <text class="heroName" x="${W / 2}" y="410" font-family="${mono}" font-size="52"
    fill="${ac}" text-anchor="middle" font-weight="bold"
    filter="url(#tglow)">Hi! I'm Dasmat 👋</text>

  <!-- Subtitle -->
  <text x="${W / 2}" y="440" font-family="${mono}" font-size="13.5" fill="${tx}"
    text-anchor="middle" opacity="0.8" letter-spacing="1">
    DevOps &amp; Cloud-Native Explorer  ·  Full-Stack Dev  ·  Open Source Contributor
  </text>

  <!-- Blinking cursor -->
  <rect class="cursor" x="${W / 2 + 200}" y="422" width="12" height="3" fill="${ac}"/>

  <!-- Decorative horizontal rule -->
  <line x1="80" y1="456" x2="${W - 80}" y2="456" stroke="${ac}" stroke-width="0.5" opacity="0.3"/>
  <circle cx="80"       cy="456" r="2.5" fill="${ac}" opacity="0.4"/>
  <circle cx="${W - 80}" cy="456" r="2.5" fill="${ac}" opacity="0.4"/>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- ABOUT ME panel                                             -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  ${panel(18, 474, W - 36, 108, '◈ ABOUT ME')}

  <text x="34" y="504" font-family="${mono}" font-size="13" fill="${tx}">
    🚀  <tspan fill="${ac}">Core:</tspan>  DevOps automation · Cloud-Native architecture · Full-stack Web Development
  </text>
  <text x="34" y="528" font-family="${mono}" font-size="13" fill="${tx}">
    🌱  <tspan fill="${ac}">Contributing:</tspan>  Kubernetes SIGs · Node.js Core · Express.js · Backstage
  </text>
  <text x="34" y="552" font-family="${mono}" font-size="13" fill="${tx}">
    📫  mey37056@gmail.com  <tspan dx="20" fill="${ac}" opacity="0.5">|</tspan>
    <tspan dx="20">⚡  Loves container orchestration &amp; automated healing systems</tspan>
  </text>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- WORLD STATE bar                                            -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  ${panel(18, 596, W - 36, 20, '◈ CURRENT WORLD')}

  <text x="${W / 2}" y="610" font-family="${mono}" font-size="13" fill="${tx}" text-anchor="middle">
    🌍 <tspan fill="${ac}" font-weight="bold">${t.label}</tspan>
    <tspan dx="22" fill="${tx}" opacity="0.5">|</tspan>
    <tspan dx="22">🌙 <tspan fill="${ac}" font-weight="bold">${world.timeOfDay}</tspan></tspan>
    <tspan dx="22" fill="${tx}" opacity="0.5">|</tspan>
    <tspan dx="22">🌦️ <tspan fill="${ac}" font-weight="bold">${world.weatherType}</tspan></tspan>
    <tspan dx="22" fill="${tx}" opacity="0.5">|</tspan>
    <tspan dx="22">🔥 <tspan fill="${ac}" font-weight="bold">${world.streak}d</tspan></tspan>
    <tspan dx="22" fill="${tx}" opacity="0.5">|</tspan>
    <tspan dx="22">🏗️ <tspan fill="${ac}" font-weight="bold">${world.totalContributions}</tspan></tspan>
  </text>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- TECH STACK panel                                           -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  ${panel(18, 630, W - 36, 120, '◈ TECH STACK')}
  ${badges}

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- ACTIVE QUESTS panel                                        -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  ${panel(18, 848, W - 36, 130, '◈ ACTIVE QUESTS')}
  ${questItems}

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- STATS HUD                                                  -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  ${statCards}

  <!-- Footer bar -->
  <rect x="0" y="${H - 22}" width="${W}" height="22" fill="rgba(0,0,0,0.5)"/>
  <text x="${W / 2}" y="${H - 8}" font-family="${mono}" font-size="9.5"
    fill="${tx}" text-anchor="middle" opacity="0.35" letter-spacing="1">
    ✦  Generated by GitWorld Engine  ·  github.com/Dasmat13/git-world-action  ·  Updates daily  ✦
  </text>

  <!-- ═══ ANIMATIONS ════════════════════════════════════════════ -->
  <style>
    .star { animation: twinkle 3s ease-in-out infinite alternate; }
    @keyframes twinkle { 0%{opacity:.08} 100%{opacity:1} }

    .heroName {
      animation: namePulse 5s ease-in-out infinite alternate;
    }
    @keyframes namePulse {
      0%   { opacity: 0.9; }
      100% { opacity: 1;   }
    }

    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .shoot {
      animation: shoot 8s linear infinite;
      opacity: 0;
    }
    @keyframes shoot {
      0%   { opacity: 0;   stroke-dashoffset: 80; }
      5%   { opacity: 0.8; }
      15%  { opacity: 0;   stroke-dashoffset: 0;  }
      100% { opacity: 0; }
    }
    line.shoot { stroke-dasharray: 60; }

    .ray { animation: rayPulse 3s ease-in-out infinite alternate; transform-origin: center; }
    @keyframes rayPulse { 0%{opacity:.3} 100%{opacity:.7} }
  </style>
</svg>`;
}
