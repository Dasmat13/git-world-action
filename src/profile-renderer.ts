import { WorldData } from './world';

const W = 960, H = 1440;

export function renderProfileCard(world: WorldData): string {
  const t = world.biomeTheme;
  const username = world.username;

  // Authentic Spiti Valley Color Palette (Soft & Cinematic)
  const themePalettes: Record<string, {
    sky: string[];
    sunColor: string;
    mountainFill1: string; // Shadow Purple / Slate
    mountainFill2: string; // Mountain Brown / Slate
    hill1: string; // Dust Beige
    hill2: string;
    hill3: string;
    waterColor: string; // Glacial River Blue
  }> = {
    night: {
      sky: ['#060814', '#0d1127', '#1c2242'],
      sunColor: '#ffffff', // Moon
      mountainFill1: '#1b1429',
      mountainFill2: '#2c223a',
      hill1: '#211a18',
      hill2: '#16100d',
      hill3: '#0c0806',
      waterColor: '#1d4ed8'
    },
    dawn: {
      sky: ['#f472b6', '#fb923c', '#fef08a'],
      sunColor: '#fbbf24',
      mountainFill1: '#584670',
      mountainFill2: '#6e5741',
      hill1: '#bfa780',
      hill2: '#a8916b',
      hill3: '#8c7653',
      waterColor: '#38bdf8'
    },
    day: {
      sky: ['#3b82f6', '#60a5fa', '#93c5fd'],
      sunColor: '#f97316',
      mountainFill1: '#5D6670', // Slate Grey
      mountainFill2: '#7A624A', // Mountain Brown
      hill1: '#C7B08A', // Cold Desert Beige
      hill2: '#b8a27c',
      hill3: '#9e8863',
      waterColor: '#4EC7E8' // Glacial River Blue
    },
    dusk: {
      sky: ['#881337', '#be123c', '#fb7185'],
      sunColor: '#fbbf24',
      mountainFill1: '#431962',
      mountainFill2: '#532470',
      hill1: '#78430c',
      hill2: '#63360f',
      hill3: '#3b1c05',
      waterColor: '#ec4899'
    }
  };
  
  const theme = themePalettes[world.timeOfDay] || themePalettes.day;

  // Cyclic transitions looping every 90 seconds (Day -> Dusk -> Night -> Dawn -> Day)
  const states = ['day', 'dusk', 'night', 'dawn'];
  const activeIdx = states.indexOf(world.timeOfDay);
  const orderedStates: string[] = [];
  for (let i = 0; i < 4; i++) {
    orderedStates.push(states[(activeIdx + i) % 4]);
  }
  orderedStates.push(orderedStates[0]);

  const skyTopVals = orderedStates.map(s => themePalettes[s].sky[0]).join(';');
  const skyBottomVals = orderedStates.map(s => themePalettes[s].sky[themePalettes[s].sky.length - 1]).join(';');
  const sunVals = orderedStates.map(s => themePalettes[s].sunColor).join(';');
  const m1Vals = orderedStates.map(s => themePalettes[s].mountainFill1).join(';');
  const m2Vals = orderedStates.map(s => themePalettes[s].mountainFill2).join(';');
  const waterVals = orderedStates.map(s => themePalettes[s].waterColor).join(';');
  const h1Vals = orderedStates.map(s => themePalettes[s].hill1).join(';');
  const h2Vals = orderedStates.map(s => themePalettes[s].hill2).join(';');
  const h3Vals = orderedStates.map(s => themePalettes[s].hill3).join(';');

  // Soft Twinkling Stars
  const stars = [
    { cx: 80, cy: 90, r: 1.8, delay: '0s' },
    { cx: 160, cy: 120, r: 1.2, delay: '1.2s' },
    { cx: 210, cy: 70, r: 2.0, delay: '0.5s' },
    { cx: 780, cy: 110, r: 1.5, delay: '2s' },
    { cx: 840, cy: 60, r: 2.2, delay: '1.5s' }
  ].map(s => `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="#ffffff" class="twinkle" style="animation-delay: ${s.delay};" />`).join('');

  // 6 Mountain Depth Layers (Spiti Cold Desert) - Outlines removed for premium look
  const mountains = `
    <!-- Layer 1 (Distant back peak left) -->
    <polygon points="260,180 50,344 470,344" fill="${theme.mountainFill1}">
      <animate attributeName="fill" values="${m1Vals}" dur="90s" repeatCount="indefinite" />
    </polygon>
    <!-- Layer 2 (Distant back peak right) -->
    <polygon points="700,190 480,344 920,344" fill="${theme.mountainFill1}">
      <animate attributeName="fill" values="${m1Vals}" dur="90s" repeatCount="indefinite" />
    </polygon>
    <!-- Layer 3 (Highest peak center-left with Snow Cap) -->
    <g>
      <polygon points="380,120 120,344 380,344" fill="${theme.mountainFill2}">
        <animate attributeName="fill" values="${m2Vals}" dur="90s" repeatCount="indefinite" />
      </polygon>
      <polygon points="380,120 380,344 640,344" fill="${theme.mountainFill1}">
        <animate attributeName="fill" values="${m1Vals}" dur="90s" repeatCount="indefinite" />
      </polygon>
      <polygon points="380,120 330,180 380,180" fill="#ffffff" />
      <polygon points="380,120 380,180 430,180" fill="#f1f5f9" />
    </g>
    <!-- Layer 4 (Mid Peak Right supporting Key Monastery) -->
    <g>
      <polygon points="760,140 500,344 760,344" fill="${theme.mountainFill2}">
        <animate attributeName="fill" values="${m2Vals}" dur="90s" repeatCount="indefinite" />
      </polygon>
      <polygon points="760,140 760,344 1020,344" fill="${theme.mountainFill1}">
        <animate attributeName="fill" values="${m1Vals}" dur="90s" repeatCount="indefinite" />
      </polygon>
      <polygon points="760,140 720,190 760,190" fill="#ffffff" />
      <polygon points="760,140 760,190 800,190" fill="#f1f5f9" />
    </g>
  `;

  // Key Monastery (Clean vector art - fine modern outlines)
  const keyMonastery = `
    <g transform="translate(710, 190)">
      <!-- Main block -->
      <rect x="-8" y="12" width="85" height="50" rx="2" fill="#fafaf9" stroke="#e7e5e4" stroke-width="1" />
      <!-- Stacked Upper Blocks -->
      <rect x="10" y="-8" width="55" height="24" rx="2" fill="#f5f5f4" stroke="#e7e5e4" stroke-width="1" />
      <rect x="25" y="-24" width="30" height="18" rx="2" fill="#e7e5e4" stroke="#d6d3d1" stroke-width="0.8" />
      
      <!-- Flat Dark Red bands representing monastery parapets -->
      <rect x="-8" y="15" width="85" height="5" fill="#991b1b" />
      <rect x="10" y="-5" width="55" height="4" fill="#991b1b" />
      <rect x="25" y="-21" width="30" height="3" fill="#991b1b" />
      
      <!-- Gold Roof Spires -->
      <polygon points="40,-34 37,-24 43,-24" fill="#fbbf24" />
      <polygon points="18,-15 16,-8 20,-8" fill="#fbbf24" />
      <polygon points="62,-15 60,-8 64,-8" fill="#fbbf24" />
      
      <!-- Tiny windows -->
      <rect x="0" y="26" width="5" height="7" rx="0.5" fill="#292524" />
      <rect x="14" y="26" width="5" height="7" rx="0.5" fill="#292524" />
      <rect x="28" y="26" width="5" height="7" rx="0.5" fill="#292524" />
      <rect x="42" y="26" width="5" height="7" rx="0.5" fill="#292524" />
      <rect x="56" y="26" width="5" height="7" rx="0.5" fill="#292524" />
      <rect x="20" y="2" width="4" height="5" rx="0.5" fill="#292524" />
      <rect x="34" y="2" width="4" height="5" rx="0.5" fill="#292524" />
      <rect x="48" y="2" width="4" height="5" rx="0.5" fill="#292524" />
      
      <!-- Small prayer flags strung to the cliff -->
      <line x1="-30" y1="35" x2="-8" y2="25" stroke="#a8a29e" stroke-width="0.8" stroke-dasharray="2,2" />
      <polygon points="-24,32 -20,36 -20,30" fill="#3b82f6" />
      <polygon points="-17,29 -13,33 -13,27" fill="#ef4444" />
    </g>
  `;

  // Spiti River & Valley meadows (cold desert terrain) - no black borders
  const valleyMeadows = `
    <!-- Dry desert valley background -->
    <rect x="0" y="340" width="${W}" height="1100" fill="${theme.hill1}">
      <animate attributeName="fill" values="${h1Vals}" dur="90s" repeatCount="indefinite" />
    </rect>
    
    <!-- Spiti River (Glacial blue path winding diagonally) -->
    <path d="M 480,340 Q 300,550 720,850 T 150,1200 T 600,1440" fill="none" stroke="${theme.waterColor}" stroke-width="60" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="stroke" values="${waterVals}" dur="90s" repeatCount="indefinite" />
    </path>
    <path d="M 480,340 Q 300,550 720,850 T 150,1200 T 600,1440" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="15,20" stroke-linecap="round" />
    
    <!-- Cold Desert Middle foothill -->
    <path d="M -20,680 Q 400,640 980,720 L 980,1450 L -20,1450 Z" fill="${theme.hill2}">
      <animate attributeName="fill" values="${h2Vals}" dur="90s" repeatCount="indefinite" />
    </path>
    
    <!-- Cold Desert Foreground foothill -->
    <path d="M -20,980 Q 550,1030 980,950 L 980,1450 L -20,1450 Z" fill="${theme.hill3}">
      <animate attributeName="fill" values="${h3Vals}" dur="90s" repeatCount="indefinite" />
    </path>
  `;

  // Scattered Tall Poplar Trees (swaying animation)
  const poplars = [
    { x: 100, y: 390, s: 0.75, delay: 'pine' },
    { x: 140, y: 400, s: 0.85, delay: 'pine-delay' },
    { x: 800, y: 380, s: 0.75, delay: 'pine' },
    { x: 860, y: 390, s: 0.9, delay: 'pine-delay' },
    { x: 60,  y: 720, s: 1.0, delay: 'pine-delay' },
    { x: 910, y: 750, s: 1.15, delay: 'pine' },
    { x: 80,  y: 1020, s: 1.25, delay: 'pine' },
    { x: 890, y: 1000, s: 1.3, delay: 'pine-delay' }
  ].map(t => `
    <g transform="translate(${t.x}, ${t.y}) scale(${t.s})" class="${t.delay}">
      <!-- Trunk -->
      <rect x="-1" y="0" width="2" height="24" fill="#5c4033" />
      <!-- Slender Poplar Crown -->
      <path d="M 0,-56 C -11,-36 -9,-10 0,0 C 9,-10 11,-36 0,-56 Z" fill="#88A94D" fill-opacity="0.9" />
    </g>
  `).join('');

  // Buddhist Prayer Flags across cliffs in the background
  const prayerFlagsStrands = `
    <g class="flags-wave" transform="translate(80, 210)">
      <path d="M 0,20 Q 100,45 200,30" fill="none" stroke="#78716c" stroke-width="1.2" opacity="0.75" />
      <!-- Small flag triangles -->
      <polygon points="20,24 28,34 32,26" fill="#3b82f6" />
      <polygon points="50,29 58,39 62,31" fill="#ffffff" />
      <polygon points="80,33 88,43 92,35" fill="#ef4444" />
      <polygon points="110,34 118,44 122,36" fill="#10b981" />
      <polygon points="140,32 148,42 152,34" fill="#fbbf24" />
      <polygon points="170,29 178,39 182,31" fill="#3b82f6" />
    </g>
  `;

  // Grass Tufts (Desert vegetation C7B08A / 88A94D)
  const grassTufts = [
    { x: 50, y: 440 }, { x: 280, y: 420 }, { x: 740, y: 460 },
    { x: 120, y: 740 }, { x: 820, y: 770 },
    { x: 180, y: 1040 }, { x: 790, y: 1020 }
  ].map(g => `
    <g transform="translate(${g.x}, ${g.y})">
      <path d="M0,0 Q-4,-12 -8,-15 Q-2,-12 0,0 Q3,-14 6,-18 Q2,-10 0,0 Q8,-10 12,-12 Q5,-8 0,0" fill="#88A94D" fill-opacity="0.8" />
    </g>
  `).join('');

  // Weather layers (Snow, Rain, or Wind Dust particles)
  let particles = '';
  if (world.weatherType === 'snow') {
    particles = Array.from({ length: 16 }).map((_, i) => {
      const px = 40 + (i * 58) + (Math.sin(i) * 20);
      const delay = (i * 0.4).toFixed(1);
      const dur = (5 + (i % 3) * 1.5).toFixed(1);
      return `<circle class="snow" cx="${px}" cy="-15" r="4.0" fill="#ffffff" fill-opacity="0.9" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('');
  } else if (world.weatherType === 'rain') {
    particles = Array.from({ length: 18 }).map((_, i) => {
      const px = 30 + (i * 54);
      const delay = (i * 0.2).toFixed(1);
      const dur = (1.2 + (i % 3) * 0.4).toFixed(1);
      return `<line class="raindrop" x1="${px}" y1="-25" x2="${px - 12}" y2="10" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" opacity="0.6" />`;
    }).join('');
  } else {
    // cold desert wind dust / sand particles
    particles = Array.from({ length: 18 }).map((_, i) => {
      const px = 30 + (i * 54);
      const delay = (i * 0.3).toFixed(1);
      const dur = (2.2 + (i % 3) * 0.8).toFixed(1);
      return `<g class="dust" style="animation-delay: ${delay}s; animation-duration: ${dur}s;"><circle cx="${px}" cy="-10" r="2.0" fill="#C7B08A" opacity="0.6" /></g>`;
    }).join('');
  }

  // Shoreline Text Marquee - glassmorphic, outline-free
  const separators = `
    <g class="marquee" transform="translate(0, 440)">
      <rect x="-10" y="0" width="${W + 20}" height="32" fill="#ffffff" fill-opacity="0.25" style="backdrop-filter: blur(8px);" />
      <text font-family="'Space Grotesk', sans-serif" font-size="12.5" font-weight="800" fill="#0f172a" letter-spacing="1.5">
        🏔️ SPITI VALLEY · KEY MONASTERY OVERLOOK · COLD DESERT · GLACIAL STREAM · SPITI VALLEY · KEY MONASTERY OVERLOOK · COLD DESERT · GLACIAL STREAM
      </text>
    </g>
  `;

  // Apple-style Glassmorphic Panel (No Neobrutalist border, no solid shadows)
  const P = (y: number, h: number, title: string, badgeBg = '#4EC7E8') => {
    const rx = 28, x = 40, w = W - 80;
    const badgeW = title.length * 8.5 + 24;
    const badgeH = 28;
    return `
<g class="panel">
  <!-- Card Main Box with Apple-style Frosted Glassmorphism -->
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#ffffff" fill-opacity="0.28" style="backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.2" />
  
  <!-- Badge Main (Soft rounded pill) -->
  <rect x="${x + 31}" y="${y - 14}" width="${badgeW}" height="${badgeH}" rx="14" fill="${badgeBg}" fill-opacity="0.85" />
  <text x="${x + 31 + badgeW / 2}" y="${y + 4}" font-family="'Space Grotesk', sans-serif" font-size="11.5" fill="#ffffff" font-weight="900" text-anchor="middle" letter-spacing="1">${title}</text>
</g>`;
  };

  // Badges grid - Glassmorphic pills, no outlines
  const skills = [
    { n: 'Kubernetes', bg: '#22c55e' },
    { n: 'Docker',     bg: '#0ea5e9' },
    { n: 'TypeScript', bg: '#ec4899' },
    { n: 'Go',         bg: '#06b6d4' },
    { n: 'Node.js',    bg: '#8b5cf6' },
    { n: 'Terraform',  bg: '#eab308' },
    { n: 'Python',     bg: '#f43f5e' },
    { n: 'AWS',        bg: '#f97316' },
    { n: 'Linux',      bg: '#64748b' },
    { n: 'Grafana',    bg: '#ef4444' },
    { n: 'Prometheus', bg: '#f43f5e' },
    { n: 'Backstage',  bg: '#14b8a6' }
  ];
  
  const bxs = [70, 280, 490, 700];
  const BR = [836, 896, 956];
  const badges = skills.map((s, i) => {
    const bx = bxs[i % 4];
    const by = BR[Math.floor(i / 4)];
    return `
    <g>
      <!-- Pill base -->
      <rect x="${bx}" y="${by}" width="180" height="30" rx="15" fill="${s.bg}" fill-opacity="0.15" stroke="${s.bg}" stroke-opacity="0.3" stroke-width="1.2" />
      <text x="${bx + 90}" y="${by + 19}" font-family="'Space Grotesk', sans-serif" font-size="11.5" fill="#0f172a" font-weight="900" text-anchor="middle">${s.n.toUpperCase()}</text>
    </g>
    `;
  }).join('');

  // Active Quests (Soft colored bullets)
  const quests = [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Journey 🌿', bg: '#22c55e' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Journey 🌿', bg: '#22c55e' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🏆',      bg: '#eab308' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🏆',      bg: '#eab308' },
    { t: 'Upstream Node.js core exploration',         s: 'Wandering 🏕️',      bg: '#0ea5e9' }
  ];
  const qItems = quests.map((q, i) => {
    const qy = 1084 + i * 38;
    return `
    <g transform="translate(60, ${qy})">
      <!-- Bullet Circle -->
      <circle cx="6" cy="0" r="4.5" fill="${q.bg}" />
      <text x="24" y="5" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
        ${q.t}
      </text>
      
      <!-- Status pill badge -->
      <g transform="translate(680, -11)">
        <rect x="0" y="0" width="130" height="22" rx="11" fill="${q.bg}" fill-opacity="0.15" stroke="${q.bg}" stroke-opacity="0.3" stroke-width="1" />
        <text x="65" y="14" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#0f172a" font-weight="900" text-anchor="middle" letter-spacing="0.5">
          ${q.s.toUpperCase()}
        </text>
      </g>
    </g>
    `;
  }).join('');

  // Stats cards (Clean glass layout, no solid borders/shadows)
  const stats = [
    { icon: '📝', lbl: 'TRAVEL STREAK', val: `${world.streak} days`,    sub: 'committed in a row', bg: '#22c55e' },
    { icon: '🌱', lbl: 'SPROUTS GROWN', val: `${world.totalContributions}`, sub: 'total commits', bg: '#0ea5e9' },
    { icon: '🏡', lbl: 'HOME BIOME',    val: t.label.toUpperCase(),     sub: `Weather: ${world.weatherType.toUpperCase()}`, bg: '#eab308' }
  ];
  const cardW = 260, cardGap = 30, cardY = 1315, cardH = 82;
  const statCards = stats.map((s, i) => {
    const cx = 60 + i * (cardW + cardGap);
    return `
    <g>
      <!-- Glassmorphic stat card -->
      <rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="18" fill="#ffffff" fill-opacity="0.28" style="backdrop-filter: blur(10px);" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.2" />
      <text x="${cx + 16}" y="${cardY + 22}" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#334155" font-weight="900" letter-spacing="1">${s.icon}  ${s.lbl}</text>
      <text x="${cx + 16}" y="${cardY + 48}" font-family="'Space Grotesk', sans-serif" font-size="19" fill="#0f172a" font-weight="900">${s.val}</text>
      <text x="${cx + 16}" y="${cardY + 68}" font-family="'Inter', sans-serif" font-size="10" fill="#334155" font-weight="700" opacity="0.8">${s.sub}</text>
    </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border:1.2px solid rgba(255,255,255,0.2);border-radius:18px;overflow:hidden">
  <defs>
    <!-- 90s Sky cyclic gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.sky[0]}">
        <animate attributeName="stop-color" values="${skyTopVals}" dur="90s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="${theme.sky[theme.sky.length - 1]}">
        <animate attributeName="stop-color" values="${skyBottomVals}" dur="90s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
  </defs>

  <!-- ═══ FULL-HEIGHT BACKDROP LANDSCAPE ═══ -->
  <rect width="${W}" height="500" fill="url(#skyGrad)"/>
  ${valleyMeadows}

  <!-- Sun / Moon with dynamic fill color transitions & pulse -->
  <circle cx="480" cy="180" r="75" fill="${theme.sunColor}" class="sun">
    <animate attributeName="fill" values="${sunVals}" dur="90s" repeatCount="indefinite" />
  </circle>
  
  <!-- Twinkling Stars -->
  ${stars}

  <!-- ═══ HIMALAYAN MOUNTAINS ═══ -->
  ${mountains}

  <!-- ═══ KEY MONASTERY ═══ -->
  ${keyMonastery}

  <!-- ═══ FOREGROUND FOREST & VEGETATION ═══ -->
  ${poplars}
  ${grassTufts}

  <!-- ═══ BUDDHIST PRAYER FLAGS ═══ -->
  ${prayerFlagsStrands}

  <!-- ═══ WEATHER PARTICLES ═══ -->
  ${particles}

  <!-- ═══ SHORELINE TEXT MARQUEE ═══ -->
  ${separators}

  <!-- ═══ ANIMATED BIRDS & DRIFTING CLOUDS ═══ -->
  <g class="floating-cloud">
    <rect x="0" y="45" width="130" height="22" rx="11" fill="#ffffff" fill-opacity="0.9" />
  </g>
  <g class="flying-bird">
    <path d="M 0,0 L 6,-5 L 12,0 L 18,-5 L 24,0" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />
  </g>
  <g class="flying-bird-delay">
    <path d="M 0,0 L 5,-4 L 10,0 L 15,-4 L 20,0" fill="none" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round" />
  </g>

  <!-- ═══ HERO HEADER (Apple Glass style) ═══ -->
  <g transform="translate(180, 320)">
    <!-- Glassmorphic Main Box -->
    <rect x="0" y="0" width="600" height="120" rx="28" fill="#ffffff" fill-opacity="0.28" style="backdrop-filter: blur(14px);" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.2"/>
    
    <!-- Left accent pill stripe -->
    <rect x="4" y="4" width="8" height="112" rx="4" fill="#4EC7E8" fill-opacity="0.8" />

    <text x="310" y="55" font-family="'Space Grotesk', sans-serif" font-size="34" fill="#0f172a" text-anchor="middle" font-weight="900">HI, I'M DASMAT ⚡</text>
    <text x="310" y="88" font-family="'Inter', sans-serif" font-size="13" fill="#334155" font-weight="700" text-anchor="middle" letter-spacing="0.5">
      DEVOPS EXPLORER  ·  FULL-STACK DEVELOPER  ·  OSS CONTRIBUTOR
    </text>
  </g>

  <!-- ═══ ABOUT ME PANEL ═══ -->
  ${P(480, 170, '⚡  ABOUT THE TRAVELER', '#4EC7E8')}
  <text x="70" y="530" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#1e293b">CORE INTERESTS:</tspan> Infrastructure automation, Cloud-Native scaling, Self-healing architectures
  </text>
  <text x="70" y="575" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#1e293b">CONTRIBUTING TO:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="70" y="620" font-family="'Inter', sans-serif" font-size="13" fill="#0f172a" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#1e293b">CONTACT:</tspan> dasmath06@gmail.com   ·   ⚡  Experiments daily with automated recovery pipelines
  </text>

  <!-- ═══ WORLD STATE BAR ═══ -->
  ${P(690, 70, '🏡  CURRENT ENVIRONMENT LOG', '#4EC7E8')}
  <text x="${W/2}" y="732" font-family="'Space Grotesk', sans-serif" font-size="13.5" fill="#0f172a" text-anchor="middle" font-weight="900">
    🌳 BIOME: <tspan fill="#0f172a" font-weight="900">${t.label.toUpperCase()}</tspan>
    <tspan dx="15" fill="#0f172a" opacity="0.25">|</tspan>
    <tspan dx="15">🕰️ TIME: <tspan fill="#0ea5e9">${world.timeOfDay.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#0f172a" opacity="0.25">|</tspan>
    <tspan dx="15">🌦️ WEATHER: <tspan fill="#8b5cf6">${world.weatherType.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#0f172a" opacity="0.25">|</tspan>
    <tspan dx="15">🎒 STREAK: <tspan fill="#d97706">${world.streak} DAYS</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK PANEL ═══ -->
  ${P(800, 190, '🎒  PACKED GEAR (TECH STACK)', '#4EC7E8')}
  ${badges}

  <!-- ═══ ACTIVE QUESTS PANEL ═══ -->
  ${P(1030, 240, '🗺️  CURRENT JOURNEY (ACTIVE QUESTS)', '#4EC7E8')}
  ${qItems}

  <!-- ═══ STATS HUD ═══ -->
  ${statCards}

  <!-- Soft bottom footer -->
  <text x="${W/2}" y="${H - 12}" font-family="'Space Grotesk', sans-serif" font-size="10.5" fill="#334155" font-weight="800" text-anchor="middle" letter-spacing="1">
    ⚡  HARVESTED DAILY BY GITWORLD ENGINE  ·  GITHUB.COM/DASMAT13/GIT-WORLD-ACTION  ⚡
  </text>

  <style>
    .sun {
      animation: pulse 4s ease-in-out infinite alternate;
      transform-origin: 480px 180px;
    }
    @keyframes pulse {
      from { transform: scale(0.96); }
      to   { transform: scale(1.04); }
    }
    .pine {
      animation: sway 3s ease-in-out infinite alternate;
      transform-origin: bottom center;
    }
    .pine-delay {
      animation: sway 4s ease-in-out infinite alternate;
      animation-delay: 1.5s;
      transform-origin: bottom center;
    }
    @keyframes sway {
      from { transform: rotate(1.2deg); }
      to   { transform: rotate(-1.2deg); }
    }
    .flags-wave {
      animation: flagSway 4s ease-in-out infinite alternate;
      transform-origin: left top;
    }
    @keyframes flagSway {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(-2px) rotate(0.8deg); }
    }
    .twinkle {
      animation: twinkleAnim 2.5s ease-in-out infinite alternate;
    }
    @keyframes twinkleAnim {
      0% { opacity: 0.15; }
      100% { opacity: 0.95; }
    }
    .marquee text {
      offset-path: path("M 960 21 H -960");
      offset-distance: 0%;
      animation: slideText 18s linear infinite;
    }
    @keyframes slideText {
      to { offset-distance: 100%; }
    }
    .flying-bird {
      animation: birdFly 16s linear infinite;
    }
    .flying-bird-delay {
      animation: birdFly 22s linear infinite;
      animation-delay: 5s;
    }
    @keyframes birdFly {
      0% { transform: translate(-50px, 90px); }
      100% { transform: translate(1010px, 40px); }
    }
    .floating-cloud {
      animation: cloudFloat 28s linear infinite;
    }
    @keyframes cloudFloat {
      0% { transform: translateX(-150px); }
      100% { transform: translateX(1010px); }
    }
    
    /* Weather particle styles */
    .snow {
      animation: fallSnow 8s linear infinite;
    }
    .raindrop {
      animation: fallRain 2s linear infinite;
    }
    .dust {
      animation: fallDust 4s linear infinite;
    }
    @keyframes fallSnow {
      0%   { transform: translateY(0)  rotate(0deg); opacity:1; }
      100% { transform: translateY(1460px) rotate(360deg); opacity:0; }
    }
    @keyframes fallRain {
      0%   { transform: translateY(0) scaleY(1); opacity:0.8; }
      100% { transform: translateY(1460px) scaleY(1.5); opacity:0; }
    }
    @keyframes fallDust {
      0%   { transform: translateY(0) translateX(0) scale(0.8); opacity:0; }
      10%  { opacity: 0.65; }
      90%  { opacity: 0.65; }
      100% { transform: translateY(1460px) translateX(-200px) scale(1.2); opacity:0; }
    }
  </style>
</svg>`;
}
