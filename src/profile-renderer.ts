import { WorldData } from './world';

const W = 900, H = 1080;

export function renderProfileCard(world: WorldData): string {
  const t   = world.biomeTheme;
  const username = world.username;
  
  // Theme colors for Synthwave / Cyberpunk aesthetic
  const neonPink   = '#ff007f';
  const neonCyan   = '#00f0ff';
  const neonPurple = '#9d4edd';
  const darkBg     = '#0b0518';
  const termBg     = 'rgba(12, 6, 24, 0.88)';
  const termBorder = 'rgba(255, 0, 127, 0.4)';
  const textCyan   = '#38bdf8';
  const textPink   = '#f43f5e';
  const textWhite  = '#e2e8f0';
  const textMuted  = '#64748b';

  // Seeded random stars
  const seed = username.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  const stars = Array.from({length: 60}, (_,i) => {
    const x  = ((seed * (i + 1) * 997) % W).toFixed(1);
    const y  = ((seed * (i + 1) * 1009) % 250).toFixed(1);
    const r  = i % 5 === 0 ? 1.5 : 0.8;
    const op = (0.2 + (i % 6) * 0.12).toFixed(2);
    const d  = ((i * 0.3) % 4).toFixed(1);
    return `<circle class="star" cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${op}" style="animation-delay:${d}s"/>`;
  }).join('');

  // Synthwave Grid Perspective Lines (Horizon at y=260, Ground from y=260 to y=350)
  const gridLines = [];
  // Perspective lines radiating from center horizon
  for (let i = -10; i <= 10; i++) {
    const startX = 450 + i * 35;
    const endX   = 450 + i * 110;
    gridLines.push(`<line x1="${startX}" y1="260" x2="${endX}" y2="350" stroke="${neonPink}" stroke-width="1.2" opacity="0.35" />`);
  }
  // Horizontal lines with exponential spacing
  for (let i = 0; i <= 6; i++) {
    const y = 260 + Math.pow(i / 6, 1.8) * 90;
    gridLines.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${neonPink}" stroke-width="1.2" opacity="${(0.1 + (i / 6) * 0.45).toFixed(2)}" />`);
  }
  const gridSVG = gridLines.join('\n  ');

  // Synthwave neon wireframe mountains from contribution columns
  // Mapped to 52 columns.
  const mountains = world.columns.slice(0, 52).map((col, i) => {
    if (col.tileType === 'grass') return '';
    const cw = W / 52;
    const x = i * cw + cw / 2;
    const bh = col.height * 0.55; // peak height
    const by = 260 - bh;          // horizon is 260
    const w = 40 + (col.maxCount * 3); // base width
    // Draw wireframe neon triangle
    return `
    <polygon points="${(x - w).toFixed(1)},260 ${x.toFixed(1)},${by.toFixed(1)} ${(x + w).toFixed(1)},260"
      fill="url(#mntGrad)" stroke="${neonCyan}" stroke-width="1.5" opacity="0.4" />
    <line x1="${x.toFixed(1)}" y1="${by.toFixed(1)}" x2="${x.toFixed(1)}" y2="260" stroke="${neonCyan}" stroke-width="1" opacity="0.25" stroke-dasharray="2 3" />`;
  }).join('');

  // ASCII Stat Bars helper
  const getASCIIBar = (val: number, max: number, length = 18) => {
    const percent = Math.min(val / max, 1);
    const filledCount = Math.round(percent * length);
    const emptyCount = length - filledCount;
    return `[${'█'.repeat(filledCount)}${'░'.repeat(emptyCount)}] ${Math.round(percent * 100)}%`;
  };

  const streakBar = getASCIIBar(world.streak, 30);
  const commitBar = getASCIIBar(world.totalContributions, 1000);

  // Tech chips outline array
  const skills = [
    'Kubernetes', 'Docker', 'TypeScript', 'Go',
    'Node.js', 'Terraform', 'Python', 'AWS',
    'Linux', 'Grafana', 'Prometheus', 'Backstage'
  ];
  const chips = skills.map((s, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const cx  = 60 + col * 200;
    const cy  = 724 + row * 40;
    return `
    <g>
      <rect x="${cx}" y="${cy}" width="168" height="28" rx="4" fill="none" stroke="${neonCyan}" stroke-width="1" opacity="0.6"/>
      <text x="${cx + 84}" y="${cy + 18}" font-family="monospace" font-size="11.5" fill="${neonCyan}" font-weight="bold" text-anchor="middle">${s}</text>
    </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border-radius:18px;overflow:hidden">
  <defs>
    <!-- Dark Space Synthwave Sky -->
    <linearGradient id="spaceSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#05010c"/>
      <stop offset="50%" stop-color="#140628"/>
      <stop offset="100%" stop-color="#2a0845"/>
    </linearGradient>
    
    <!-- Neon Synthwave Sun -->
    <linearGradient id="synthSun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f72585"/>
      <stop offset="40%" stop-color="#b5179e"/>
      <stop offset="70%" stop-color="#7209b7"/>
      <stop offset="100%" stop-color="#3f0764"/>
    </linearGradient>

    <!-- Mountain wireframe glow gradient -->
    <linearGradient id="mntGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0, 240, 255, 0.15)"/>
      <stop offset="100%" stop-color="rgba(12, 6, 24, 0)"/>
    </linearGradient>

    <!-- Retro Sun Horizontal Lines Mask -->
    <mask id="sunMask">
      <rect width="900" height="400" fill="#fff" />
      <g fill="#000">
        <rect x="0" y="160" width="900" height="3" />
        <rect x="0" y="174" width="900" height="4" />
        <rect x="0" y="190" width="900" height="6" />
        <rect x="0" y="208" width="900" height="8" />
        <rect x="0" y="228" width="900" height="11" />
        <rect x="0" y="250" width="900" height="15" />
      </g>
    </mask>

    <linearGradient id="termBorderGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${neonPink}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${neonPurple}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${neonCyan}" stop-opacity="0.8"/>
    </linearGradient>

    <filter id="neonGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="sunGlow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="rgba(0, 0, 0, 0.12)" />
    </pattern>
  </defs>

  <!-- ════ BACKGROUND & RETRO SUN ════ -->
  <rect width="${W}" height="${H}" fill="url(#spaceSky)" />
  ${stars}

  <!-- Sun sitting on the horizon -->
  <circle cx="450" cy="170" r="100" fill="url(#synthSun)" filter="url(#sunGlow)" mask="url(#sunMask)" />
  <line x1="0" y1="260" x2="${W}" y2="260" stroke="${neonPink}" stroke-width="2" filter="url(#neonGlow)" />

  <!-- Neon wireframe mountains -->
  ${mountains}

  <!-- perspective grid floor -->
  ${gridSVG}
  <rect y="260" width="${W}" height="90" fill="url(#mntGrad)" opacity="0.4" />

  <!-- Scanlines retro CRT effect over entire backdrop -->
  <rect width="${W}" height="350" fill="url(#scanlines)" opacity="0.6" />

  <!-- ════ macOS TERMINAL WINDOW ════ -->
  <g transform="translate(30, 370)">
    <!-- Terminal Background Box -->
    <rect width="840" height="660" rx="12" fill="${termBg}" stroke="url(#termBorderGrad)" stroke-width="2" filter="url(#neonGlow)"/>
    
    <!-- Terminal Header / Title Bar -->
    <path d="M 0,12 A 12,12 0 0 1 12,0 L 828,0 A 12,12 0 0 1 840,12 L 840,36 L 0,36 Z" fill="rgba(20, 12, 38, 0.95)" />
    
    <!-- Window Controls (traffic lights) -->
    <circle cx="20" cy="18" r="6" fill="#ff5f56" />
    <circle cx="38" cy="18" r="6" fill="#ffbd2e" />
    <circle cx="56" cy="18" r="6" fill="#27c93f" />

    <text x="420" y="22" font-family="monospace" font-size="12" fill="${neonPurple}" font-weight="bold" text-anchor="middle">dasmat@gitworld:~ (zsh)</text>

    <!-- Shell Session Typing Out -->
    <text x="25" y="65" font-family="monospace" font-size="14" fill="${textWhite}">
      <tspan fill="${neonPink}">dasmat@gitworld</tspan> <tspan fill="${textMuted}">~ %</tspan> gitworld --profile
    </text>
    <rect class="cursor" x="350" y="52" width="8" height="15" fill="${neonCyan}" />

    <!-- ──────────────────────────────────────── -->
    <!-- LEFT PANEL: Profile/Neofetch Details -->
    <!-- ──────────────────────────────────────── -->
    <g transform="translate(25, 100)">
      <text font-family="monospace" font-size="13" fill="${textWhite}">
        <tspan x="0" y="0" fill="${textPink}" font-weight="bold">SYSTEM INFO</tspan>
        <tspan x="0" y="16" fill="${textMuted}">───────────</tspan>
        <tspan x="0" y="38" fill="${textCyan}">User:</tspan>       dasmat (DevOps Explorer)
        <tspan x="0" y="60" fill="${textCyan}">Host:</tspan>       github.com/${username}
        <tspan x="0" y="82" fill="${textCyan}">Kernel:</tspan>     Kubernetes &amp; Cloud-Native
        <tspan x="0" y="104" fill="${textCyan}">Uptime:</tspan>     ${world.totalContributions} Contributions
        <tspan x="0" y="126" fill="${textCyan}">Location:</tspan>   ${world.username === 'Dasmat13' ? 'Kolkata, India' : 'Auto-detected'}
        <tspan x="0" y="148" fill="${textCyan}">Biome:</tspan>      ${t.label}
        <tspan x="0" y="170" fill="${textCyan}">Weather:</tspan>    ${world.weatherType.toUpperCase()} (live)
      </text>
    </g>

    <!-- ──────────────────────────────────────── -->
    <!-- RIGHT PANEL: CLI Stats HUD -->
    <!-- ──────────────────────────────────────── -->
    <g transform="translate(430, 100)">
      <text font-family="monospace" font-size="13" fill="${textWhite}">
        <tspan x="0" y="0" fill="${textPink}" font-weight="bold">SYSTEM RESOURCE BARS</tspan>
        <tspan x="0" y="16" fill="${textMuted}">────────────────────</tspan>
        
        <tspan x="0" y="42" fill="${textCyan}">STREAK   </tspan> <tspan fill="${neonCyan}">${streakBar}</tspan> <tspan fill="${textMuted}">[${world.streak}/30 days]</tspan>
        <tspan x="0" y="72" fill="${textCyan}">COMMITS  </tspan> <tspan fill="${neonCyan}">${commitBar}</tspan> <tspan fill="${textMuted}">[${world.totalContributions}/1000]</tspan>
        
        <tspan x="0" y="120" fill="${textPink}" font-weight="bold">ENVIRONMENT STATUS</tspan>
        <tspan x="0" y="136" fill="${textMuted}">──────────────────</tspan>
        <tspan x="0" y="162" fill="${textCyan}">Atmosphere:</tspan> ${world.timeOfDay.toUpperCase()} / WMO:${world.weatherType.toUpperCase()}
      </text>
    </g>

    <!-- ──────────────────────────────────────── -->
    <!-- MIDDLE SECTION: Tech StackChips Outline -->
    <!-- ──────────────────────────────────────── -->
    <g transform="translate(0, 0)">
      <!-- Label -->
      <text x="25" y="315" font-family="monospace" font-size="13" fill="${textPink}" font-weight="bold">CONFIGURED STACK MODULES</text>
      <line x1="25" y1="324" x2="815" y2="324" stroke="${textMuted}" stroke-width="1" />
      
      <!-- Tech stack chips -->
      ${chips}
    </g>

    <!-- ──────────────────────────────────────── -->
    <!-- BOTTOM SECTION: Quest Log Status -->
    <!-- ──────────────────────────────────────── -->
    <g transform="translate(25, 452)">
      <text font-family="monospace" font-size="13" fill="${textPink}" font-weight="bold">ACTIVE PIPELINE JOBS (QUEST LOG)</text>
      <line x1="0" y1="9" x2="790" y2="9" stroke="${textMuted}" stroke-width="1" />

      <text font-family="monospace" font-size="12" fill="${textWhite}">
        <tspan x="0" y="32" fill="${neonCyan}">●</tspan><tspan fill="${textWhite}">  lws-topology-scheduling ...... [</tspan><tspan fill="${neonCyan}"> RUNNING </tspan><tspan fill="${textWhite}">]</tspan>
        <tspan x="0" y="52" fill="${neonCyan}">●</tspan><tspan fill="${textWhite}">  KEP-893-composite-pod ........ [</tspan><tspan fill="${neonCyan}"> RUNNING </tspan><tspan fill="${textWhite}">]</tspan>
        <tspan x="0" y="72" fill="${neonPink}">●</tspan><tspan fill="${textWhite}">  gitworld-engine-core ......... [</tspan><tspan fill="${neonPink}"> SUCCESS </tspan><tspan fill="${textWhite}">]</tspan>
        <tspan x="0" y="92" fill="${neonPink}">●</tspan><tspan fill="${textWhite}">  realtime-weather-lookup ...... [</tspan><tspan fill="${neonPink}"> SUCCESS </tspan><tspan fill="${textWhite}">]</tspan>
        <tspan x="0" y="112" fill="${textMuted}">●</tspan><tspan fill="${textMuted}">  node-core-contributions ...... [ PENDING ]</tspan>
        <tspan x="0" y="132" fill="${textMuted}">●</tspan><tspan fill="${textMuted}">  backstage-plugin-ecosystem ... [ PENDING ]</tspan>
      </text>
    </g>

    <!-- tmux Status Bar at window bottom -->
    <rect x="0" y="626" width="840" height="34" fill="rgba(20, 12, 38, 0.95)" />
    <line x1="0" y1="626" x2="840" y2="626" stroke="${termBorder}" stroke-width="1" />
    <text x="15" y="647" font-family="monospace" font-size="11" fill="${neonCyan}">[0] 1:zsh* 2:weather(live) | ${world.username === 'Dasmat13' ? 'Kolkata, IN' : 'Location'}</text>
    <text x="825" y="647" font-family="monospace" font-size="11" fill="${neonPink}" text-anchor="end">SYS_TEMP: STABLE | 2026-07-13</text>
  </g>

  <!-- CRT scanlines over terminal -->
  <rect x="30" y="406" width="840" height="624" fill="url(#scanlines)" opacity="0.3" pointer-events="none" />

  <style>
    .star { animation: twinkle 3.s ease-in-out infinite alternate; }
    @keyframes twinkle { 0%{opacity:.1} 100%{opacity:1} }
    
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  </style>
</svg>`;
}
