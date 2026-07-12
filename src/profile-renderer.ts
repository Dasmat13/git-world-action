import { WorldData } from './world';

const W = 900, H = 1080;

export function renderProfileCard(world: WorldData): string {
  const t   = world.biomeTheme;
  const username = world.username;

  // Disney Magic Theme Colors
  const magicGold   = '#ffd700';
  const royalBlue   = '#1a237e';
  const magicPurple = '#4a148c';
  const fairyPink   = '#ff4081';
  const warmCream   = 'rgba(255, 250, 230, 0.94)';
  const borderGold  = '#e5c158';

  const skyPalettes: Record<string, [string, string, string]> = {
    night: ['#03001e', '#7303c0', '#ec38bc'], // magical starry galaxy sky
    dawn:  ['#fcb045', '#fd1d1d', '#833ab4'], // vibrant sunrise magic
    day:   ['#00c6ff', '#0072ff', '#dbf3fa'], // sparkling sky blue
    dusk:  ['#2c3e50', '#fd746c', '#ff9068'], // nostalgic twilight orange
  };
  const [s0, s1, s2] = skyPalettes[world.timeOfDay] || skyPalettes.night;

  // Seeded values for sparkles and fireworks
  const seed = username.split('').reduce((a,c) => a + c.charCodeAt(0), 0);

  // Sparkles (4-pointed star shapes)
  const sparkles = Array.from({length: 30}, (_, i) => {
    const sx = ((seed * (i + 3) * 397) % W).toFixed(1);
    const sy = (50 + ((seed * (i + 2) * 521) % 250)).toFixed(1);
    const scale = (0.4 + (i % 4) * 0.2).toFixed(2);
    const d = ((i * 0.3) % 4).toFixed(1);
    return `
    <g transform="translate(${sx},${sy}) scale(${scale})" style="animation: sparklePulse 3s ease-in-out infinite; animation-delay:${d}s;">
      <path d="M 0,-15 L 3,-4 L 14,0 L 3,4 L 0,15 L -3,4 L -14,0 L -3,-4 Z" fill="${magicGold}" />
    </g>`;
  }).join('');

  // Magical swirling star trail
  const starTrail = Array.from({length: 12}, (_, i) => {
    const angle = (i / 12) * Math.PI;
    const tx = (450 + Math.cos(angle) * 260).toFixed(1);
    const ty = (240 - Math.sin(angle) * 110).toFixed(1);
    const size = (2 + (i % 3) * 2.5).toFixed(1);
    return `<circle cx="${tx}" cy="${ty}" r="${size}" fill="#ffffff" filter="url(#glowMagic)" opacity="0.8" />`;
  }).join('');

  // Disney-style Castle horizon silhouette (center height at 260)
  const castle = `
    <!-- Distant Castle Spires -->
    <path d="M 370,260 L 370,170 L 380,170 L 380,260 Z" fill="#2a1b4e" opacity="0.6" />
    <path d="M 520,260 L 520,170 L 530,170 L 530,260 Z" fill="#2a1b4e" opacity="0.6" />
    <!-- Midground Towers -->
    <path d="M 390,260 L 390,140 L 405,115 L 420,140 L 420,260 Z" fill="#3c226a" />
    <path d="M 480,260 L 480,140 L 495,115 L 510,140 L 510,260 Z" fill="#3c226a" />
    <!-- Main Center Tower and Spire -->
    <path d="M 430,260 L 430,110 L 450,70 L 470,110 L 470,260 Z" fill="#4d2c88" />
    <!-- Tower Flags -->
    <polygon points="450,70 464,74 450,78" fill="${magicGold}" />
    <!-- Castle Base and Arched Gate -->
    <rect x="410" y="210" width="80" height="50" rx="6" fill="#3c226a" />
    <path d="M 435,260 A 15,15 0 0 1 465,260 Z" fill="#0d051c" />
    <!-- Left/Right Side Blocks -->
    <rect x="375" y="220" width="40" height="40" rx="4" fill="#311b58" />
    <rect x="485" y="220" width="40" height="40" rx="4" fill="#311b58" />
  `;

  // Whimsical Scroll Panel with curved edges and corner ornaments
  const P = (y: number, h: number, title: string) => {
    const rx = 22, x = 20, w = W - 40;
    return `
<g class="magic-panel">
  <!-- Dropped magic shadow -->
  <rect x="${x + 2}" y="${y + 4}" width="${w}" height="${h}" rx="${rx}" fill="rgba(26, 8, 48, 0.25)"/>
  
  <!-- Main Scroll Body -->
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${warmCream}" stroke="${borderGold}" stroke-width="2.5"/>
  <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" rx="${rx - 6}" fill="none" stroke="${borderGold}" stroke-width="1.2" stroke-dasharray="8 4" opacity="0.6" />

  <!-- Corner Flourish Circles (Ornate Disney style) -->
  <circle cx="${x + 10}" cy="${y + 10}" r="8" fill="none" stroke="${borderGold}" stroke-width="2" />
  <circle cx="${x + w - 10}" cy="${y + 10}" r="8" fill="none" stroke="${borderGold}" stroke-width="2" />
  <circle cx="${x + 10}" cy="${y + h - 10}" r="8" fill="none" stroke="${borderGold}" stroke-width="2" />
  <circle cx="${x + w - 10}" cy="${y + h - 10}" r="8" fill="none" stroke="${borderGold}" stroke-width="2" />
  
  <!-- Floating magical stars at corners -->
  <path d="M ${x + 10},${y + 10} L ${x + 12},${y + 7} L ${x + 15},${y + 10} L ${x + 12},${y + 13} Z" fill="${magicGold}" />
  <path d="M ${x + w - 10},${y + 10} L ${x + w - 12},${y + 7} L ${x + w - 15},${y + 10} L ${x + w - 12},${y + 13} Z" fill="${magicGold}" />

  <!-- Whimsical Ribbon Header -->
  <g transform="translate(${x + 40}, ${y - 14})">
    <rect width="${title.length * 8.5 + 40}" height="28" rx="14" fill="${magicPurple}" stroke="${magicGold}" stroke-width="1.5" filter="url(#glowMagic)" />
    <text x="${(title.length * 8.5 + 40) / 2}" y="18" font-family="'Outfit', 'Inter', sans-serif" font-weight="bold" font-size="12" fill="${magicGold}" text-anchor="middle" letter-spacing="1">${title}</text>
  </g>
</g>`;
  };

  // Disney gemstone-style tech badges
  const skills = [
    { n: 'Kubernetes', c: '#1a73e8' }, { n: 'Docker',     c: '#0288d1' },
    { n: 'TypeScript', c: '#1976d2' }, { n: 'Go',         c: '#0097a7' },
    { n: 'Node.js',    c: '#2e7d32' }, { n: 'Terraform',  c: '#7b1fa2' },
    { n: 'Python',     c: '#5d4037' }, { n: 'AWS',        c: '#e65100' },
    { n: 'Linux',      c: '#37474f' }, { n: 'Grafana',    c: '#d84315' },
    { n: 'Prometheus', c: '#c62828' }, { n: 'Backstage',  c: '#00695c' }
  ];
  
  const bxs = [32, 172, 312, 452, 592, 732];
  const BR0 = 694, BR1 = 734;
  const badges = skills.map((s, i) => {
    const bx = bxs[i % 6];
    const by = i < 6 ? BR0 : BR1;
    return `
    <g>
      <!-- Gemstone Badge -->
      <polygon points="${bx},${by + 14} ${bx + 16},${by} ${bx + 118},${by} ${bx + 134},${by + 14} ${bx + 118},${by + 28} ${bx + 16},${by + 28}" fill="${s.c}" stroke="${magicGold}" stroke-width="1.2" />
      <text x="${bx + 67}" y="${by + 18}" font-family="sans-serif" font-size="11.5" fill="#ffffff" font-weight="bold" text-anchor="middle">${s.n}</text>
    </g>
    `;
  }).join('');

  // Magic quest log
  const quests = [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Quest ✨', c: '#e91e63' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Quest ✨', c: '#e91e63' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🌟',      c: '#ff9800' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🌟',      c: '#ff9800' },
    { t: 'Upstream Node.js core exploration',         s: 'Exploring 🧭',      c: '#2196f3' }
  ];
  const qItems = quests.map((q, i) => {
    const qy = 836 + i * 26;
    return `
    <text x="40" y="${qy}" font-family="sans-serif" font-size="13" fill="${magicPurple}">
      <tspan fill="${fairyPink}" font-weight="bold">✦ </tspan>${q.t}
      <tspan dx="10" fill="${q.c}" font-size="11" font-weight="bold">[ ${q.s} ]</tspan>
    </text>
    `;
  }).join('');

  // Magic Shields stats cards
  const stats = [
    { icon: '✨', lbl: 'MAGIC STREAK', val: `${world.streak} days`,    sub: 'consecutive active days' },
    { icon: '👑', lbl: 'ROYAL COMMITS', val: `${world.totalContributions}`, sub: 'total contributions' },
    { icon: '🏰', lbl: 'WORLD BIOME',  val: t.label,                   sub: `Weather: ${world.weatherType}` }
  ];
  const cardW = 270, cardGap = 25, cardY = 974, cardH = 76;
  const statCards = stats.map((s, i) => {
    const cx = 30 + i * (cardW + cardGap);
    return `
    <g>
      <rect x="${cx + 2}" y="${cardY + 3}" width="${cardW}" height="${cardH}" rx="16" fill="rgba(26, 8, 48, 0.2)"/>
      <rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="16" fill="${warmCream}" stroke="${borderGold}" stroke-width="2"/>
      
      <!-- Crown/Shield design decoration -->
      <path d="M ${cx + 10},${cardY + 8} L ${cx + cardW - 10},${cardY + 8}" stroke="${borderGold}" stroke-width="0.8" />
      
      <text x="${cx + 12}" y="${cardY + 22}" font-family="sans-serif" font-size="9" fill="${magicPurple}" font-weight="bold" letter-spacing="1">${s.icon}  ${s.lbl}</text>
      <text x="${cx + 12}" y="${cardY + 49}" font-family="sans-serif" font-size="19" fill="${magicPurple}" font-weight="bold">${s.val}</text>
      <text x="${cx + 12}" y="${cardY + 66}" font-family="sans-serif" font-size="9" fill="${magicPurple}" opacity="0.6">${s.sub}</text>
    </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border-radius:18px;overflow:hidden">
  <defs>
    <!-- Magic Sky Gradient -->
    <linearGradient id="magicSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${s0}"/>
      <stop offset="55%"  stop-color="${s1}"/>
      <stop offset="100%" stop-color="${s2}"/>
    </linearGradient>

    <!-- Magic Glow filter -->
    <filter id="glowMagic" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- ═══ MAGIC SKY BACKDROP ═══ -->
  <rect width="${W}" height="${H}" fill="url(#magicSky)"/>
  
  <!-- Swirling magic trail and sparkles -->
  ${starTrail}
  ${sparkles}

  <!-- ═══ DISNEY SILHOUETTE CASTLE ═══ -->
  ${castle}
  <rect x="0" y="260" width="${W}" height="60" fill="#1c0f38" />

  <!-- ═══ HERO HEADER ═══ -->
  <g transform="translate(150, 336)">
    <rect x="2" y="3" width="600" height="114" rx="20" fill="rgba(26, 8, 48, 0.25)"/>
    <rect x="0" y="0" width="600" height="114" rx="20" fill="${warmCream}" stroke="${borderGold}" stroke-width="2.5"/>
    <rect x="5" y="5" width="590" height="104" rx="15" fill="none" stroke="${borderGold}" stroke-width="1.2" stroke-dasharray="6 3" opacity="0.5" />
    
    <!-- Ornate inner loops -->
    <circle cx="20" cy="20" r="10" fill="none" stroke="${borderGold}" stroke-width="1.5" />
    <circle cx="580" cy="20" r="10" fill="none" stroke="${borderGold}" stroke-width="1.5" />
    <circle cx="20" cy="94" r="10" fill="none" stroke="${borderGold}" stroke-width="1.5" />
    <circle cx="580" cy="94" r="10" fill="none" stroke="${borderGold}" stroke-width="1.5" />

    <text x="300" y="52" font-family="'Outfit', sans-serif" font-size="34" fill="${magicPurple}" text-anchor="middle" font-weight="bold" filter="url(#glowMagic)">Dasmat's Magic Kingdom ✨</text>
    <text x="300" y="80" font-family="sans-serif" font-size="13.5" fill="${magicPurple}" opacity="0.8" text-anchor="middle" letter-spacing="0.5">
      DevOps Sorcerer  ·  Full-Stack Software Craftsman  ·  Open Source Explorer
    </text>
  </g>

  <!-- ═══ ABOUT ME PANEL y=468 h=118 ═══ -->
  ${P(468, 118, '✨  ABOUT THE ARCHITECT')}
  <text x="40" y="505" font-family="sans-serif" font-size="13.5" fill="${magicPurple}">
    👑  <tspan font-weight="bold" fill="${magicPurple}">Core Focus:</tspan> Infrastructure spellcasting, Cloud-Native architecture, Auto-healing systems
  </text>
  <text x="40" y="531" font-family="sans-serif" font-size="13.5" fill="${magicPurple}">
    🪄  <tspan font-weight="bold" fill="${magicPurple}">Guild Contributions:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="40" y="557" font-family="sans-serif" font-size="13.5" fill="${magicPurple}">
    📬  <tspan font-weight="bold" fill="${magicPurple}">Magic Mail:</tspan> mey37056@gmail.com   ·   ⚡  Creating self-restoring cloud kingdoms daily
  </text>

  <!-- ═══ WORLD STATE BAR y=600 h=50 ═══ -->
  ${P(600, 50, '🏰  KINGDOM STATUS')}
  <text x="${W/2}" y="632" font-family="sans-serif" font-size="13.5" fill="${magicPurple}" text-anchor="middle" font-weight="bold">
    🌟 Biome: <tspan fill="${magicPurple}">${t.label}</tspan>
    <tspan dx="15" fill="${magicPurple}" opacity="0.3">|</tspan>
    <tspan dx="15">🕰️ Cycle: <tspan fill="${magicPurple}">${world.timeOfDay}</tspan></tspan>
    <tspan dx="15" fill="${magicPurple}" opacity="0.3">|</tspan>
    <tspan dx="15">🌦️ Climate: <tspan fill="${magicPurple}">${world.weatherType}</tspan></tspan>
    <tspan dx="15" fill="${magicPurple}" opacity="0.3">|</tspan>
    <tspan dx="15">🎒 Streak: <tspan fill="${magicPurple}">${world.streak} days</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK PANEL y=664 h=118 ═══ -->
  ${P(664, 118, '🪄  ROYAL GEAR (TECH STACK)')}
  ${badges}

  <!-- ═══ ACTIVE QUESTS PANEL y=796 h=162 ═══ -->
  ${P(796, 162, '🗺️  ACTIVE ADVENTURES (QUEST LOG)')}
  ${qItems}

  <!-- ═══ STATS HUD y=974 h=76 ═══ -->
  ${statCards}

  <!-- Magic bottom footer -->
  <text x="${W/2}" y="${H - 10}" font-family="sans-serif" font-size="10" fill="${magicPurple}" opacity="0.5" text-anchor="middle" letter-spacing="1.5">
    ✨  Created under the Magic Kingdom of GitWorld Engine  ·  github.com/Dasmat13/git-world-action  ✨
  </text>

  <style>
    @keyframes sparklePulse {
      0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.3; }
      50% { transform: scale(1.1) rotate(45deg); opacity: 0.95; }
    }
  </style>
</svg>`;
}
