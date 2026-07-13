import { WorldData } from './world';

const W = 900, H = 1080;

export function renderProfileCard(world: WorldData): string {
  const t   = world.biomeTheme;
  const username = world.username;

  // Pattern-based dot grid background helper for Neobrutalist look
  const seed = username.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  
  // Vector retro stars (floating objects replacing clouds/fireflies)
  const floaters = Array.from({length: 15}, (_, i) => {
    const sx = ((seed * (i + 5) * 443) % W);
    const sy = (30 + ((seed * (i + 7) * 701) % 200));
    const r = (i % 3 === 0) ? 14 : 9;
    // Draw 4-pointed Neobrutalist stars
    return `<path d="M ${sx},${sy - r} Q ${sx},${sy} ${sx + r},${sy} Q ${sx},${sy} ${sx},${sy + r} Q ${sx},${sy} ${sx - r},${sy} Q ${sx},${sy} ${sx},${sy - r} Z" fill="#000000" opacity="0.8" />`;
  }).join('');

  // Stepped neobrutalist separator lines (replacing green Ghibli hills at Y=280)
  const separators = `
    <!-- Top divider line -->
    <line x1="0" y1="280" x2="900" y2="280" stroke="#000000" stroke-width="4" />
    <!-- Cyan separator band -->
    <rect x="0" y="280" width="900" height="20" fill="#38bdf8" stroke="#000000" stroke-width="3" />
    <!-- Yellow separator band -->
    <rect x="0" y="300" width="900" height="20" fill="#facc15" stroke="#000000" stroke-width="3" />
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
  const BR0 = 694, BR1 = 734;
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

  // Quest lines as Neobrutalist lists with custom status pills
  const quests = [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Journey 🌿', bg: '#4ade80' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Journey 🌿', bg: '#4ade80' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🏆',      bg: '#facc15' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🏆',      bg: '#facc15' },
    { t: 'Upstream Node.js core exploration',         s: 'Wandering 🏕️',      bg: '#38bdf8' }
  ];
  const qItems = quests.map((q, i) => {
    const qy = 836 + i * 26;
    return `
    <g transform="translate(40, ${qy - 12})">
      <!-- Bullet diamond -->
      <rect x="0" y="0" width="8" height="8" fill="#000000" transform="rotate(45 4 4)" />
      <text x="20" y="9" font-family="'Inter', sans-serif" font-size="13" fill="#000000" font-weight="700">
        ${q.t}
      </text>
      
      <!-- Status pill badge -->
      <g transform="translate(680, -4)">
        <rect x="0" y="0" width="120" height="18" rx="4" fill="${q.bg}" stroke="#000000" stroke-width="1.5" />
        <text x="60" y="12" font-family="'Space Grotesk', sans-serif" font-size="9.5" fill="#000000" font-weight="900" text-anchor="middle">
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
  const cardW = 270, cardGap = 25, cardY = 974, cardH = 76;
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

  <!-- ═══ BASE BACKDROP ═══ -->
  <rect width="${W}" height="${H}" fill="#f6f5f0"/>
  <rect width="${W}" height="${H}" fill="url(#dotGrid)"/>
  
  <!-- Retro floating vector stars -->
  ${floaters}

  <!-- ═══ DIVIDERS ═══ -->
  ${separators}

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

  <!-- ═══ ABOUT ME PANEL y=468 h=118 ═══ -->
  ${P(468, 118, '⚡  ABOUT THE TRAVELER', '#38bdf8')}
  <text x="40" y="505" font-family="'Inter', sans-serif" font-size="13.5" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CORE INTERESTS:</tspan> Infrastructure automation, Cloud-Native scaling, Self-healing architectures
  </text>
  <text x="40" y="531" font-family="'Inter', sans-serif" font-size="13.5" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CONTRIBUTING TO:</tspan> Kubernetes SIGs, Node.js Core, Express.js, Backstage Ecosystem
  </text>
  <text x="40" y="557" font-family="'Inter', sans-serif" font-size="13.5" fill="#000000" font-weight="700">
    ⚡  <tspan font-weight="900" fill="#facc15" stroke="#000000" stroke-width="0.5">CONTACT:</tspan> dasmath06@gmail.com   ·   ⚡  Experiments daily with automated recovery pipelines
  </text>

  <!-- ═══ WORLD STATE BAR y=600 h=50 ═══ -->
  ${P(600, 50, '🏡  CURRENT ENVIRONMENT LOG', '#f472b6')}
  <text x="${W/2}" y="632" font-family="'Space Grotesk', sans-serif" font-size="13.5" fill="#000000" text-anchor="middle" font-weight="900">
    🌳 BIOME: <tspan fill="#000000" font-weight="900">${t.label.toUpperCase()}</tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🕰️ TIME: <tspan fill="#38bdf8">${world.timeOfDay.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🌦️ WEATHER: <tspan fill="#a855f7">${world.weatherType.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#000000" opacity="0.3">|</tspan>
    <tspan dx="15">🎒 STREAK: <tspan fill="#fbbf24">${world.streak} DAYS</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK PANEL y=664 h=118 ═══ -->
  ${P(664, 118, '🎒  PACKED GEAR (TECH STACK)', '#4ade80')}
  ${badges}

  <!-- ═══ ACTIVE QUESTS PANEL y=796 h=162 ═══ -->
  ${P(796, 162, '🗺️  CURRENT JOURNEY (ACTIVE QUESTS)', '#c084fc')}
  ${qItems}

  <!-- ═══ STATS HUD y=974 h=76 ═══ -->
  ${statCards}

  <!-- Neobrutalist bottom footer -->
  <text x="${W/2}" y="${H - 12}" font-family="'Space Grotesk', sans-serif" font-size="10.5" fill="#000000" font-weight="800" text-anchor="middle" letter-spacing="1">
    ⚡  HARVESTED DAILY BY GITWORLD ENGINE  ·  GITHUB.COM/DASMAT13/GIT-WORLD-ACTION  ⚡
  </text>
</svg>`;
}
