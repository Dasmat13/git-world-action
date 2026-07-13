import { WorldData } from './world';

const W = 960, H = 1440;

export function renderProfileCard(world: WorldData): string {
  const t = world.biomeTheme;
  const username = world.username;

  // Kashmir/Himachal theme palettes for dynamic transition loops
  const themePalettes: Record<string, {
    sky: string[];
    sunColor: string;
    mountainFill1: string;
    mountainFill2: string;
    hill1: string;
    hill2: string;
    hill3: string;
    waterColor: string;
  }> = {
    night: {
      sky: ['#090d16', '#0f172a', '#1e293b'],
      sunColor: '#f1f5f9', // Glowing Moon
      mountainFill1: '#12102e',
      mountainFill2: '#1e1b4b',
      hill1: '#0f172a',
      hill2: '#090d16',
      hill3: '#020617',
      waterColor: '#1d4ed8'
    },
    dawn: {
      sky: ['#f472b6', '#fb923c', '#fef08a'],
      sunColor: '#fbbf24',
      mountainFill1: '#581c87',
      mountainFill2: '#701a75',
      hill1: '#b45309',
      hill2: '#92400e',
      hill3: '#78350f',
      waterColor: '#ec4899'
    },
    day: {
      sky: ['#0ea5e9', '#38bdf8', '#7dd3fc'],
      sunColor: '#f97316',
      mountainFill1: '#1d4ed8',
      mountainFill2: '#3b82f6',
      hill1: '#22c55e', // Emerald hills
      hill2: '#16a34a',
      hill3: '#15803d',
      waterColor: '#06b6d4'
    },
    dusk: {
      sky: ['#be123c', '#e11d48', '#fda4af'],
      sunColor: '#fbbf24',
      mountainFill1: '#3b0764',
      mountainFill2: '#581c87',
      hill1: '#6b21a8',
      hill2: '#581c87',
      hill3: '#4a044e',
      waterColor: '#db2777'
    }
  };
  
  const theme = themePalettes[world.timeOfDay] || themePalettes.day;

  // Construct cyclic transition lists for `<animate>` tags based on current timeOfDay
  const states = ['day', 'dusk', 'night', 'dawn'];
  const activeIdx = states.indexOf(world.timeOfDay);
  const orderedStates: string[] = [];
  for (let i = 0; i < 4; i++) {
    orderedStates.push(states[(activeIdx + i) % 4]);
  }
  orderedStates.push(orderedStates[0]); // Complete loop

  const skyTopVals = orderedStates.map(s => themePalettes[s].sky[0]).join(';');
  const skyBottomVals = orderedStates.map(s => themePalettes[s].sky[themePalettes[s].sky.length - 1]).join(';');
  const sunVals = orderedStates.map(s => themePalettes[s].sunColor).join(';');
  const m1Vals = orderedStates.map(s => themePalettes[s].mountainFill1).join(';');
  const m2Vals = orderedStates.map(s => themePalettes[s].mountainFill2).join(';');
  const waterVals = orderedStates.map(s => themePalettes[s].waterColor).join(';');
  const h1Vals = orderedStates.map(s => themePalettes[s].hill1).join(';');
  const h2Vals = orderedStates.map(s => themePalettes[s].hill2).join(';');
  const h3Vals = orderedStates.map(s => themePalettes[s].hill3).join(';');

  // Floating Neobrutalist stars
  const stars = [
    { x: 100, y: 80, size: 14, color: '#ffffff', anim: 'floating-item' },
    { x: 860, y: 110, size: 16, color: '#facc15', anim: 'floating-item-delay-1' },
    { x: 220, y: 200, size: 10, color: '#f472b6', anim: 'floating-item-delay-2' }
  ].map(s => {
    return `<g class="${s.anim}"><path d="M ${s.x},${s.y - s.size} Q ${s.x},${s.y} ${s.x + s.size},${s.y} Q ${s.x},${s.y} ${s.x},${s.y + s.size} Q ${s.x},${s.y} ${s.x - s.size},${s.y} Q ${s.x},${s.y} ${s.x},${s.y - s.size} Z" fill="${s.color}" stroke="#000000" stroke-width="2.5" /></g>`;
  }).join('');

  // Kashmir/Himachal mountains with dynamic SVG `<animate>` color transitions
  const mountains = `
    <!-- Back Peak (Left) -->
    <polygon points="340,160 100,340 580,340" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3">
      <animate attributeName="fill" values="${m1Vals}" dur="24s" repeatCount="indefinite" />
    </polygon>
    <!-- Back Peak (Right) -->
    <polygon points="760,170 520,340 980,340" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3">
      <animate attributeName="fill" values="${m1Vals}" dur="24s" repeatCount="indefinite" />
    </polygon>
    
    <!-- Center-Left Peak with Snow Cap -->
    <g>
      <polygon points="240,110 0,340 240,340" fill="${theme.mountainFill2}" stroke="#000000" stroke-width="3">
        <animate attributeName="fill" values="${m2Vals}" dur="24s" repeatCount="indefinite" />
      </polygon>
      <polygon points="240,110 240,340 480,340" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3">
        <animate attributeName="fill" values="${m1Vals}" dur="24s" repeatCount="indefinite" />
      </polygon>
      <polygon points="240,110 190,170 240,170" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <polygon points="240,110 240,170 290,170" fill="#e2e8f0" stroke="#000000" stroke-width="3" />
    </g>

    <!-- Center-Right Peak with Snow Cap -->
    <g>
      <polygon points="620,120 380,340 620,340" fill="${theme.mountainFill2}" stroke="#000000" stroke-width="3">
        <animate attributeName="fill" values="${m2Vals}" dur="24s" repeatCount="indefinite" />
      </polygon>
      <polygon points="620,120 620,340 860,340" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3">
        <animate attributeName="fill" values="${m1Vals}" dur="24s" repeatCount="indefinite" />
      </polygon>
      <polygon points="620,120 570,180 620,180" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <polygon points="620,120 620,180 670,180" fill="#e2e8f0" stroke="#000000" stroke-width="3" />
    </g>
  `;

  // Meadows & Winding River valleys
  const valleyMeadows = `
    <!-- Top valley ground line -->
    <rect x="0" y="340" width="${W}" height="1100" fill="${theme.hill1}">
      <animate attributeName="fill" values="${h1Vals}" dur="24s" repeatCount="indefinite" />
    </rect>
    
    <!-- Winding Valley River -->
    <path d="M 480,340 Q 300,550 720,850 T 150,1200 T 600,1440" fill="none" stroke="${theme.waterColor}" stroke-width="60" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="stroke" values="${waterVals}" dur="24s" repeatCount="indefinite" />
    </path>
    <path d="M 480,340 Q 300,550 720,850 T 150,1200 T 600,1440" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="15,20" stroke-linecap="round" />
    
    <!-- Mid Valley Hill -->
    <path d="M -20,680 Q 400,640 980,720 L 980,1450 L -20,1450 Z" fill="${theme.hill2}" stroke="#000000" stroke-width="3.5">
      <animate attributeName="fill" values="${h2Vals}" dur="24s" repeatCount="indefinite" />
    </path>
    
    <!-- Foreground Valley Hill -->
    <path d="M -20,980 Q 550,1030 980,950 L 980,1450 L -20,1450 Z" fill="${theme.hill3}" stroke="#000000" stroke-width="3.5">
      <animate attributeName="fill" values="${h3Vals}" dur="24s" repeatCount="indefinite" />
    </path>
  `;

  // Swaying Pine Trees
  const pineTrees = [
    { x: 100, y: 390, s: 0.75, delay: 'pine' },
    { x: 150, y: 400, s: 0.85, delay: 'pine-delay' },
    { x: 820, y: 380, s: 0.75, delay: 'pine' },
    { x: 880, y: 390, s: 0.9, delay: 'pine-delay' },
    { x: 60,  y: 720, s: 1.0, delay: 'pine-delay' },
    { x: 900, y: 750, s: 1.1, delay: 'pine' },
    { x: 80,  y: 1020, s: 1.25, delay: 'pine' },
    { x: 880, y: 1000, s: 1.3, delay: 'pine-delay' }
  ].map(t => `
    <g transform="translate(${t.x}, ${t.y}) scale(${t.s})" class="${t.delay}">
      <rect x="-3.5" y="0" width="7" height="15" fill="#78350f" stroke="#000000" stroke-width="2" />
      <polygon points="0,-32 -22,-8 22,-8" fill="#166534" stroke="#000000" stroke-width="2" />
      <polygon points="0,-45 -17,-20 17,-20" fill="#15803d" stroke="#000000" stroke-width="2" />
      <polygon points="0,-58 -12,-32 12,-32" fill="#14532d" stroke="#000000" stroke-width="2" />
    </g>
  `).join('');

  // Weather layers
  let particles = '';
  if (world.weatherType === 'snow') {
    particles = Array.from({ length: 16 }).map((_, i) => {
      const px = 40 + (i * 58) + (Math.sin(i) * 20);
      const delay = (i * 0.4).toFixed(1);
      const dur = (5 + (i % 3) * 1.5).toFixed(1);
      return `<circle class="snow" cx="${px}" cy="-15" r="4.5" fill="#ffffff" stroke="#000000" stroke-width="1.8" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('');
  } else if (world.weatherType === 'rain') {
    particles = Array.from({ length: 18 }).map((_, i) => {
      const px = 30 + (i * 54);
      const delay = (i * 0.2).toFixed(1);
      const dur = (1.2 + (i % 3) * 0.4).toFixed(1);
      return `<line class="raindrop" x1="${px}" y1="-25" x2="${px - 12}" y2="10" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('');
  } else {
    // clear / blossoms
    particles = Array.from({ length: 14 }).map((_, i) => {
      const px = 50 + (i * 65);
      const delay = (i * 0.5).toFixed(1);
      const dur = (7 + (i % 3) * 2).toFixed(1);
      const fill = i % 2 === 0 ? '#f472b6' : '#facc15';
      return `<path class="petal" d="M ${px},-10 C ${px+6},-16 ${px+12},-16 ${px+12},-10 C ${px+12},-4 ${px+6},2 ${px},2 C ${px-6},2 ${px-12},-4 ${px-12},-10 Z" fill="${fill}" stroke="#000000" stroke-width="1.8" style="animation-delay: ${delay}s; animation-duration: ${dur}s;" />`;
    }).join('');
  }

  // Shoreline Text Marquee using modern CSS `offset-path`
  const separators = `
    <g class="marquee" transform="translate(0, 440)">
      <rect x="-10" y="0" width="${W + 20}" height="32" fill="#facc15" stroke="#000000" stroke-width="3" />
      <text font-family="'Space Grotesk', sans-serif" font-size="12.5" font-weight="900" fill="#000000" letter-spacing="1.5">
        🌊 KASHMIR DAL LAKE · HIMACHAL HIMALAYAS · ORCHESTRATE · COMPILE · MERGE · REFACTOR · SCALE · KASHMIR DAL LAKE · HIMACHAL HIMALAYAS
      </text>
    </g>
    <line x1="0" y1="440" x2="${W}" y2="440" stroke="#000000" stroke-width="4.5" />
    <line x1="0" y1="472" x2="${W}" y2="472" stroke="#000000" stroke-width="4.5" />
  `;

  // Spacious Neobrutalist glassmorphic panel
  const P = (y: number, h: number, title: string, badgeBg = '#38bdf8') => {
    const rx = 8, x = 40, w = W - 80;
    const badgeW = title.length * 8.5 + 24;
    const badgeH = 28;
    return `
<g class="panel">
  <!-- Card Shadow -->
  <rect x="${x + 6}" y="${y + 6}" width="${w}" height="${h}" rx="${rx}" fill="#000000" />
  <!-- Card Main Box with Frosted Glassmorphism -->
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#ffffff" fill-opacity="0.91" style="backdrop-filter: blur(8px);" stroke="#000000" stroke-width="3.5" />
  
  <!-- Badge Shadow -->
  <rect x="${x + 34}" y="${y - 11}" width="${badgeW}" height="${badgeH}" rx="4" fill="#000000" />
  <!-- Badge Main -->
  <rect x="${x + 31}" y="${y - 14}" width="${badgeW}" height="${badgeH}" rx="4" fill="${badgeBg}" stroke="#000000" stroke-width="3" />
  <text x="${x + 31 + badgeW / 2}" y="${y + 4}" font-family="'Space Grotesk', sans-serif" font-size="12" fill="#000000" font-weight="900" text-anchor="middle" letter-spacing="1.2">${title}</text>
</g>`;
  };

  // Badges grid
  const skills = [
    { n: 'Kubernetes', bg: '#4ade80' },
    { n: 'Docker',     bg: '#38bdf8' },
    { n: 'TypeScript', bg: '#f472b6' },
    { n: 'Go',         bg: '#22d3ee' },
    { n: 'Node.js',    bg: '#a855f7' },
    { n: 'Terraform',  bg: '#fbbf24' },
    { n: 'Python',     bg: '#ff7096' },
    { n: 'AWS',        bg: '#fb923c' },
    { n: 'Linux',      bg: '#94a3b8' },
    { n: 'Grafana',    bg: '#f87171' },
    { n: 'Prometheus', bg: '#fb7185' },
    { n: 'Backstage',  bg: '#2dd4bf' }
  ];
  
  const bxs = [70, 280, 490, 700];
  const BR = [836, 896, 956];
  const badges = skills.map((s, i) => {
    const bx = bxs[i % 4];
    const by = BR[Math.floor(i / 4)];
    return `
    <g>
      <!-- Shadow -->
      <rect x="${bx + 4}" y="${by + 4}" width="180" height="28" rx="4" fill="#000000" />
      <!-- Main -->
      <rect x="${bx}" y="${by}" width="180" height="28" rx="4" fill="${s.bg}" stroke="#000000" stroke-width="2.5" />
      <text x="${bx + 90}" y="${by + 18}" font-family="'Space Grotesk', sans-serif" font-size="11.5" fill="#000000" font-weight="900" text-anchor="middle">${s.n.toUpperCase()}</text>
    </g>
    `;
  }).join('');

  // Active Quests
  const quests = [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Journey 🌿', bg: '#4ade80' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Journey 🌿', bg: '#4ade80' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🏆',      bg: '#facc15' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🏆',      bg: '#facc15' },
    { t: 'Upstream Node.js core exploration',         s: 'Wandering 🏕️',      bg: '#38bdf8' }
  ];
  const qItems = quests.map((q, i) => {
    const qy = 1084 + i * 38;
    return `
    <g transform="translate(60, ${qy})">
      <!-- Bullet Diamond -->
      <rect x="0" y="-4" width="8" height="8" fill="#000000" transform="rotate(45 4 4)" />
      <text x="24" y="5" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700">
        ${q.t}
      </text>
      
      <!-- Status pill badge -->
      <g transform="translate(680, -11)">
        <rect x="0" y="0" width="130" height="22" rx="4" fill="${q.bg}" stroke="#000000" stroke-width="2" />
        <text x="65" y="15" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#000000" font-weight="900" text-anchor="middle" letter-spacing="0.5">
          ${q.s.toUpperCase()}
        </text>
      </g>
    </g>
    `;
  }).join('');

  // Stats cards
  const stats = [
    { icon: '📝', lbl: 'TRAVEL STREAK', val: `${world.streak} days`,    sub: 'committed in a row', bg: '#4ade80' },
    { icon: '🌱', lbl: 'SPROUTS GROWN', val: `${world.totalContributions}`, sub: 'total commits', bg: '#38bdf8' },
    { icon: '🏡', lbl: 'HOME BIOME',    val: t.label.toUpperCase(),     sub: `Weather: ${world.weatherType.toUpperCase()}`, bg: '#facc15' }
  ];
  const cardW = 260, cardGap = 30, cardY = 1315, cardH = 82;
  const statCards = stats.map((s, i) => {
    const cx = 60 + i * (cardW + cardGap);
    return `
    <g>
      <!-- Shadow -->
      <rect x="${cx + 5}" y="${cardY + 5}" width="${cardW}" height="${cardH}" rx="6" fill="#000000" />
      <!-- Main -->
      <rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="6" fill="${s.bg}" stroke="#000000" stroke-width="3" />
      <text x="${cx + 12}" y="${cardY + 20}" font-family="'Space Grotesk', sans-serif" font-size="9.5" fill="#000000" font-weight="900" letter-spacing="1">${s.icon}  ${s.lbl}</text>
      <text x="${cx + 12}" y="${cardY + 48}" font-family="'Space Grotesk', sans-serif" font-size="20" fill="#000000" font-weight="900">${s.val}</text>
      <text x="${cx + 12}" y="${cardY + 68}" font-family="'Inter', sans-serif" font-size="10" fill="#000000" font-weight="700" opacity="0.8">${s.sub}</text>
    </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border:4px solid #000000;border-radius:18px;overflow:hidden">
  <defs>
    <!-- Full cyclic sky gradient animation -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.sky[0]}">
        <animate attributeName="stop-color" values="${skyTopVals}" dur="20s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="${theme.sky[theme.sky.length - 1]}">
        <animate attributeName="stop-color" values="${skyBottomVals}" dur="20s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
    
    <!-- Dot Grid pattern overlay -->
    <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#000000" opacity="0.08" />
    </pattern>
  </defs>

  <!-- ═══ FULL-HEIGHT BACKDROP LANDSCAPE ═══ -->
  <rect width="${W}" height="500" fill="url(#skyGrad)"/>
  ${valleyMeadows}
  <rect width="${W}" height="${H}" fill="url(#dotGrid)" pointer-events="none" />

  <!-- Sun / Moon with dynamic fill color transitions & pulse -->
  <circle cx="480" cy="180" r="75" fill="${theme.sunColor}" stroke="#000000" stroke-width="4.5" class="sun">
    <animate attributeName="fill" values="${sunVals}" dur="20s" repeatCount="indefinite" />
  </circle>
  
  <!-- Dynamic floating stars -->
  ${stars}

  <!-- ═══ HIMALAYAN MOUNTAINS ═══ -->
  ${mountains}

  <!-- ═══ FOREGROUND PINE FOREST ═══ -->
  ${pineTrees}

  <!-- ═══ WEATHER PARTICLES ═══ -->
  ${particles}

  <!-- ═══ SHORELINE TEXT MARQUEE ═══ -->
  ${separators}

  <!-- ═══ ANIMATED BIRDS & DRIFTING CLOUDS ═══ -->
  <g class="floating-cloud">
    <rect x="0" y="45" width="130" height="22" rx="11" fill="#ffffff" stroke="#000000" stroke-width="3" />
  </g>
  <g class="flying-bird">
    <path d="M 0,0 L 6,-5 L 12,0 L 18,-5 L 24,0" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
  </g>
  <g class="flying-bird-delay">
    <path d="M 0,0 L 5,-4 L 10,0 L 15,-4 L 20,0" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- ═══ HERO HEADER (Floating atop landscape) ═══ -->
  <g transform="translate(180, 320)">
    <!-- Shadow -->
    <rect x="6" y="6" width="600" height="120" rx="8" fill="#000000"/>
    <!-- Main Box -->
    <rect x="0" y="0" width="600" height="120" rx="8" fill="#ffffff" fill-opacity="0.94" stroke="#000000" stroke-width="3.5"/>
    
    <!-- Neon Pink left vertical stripe -->
    <rect x="3" y="3" width="10" height="114" fill="#f472b6" />
    <line x1="13" y1="3" x2="13" y2="117" stroke="#000000" stroke-width="3.5" />

    <text x="310" y="55" font-family="'Space Grotesk', sans-serif" font-size="34" fill="#000000" text-anchor="middle" font-weight="900">HI, I'M DASMAT ⚡</text>
    <text x="310" y="88" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700" text-anchor="middle" letter-spacing="0.5">
      DEVOPS EXPLORER  ·  FULL-STACK DEVELOPER  ·  OSS CONTRIBUTOR
    </text>
  </g>

  <!-- ═══ ABOUT ME PANEL ═══ -->
  ${P(480, 170, '⚡  ABOUT THE TRAVELER', '#38bdf8')}
  <text x="70" y="530" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CORE INTERESTS:</tspan> Infrastructure automation, Cloud-Native scaling, Self-healing architectures
  </text>
  <text x="70" y="575" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CONTRIBUTING TO:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="70" y="620" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CONTACT:</tspan> dasmath06@gmail.com   ·   ⚡  Experiments daily with automated recovery pipelines
  </text>

  <!-- ═══ WORLD STATE BAR ═══ -->
  ${P(690, 70, '🏡  CURRENT ENVIRONMENT LOG', '#f472b6')}
  <text x="${W/2}" y="732" font-family="'Space Grotesk', sans-serif" font-size="13.5" fill="#000000" text-anchor="middle" font-weight="900">
    🌳 BIOME: <tspan fill="#000000" font-weight="900">${t.label.toUpperCase()}</tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🕰️ TIME: <tspan fill="#38bdf8">${world.timeOfDay.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🌦️ WEATHER: <tspan fill="#a855f7">${world.weatherType.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🎒 STREAK: <tspan fill="#fbbf24">${world.streak} DAYS</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK PANEL ═══ -->
  ${P(800, 190, '🎒  PACKED GEAR (TECH STACK)', '#4ade80')}
  ${badges}

  <!-- ═══ ACTIVE QUESTS PANEL ═══ -->
  ${P(1030, 240, '🗺️  CURRENT JOURNEY (ACTIVE QUESTS)', '#c084fc')}
  ${qItems}

  <!-- ═══ STATS HUD ═══ -->
  ${statCards}

  <!-- Neobrutalist bottom footer -->
  <text x="${W/2}" y="${H - 12}" font-family="'Space Grotesk', sans-serif" font-size="10.5" fill="#000000" font-weight="800" text-anchor="middle" letter-spacing="1">
    ⚡  HARVESTED DAILY BY GITWORLD ENGINE  ·  GITHUB.COM/DASMAT13/GIT-WORLD-ACTION  ⚡
  </text>

  <style>
    .floating-item {
      animation: floatAnimation 5s ease-in-out infinite alternate;
      transform-origin: center;
    }
    .floating-item-delay-1 {
      animation: floatAnimation 7s ease-in-out infinite alternate;
      animation-delay: 1.5s;
      transform-origin: center;
    }
    .floating-item-delay-2 {
      animation: floatAnimation 6s ease-in-out infinite alternate;
      animation-delay: 3s;
      transform-origin: center;
    }
    @keyframes floatAnimation {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(3deg); }
      100% { transform: translateY(-24px) rotate(-3deg); }
    }
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
      from { transform: rotate(1.5deg); }
      to   { transform: rotate(-1.5deg); }
    }
    .marquee text {
      offset-path: path("M 960 21 H -960");
      offset-distance: 0%;
      animation: slideText 16s linear infinite;
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
    .petal {
      animation: fallPetal 10s linear infinite;
    }
    @keyframes fallSnow {
      0%   { transform: translateY(0)  rotate(0deg); opacity:1; }
      100% { transform: translateY(1460px) rotate(360deg); opacity:0; }
    }
    @keyframes fallRain {
      0%   { transform: translateY(0) scaleY(1); opacity:0.8; }
      100% { transform: translateY(1460px) scaleY(1.5); opacity:0; }
    }
    @keyframes fallPetal {
      0%   { transform: translateY(0) rotate(0deg); opacity:1; }
      100% { transform: translateY(1460px) rotate(720deg); opacity:0; }
    }
  </style>
</svg>`;
}
