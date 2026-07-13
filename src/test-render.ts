import { renderProfileCard } from './renderProfileCard';
import { WorldData } from './world';
import * as fs from 'fs';

const mockWorld: WorldData = {
  columns: [],
  biomeTheme: {
    skyTop: '#0a0f1e',
    skyBottom: '#0d1a33',
    groundColor: '#0a2040',
    groundLine: '#1f6feb',
    buildingBase: '#3178c6',
    buildingAccent: '#1a5fa0',
    windowColor: '#e0f0ff',
    smokeColor: '#9bb',
    starColor: '#58a6ff',
    label: 'TS Empire'
  },
  tempo: 10,
  isMinorKey: false,
  streak: 42,
  totalContributions: 1337,
  username: 'Dasmat13',
  timeOfDay: 'day',
  weatherType: 'clear'
};

try {
  console.log('Rendering test card for day clear...');
  const daySvg = renderProfileCard(mockWorld);
  fs.writeFileSync('test-profile-card-day.svg', daySvg, 'utf8');
  console.log('Successfully wrote test-profile-card-day.svg');

  console.log('Rendering test card for night snow...');
  const nightSnowSvg = renderProfileCard({
    ...mockWorld,
    timeOfDay: 'night',
    weatherType: 'snow'
  });
  fs.writeFileSync('test-profile-card-night-snow.svg', nightSnowSvg, 'utf8');
  console.log('Successfully wrote test-profile-card-night-snow.svg');

  console.log('Rendering test card with custom settings...');
  const customSvg = renderProfileCard({
    ...mockWorld,
    username: 'DASMAT_EXPLORER',
    bio: 'Procedural scenery compiler engineer'
  });
  fs.writeFileSync('test-profile-card-custom.svg', customSvg, 'utf8');
  console.log('Successfully wrote test-profile-card-custom.svg');

} catch (err) {
  console.error('Error rendering card:', err);
}
