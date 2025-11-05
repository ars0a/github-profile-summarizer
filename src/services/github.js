import axios from "axios";

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(import.meta.env.VITE_GITHUB_TOKEN ? { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` } : {})
  }
});

export async function getUser(username) {
  const { data } = await gh.get(`/users/${username}`);
  return data;
}

export async function getRepos(username, perPage = 100) {
  // paginate first 100 repos (sorted by updated)
  const { data } = await gh.get(`/users/${username}/repos`, {
    params: { per_page: perPage, sort: "updated" }
  });
  return data;
}

export async function getRepoLanguages(owner, repo) {
  const { data } = await gh.get(`/repos/${owner}/${repo}/languages`);
  return data; // { "JavaScript": 12345, "HTML": 234 }
}

export async function getRecentCommitCount(username, pages=3) {
  // Recent commits via public events (up to ~90 days, max 300 events)
  // We sum commits in PushEvent payloads
  let commits = 0;
  for (let page = 1; page <= pages; page++) {
    const { data } = await gh.get(`/users/${username}/events`, { params: { per_page: 100, page } });
    for (const ev of data) {
      if (ev.type === "PushEvent" && ev.payload?.commits) {
        commits += ev.payload.commits.length;
      }
    }
    if (!data.length) break;
  }
  return commits;
}

export function aggregateLanguages(languageMaps) {
  const totals = {};
  for (const langMap of languageMaps) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }
  // convert to array sorted desc
  const arr = Object.entries(totals).map(([name, bytes]) => ({ name, bytes }))
    .sort((a,b) => b.bytes - a.bytes);
  return arr;
}
