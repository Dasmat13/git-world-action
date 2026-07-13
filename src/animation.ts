import { TimeOfDay } from './world';
import { themePalettes } from './theme';
import { BiomePalette } from './types';

/**
 * Returns a semicolon-joined string of animated values for a 90-second loop.
 * Resolves values chronologically starting from the active time of day.
 * 
 * @param activeTime Current active time of day.
 * @param getter Callback resolver to extract the correct color string from the palette.
 * @returns Semicolon-joined values list.
 */
export function cyclicAnimateValues(
  activeTime: TimeOfDay,
  getter: (p: BiomePalette) => string
): string {
  const states: TimeOfDay[] = ['day', 'dusk', 'night', 'dawn'];
  const activeIdx = states.indexOf(activeTime) === -1 ? 0 : states.indexOf(activeTime);
  
  const values: string[] = [];
  for (let i = 0; i < 4; i++) {
    const state = states[(activeIdx + i) % 4];
    const palette = themePalettes[state];
    values.push(getter(palette));
  }
  values.push(values[0]); // Complete loop back to start state
  return values.join(';');
}

/**
 * Generates the CSS variable animation definitions.
 * 
 * @param activeTime Current active time of day.
 * @returns Keyframes CSS string.
 */
export function compileCSSVariables(activeTime: TimeOfDay): string {
  const skyTop = cyclicAnimateValues(activeTime, p => p.sky[0]).split(';');
  const skyBot = cyclicAnimateValues(activeTime, p => p.sky[p.sky.length - 1]).split(';');
  const sun = cyclicAnimateValues(activeTime, p => p.sunColor).split(';');
  const mt1 = cyclicAnimateValues(activeTime, p => p.mountainFill1).split(';');
  const mt2 = cyclicAnimateValues(activeTime, p => p.mountainFill2).split(';');
  const hill1 = cyclicAnimateValues(activeTime, p => p.hill1).split(';');
  const hill2 = cyclicAnimateValues(activeTime, p => p.hill2).split(';');
  const hill3 = cyclicAnimateValues(activeTime, p => p.hill3).split(';');
  const water = cyclicAnimateValues(activeTime, p => p.waterColor).split(';');

  const steps = [0, 25, 50, 75, 100];
  const frameCSS = steps.map((pct, idx) => {
    return `
      ${pct}% {
        --sky-top: ${skyTop[idx]};
        --sky-bot: ${skyBot[idx]};
        --sun-color: ${sun[idx]};
        --mt1: ${mt1[idx]};
        --mt2: ${mt2[idx]};
        --hill1: ${hill1[idx]};
        --hill2: ${hill2[idx]};
        --hill3: ${hill3[idx]};
        --water: ${water[idx]};
      }`;
  }).join('\n');

  return `
    :root {
      animation: daylightCycle 90s linear infinite;
    }
    @keyframes daylightCycle {
      ${frameCSS}
    }
  `;
}

/**
 * Renders a hidden group with SMIL animations targeting CSS custom properties.
 * 
 * @param activeTime Current active time of day.
 * @returns Hidden group with SMIL <animate> tags.
 */
export function renderSMILVariables(activeTime: TimeOfDay): string {
  const skyTop = cyclicAnimateValues(activeTime, p => p.sky[0]);
  const skyBot = cyclicAnimateValues(activeTime, p => p.sky[p.sky.length - 1]);
  const sun = cyclicAnimateValues(activeTime, p => p.sunColor);
  const mt1 = cyclicAnimateValues(activeTime, p => p.mountainFill1);
  const mt2 = cyclicAnimateValues(activeTime, p => p.mountainFill2);
  const hill1 = cyclicAnimateValues(activeTime, p => p.hill1);
  const hill2 = cyclicAnimateValues(activeTime, p => p.hill2);
  const hill3 = cyclicAnimateValues(activeTime, p => p.hill3);
  const water = cyclicAnimateValues(activeTime, p => p.waterColor);

  return `
  <!-- Centralized animation driver (emits CSS variables on hidden root) -->
  <g id="theme-cycle-root" style="display: none">
    <animate attributeName="--sky-top" values="${skyTop}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--sky-bot" values="${skyBot}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--sun-color" values="${sun}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--mt1" values="${mt1}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--mt2" values="${mt2}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--hill1" values="${hill1}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--hill2" values="${hill2}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--hill3" values="${hill3}" dur="90s" repeatCount="indefinite" />
    <animate attributeName="--water" values="${water}" dur="90s" repeatCount="indefinite" />
  </g>`;
}
