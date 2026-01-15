import axios from "axios";

// In-memory cache (reset on refresh)
const cache = {
  users: new Map(),
  repos: new Map(),
  languages: new Map(),
  events: new Map()
};

const token = import.meta.env.VITE_GITHUB_TOKEN;

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
});

// --- Error Wrapper ---
async function safeGet(url, params = {}) {
  try {
    const res = await gh.get(url, { params });
    return res;
  } catch (err) {
    if (err.response) {
      const { status, data } = err.response;
      if (status === 404) throw new Error("User not found.");
      if (status === 401) throw new Error("Bad credentials (invalid token).");
      if (status === 403 && data.message?.includes("rate limit"))
        throw new Error("API rate limit exceeded. Add a GitHub token.");
      throw new Error(data?.message || "GitHub API error.");
    }
    throw err;
  }
}

// --- API calls ---
export async function getUser(username) {
  if (cache.users.has(username)) return cache.users.get(username);

  const { data } = await safeGet(`/users/${username}`);
  cache.users.set(username, data);
  return data;
}

export async function getRepos(username, perPage = 100) {
  if (cache.repos.has(username)) return cache.repos.get(username);

  const { data } = await safeGet(`/users/${username}/repos`, {
    per_page: perPage,
    sort: "updated"
  });

  cache.repos.set(username, data);
  return data;
}

export async function getRepoLanguages(owner, repo) {
  const key = `${owner}/${repo}`;
  if (cache.languages.has(key)) return cache.languages.get(key);

  const { data } = await safeGet(`/repos/${owner}/${repo}/languages`);
  cache.languages.set(key, data);
  return data;
}

export async function getRecentCommitCount(username, pages = 3) {
  if (cache.events.has(username)) return cache.events.get(username);

  let commits = 0;
  for (let page = 1; page <= pages; page++) {
    const { data } = await safeGet(`/users/${username}/events`, {
      per_page: 100,
      page
    });

    for (const ev of data) {
      if (ev.type === "PushEvent" && ev.payload?.commits) {
        commits += ev.payload.commits.length;
      }
    }

    if (!data.length) break; // no more events
  }

  cache.events.set(username, commits);
  return commits;
}

// --- Aggregation Helpers ---
export function aggregateLanguages(languageMaps) {
  const totals = {};

  for (const langMap of languageMaps) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }

  return Object.entries(totals)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
}

// --- Repo Stats Helper ---
export function getRepoStats(repos) {
  let stars = 0;
  let forks = 0;

  repos.forEach(r => {
    stars += r.stargazers_count;
    forks += r.forks_count;
  });

  return {
    totalStars: stars,
    totalForks: forks,
    repoCount: repos.length
  };
}

// --- Language Count Helper ---
export function countLanguages(languageArr) {
  return languageArr.length;
}
