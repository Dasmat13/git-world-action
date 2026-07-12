import { GitHubData } from './github';

export type TileType    = 'empty' | 'grass' | 'house' | 'building' | 'tower' | 'skyscraper' | 'castle';
export type TimeOfDay   = 'dawn' | 'day' | 'dusk' | 'night';
export type WeatherType = 'clear' | 'rain' | 'snow';

export interface ColumnData {
  weekIdx:    number;
  maxCount:   number;      // max commits in the week
  totalCount: number;      // total commits in the week
  height:     number;      // pixel height 0–140
  tileType:   TileType;
  hasSmoke:   boolean;
  hasBoss:    boolean;     // PR boss — rare, very tall column
  hasMonster: boolean;     // issue monster — columns with open issues
  biomeColor: string;      // from language
  windowColor: string;
}

export interface WorldData {
  columns:            ColumnData[];
  biomeTheme:         BiomeTheme;
  tempo:              number;      // derived from stars (affects animation speed)
  isMinorKey:         boolean;     // night sky if more issues than resolved
  streak:             number;
  totalContributions: number;
  username:           string;
  timeOfDay:          TimeOfDay;   // 🌙 Day/Night cycle
  weatherType:        WeatherType; // 🌧️ Weather effects
}

export interface BiomeTheme {
  skyTop:      string;
  skyBottom:   string;
  groundColor: string;
  groundLine:  string;
  buildingBase: string;
  buildingAccent: string;
  windowColor: string;
  smokeColor:  string;
  starColor:   string;
  label:       string;
}

const BIOMES: Record<string, BiomeTheme> = {
  JavaScript: {
    skyTop: '#0d1117', skyBottom: '#1a2332',
    groundColor: '#1a3a1a', groundLine: '#2ea043',
    buildingBase: '#f0c040', buildingAccent: '#e8a020',
    windowColor: '#fffde7', smokeColor: '#aaa',
    starColor: '#ffd700', label: 'JS Kingdom',
  },
  TypeScript: {
    skyTop: '#0a0f1e', skyBottom: '#0d1a33',
    groundColor: '#0a2040', groundLine: '#1f6feb',
    buildingBase: '#3178c6', buildingAccent: '#1a5fa0',
    windowColor: '#e0f0ff', smokeColor: '#9bb',
    starColor: '#58a6ff', label: 'TS Empire',
  },
  Python: {
    skyTop: '#0d1a0d', skyBottom: '#1a2d1a',
    groundColor: '#0d2818', groundLine: '#2ea043',
    buildingBase: '#3776ab', buildingAccent: '#ffd43b',
    windowColor: '#fff9e0', smokeColor: '#8a8',
    starColor: '#7ee787', label: 'Python Forest',
  },
  Go: {
    skyTop: '#001020', skyBottom: '#002040',
    groundColor: '#002030', groundLine: '#00ADD8',
    buildingBase: '#00ADD8', buildingAccent: '#007a9e',
    windowColor: '#e0faff', smokeColor: '#9cc',
    starColor: '#79c0ff', label: 'Go Realm',
  },
  Rust: {
    skyTop: '#1a0800', skyBottom: '#2d1000',
    groundColor: '#2a1005', groundLine: '#ce412b',
    buildingBase: '#ce412b', buildingAccent: '#8b2010',
    windowColor: '#ffe0d0', smokeColor: '#b88',
    starColor: '#ffa657', label: 'Rust Wasteland',
  },
  // 🏰 New biome themes
  Java: {
    skyTop: '#1a0a00', skyBottom: '#2d1a00',
    groundColor: '#2a1a00', groundLine: '#e76f00',
    buildingBase: '#e76f00', buildingAccent: '#b35000',
    windowColor: '#fff3e0', smokeColor: '#c99',
    starColor: '#ffb74d', label: 'Java Citadel',
  },
  'C++': {
    skyTop: '#000820', skyBottom: '#001040',
    groundColor: '#001030', groundLine: '#004488',
    buildingBase: '#0047ab', buildingAccent: '#003380',
    windowColor: '#dde8ff', smokeColor: '#88a',
    starColor: '#99bbff', label: 'C++ Fortress',
  },
  Ruby: {
    skyTop: '#1a0010', skyBottom: '#2d0020',
    groundColor: '#200010', groundLine: '#cc2244',
    buildingBase: '#cc2244', buildingAccent: '#991133',
    windowColor: '#ffe0e8', smokeColor: '#c8a',
    starColor: '#ff7096', label: 'Ruby Ruins',
  },
  Shell: {
    skyTop: '#001a00', skyBottom: '#003300',
    groundColor: '#002200', groundLine: '#00cc44',
    buildingBase: '#00cc44', buildingAccent: '#009933',
    windowColor: '#e0ffe8', smokeColor: '#8c8',
    starColor: '#00ff88', label: 'Shell Jungle',
  },
  Swift: {
    skyTop: '#1a0500', skyBottom: '#2d0d00',
    groundColor: '#2a0c00', groundLine: '#ff5630',
    buildingBase: '#ff5630', buildingAccent: '#cc3010',
    windowColor: '#fff0ec', smokeColor: '#c8a',
    starColor: '#ff8c69', label: 'Swift Peaks',
  },
  Kotlin: {
    skyTop: '#0d0020', skyBottom: '#1a0040',
    groundColor: '#0f0028', groundLine: '#7f52ff',
    buildingBase: '#7f52ff', buildingAccent: '#5a30cc',
    windowColor: '#ede8ff', smokeColor: '#aa9',
    starColor: '#b99aff', label: 'Kotlin Nexus',
  },
};

