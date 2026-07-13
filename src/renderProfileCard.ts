import { WorldData } from './world';
import { renderDefs } from './core/defs';
import { compileCSSAnimations } from './core/animation';

// Scene Layers
import { renderSky } from './scene/sky';
import { renderStars } from './scene/stars';
import { renderSunMoon } from './scene/sunMoon';
import { renderClouds } from './scene/clouds';
import { renderMountains } from './scene/mountains';
import { renderMonastery } from './scene/monastery';
import { renderRoads } from './scene/roads';
import { renderTerrain } from './scene/terrain';
import { renderVegetation } from './scene/vegetation';
import { renderRiver } from './scene/river';
import { renderWildlife } from './scene/wildlife';
import { renderParticles } from './scene/particles';

// UI Layers
import { renderHero } from './ui/hero';
import { renderAbout } from './ui/about';
import { renderTech } from './ui/tech';
import { renderStats } from './ui/stats';
import { renderQuests } from './ui/quests';
import { renderContribution } from './ui/contribution';
import { renderFooter } from './ui/footer';

/**
 * Main rendering orchestrator that compiles the full 960x1440 animated Spiti Valley SVG.
 * 
 * @param world Current environmental world data.
 * @returns Fully generated self-contained SVG string.
 */
export function renderProfileCard(world: WorldData): string {
  const activeTime = world.timeOfDay;
  
  // Defs (Gradients and filters)
  const defs = renderDefs(activeTime);
  
  // Animations compiler (CSS styling)
  const cssStyles = compileCSSAnimations();

  // Scene vectors
  const sky = renderSky(world);
  const stars = renderStars(world);
  const sunMoon = renderSunMoon(world);
  const clouds = renderClouds(world);
  const mountains = renderMountains(world);
  const monastery = renderMonastery(world);
  const roads = renderRoads(world);
  const river = renderRiver(world);
  const terrain = renderTerrain(world);
  const vegetation = renderVegetation(world);
  const wildlife = renderWildlife(world);
  const particles = renderParticles(world);

  // UI Panels
  const hero = renderHero(world);
  const about = renderAbout(world);
  const tech = renderTech(world);
  const stats = renderStats(world);
  const quests = renderQuests(world);
  const contribution = renderContribution(world);
  const footer = renderFooter(world);

  return `
<svg width="960" height="1440" viewBox="0 0 960 1440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitWorld Expedition Profile Card">
  <style>
    <![CDATA[
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@900&family=Inter:wght@500;600;700&family=JetBrains+Mono:wght@700&display=swap');
    
    ${cssStyles}
    ]]>
  </style>

  ${defs}

  <!-- 1. Sky & Outer Atmosphere Layer -->
  <g id="scene-sky">
    ${sky}
  </g>
  
  <!-- 2. Stars & Milky Way -->
  <g id="scene-stars">
    ${stars}
  </g>

  <!-- 3. Celestial disc -->
  <g id="scene-celestial">
    ${sunMoon}
  </g>

  <!-- 4. Upper Atmosphere Clouds -->
  <g id="scene-clouds">
    ${clouds}
  </g>

  <!-- 5. Distant and Foreground Mountain Peaks -->
  <g id="scene-mountains">
    ${mountains}
  </g>

  <!-- 6. Key Monastery complex built on top of rock shelves -->
  <g id="scene-monastery">
    ${monastery}
  </g>

  <!-- 7. Rocky Terrain Slopes, cliffs & boulders -->
  <g id="scene-terrain">
    ${terrain}
  </g>

  <!-- 8. Winding Mountain Road -->
  <g id="scene-roads">
    ${roads}
  </g>

  <!-- 9. Glacial Spiti River, banks & wooden footbridge -->
  <g id="scene-river">
    ${river}
  </g>

  <!-- 10. Vegetation Poplars & high-altitude grass -->
  <g id="scene-vegetation">
    ${vegetation}
  </g>

  <!-- 11. Wildlife (Circling eagles, blue sheep, marmots) -->
  <g id="scene-wildlife">
    ${wildlife}
  </g>

  <!-- 12. Weather particles falling & campfires -->
  <g id="scene-particles">
    ${particles}
  </g>

  <!-- 13. Glassmorphic User Interface Elements (Vision Pro floating panels) -->
  <g id="ui-overlay">
    ${hero}
    ${contribution}
    ${about}
    ${stats}
    ${tech}
    ${quests}
    ${footer}
  </g>
</svg>`;
}
