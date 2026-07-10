import { graphql } from '@octokit/graphql';

export interface DayData {
  date: string;
  count: number;
}

export interface GitHubData {
  username: string;
  totalContributions: number;
  weeks: DayData[][];          // 52 weeks × 7 days
  topLanguage: string;
  totalStars: number;
  openIssues: number;
  closedIssues: number;
  followers: number;
  organizations: number;
  streak: number;
}

const QUERY = `
query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    organizations { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
    repositories(first: 100, isFork: false, orderBy: { field: STARGAZERS, direction: DESC }) {
      nodes {
        stargazerCount
        primaryLanguage { name }
        openIssues:   issues(states: OPEN)   { totalCount }
        closedIssues: issues(states: CLOSED) { totalCount }
      }
    }
  }
}`;

export async function fetchGitHubData(username: string, token: string): Promise<GitHubData> {
  const gql = graphql.defaults({ headers: { authorization: `token ${token}` } });

  const { user } = await gql<any>(QUERY, { login: username });

  // Flatten weeks/days
  const weeks: DayData[][] = user.contributionsCollection.contributionCalendar.weeks
    .slice(-52)
    .map((w: any) => w.contributionDays.map((d: any) => ({ date: d.date, count: d.contributionCount })));

  // Aggregate repo stats
  let totalStars = 0, openIssues = 0, closedIssues = 0;
  const langBytes: Record<string, number> = {};
  for (const r of user.repositories.nodes) {
    totalStars   += r.stargazerCount || 0;
    openIssues   += r.openIssues?.totalCount || 0;
    closedIssues += r.closedIssues?.totalCount || 0;
    if (r.primaryLanguage?.name) {
      langBytes[r.primaryLanguage.name] = (langBytes[r.primaryLanguage.name] || 0) + 1;
    }
  }

  const topLanguage = Object.entries(langBytes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'JavaScript';

  // Compute contribution streak
  const allDays = weeks.flat().reverse();
  let streak = 0;
  for (const d of allDays) {
    if (d.count > 0) streak++;
    else break;
  }

  return {
    username,
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    weeks,
    topLanguage,
    totalStars,
    openIssues,
    closedIssues,
    followers: user.followers.totalCount,
    organizations: user.organizations.totalCount,
    streak,
  };
}
