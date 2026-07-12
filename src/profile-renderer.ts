import { WorldData } from './world';

const W = 900, H = 1080;

export function renderProfileCard(world: WorldData): string {
  const t   = world.biomeTheme;
  const ac  = t.buildingBase;
  const ac2 = t.buildingAccent;
  const tx  = t.starColor;
  const seed = world.username.split('').reduce((a,c) => a + c.charCodeAt(0), 0);

  const skyPal: Record<string,[string,string,string]> = {
    night: ['#010408','#060d1f','#0d1a3a'],
    dawn:  ['#0d0520','#6b1f4a','#e8571a'],
    day:   [t.skyTop, t.skyBottom, t.groundColor],
    dusk:  ['#0d0220','#5b0e6e','#b91c1c'],
  };
  const [s0,s1,s2] = skyPal[world.timeOfDay];
  const isSun = world.timeOfDay === 'day' || world.timeOfDay === 'dawn';

  // Stars
  const stars = Array.from({length:70}, (_,i) => {
    const x  = ((seed*(i+1)*997)%W).toFixed(1);
    const y  = ((seed*(i+1)*1009)%255).toFixed(1);
    const r  = i%7===0 ? 2 : i%3===0 ? 1.2 : 0.7;
    const d  = ((i*0.28)%5).toFixed(1);
    return `<circle class="star" cx="${x}" cy="${y}" r="${r}" fill="${tx}" style="animation-delay:${d}s"/>`;
  }).join('');

  // Skyline
  const skyline = world.columns.slice(0,52).map((col,i) => {
    if (col.tileType === 'grass') return '';
    const cw = W/52, bh = col.height*0.42;
    const bx = (i*cw).toFixed(1), by = (300-bh).toFixed(1);
    return `<rect x="${bx}" y="${by}" width="${(cw-1.5).toFixed(1)}" height="${bh.toFixed(1)}" fill="${ac2}" opacity="0.5" rx="1"/>`;
  }).join('');

  // Panel helper — correct y label position
  const P = (y:number,h:number,lbl:string) => {
    const r=10, x=18, w=W-36;
    return `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#pg)" stroke="url(#bg)" stroke-width="1.5"/>
<rect x="${x+1}" y="${y+1}" width="${w-2}" height="2" rx="1" fill="${ac}" opacity="0.2"/>
<path d="M${x+r},${y} L${x},${y} L${x},${y+r}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.6"/>
<path d="M${x+w-r},${y} L${x+w},${y} L${x+w},${y+r}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.6"/>
<path d="M${x},${y+h-r} L${x},${y+h} L${x+r},${y+h}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.6"/>
<path d="M${x+w},${y+h-r} L${x+w},${y+h} L${x+w-r},${y+h}" stroke="${ac}" stroke-width="2" fill="none" opacity="0.6"/>
<rect x="36" y="${y-10}" width="${lbl.length*7+18}" height="20" rx="4" fill="${ac2}"/>
<text x="44" y="${y+4}" font-family="monospace" font-size="10" fill="${ac}" font-weight="bold" letter-spacing="2">${lbl}</text>`;
  };

  // Badges — 6 per row, explicit coords
  const skills = [
    {n:'Kubernetes',c:'#326CE5'},{n:'Docker',c:'#2496ED'},
    {n:'TypeScript',c:'#3178C6'},{n:'Go',c:'#00ADD8'},
    {n:'Node.js',c:'#339933'},{n:'Terraform',c:'#7B42BC'},
    {n:'Python',c:'#3776AB'},{n:'AWS',c:'#FF9900'},
    {n:'Linux',c:'#c8a000'},{n:'Grafana',c:'#F46800'},
    {n:'Prometheus',c:'#E6522C'},{n:'Backstage',c:'#36BAA2'},
  ];
  // Tech panel: y=668, h=128 → y=796
  // Badge rows: y=693 and y=733 (after 25px label area, 30px badge, 10px gap, 30px badge)
  const BW=132, BH=30, BR0=693, BR1=733;
  const bxs = [28,170,312,454,596,738];
  const badges = skills.map((s,i) => {
    const bx = bxs[i%6], by = i<6 ? BR0 : BR1;
    return `
<rect x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="6" fill="${s.c}" opacity="0.88"/>
<rect x="${bx}" y="${by}" width="${BW}" height="3" rx="3" fill="rgba(255,255,255,0.25)"/>
<text x="${bx+BW/2}" y="${by+20}" font-family="monospace" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">${s.n}</text>`;
  }).join('');

  // Quests — panel y=808 h=162 → y=970
  // Items at y: 835,858,881,904,927,950
  const quests = [
    {t:'Topology-aware scheduling — kubernetes-sigs/lws',s:'IN PROGRESS',c:'#3fb950'},
    {t:'CompositePodGroup integration — KEP-893',       s:'IN PROGRESS',c:'#3fb950'},
    {t:'GitWorld Engine — GitHub profile as pixel world',s:'SHIPPED ✓',  c:'#ffd700'},
    {t:'Real-time weather via Open-Meteo',               s:'SHIPPED ✓',  c:'#ffd700'},
    {t:'Node.js core contributions',                     s:'EXPLORING',  c:'#58a6ff'},
    {t:'Backstage plugin ecosystem',                     s:'EXPLORING',  c:'#58a6ff'},
  ];
  const qItems = quests.map((q,i) => {
    const qy = 835 + i*23;
    return `<text x="34" y="${qy}" font-family="monospace" font-size="12.5" fill="${tx}">▶  ${q.t}  <tspan fill="${q.c}" font-size="10" font-weight="bold">[ ${q.s} ]</tspan></text>`;
  }).join('');

  // Stats — y=984, h=72, 4 cards
  const stats = [
    {icon:'🔥',lbl:'STREAK',      val:`${world.streak}d`,             sub:'contribution days'},
    {icon:'🏗️',lbl:'COMMITS',     val:`${world.totalContributions}`,  sub:'total contributions'},
    {icon:'🌍',lbl:'BIOME',        val:t.label,                        sub:world.timeOfDay},
    {icon:'🌦️',lbl:'WEATHER',      val:world.weatherType.toUpperCase(),sub:'live via Open-Meteo'},
  ];
  const cardW=205, cardGap=15, cardY=984, cardH=72;
  const statCards = stats.map((s,i) => {
    const cx = 20 + i*(cardW+cardGap);
    return `
<rect x="${cx}" y="${cardY}" width="${cardW}" height="${cardH}" rx="8" fill="url(#pg)" stroke="${ac2}" stroke-width="1"/>
<rect x="${cx}" y="${cardY}" width="${cardW}" height="2" rx="1" fill="${ac}" opacity="0.35"/>
<path d="M${cx+8},${cardY} L${cx},${cardY} L${cx},${cardY+8}" stroke="${ac}" stroke-width="1.5" fill="none" opacity="0.5"/>
<path d="M${cx+cardW},${cardY+8} L${cx+cardW},${cardY} L${cx+cardW-8},${cardY}" stroke="${ac}" stroke-width="1.5" fill="none" opacity="0.5"/>
<text x="${cx+10}" y="${cardY+20}" font-family="monospace" font-size="9" fill="${tx}" opacity="0.5" letter-spacing="2">${s.icon}  ${s.lbl}</text>
<text x="${cx+10}" y="${cardY+48}" font-family="monospace" font-size="20" fill="${ac}" font-weight="bold">${s.val}</text>
<text x="${cx+10}" y="${cardY+64}" font-family="monospace" font-size="9" fill="${tx}" opacity="0.4">${s.sub}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="border-radius:16px;overflow:hidden">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="${s0}"/>
    <stop offset="38%"  stop-color="${s1}"/>
    <stop offset="100%" stop-color="${s2}"/>
  </linearGradient>
  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(8,14,28,0.90)"/>
    <stop offset="100%" stop-color="rgba(4,8,18,0.75)"/>
  </linearGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%"   stop-color="${ac}"  stop-opacity="0.7"/>
    <stop offset="50%"  stop-color="${ac2}" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="${ac}"  stop-opacity="0.6"/>
  </linearGradient>
  <filter id="glow"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="tg"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <pattern id="scan" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
    <rect width="1" height="1" fill="rgba(0,0,0,0.07)"/>
  </pattern>
</defs>

<!-- BG -->
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#scan)" opacity="0.6"/>

<!-- Stars -->
${stars}

<!-- Celestial -->
<g filter="url(#glow)">
  <circle r="${isSun?20:14}" fill="${isSun?'#f5d060':'#c8d8f0'}">
    <animateMotion dur="45s" repeatCount="indefinite" path="M -30,280 Q ${W/2},-30 ${W+30},280"/>
  </circle>
</g>

<!-- Skyline -->
${skyline}
<rect x="0" y="300" width="${W}" height="18" fill="${t.groundColor}" opacity="0.7"/>
<rect x="0" y="300" width="${W}" height="2"  fill="${t.groundLine}"  opacity="0.9"/>

<!-- ══ HERO ══════════════════════════════════════════════ -->
<rect x="0" y="322" width="${W}" height="142" fill="rgba(0,0,0,0.30)"/>
<rect x="0" y="322" width="${W}" height="1.5" fill="${ac}" opacity="0.25"/>
<rect x="0" y="463" width="${W}" height="1.5" fill="${ac}" opacity="0.15"/>

<text x="${W/2}" y="352" font-family="monospace" font-size="10" fill="${tx}" text-anchor="middle" opacity="0.45" letter-spacing="8">✦  PLAYER ONE  ✦</text>

<text class="hn" x="${W/2}" y="418" font-family="monospace" font-size="50" fill="${ac}" text-anchor="middle" font-weight="bold" filter="url(#tg)">Hi! I'm Dasmat 👋</text>

<text x="${W/2}" y="450" font-family="monospace" font-size="13" fill="${tx}" text-anchor="middle" opacity="0.8">DevOps &amp; Cloud-Native Explorer  ·  Full-Stack Dev  ·  Open Source Contributor</text>

<rect class="cur" x="${W/2+198}" y="426" width="12" height="3" fill="${ac}"/>

<line x1="80" y1="462" x2="${W-80}" y2="462" stroke="${ac}" stroke-width="0.6" opacity="0.25"/>
<circle cx="80"     cy="462" r="2.5" fill="${ac}" opacity="0.35"/>
<circle cx="${W-80}" cy="462" r="2.5" fill="${ac}" opacity="0.35"/>

<!-- ══ ABOUT ME panel y=478 h=116 ════════════════════════ -->
${P(478,116,'◈ ABOUT ME')}
<text x="34" y="507" font-family="monospace" font-size="13" fill="${tx}">🚀  <tspan fill="${ac}">Core:</tspan>  DevOps automation · Cloud-Native architecture · Full-stack Web Development</text>
<text x="34" y="531" font-family="monospace" font-size="13" fill="${tx}">🌱  <tspan fill="${ac}">Contributing:</tspan>  Kubernetes SIGs · Node.js Core · Express.js · Backstage</text>
<text x="34" y="555" font-family="monospace" font-size="13" fill="${tx}">📫  mey37056@gmail.com  ·  ⚡  Container orchestration &amp; automated healing systems</text>

<!-- ══ WORLD STATE panel y=608 h=54 ══════════════════════ -->
${P(608,54,'◈ WORLD STATE')}
<text x="${W/2}" y="632" font-family="monospace" font-size="13" fill="${tx}" text-anchor="middle">🌍 <tspan fill="${ac}" font-weight="bold">${t.label}</tspan><tspan dx="18" fill="${tx}" opacity="0.4">|</tspan><tspan dx="18">🌙 <tspan fill="${ac}" font-weight="bold">${world.timeOfDay}</tspan></tspan><tspan dx="18" fill="${tx}" opacity="0.4">|</tspan><tspan dx="18">🌦️ <tspan fill="${ac}" font-weight="bold">${world.weatherType}</tspan></tspan><tspan dx="18" fill="${tx}" opacity="0.4">|</tspan><tspan dx="18">🔥 <tspan fill="${ac}" font-weight="bold">${world.streak}d</tspan></tspan><tspan dx="18" fill="${tx}" opacity="0.4">|</tspan><tspan dx="18">🏗️ <tspan fill="${ac}" font-weight="bold">${world.totalContributions}</tspan></tspan></text>

<!-- ══ TECH STACK panel y=676 h=128 ═════════════════════ -->
${P(676,128,'◈ TECH STACK')}
${badges}

<!-- ══ ACTIVE QUESTS panel y=818 h=154 ══════════════════ -->
${P(818,154,'◈ ACTIVE QUESTS')}
${qItems}

<!-- ══ STATS HUD ══════════════════════════════════════════ -->
${statCards}

<!-- Footer -->
<rect x="0" y="${H-22}" width="${W}" height="22" fill="rgba(0,0,0,0.55)"/>
<text x="${W/2}" y="${H-8}" font-family="monospace" font-size="9" fill="${tx}" text-anchor="middle" opacity="0.3" letter-spacing="1">✦  GitWorld Engine  ·  github.com/Dasmat13/git-world-action  ·  Updates daily  ✦</text>

<style>
.star{animation:tw 3s ease-in-out infinite alternate}
@keyframes tw{0%{opacity:.1}100%{opacity:.9}}
.hn{animation:np 5s ease-in-out infinite alternate}
@keyframes np{0%{opacity:.88}100%{opacity:1}}
.cur{animation:bl 1s step-end infinite}
@keyframes bl{0%,100%{opacity:1}50%{opacity:0}}
</style>
</svg>`;
}
