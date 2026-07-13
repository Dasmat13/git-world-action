import { WorldData } from './world';

const W = 900, H = 1160;

export function renderProfileCard(world: WorldData): string {
  const t = world.biomeTheme;
  const username = world.username;

  // Determine Neobrutalist color theme based on time of day (Kashmir/Himachal mood boards)
  const skyPalettes: Record<string, { sky: string[]; sunColor: string; mountainFill1: string; mountainFill2: string; waterColor: string }> = {
    night: {
      sky: ['#0f172a', '#1e293b', '#334155'], // deep starry slate
      sunColor: '#f1f5f9', // glowing moon
      mountainFill1: '#1e1b4b', // deep violet/indigo shadow face
      mountainFill2: '#312e81', // indigo main face
      waterColor: '#1e1b4b'
    },
    dawn: {
      sky: ['#f472b6', '#fb923c', '#fef08a'], // pink-orange dawn
      sunColor: '#facc15', // gold sun
      mountainFill1: '#701a75', // purple shadow
      mountainFill2: '#a21caf', // magenta-purple main
      waterColor: '#a21caf'
    },
    day: {
      sky: ['#38bdf8', '#7dd3fc', '#bae6fd'], // crystal clear blue sky
      sunColor: '#f97316', // vibrant orange sun
      mountainFill1: '#2563eb', // royal blue shadow
      mountainFill2: '#60a5fa', // sky blue main
      waterColor: '#22d3ee' // bright cyan water
    },
    dusk: {
      sky: ['#be123c', '#fb7185', '#fda4af'], // nostalgic rose sunset
      sunColor: '#fbbf24', // deep amber sun
      mountainFill1: '#4c1d95', // deep purple shadow
      mountainFill2: '#6d28d9', // violet main
      waterColor: '#c084fc'
    }
  };
  const theme = skyPalettes[world.timeOfDay] || skyPalettes.day;

  // Horizontal Neobrutalist poster-style sky stripes
  const skyBands = theme.sky.map((color, i) => {
    const bandH = 280 / theme.sky.length;
    return `<rect x="0" y="${i * bandH}" width="900" height="${bandH}" fill="${color}" />`;
  }).join('');

  // Floating Neobrutalist 4-point stars in the sky
  const seed = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const stars = [
    { x: 70, y: 60, size: 10, color: '#ffffff', anim: 'floating-item' },
    { x: 820, y: 90, size: 12, color: '#facc15', anim: 'floating-item-delay-1' },
    { x: 190, y: 150, size: 8, color: '#f472b6', anim: 'floating-item-delay-2' }
  ].map(s => {
    return `<g class="${s.anim}"><path d="M ${s.x},${s.y - s.size} Q ${s.x},${s.y} ${s.x + s.size},${s.y} Q ${s.x},${s.y} ${s.x},${s.y + s.size} Q ${s.x},${s.y} ${s.x - s.size},${s.y} Q ${s.x},${s.y} ${s.x},${s.y - s.size} Z" fill="${s.color}" stroke="#000000" stroke-width="2" /></g>`;
  }).join('');

  // Kashmir/Himachal Mountain range: overlapping geometric peaks with snow-caps
  const mountains = `
    <!-- Back Peak (Left) -->
    <polygon points="320,130 120,280 520,280" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3" />
    
    <!-- Back Peak (Right) -->
    <polygon points="720,140 520,280 920,280" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3" />
    
    <!-- Fore Peak (Left) with Snow Cap -->
    <g>
      <polygon points="220,90 20,280 220,280" fill="${theme.mountainFill2}" stroke="#000000" stroke-width="3" />
      <polygon points="220,90 220,280 420,280" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3" />
      <!-- Snow cap -->
      <polygon points="220,90 180,140 220,140" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <polygon points="220,90 220,140 260,140" fill="#e2e8f0" stroke="#000000" stroke-width="3" />
    </g>

    <!-- Fore Peak (Right) with Snow Cap -->
    <g>
      <polygon points="580,100 380,280 580,280" fill="${theme.mountainFill2}" stroke="#000000" stroke-width="3" />
      <polygon points="580,100 580,280 780,280" fill="${theme.mountainFill1}" stroke="#000000" stroke-width="3" />
      <!-- Snow cap -->
      <polygon points="580,100 540,150 580,150" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <polygon points="580,100 580,150 620,150" fill="#e2e8f0" stroke="#000000" stroke-width="3" />
    </g>
  `;

  // Kashmir Valley Pine Trees (stacked triangles) along the base line
  const pineTrees = [
    { x: 60, y: 280, s: 0.95 },
    { x: 110, y: 280, s: 1.15 },
    { x: 170, y: 280, s: 0.8 },
    { x: 380, y: 280, s: 1.0 },
    { x: 420, y: 280, s: 0.7 },
    { x: 490, y: 280, s: 0.9 },
    { x: 760, y: 280, s: 1.2 },
    { x: 820, y: 280, s: 0.85 }
  ].map(tree => `
    <g transform="translate(${tree.x}, ${tree.y}) scale(${tree.s})">
      <!-- Trunk -->
      <rect x="-4" y="0" width="8" height="15" fill="#78350f" stroke="#000000" stroke-width="2" />
      <!-- Leaf levels -->
      <polygon points="0,-35 -24,-10 24,-10" fill="#15803d" stroke="#000000" stroke-width="2.5" />
      <polygon points="0,-50 -18,-25 18,-25" fill="#166534" stroke="#000000" stroke-width="2.5" />
      <polygon points="0,-65 -13,-40 13,-40" fill="#14532d" stroke="#000000" stroke-width="2.5" />
    </g>
  `).join('');

  // Moving Neobrutalist text marquee separator at Y=280 (acting as river shoreline)
  const separators = `
    <!-- Lake shore shadow border -->
    <rect x="-10" y="278" width="920" height="34" fill="#38bdf8" stroke="#000000" stroke-width="3" />
    
    <!-- Moving Text Marquee (lake waves) -->
    <g transform="translate(0, 280)">
      <g class="marquee-group">
        <text y="21" font-family="'Space Grotesk', sans-serif" font-size="12.5" font-weight="900" fill="#000000" letter-spacing="1">
          🌊 KASHMIR DAL LAKE · HIMACHAL HIMALAYAS · DEPLOY · OPTIMIZE · AUTOMATE · ORCHESTRATE · MERGE · REFACTOR · KASHMIR DAL LAKE · HIMACHAL HIMALAYAS · DEPLOY · OPTIMIZE · AUTOMATE · ORCHESTRATE · MERGE · REFACTOR
        </text>
      </g>
    </g>
    
    <!-- Shore divider -->
    <line x1="0" y1="312" x2="900" y2="312" stroke="#000000" stroke-width="4" />
  `;

  // Neobrutalist Panel component: thick border, solid offset shadow, square corner badge
  const P = (y: number, h: number, title: string, badgeBg = '#facc15') => {
    const rx = 6, x = 20, w = W - 40;
    const badgeW = title.length * 8.5 + 24;
    const badgeH = 28;
    return `
<g class="panel">
  <!-- Card Shadow -->
  <rect x="${x + 6}" y="${y + 6}" width="${w}" height="${h}" rx="${rx}" fill="#000000" />
  <!-- Card Main Box -->
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#ffffff" stroke="#000000" stroke-width="3" />
  
  <!-- Badge Shadow -->
  <rect x="${x + 28}" y="${y - 11}" width="${badgeW}" height="${badgeH}" rx="4" fill="#000000" />
  <!-- Badge Main -->
  <rect x="${x + 25}" y="${y - 14}" width="${badgeW}" height="${badgeH}" rx="4" fill="${badgeBg}" stroke="#000000" stroke-width="3" />
  <text x="${x + 25 + badgeW / 2}" y="${y + 4}" font-family="'Space Grotesk', 'Outfit', sans-serif" font-size="12" fill="#000000" font-weight="900" text-anchor="middle" letter-spacing="1.2">${title}</text>
</g>`;
  };

  // Blocky tech badges
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
  
  const bxs = [32, 172, 312, 452, 592, 732];
  const BR0 = 726, BR1 = 772;
  const badges = skills.map((s, i) => {
    const bx = bxs[i % 6];
    const by = i < 6 ? BR0 : BR1;
    return `
    <g>
      <!-- Shadow -->
      <rect x="${bx + 3}" y="${by + 3}" width="128" height="26" rx="4" fill="#000000" />
      <!-- Main -->
      <rect x="${bx}" y="${by}" width="128" height="26" rx="4" fill="${s.bg}" stroke="#000000" stroke-width="2" />
      <text x="${bx + 64}" y="${by + 17}" font-family="'Space Grotesk', sans-serif" font-size="11" fill="#000000" font-weight="900" text-anchor="middle">${s.n.toUpperCase()}</text>
    </g>
    `;
  }).join('');

  // Quest lines spaced out with custom Neobrutalist status badges
  const quests = [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Journey 🌿', bg: '#4ade80' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Journey 🌿', bg: '#4ade80' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🏆',      bg: '#facc15' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🏆',      bg: '#facc15' },
    { t: 'Upstream Node.js core exploration',         s: 'Wandering 🏕️',      bg: '#38bdf8' }
  ];
  const qItems = quests.map((q, i) => {
    const qy = 886 + i * 30; // 30px gaps for breathing room
    return `
    <g transform="translate(40, ${qy})">
      <!-- Bullet diamond -->
      <rect x="0" y="-4" width="8" height="8" fill="#000000" transform="rotate(45 4 4)" />
      <text x="24" y="5" font-family="'Inter', sans-serif" font-size="12.5" fill="#000000" font-weight="700">
        ${q.t}
      </text>
      
      <!-- Status pill badge -->
      <g transform="translate(670, -11)">
        <rect x="0" y="0" width="120" height="20" rx="4" fill="${q.bg}" stroke="#000000" stroke-width="2" />
        <text x="60" y="14" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#000000" font-weight="900" text-anchor="middle" letter-spacing="0.5">
          ${q.s.toUpperCase()}
        </text>
      </g>
    </g>
    `;
  }).join('');

  // Stats entries
  const stats = [
    { icon: '📝', lbl: 'TRAVEL STREAK', val: `${world.streak} days`,    sub: 'committed in a row', bg: '#4ade80' },
    { icon: '🌱', lbl: 'SPROUTS GROWN', val: `${world.totalContributions}`, sub: 'total commits', bg: '#38bdf8' },
    { icon: '🏡', lbl: 'HOME BIOME',    val: t.label.toUpperCase(),     sub: `Weather: ${world.weatherType.toUpperCase()}`, bg: '#facc15' }
  ];
  const cardW = 270, cardGap = 25, cardY = 1048, cardH = 76;
  const statCards = stats.map((s, i) => {
    const cx = 30 + i * (cardW + cardGap);
    return `
    <g>
      <!-- Shadow -->
      <rect x="${cx + 5}" y="${cardY + 5}" width="${cardW}" height="${cardH}" rx="6" fill="#000000" />
      <!-- Main -->
      <rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="6" fill="${s.bg}" stroke="#000000" stroke-width="3" />
      <text x="${cx + 12}" y="${cardY + 20}" font-family="'Space Grotesk', sans-serif" font-size="9" fill="#000000" font-weight="900" letter-spacing="1">${s.icon}  ${s.lbl}</text>
      <text x="${cx + 12}" y="${cardY + 48}" font-family="'Space Grotesk', sans-serif" font-size="20" fill="#000000" font-weight="900">${s.val}</text>
      <text x="${cx + 12}" y="${cardY + 65}" font-family="'Inter', sans-serif" font-size="9.5" fill="#000000" font-weight="700" opacity="0.8">${s.sub}</text>
    </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border:4px solid #000000;border-radius:18px;overflow:hidden">
  <defs>
    <!-- Dot Matrix Grid Pattern -->
    <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#eadecd" />
    </pattern>
  </defs>

  <!-- ═══ BASE BACKDROP (KASHMIR SUNSET STRIPES) ═══ -->
  ${skyBands}
  <rect width="${W}" height="${H}" y="280" fill="#f6f5f0"/>
  <rect width="${W}" height="${H}" y="280" fill="url(#dotGrid)"/>

  <!-- Sun / Moon behind mountains -->
  <circle cx="480" cy="160" r="72" fill="${theme.sunColor}" stroke="#000000" stroke-width="4" />
  
  <!-- Dynamic floating vector stars -->
  ${stars}

  <!-- ═══ HIMALAYAN MOUNTAINS ═══ -->
  ${mountains}

  <!-- ═══ VALLEY WATER LAKE LINE ═══ -->
  <rect x="0" y="268" width="900" height="12" fill="${theme.waterColor}" stroke="#000000" stroke-width="3" />

  <!-- ═══ FOREGROUND PINE FOREST ═══ -->
  ${pineTrees}

  <!-- ═══ DIVIDERS ═══ -->
  ${separators}

  <!-- ═══ ANIMATED BIRDS & CLOUDS ═══ -->
  <!-- Flat drifting cloud -->
  <g class="floating-cloud">
    <rect x="0" y="45" width="130" height="22" rx="11" fill="#ffffff" stroke="#000000" stroke-width="3" />
  </g>
  <!-- Flying birds -->
  <g class="flying-bird">
    <path d="M 0,0 L 6,-5 L 12,0 L 18,-5 L 24,0" fill="none" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
  </g>
  <g class="flying-bird-delay">
    <path d="M 0,0 L 5,-4 L 10,0 L 15,-4 L 20,0" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- ═══ HERO HEADER ═══ -->
  <g transform="translate(150, 336)">
    <!-- Shadow -->
    <rect x="6" y="6" width="600" height="114" rx="6" fill="#000000"/>
    <!-- Main Box -->
    <rect x="0" y="0" width="600" height="114" rx="6" fill="#ffffff" stroke="#000000" stroke-width="3"/>
    
    <!-- Neon Pink left vertical stripe -->
    <rect x="3" y="3" width="10" height="108" fill="#f472b6" />
    <line x1="13" y1="3" x2="13" y2="111" stroke="#000000" stroke-width="3" />

    <text x="310" y="52" font-family="'Space Grotesk', sans-serif" font-size="34" fill="#000000" text-anchor="middle" font-weight="900">HI, I'M DASMAT ⚡</text>
    <text x="310" y="82" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700" text-anchor="middle" letter-spacing="0.5">
      DEVOPS EXPLORER  ·  FULL-STACK DEVELOPER  ·  OSS CONTRIBUTOR
    </text>
  </g>

  <!-- ═══ ABOUT ME PANEL y=475 h=125 (spacious layout) ═══ -->
  ${P(475, 125, '⚡  ABOUT THE TRAVELER', '#38bdf8')}
  <text x="40" y="515" font-family="'Inter', sans-serif" font-size="12.5" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CORE INTERESTS:</tspan> Infrastructure automation, Cloud-Native scaling, Self-healing architectures
  </text>
  <text x="40" y="545" font-family="'Inter', sans-serif" font-size="12.5" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CONTRIBUTING TO:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="40" y="575" font-family="'Inter', sans-serif" font-size="12.5" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CONTACT:</tspan> dasmath06@gmail.com   ·   ⚡  Experiments daily with automated recovery pipelines
  </text>

  <!-- ═══ WORLD STATE BAR y=620 h=55 ═══ -->
  ${P(620, 55, '🏡  CURRENT ENVIRONMENT LOG', '#f472b6')}
  <text x="${W/2}" y="653" font-family="'Space Grotesk', sans-serif" font-size="13.5" fill="#000000" text-anchor="middle" font-weight="900">
    🌳 BIOME: <tspan fill="#000000" font-weight="900">${t.label.toUpperCase()}</tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🕰️ TIME: <tspan fill="#38bdf8">${world.timeOfDay.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🌦️ WEATHER: <tspan fill="#a855f7">${world.weatherType.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🎒 STREAK: <tspan fill="#fbbf24">${world.streak} DAYS</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK PANEL y=695 h=130 ═══ -->
  ${P(695, 130, '🎒  PACKED GEAR (TECH STACK)', '#4ade80')}
  ${badges}

  <!-- ═══ ACTIVE QUESTS PANEL y=845 h=180 ═══ -->
  ${P(845, 180, '🗺️  CURRENT JOURNEY (ACTIVE QUESTS)', '#c084fc')}
  ${qItems}

  <!-- ═══ STATS HUD y=1048 h=76 ═══ -->
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
    .marquee-group {
      animation: marqueeText 25s linear infinite;
    }
    @keyframes marqueeText {
      0% { transform: translateX(0); }
      100% { transform: translateX(-650px); }
    }
    .flying-bird {
      animation: birdFly 15s linear infinite;
    }
    .flying-bird-delay {
      animation: birdFly 20s linear infinite;
      animation-delay: 4s;
    }
    @keyframes birdFly {
      0% { transform: translate(-50px, 90px); }
      100% { transform: translate(950px, 50px); }
    }
    .floating-cloud {
      animation: cloudFloat 26s linear infinite;
    }
    @keyframes cloudFloat {
      0% { transform: translateX(-150px); }
      100% { transform: translateX(950px); }
    }
  </style>
</svg>`;
}
