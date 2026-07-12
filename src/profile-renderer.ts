/**
 * Profile Card Renderer
 * Generates a full pixel-art profile SVG styled like the GitWorld game UI.
 * Panels: hero, about me, current world, tech stack, active quests, stats HUD.
 */

import { WorldData } from './world';

const W = 900;
const H = 840;

export function renderProfileCard(world: WorldData): string {
  const t = world.biomeTheme;
  const username = world.username;

  const skyColors: Record<string, [string, string]> = {
    night: ['#020510', '#0a0f1e'],
    dawn:  ['#1a0a2e', '#ff7043'],
    day:   [t.skyTop,  t.skyBottom],
    dusk:  ['#1a0533', '#c62828'],
  };
  const [skyTop, skyBot] = skyColors[world.timeOfDay];

  const panel  = 'url(#panelGrad)';
  const border = t.buildingAccent;
  const accent = t.buildingBase;
  const text   = t.starColor;
  const mono   = 'monospace';
  const seed   = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  // Stars
  const stars = Array.from({ length: 55 }, (_, i) => {
    const x = ((seed * (i + 1) * 997)  % W).toFixed(1);
    const y = ((seed * (i + 1) * 1009) % 290).toFixed(1);
    const r = i % 5 === 0 ? 1.5 : 0.8;
    const d = ((i * 0.3) % 4).toFixed(1);
    return `<circle class="star" cx="${x}" cy="${y}" r="${r}" fill="${text}" style="animation-delay:${d}s"/>`;
  }).join('\n  ');

  // Mini skyline
  const skyline = world.columns.slice(0, 52).map((col, i) => {
    if (col.tileType === 'grass') return '';
    const cw = W / 52;
    const x  = (i * cw).toFixed(1);
    const bh = col.height * 0.38;
    const by = (300 - bh).toFixed(1);
    return `<rect x="${x}" y="${by}" width="${(cw - 1).toFixed(1)}" height="${bh.toFixed(1)}" fill="${accent}" opacity="0.45" rx="1"/>`;
  }).join('');

  // Tech badges — 2 rows of 6
  const skills = [
    { label: 'Kubernetes', color: '#326CE5' }, { label: 'Docker',     color: '#2496ED' },
    { label: 'TypeScript', color: '#3178C6' }, { label: 'Go',         color: '#00ADD8' },
    { label: 'Node.js',    color: '#339933' }, { label: 'Terraform',  color: '#7B42BC' },
    { label: 'Python',     color: '#3776AB' }, { label: 'AWS',        color: '#FF9900' },
    { label: 'Linux',      color: '#d4a017' }, { label: 'Grafana',    color: '#F46800' },
    { label: 'Prometheus', color: '#E6522C' }, { label: 'Backstage',  color: '#36BAA2' },
  ];
  const BW = 126, BH = 26, BGAPX = 12, BGAPY = 10;
  const BSTARTX = 28, BSTARTY = 450;
  const badges = skills.map((s, i) => {
    const bx = BSTARTX + (i % 6) * (BW + BGAPX);
    const by = BSTARTY + Math.floor(i / 6) * (BH + BGAPY);
    return `
  <rect x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="4" fill="${s.color}" opacity="0.82"/>
  <text x="${bx + BW / 2}" y="${by + 17}" font-family="${mono}" font-size="11"
    fill="#fff" text-anchor="middle" font-weight="bold">${s.label}</text>`;
  }).join('');

  // Stats HUD — 4 items
  const stats = [
    { icon: '🔥', label: 'Streak',       val: `${world.streak}d` },
    { icon: '🏗️', label: 'Contributions', val: `${world.totalContributions}` },
    { icon: '🌍', label: 'Biome',         val: t.label },
    { icon: '🌦️', label: 'Weather',       val: world.weatherType },
  ];
  const statItems = stats.map((s, i) => {
    const sx = 22 + i * 215;
    return `
  <rect x="${sx}" y="748" width="205" height="58" rx="6" fill="${panel}" stroke="${border}" stroke-width="1"/>
  <text x="${sx + 12}" y="770" font-family="${mono}" font-size="10" fill="${text}" opacity="0.65">${s.icon}  ${s.label}</text>
  <text x="${sx + 12}" y="793" font-family="${mono}" font-size="15" fill="${accent}" font-weight="bold">${s.val}</text>`;
  }).join('');

  const isSun = world.timeOfDay === 'day' || world.timeOfDay === 'dawn';

  return `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
     style="border-radius:16px;overflow:hidden">
  <defs>
    <linearGradient id="pcSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${skyTop}"/>
      <stop offset="38%"  stop-color="${skyBot}"/>
      <stop offset="100%" stop-color="${t.groundColor}"/>
    </linearGradient>
    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(0,0,0,0.68)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.38)"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="tglow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background sky -->
  <rect width="${W}" height="${H}" fill="url(#pcSky)"/>

  <!-- Stars -->
  ${stars}

  <!-- Celestial body -->
  <circle r="18" fill="${isSun ? '#f5d060' : '#c8d0e0'}" filter="url(#glow)">
    <animateMotion dur="40s" repeatCount="indefinite"
      path="M -20,280 Q ${W / 2},-20 ${W + 20},280"/>
  </circle>

  <!-- Skyline strip -->
  ${skyline}
  <rect x="0" y="300" width="${W}" height="12" fill="${t.groundColor}" opacity="0.5"/>

  <!-- ══════════════════════════════════════════════════════ -->
  <!--  HERO                                                  -->
  <!-- ══════════════════════════════════════════════════════ -->
  <text x="${W / 2}" y="72" font-family="${mono}" font-size="10" fill="${text}"
    text-anchor="middle" opacity="0.55" letter-spacing="6">[ PLAYER ONE ]</text>

  <text class="heroName" x="${W / 2}" y="136" font-family="${mono}" font-size="42"
    fill="${accent}" text-anchor="middle" font-weight="bold"
    filter="url(#tglow)">Hi! I'm Dasmat 👋</text>

  <text x="${W / 2}" y="170" font-family="${mono}" font-size="13" fill="${text}"
    text-anchor="middle" opacity="0.85">DevOps &amp; Cloud-Native Explorer · Full-Stack Developer · Open Source Contributor</text>

  <rect class="cursor" x="${W / 2 + 190}" y="153" width="10" height="3" fill="${accent}"/>

  <!-- ══════════════════════════════════════════════════════ -->
  <!--  ABOUT ME panel                                        -->
  <!-- ══════════════════════════════════════════════════════ -->
  <rect x="18" y="190" width="${W - 36}" height="98" rx="8"
    fill="${panel}" stroke="${border}" stroke-width="1"/>
  <text x="34" y="212" font-family="${mono}" font-size="9"
    fill="${accent}" opacity="0.65" letter-spacing="4">◈ ABOUT ME</text>
  <text x="34" y="234" font-family="${mono}" font-size="12" fill="${text}">🚀  Core: DevOps automation · Cloud-Native architecture · Full-stack Web Development</text>
  <text x="34" y="255" font-family="${mono}" font-size="12" fill="${text}">🌱  Contributing to: Kubernetes SIGs · Node.js Core · Express.js · Backstage</text>
  <text x="34" y="276" font-family="${mono}" font-size="12" fill="${text}">📫  mey37056@gmail.com     ⚡  Loves container orchestration &amp; automated healing systems</text>

  <!-- ══════════════════════════════════════════════════════ -->
  <!--  CURRENT WORLD panel                                   -->
  <!-- ══════════════════════════════════════════════════════ -->
  <rect x="18" y="325" width="${W - 36}" height="58" rx="8"
    fill="${panel}" stroke="${border}" stroke-width="1"/>
  <text x="34" y="346" font-family="${mono}" font-size="9"
    fill="${accent}" opacity="0.65" letter-spacing="4">◈ CURRENT WORLD STATE</text>
  <text x="34" y="368" font-family="${mono}" font-size="13" fill="${text}">
    🌍 <tspan fill="${accent}" font-weight="bold">${t.label}</tspan>
    <tspan dx="24">🌙 </tspan><tspan fill="${accent}" font-weight="bold">${world.timeOfDay}</tspan>
    <tspan dx="24">🌦️ </tspan><tspan fill="${accent}" font-weight="bold">${world.weatherType}</tspan>
    <tspan dx="24">🔥 </tspan><tspan fill="${accent}" font-weight="bold">${world.streak}d streak</tspan>
    <tspan dx="24">🏗️ </tspan><tspan fill="${accent}" font-weight="bold">${world.totalContributions} commits</tspan>
  </text>

  <!-- ══════════════════════════════════════════════════════ -->
  <!--  TECH STACK panel                                      -->
  <!-- ══════════════════════════════════════════════════════ -->
  <rect x="18" y="398" width="${W - 36}" height="110" rx="8"
    fill="${panel}" stroke="${border}" stroke-width="1"/>
  <text x="34" y="420" font-family="${mono}" font-size="9"
    fill="${accent}" opacity="0.65" letter-spacing="4">◈ TECH STACK &amp; SKILLS</text>
  ${badges}

  <!-- ══════════════════════════════════════════════════════ -->
  <!--  ACTIVE QUESTS panel                                   -->
  <!-- ══════════════════════════════════════════════════════ -->
  <rect x="18" y="528" width="${W - 36}" height="202" rx="8"
    fill="${panel}" stroke="${border}" stroke-width="1"/>
  <text x="34" y="550" font-family="${mono}" font-size="9"
    fill="${accent}" opacity="0.65" letter-spacing="4">◈ ACTIVE QUESTS</text>
  <text x="34" y="575" font-family="${mono}" font-size="12" fill="${text}">▶  Topology-aware scheduling for LeaderWorkerSet (kubernetes-sigs/lws)
    <tspan fill="#7ee787">[ IN PROGRESS ]</tspan></text>
  <text x="34" y="600" font-family="${mono}" font-size="12" fill="${text}">▶  CompositePodGroup integration — KEP-893
    <tspan fill="#7ee787">[ IN PROGRESS ]</tspan></text>
  <text x="34" y="625" font-family="${mono}" font-size="12" fill="${text}">▶  GitWorld Engine — GitHub profile as a living pixel-art world
    <tspan fill="#ffd700">[ SHIPPED  ✓ ]</tspan></text>
  <text x="34" y="650" font-family="${mono}" font-size="12" fill="${text}">▶  Real-time weather auto-detection via Open-Meteo
    <tspan fill="#ffd700">[ SHIPPED  ✓ ]</tspan></text>
  <text x="34" y="675" font-family="${mono}" font-size="12" fill="${text}">▶  Node.js core contributions
    <tspan fill="#58a6ff">[ EXPLORING  ]</tspan></text>
  <text x="34" y="700" font-family="${mono}" font-size="12" fill="${text}">▶  Backstage plugin ecosystem
    <tspan fill="#58a6ff">[ EXPLORING  ]</tspan></text>

  <!-- ══════════════════════════════════════════════════════ -->
  <!--  STATS HUD                                             -->
  <!-- ══════════════════════════════════════════════════════ -->
  ${statItems}

  <!-- Footer -->
  <text x="${W / 2}" y="${H - 10}" font-family="${mono}" font-size="9"
    fill="${text}" text-anchor="middle" opacity="0.35">
    ✦ Generated by GitWorld Engine · github.com/Dasmat13/git-world-action · Updates daily ✦
  </text>

  <style>
    .star     { animation: twinkle 3s ease-in-out infinite alternate; }
    @keyframes twinkle { 0%{opacity:.12} 100%{opacity:1} }

    .heroName { animation: glow-pulse 4s ease-in-out infinite alternate; }
    @keyframes glow-pulse { 0%{opacity:.88} 100%{opacity:1} }

    .cursor   { animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  </style>
</svg>`;
}
