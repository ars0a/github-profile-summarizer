import { useCallback, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import StatCard from "./components/StatCard.jsx";
import LanguagePie from "./components/LanguagePie.jsx";
import RepoList from "./components/RepoList.jsx";
import { getUser, getRepos, getRepoLanguages, aggregateLanguages, getRecentCommitCount } from "./services/github.js";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [langs, setLangs] = useState([]);
  const [recentCommits, setRecentCommits] = useState(0);

  const summarize = useCallback(async (username) => {
    setLoading(true); setError(null);
    try {
      const user = await getUser(username);
      setProfile(user);

      let repoList = await getRepos(username);
      // sort by stars desc for display
      repoList = repoList.sort((a,b) => b.stargazers_count - a.stargazers_count);
      setRepos(repoList.slice(0, 20));

      // language aggregation (limit for rate safety)
      const max = Number(import.meta.env.VITE_MAX_REPOS || 50);
      const slice = repoList.slice(0, max);
      const langMaps = [];
      for (const r of slice) {
        try {
          const lm = await getRepoLanguages(username, r.name);
          langMaps.push(lm);
        } catch {}
      }
      setLangs(aggregateLanguages(langMaps));

      // recent commits via events (approx, not total lifetime)
      const commits = await getRecentCommitCount(username, 3);
      setRecentCommits(commits);

    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  const primaryLanguage = useMemo(() => langs[0]?.name || "—", [langs]);

  return (
    <div>
      <header>
        <div className="container">
          <h1 className="text-2xl font-semibold">GitHub Profile Summarizer</h1>
          <p className="text-sm text-indigo-100">Type a username and get a clean summary: profile, repos, languages, recent commits.</p>
        </div>
      </header>

      <main className="container space-y-6">
        <div className="card">
          <div className="font-medium mb-3">Search</div>
          <SearchBar onSearch={summarize} loading={loading} />
          {error && <div className="mt-3 text-red-600">{error}</div>}
        </div>

        <ProfileCard profile={profile} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Public Repos" value={profile?.public_repos ?? '—'} />
          <StatCard title="Primary Language" value={primaryLanguage} />
          <StatCard title="Recent Commits" value={recentCommits} hint="Approx. from recent events" />
          <StatCard title="Followers" value={profile?.followers ?? '—'} />
        </div>

        <div className="card">
          <div className="font-medium mb-2">Languages</div>
          <LanguagePie data={langs} />
        </div>

        <RepoList repos={repos} />
      </main>

      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center text-slate-600">
          Loading…
        </div>
      )}
    </div>
  );
}