const DEFAULT_BIOME: BiomeTheme = {
  skyTop: '#0d1117', skyBottom: '#161b22',
  groundColor: '#1a3322', groundLine: '#39d353',
  buildingBase: '#39d353', buildingAccent: '#2ea043',
  windowColor: '#f0fff4', smokeColor: '#888',
  starColor: '#c3d1d9', label: 'GitWorld',
};

function countToHeight(count: number, maxCount: number): number {
  if (count === 0) return 0;
  const norm = Math.log(count + 1) / Math.log(maxCount + 1);
  return Math.round(10 + norm * 130);
}

function countToTile(count: number): TileType {
  if (count === 0) return 'grass';
  if (count <= 2)  return 'house';
  if (count <= 5)  return 'building';
  if (count <= 9)  return 'tower';
  if (count <= 15) return 'skyscraper';
  return 'castle';
}

export function buildWorld(data: GitHubData, realWeather?: WeatherType): WorldData {
  const theme = BIOMES[data.topLanguage] || DEFAULT_BIOME;
  const allMax = Math.max(...data.weeks.flatMap(w => w.map(d => d.count)), 1);

  const columns: ColumnData[] = data.weeks.map((week, i) => {
    const maxCount   = Math.max(...week.map(d => d.count), 0);
    const totalCount = week.reduce((s, d) => s + d.count, 0);
    const height     = countToHeight(maxCount, allMax);
    const tileType   = countToTile(maxCount);

    return {
      weekIdx:    i,
      maxCount,
      totalCount,
      height,
      tileType,
      hasSmoke:   tileType === 'skyscraper' || tileType === 'castle',
      hasBoss:    tileType === 'castle' && i % 13 === 0,
      hasMonster: data.openIssues > 10 && i % 7 === 3,
      biomeColor: theme.buildingBase,
      windowColor: theme.windowColor,
    };
  });

  const tempo = Math.max(8, Math.min(20, Math.log10(data.totalStars + 1) * 6));
  const isMinorKey = data.openIssues > data.closedIssues;

  // 🌙 Day/Night: map streak% to time of day
  const streakRatio = Math.min(data.streak / 365, 1);
  const timeOfDay: TimeOfDay =
    streakRatio < 0.1 ? 'night' :
    streakRatio < 0.3 ? 'dawn'  :
    streakRatio < 0.7 ? 'day'   : 'dusk';

  // 🌧️ Weather: real-location takes priority; fall back to activity-based
  const issueRatio = data.openIssues / (data.openIssues + data.closedIssues + 1);
  const coldBiomes = ['Rust', 'C++', 'Go', 'Kotlin'];
  const derivedWeather: WeatherType =
    coldBiomes.includes(data.topLanguage) && data.streak > 30 ? 'snow' :
    issueRatio > 0.4 ? 'rain' : 'clear';
  const weatherType: WeatherType = realWeather ?? derivedWeather;

  return {
    columns,
    biomeTheme: theme,
    tempo,
    isMinorKey,
    streak: data.streak,
    totalContributions: data.totalContributions,
    username: data.username,
    timeOfDay,
    weatherType,
  };
}
