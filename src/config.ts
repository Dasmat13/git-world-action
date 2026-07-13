import { ProfileConfig } from './types';
import { WorldData } from './world';

/**
 * Default profile card configuration settings and vector layout metadata.
 */
export const DEFAULT_PROFILE_CONFIG: ProfileConfig = {
  name: 'DASMAT',
  tagline: 'DEVOPS EXPLORER  ·  FULL-STACK DEVELOPER  ·  OSS CONTRIBUTOR',
  contact: 'Experiments daily with automated recovery pipelines',
  email: 'dasmath06@gmail.com',
  repoLink: 'https://github.com/Dasmat13/git-world-action',
  skills: [
    { n: 'Kubernetes', bg: '#22c55e' },
    { n: 'Docker',     bg: '#0ea5e9' },
    { n: 'TypeScript', bg: '#ec4899' },
    { n: 'Go',         bg: '#06b6d4' },
    { n: 'Node.js',    bg: '#8b5cf6' },
    { n: 'Terraform',  bg: '#eab308' },
    { n: 'Python',     bg: '#f43f5e' },
    { n: 'AWS',        bg: '#f97316' },
    { n: 'Linux',      bg: '#64748b' },
    { n: 'Grafana',    bg: '#ef4444' },
    { n: 'Prometheus', bg: '#f43f5e' },
    { n: 'Backstage',  bg: '#14b8a6' }
  ],
  quests: [
    { t: 'LeaderWorkerSet topology-aware scheduling', s: 'Active Journey 🌿', bg: '#22c55e' },
    { t: 'CompositePodGroup integration (KEP-893)',  s: 'Active Journey 🌿', bg: '#22c55e' },
    { t: 'GitWorld Engine rendering pipeline core',   s: 'Completed 🏆',      bg: '#eab308' },
    { t: 'Real-time automatic location weather sync', s: 'Completed 🏆',      bg: '#eab308' },
    { t: 'Upstream Node.js core exploration',         s: 'Wandering 🏕️',      bg: '#0ea5e9' }
  ],
  stats: (world: WorldData) => [
    { icon: '📝', lbl: 'TRAVEL STREAK', val: `${world.streak} days`,    sub: 'committed in a row', bg: '#22c55e' },
    { icon: '🌱', lbl: 'SPROUTS GROWN', val: `${world.totalContributions}`, sub: 'total commits', bg: '#0ea5e9' },
    { icon: '🏡', lbl: 'HOME BIOME',    val: world.biomeTheme.label.toUpperCase(), sub: `Weather: ${world.weatherType.toUpperCase()}`, bg: '#eab308' }
  ],
  monasteryPos: { x: 710, y: 190 },
  poplars: [
    { x: 100, y: 390, s: 0.75, delay: 'pine' },
    { x: 140, y: 400, s: 0.85, delay: 'pine-delay' },
    { x: 800, y: 380, s: 0.75, delay: 'pine' },
    { x: 860, y: 390, s: 0.90, delay: 'pine-delay' },
    { x: 60,  y: 720, s: 1.00, delay: 'pine-delay' },
    { x: 910, y: 750, s: 1.15, delay: 'pine' },
    { x: 80,  y: 1020, s: 1.25, delay: 'pine' },
    { x: 890, y: 1000, s: 1.30, delay: 'pine-delay' }
  ],
  grass: [
    { x: 50, y: 440 }, { x: 280, y: 420 }, { x: 740, y: 460 },
    { x: 120, y: 740 }, { x: 820, y: 770 },
    { x: 180, y: 1040 }, { x: 790, y: 1020 }
  ],
  stars: [
    { cx: 80, cy: 90, r: 1.8, delay: '0s' },
    { cx: 160, cy: 120, r: 1.2, delay: '1.2s' },
    { cx: 210, cy: 70, r: 2.0, delay: '0.5s' },
    { cx: 780, cy: 110, r: 1.5, delay: '2s' },
    { cx: 840, cy: 60, r: 2.2, delay: '1.5s' }
  ],
  prayerFlagsPos: { x: 80, y: 210 },
  marqueeText: '🏔️ SPITI VALLEY · KEY MONASTERY OVERLOOK · COLD DESERT · GLACIAL STREAM · SPITI VALLEY · KEY MONASTERY OVERLOOK · COLD DESERT · GLACIAL STREAM'
};
