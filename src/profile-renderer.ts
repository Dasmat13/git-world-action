import { WorldData } from './world';
import { ProfileConfig } from './types';
import { DEFAULT_PROFILE_CONFIG } from './config';
import { getPalette } from './theme';
import { compileCSSVariables, renderSMILVariables } from './animation';
import { escapeXml } from './utils/xml-sanitizer';

// Import scene layers
import {
  renderSkyLayer,
  renderMountainsLayer,
  renderMonasteryLayer,
  renderValleyLayer,
  renderVegetationLayer,
  renderWeatherLayer,
  renderFlagsLayer
} from './layers';

// Import UI panels
import {
  renderGlassPanel,
  renderSkillsGrid,
  renderQuestsList,
  renderStatCards,
  renderHeaderPanel,
  renderAboutPanel
} from './panels';

const W = 960, H = 1440;

/**
 * Main coordinating builder function that compiles and renders the GitWorld Spiti Valley profile card.
 * Integrates procedural scenic layers, custom-themed UI panels, accessibility tags, and optimized
 * day/night cycle animations.
 * 
 * @param world Active GitWorld environment data from github actions.
 * @param config Custom layout configurations (optional).
 * @returns Self-contained valid SVG string.
 */
export function renderProfileCard(world: WorldData, config?: Partial<ProfileConfig>): string {
  // Validate timeOfDay exists in the theme registry
  const theme = getPalette(world.timeOfDay);
  const username = world.username;

  // Merge custom config overlays on top of the layout defaults
  const mergedConfig: ProfileConfig = {
    ...DEFAULT_PROFILE_CONFIG,
    ...config
  };

  const safeUsername = escapeXml(username);
  const safeTitleLabel = escapeXml(world.biomeTheme.label);
  const safeContact = escapeXml(mergedConfig.contact);
  const safeEmail = escapeXml(mergedConfig.email);
  const safeRepoLink = escapeXml(mergedConfig.repoLink);

  // Compile Dynamic Cycle Animations
  const cssVariablesStyles = compileCSSVariables(world.timeOfDay);
  const smilVariablesRoot = renderSMILVariables(world.timeOfDay);

  // Resolve stat HUD cards using config callback
  const statsList = mergedConfig.stats ? mergedConfig.stats(world) : DEFAULT_PROFILE_CONFIG.stats!(world);

  return `<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${W} ${H}" 
     width="${W}" 
     height="${H}" 
     role="img" 
     aria-label="GitWorld Profile Card for ${safeUsername}"
     style="border: 1.2px solid rgba(255,255,255,0.2); border-radius: 18px; overflow: hidden;">
  <title>GitWorld Profile Card - Spiti Valley Theme</title>
  <desc>An animated glassmorphic profile card displaying GitHub contribution details for ${safeUsername} set against a Spiti Valley landscape.</desc>

  <defs>
    <!-- Sky cyclic gradient utilizing animated custom properties -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="var(--sky-top)" />
      <stop offset="100%" stop-color="var(--sky-bot)" />
    </linearGradient>
  </defs>

  <!-- Centralized animation custom properties driver -->
  ${smilVariablesRoot}

  <!-- ═══ SCENIC LAYERS ═══ -->
  ${renderSkyLayer(world, mergedConfig)}
  ${renderValleyLayer(world, mergedConfig)}
  ${renderMountainsLayer(world, mergedConfig)}
  ${renderMonasteryLayer(world, mergedConfig)}
  ${renderVegetationLayer(world, mergedConfig)}
  ${renderFlagsLayer(world, mergedConfig)}
  ${renderWeatherLayer(world, mergedConfig)}

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

  <!-- ═══ GREETING & DETAILS UI PANELS ═══ -->
  ${renderHeaderPanel(mergedConfig)}
  ${renderAboutPanel(mergedConfig)}

  <!-- ═══ WORLD STATE BAR ═══ -->
  ${renderGlassPanel(690, 70, '🏡  CURRENT ENVIRONMENT LOG', '#4EC7E8')}
  <text x="${W / 2}" y="732" font-family="'Space Grotesk', sans-serif" font-size="13.5" fill="#0f172a" text-anchor="middle" font-weight="900">
    🌳 BIOME: <tspan fill="#0f172a" font-weight="900">${safeTitleLabel.toUpperCase()}</tspan>
    <tspan dx="15" fill="#0f172a" opacity="0.25">|</tspan>
    <tspan dx="15">🕰️ TIME: <tspan fill="#0ea5e9">${world.timeOfDay.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#0f172a" opacity="0.25">|</tspan>
    <tspan dx="15">🌦️ WEATHER: <tspan fill="#8b5cf6">${world.weatherType.toUpperCase()}</tspan></tspan>
    <tspan dx="15" fill="#0f172a" opacity="0.25">|</tspan>
    <tspan dx="15">🎒 STREAK: <tspan fill="#d97706">${world.streak} DAYS</tspan></tspan>
  </text>

  <!-- ═══ TECH STACK GEAR ═══ -->
  ${renderGlassPanel(800, 190, '🎒  PACKED GEAR (TECH STACK)', '#4EC7E8')}
  ${renderSkillsGrid(mergedConfig.skills)}

  <!-- ═══ ACTIVE JOURNEYS ═══ -->
  ${renderGlassPanel(1030, 240, '🗺️  CURRENT JOURNEY (ACTIVE QUESTS)', '#4EC7E8')}
  ${renderQuestsList(mergedConfig.quests)}

  <!-- ═══ STATS HUD CARDS ═══ -->
  ${renderStatCards(statsList)}

  <!-- Soft bottom footer -->
  <text x="${W / 2}" y="${H - 12}" font-family="'Space Grotesk', sans-serif" font-size="10.5" fill="#334155" font-weight="800" text-anchor="middle" letter-spacing="1">
    ⚡  HARVESTED DAILY BY GITWORLD ENGINE  ·  ${safeRepoLink.toUpperCase()}  ⚡
  </text>

  <style>
    /* Daylight Cycle Keyframes compilation injection */
    ${cssVariablesStyles}

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
    
    /* Weather particle animations */
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
      0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(1460px) rotate(360deg); opacity: 0; }
    }
    @keyframes fallRain {
      0%   { transform: translateY(0) scaleY(1); opacity: 0.8; }
      100% { transform: translateY(1460px) scaleY(1.5); opacity: 0; }
    }
    @keyframes fallDust {
      0%   { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
      10%  { opacity: 0.65; }
      90%  { opacity: 0.65; }
      100% { transform: translateY(1460px) translateX(-200px) scale(1.2); opacity: 0; }
    }

    /* Accessibility fallback checking user's reduced-motion preference */
    @media (prefers-reduced-motion: reduce) {
      .sun, .pine, .pine-delay, .flags-wave, .twinkle, .marquee text, 
      .flying-bird, .flying-bird-delay, .floating-cloud, .snow, .raindrop, .dust {
        animation: none !important;
        transform: none !important;
        transition: none !important;
      }
    }
  </style>
</svg>`;
}
