import { WorldData } from './world';

const W = 900, H = 1080;

export function renderProfileCard(world: WorldData): string {
  const t   = world.biomeTheme;
  const username = world.username;

  // Ghibli aesthetic color palette: warm, soft, hand-drawn, botanical
  const forestGreen = '#3a5f43';
  const leafGreen   = '#5b8c5a';
  const warmGold    = '#d9a05b';
  const darkWood    = '#4a3b32';
  const creamPaper  = 'rgba(255, 252, 242, 0.92)';
  const borderGold  = '#c9a054';

  const skyPalettes: Record<string, [string, string, string]> = {
    night: ['#0f1c3f', '#1d2d50', '#133b5c'], // deep starry Ghibli night
    dawn:  ['#e3c0d3', '#fbc5b3', '#ffe4c9'], // soft magical pink-orange dawn
    day:   ['#51a2e9', '#86c3f7', '#dbedf8'], // crystal clear blue sky
    dusk:  ['#b05b76', '#e07a5f', '#f4f1de'], // warm nostalgia sunset
  };
  const [s0, s1, s2] = skyPalettes[world.timeOfDay] || skyPalettes.day;

  // Fluffy clouds & fireflies
  const seed = username.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  
  // Fluffy Ghibli clouds (bezier curves)
  const clouds = Array.from({length: 4}, (_, i) => {
    const cy = 60 + i * 45;
    const cx = ((seed * (i + 1) * 311) % 600) - 100;
    const scale = (0.7 + (i % 3) * 0.2).toFixed(2);
    const op = (0.25 + (i % 4) * 0.15).toFixed(2);
    const dur = 40 + i * 15;
    return `
    <g opacity="${op}" style="animation: floatCloud ${dur}s linear infinite; transform-origin: left; transform: translate(${cx}px, ${cy}px) scale(${scale});">
      <path d="M 0,40 Q 20,10 50,20 Q 80,-5 120,15 Q 160,0 180,30 Q 210,40 190,60 Q 190,80 150,80 L 30,80 Q -15,70 0,40 Z" fill="#ffffff" />
    </g>`;
  }).join('');

  // Fireflies (for night/dusk) or dandelion seeds (for day/dawn)
  const floaters = Array.from({length: 25}, (_, i) => {
    const fx = ((seed * (i + 5) * 443) % W).toFixed(1);
    const fy = (120 + ((seed * (i + 7) * 701) % 180)).toFixed(1);
    const r = i % 5 === 0 ? 3 : 1.8;
    const d = ((i * 0.4) % 6).toFixed(1);
    const color = (world.timeOfDay === 'night' || world.timeOfDay === 'dusk') ? '#e9d8a6' : '#ffffff';
    return `<circle class="floater" cx="${fx}" cy="${fy}" r="${r}" fill="${color}" filter="url(#glowSoft)" style="animation-delay:${d}s"/>`;
  }).join('');

  // Overlapping rolling green hills at the horizon (replacing buildings)
  const hills = `
    <!-- Distant Hill -->
    <path d="M -100,280 Q 250,190 600,250 T 1000,270 L 1000,320 L -100,320 Z" fill="#2d4a34" opacity="0.75" />
    <!-- Midground Hill with simple tree shapes -->
    <path d="M -50,290 Q 350,230 750,260 T 1050,295 L 1050,320 L -50,320 Z" fill="#3c6346" />
    <!-- Foreground Grass Slope -->
    <path d="M -20,300 Q 200,260 500,295 T 920,290 L 920,320 L -20,320 Z" fill="#4d7c57" />
  `;

  // Ghibli ivy leaves corner decoration path helper
  const ivyLeaf = (x: number, y: number, rot: number) => `
    <g transform="translate(${x},${y}) rotate(${rot}) scale(0.8)">
      <path d="M0,0 Q-10,-15 0,-25 Q10,-15 0,0" fill="${leafGreen}" />
      <path d="M-4,-8 Q-12,-16 -6,-22" fill="#7ba879" opacity="0.6" />
      <path d="M0,0 L0,-23" stroke="#2d4a34" stroke-width="0.8" />
    </g>
  `;

  // Botanical Panel with Ivy borders and warm dropshadow
  const P = (y: number, h: number, title: string) => {
    const rx = 14, x = 20, w = W - 40;
    return `
<g class="panel">
  <!-- Dropshadow -->
  <rect x="${x + 2}" y="${y + 3}" width="${w}" height="${h}" rx="${rx}" fill="rgba(40,30,20,0.15)"/>
  <!-- Main Box -->
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${creamPaper}" stroke="${darkWood}" stroke-width="2"/>
  <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="${rx - 4}" fill="none" stroke="${borderGold}" stroke-width="1" opacity="0.4" />
  
  <!-- Ivy Corner Decorations -->
  ${ivyLeaf(x + 10, y + 10, -45)}
  ${ivyLeaf(x + w - 10, y + 10, 45)}
  ${ivyLeaf(x + 10, y + h - 10, -135)}
  ${ivyLeaf(x + w - 10, y + h - 10, 135)}

  <!-- Label badge -->
  <rect x="${x + 30}" y="${y - 12}" width="${title.length * 7.5 + 24}" height="24" rx="12" fill="${forestGreen}" stroke="${darkWood}" stroke-width="1.5"/>
  <text x="${x + 42}" y="${y + 4}" font-family="'Outfit', 'Inter', sans-serif" font-size="11.5" fill="#fcfbf7" font-weight="bold" letter-spacing="1.5">${title}</text>
</g>`;
  };

  // Pebble-style soft tech tags
  const skills = [
    { n: 'Kubernetes', bg: '#e8f0fe', fg: '#1a73e8' },
    { n: 'Docker',     bg: '#e1f5fe', fg: '#0288d1' },
    { n: 'TypeScript', bg: '#e8f4fd', fg: '#1976d2' },
    { n: 'Go',         bg: '#e0f7fa', fg: '#0097a7' },
    { n: 'Node.js',    bg: '#e8f5e9', fg: '#2e7d32' },
    { n: 'Terraform',  bg: '#f3e5f5', fg: '#7b1fa2' },
    { n: 'Python',     bg: '#efebe9', fg: '#5d4037' },
    { n: 'AWS',        bg: '#fff3e0', fg: '#e65100' },
    { n: 'Linux',      bg: '#eceff1', fg: '#37474f' },
    { n: 'Grafana',    bg: '#fbe9e7', fg: '#d84315' },
    { n: 'Prometheus', bg: '#ffebee', fg: '#c62828' },
    { n: 'Backstage',  bg: '#e0f2f1', fg: '#00695c' }
  ];
  
  const bxs = [32, 172, 312, 452, 592, 732];
  const BR0 = 694, BR1 = 734;
  const badges = skills.map((s, i) => {
    const bx = bxs[i % 6];
    const by = i < 6 ? BR0 : BR1;
    return `
    <rect x="${bx}" y="${by}" width="134" height="28" rx="14" fill="${s.bg}" stroke="${darkWood}" stroke-width="1" />
    <text x="${bx + 67}" y="${by + 18}" font-family="sans-serif" font-size="11.5" fill="${s.fg}" font-weight="bold" text-anchor="middle">${s.n}</text>
    `;
  }).join('');

  // Cozy journey logs (Quests)
  const quests = [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Journey 🌿', c: '#4caf50' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Journey 🌿', c: '#4caf50' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🏆',      c: '#b2851d' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🏆',      c: '#b2851d' },
    { t: 'Upstream Node.js core exploration',         s: 'Wandering 🏕️',      c: '#0288d1' }
  ];
  const qItems = quests.map((q, i) => {
    const qy = 836 + i * 26;
    return `
    <text x="40" y="${qy}" font-family="sans-serif" font-size="13" fill="${darkWood}">
      <tspan fill="${forestGreen}" font-weight="bold">✦ </tspan>${q.t}
      <tspan dx="10" fill="${q.c}" font-size="10.5" font-weight="bold">[ ${q.s} ]</tspan>
    </text>
    `;
  }).join('');

  // Stat diary entries
  const stats = [
    { icon: '📝', lbl: 'TRAVEL STREAK', val: `${world.streak} days`,    sub: 'committed in a row' },
    { icon: '🌱', lbl: 'SPROUTS GROWN', val: `${world.totalContributions}`, sub: 'total commits' },
    { icon: '🏡', lbl: 'HOME BIOME',    val: t.label,                   sub: `Weather: ${world.weatherType}` }
  ];
  const cardW = 270, cardGap = 25, cardY = 974, cardH = 76;
  const statCards = stats.map((s, i) => {
    const cx = 30 + i * (cardW + cardGap);
    return `
    <g>
      <rect x="${cx + 1}" y="${cardY + 2}" width="${cardW}" height="${cardH}" rx="12" fill="rgba(40,30,20,0.1)"/>
      <rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12" fill="${creamPaper}" stroke="${darkWood}" stroke-width="1.5"/>
      <text x="${cx + 12}" y="${cardY + 20}" font-family="sans-serif" font-size="9" fill="${forestGreen}" font-weight="bold" letter-spacing="1.5">${s.icon}  ${s.lbl}</text>
      <text x="${cx + 12}" y="${cardY + 48}" font-family="sans-serif" font-size="20" fill="${darkWood}" font-weight="bold">${s.val}</text>
      <text x="${cx + 12}" y="${cardY + 65}" font-family="sans-serif" font-size="9.5" fill="${darkWood}" opacity="0.6">${s.sub}</text>
    </g>
    `;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border-radius:18px;overflow:hidden">
  <defs>
    <!-- Soft Dreamy Sky -->
    <linearGradient id="ghSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${s0}"/>
      <stop offset="50%"  stop-color="${s1}"/>
      <stop offset="100%" stop-color="${s2}"/>
    </linearGradient>

    <!-- Soft glow for dandelion/fireflies -->
    <filter id="glowSoft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- ═══ SKY BACKDROP ═══ -->
  <rect width="${W}" height="${H}" fill="url(#ghSky)"/>
  
  <!-- Dreamy floating clouds -->
  ${clouds}
  
  <!-- Floating fireflies or dandelion seeds -->
  ${floaters}

  <!-- ═══ HORIZON GREEN HILLS ═══ -->
  ${hills}
  <rect x="0" y="306" width="${W}" height="10" fill="#4d7c57" />

  <!-- ═══ HERO HEADER ═══ -->
  <!-- Hand-drawn style soft board behind title -->
  <g transform="translate(150, 336)">
    <rect x="1" y="2" width="600" height="114" rx="16" fill="rgba(40, 30, 20, 0.15)"/>
    <rect x="0" y="0" width="600" height="114" rx="16" fill="${creamPaper}" stroke="${darkWood}" stroke-width="2"/>
    <rect x="4" y="4" width="592" height="106" rx="12" fill="none" stroke="${borderGold}" stroke-width="1" opacity="0.3" />
    
    <!-- Decorative vine framing the header -->
    <path d="M 20,15 Q 120,5 300,10 T 580,15" fill="none" stroke="${forestGreen}" stroke-width="1.2" />
    <path d="M 20,95 Q 120,105 300,100 T 580,95" fill="none" stroke="${forestGreen}" stroke-width="1.2" />

    <text x="300" y="52" font-family="'Outfit', sans-serif" font-size="34" fill="${darkWood}" text-anchor="middle" font-weight="bold">Hi, I'm Dasmat 🌿</text>
    <text x="300" y="80" font-family="sans-serif" font-size="13.5" fill="${darkWood}" opacity="0.75" text-anchor="middle" letter-spacing="0.5">
      DevOps Explorer  ·  Full-Stack Software Developer  ·  Open Source Contributor
    </text>
    
    ${ivyLeaf(14, 14, 45)}
    ${ivyLeaf(586, 14, -45)}
  </g>

  <!-- ═══ ABOUT ME PANEL y=468 h=118 ═══ -->
  ${P(468, 118, '🌿  ABOUT THE TRAVELER')}
  <text x="40" y="505" font-family="sans-serif" font-size="13.5" fill="${darkWood}">
    🌱  <tspan font-weight="bold" fill="${forestGreen}">Core Interests:</tspan> Infrastructure automation, Cloud-Native scaling, Self-healing architectures
  </text>
  <text x="40" y="531" font-family="sans-serif" font-size="13.5" fill="${darkWood}">
    🍃  <tspan font-weight="bold" fill="${forestGreen}">Contributing To:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="40" y="557" font-family="sans-serif" font-size="13.5" fill="${darkWood}">
    📬  <tspan font-weight="bold" fill="${forestGreen}">Contact:</tspan> mey37056@gmail.com   ·   ⚡  Experiments daily with automated recovery pipelines
  </text>

  <!-- ═══ WORLD STATE BAR y=600 h=50 ═══ -->
  ${P(600, 50, '🏡  CURRENT ENVIRONMENT LOG')}
  <text x="${W/2}" y="632" font-family="sans-serif" font-size="13.5" fill="${darkWood}" text-anchor="middle" font-weight="bold">
    🌳 Biome: <tspan fill="${forestGreen}">${t.label}</tspan>
    <tspan dx="15" fill="${darkWood}" opacity="0.3">|</tspan>
    <tspan dx="15">🕰️ Time: <tspan fill="${forestGreen}">${world.timeOfDay}</tspan></tspan>
    <tspan dx="15" fill="${darkWood}" opacity="0.3">|</tspan>
    <tspan dx="15">🌦️ Weather: <tspan fill="${forestGreen}">${world.weatherType}</tspan></tspan>
    <tspan dx="15" fill="${darkWood}" opacity="0.3">|</tspan>
    <tspan dx="15">🎒 Streak: <tspan fill="${forestGreen}">${world.streak} days</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK PANEL y=664 h=118 ═══ -->
  ${P(664, 118, '🎒  PACKED GEAR (TECH STACK)')}
  ${badges}

  <!-- ═══ ACTIVE QUESTS PANEL y=796 h=162 ═══ -->
  ${P(796, 162, '🗺️  CURRENT JOURNEY (ACTIVE QUESTS)')}
  ${qItems}

  <!-- ═══ STATS HUD y=974 h=76 ═══ -->
  ${statCards}

  <!-- Cozy bottom footer -->
  <text x="${W/2}" y="${H - 10}" font-family="sans-serif" font-size="10" fill="${darkWood}" opacity="0.45" text-anchor="middle" letter-spacing="1">
    🌾  Harvested daily by GitWorld Engine  ·  github.com/Dasmat13/git-world-action  🌾
  </text>

  <style>
    .floater {
      animation: floatUp 8s ease-in-out infinite alternate;
    }
    @keyframes floatUp {
      0% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
      50% { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
      100% { transform: translateY(-30px) translateX(-5px); opacity: 0.3; }
    }
    @keyframes floatCloud {
      0% { transform: translateX(-220px); }
      100% { transform: translateX(${W}px); }
    }
  </style>
</svg>`;
}
