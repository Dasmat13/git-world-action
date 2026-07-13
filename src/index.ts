import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { fetchGitHubData } from './github';
import { buildWorld } from './world';
import { renderSVG } from './renderer';
import { renderProfileCard } from './renderProfileCard';
import { fetchRealWeather } from './weather';

async function run(): Promise<void> {
  try {
    const username  = core.getInput('github_user_name', { required: true });
    const token     = core.getInput('github_token',      { required: true });
    const outPath   = core.getInput('svg_out_path')     || 'dist/gitworld.svg';

    core.info(`🌍 Generating GitWorld for @${username}...`);

    core.info('📡 Fetching GitHub data...');
    const data = await fetchGitHubData(username, token);

    // 🌦️ Location priority: manual input > GitHub profile location > activity-based
    const manualLocation = core.getInput('location') || '';
    const resolvedLocation = manualLocation.trim() || data.location.trim();

    let realWeather;
    if (resolvedLocation) {
      const source = manualLocation.trim() ? 'manual input' : 'GitHub profile';
      core.info(`🌍 Auto-detected location from ${source}: "${resolvedLocation}"`);
      core.info(`🌦️  Fetching real-time weather...`);
      realWeather = await fetchRealWeather(resolvedLocation);
      if (realWeather) {
        core.info(`✅ Weather: ${realWeather} (${resolvedLocation})`);
      } else {
        core.warning(`⚠️  Could not resolve weather for "${resolvedLocation}", using activity-based fallback.`);
      }
    } else {
      core.info('📍 No location set in GitHub profile or inputs — using activity-based weather.');
    }

    core.info('🏗️  Building world...');
    const world = buildWorld(data, realWeather);

    core.info('🎨 Rendering SVG...');
    const svg = renderSVG(world, username);
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, svg, 'utf8');
    core.info(`✅ GitWorld SVG written to ${outPath}`);
    core.setOutput('svg_path', outPath);

    // 🃏 Also render profile card
    const cardPath = path.join(path.dirname(outPath), 'profile-card.svg');
    const cardSvg  = renderProfileCard(world);
    fs.writeFileSync(cardPath, cardSvg, 'utf8');
    core.info(`✅ Profile card written to ${cardPath}`);
    core.setOutput('profile_card_path', cardPath);
  } catch (err: unknown) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

run();
