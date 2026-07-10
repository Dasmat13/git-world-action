import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { fetchGitHubData } from './github';
import { buildWorld } from './world';
import { renderSVG } from './renderer';

async function run(): Promise<void> {
  try {
    const username  = core.getInput('github_user_name', { required: true });
    const token     = core.getInput('github_token',      { required: true });
    const outPath   = core.getInput('svg_out_path')     || 'dist/gitworld.svg';

    core.info(`🌍 Generating GitWorld for @${username}...`);

    core.info('📡 Fetching GitHub data...');
    const data = await fetchGitHubData(username, token);

    core.info('🏗️  Building world...');
    const world = buildWorld(data);

    core.info('🎨 Rendering SVG...');
    const svg = renderSVG(world, username);

    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, svg, 'utf8');

    core.info(`✅ GitWorld SVG written to ${outPath}`);
    core.setOutput('svg_path', outPath);
  } catch (err: unknown) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

run();
