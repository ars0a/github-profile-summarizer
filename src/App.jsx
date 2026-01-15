import { useCallback, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import StatCard from "./components/StatCard.jsx";
import LanguagePie from "./components/LanguagePie.jsx";
import RepoList from "./components/RepoList.jsx";

import {
  getUser,
  getRepos,
  getRepoLanguages,
  aggregateLanguages,
  getRecentCommitCount,
  getRepoStats,
  countLanguages
} from "./services/github.js";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [langs, setLangs] = useState([]);
  const [recentCommits, setRecentCommits] = useState(0);

  const summarize = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);
    setLangs([]);
    setRecentCommits(0);

    try {
      const user = await getUser(username);
      setProfile(user);

      let repoList = await getRepos(username);
      repoList = repoList.sort((a, b) => b.stargazers_count - a.stargazers_count);
      setRepos(repoList.slice(0, 20));

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

      const commits = await getRecentCommitCount(username, 3);
      setRecentCommits(commits);

    } catch (e) {
      console.error(e);
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Back to search reset function
  function reset() {
    setProfile(null);
    setRepos([]);
    setLangs([]);
    setRecentCommits(0);
    setError(null);
  }

  const primaryLanguage = useMemo(() => langs[0]?.name || "—", [langs]);
  const repoStats = useMemo(
    () => (Array.isArray(repos) && repos.length ? getRepoStats(repos) : { totalStars: 0, totalForks: 0 }),
    [repos]
  );
  const langCount = useMemo(
    () => (Array.isArray(langs) ? countLanguages(langs) : 0),
    [langs]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Header */}
      <header>
        <div className="container text-center">
          <h1 className="text-3xl font-semibold mb-1 text-white">
            GitHub Profile Summarizer
          </h1>
          <p className="text-emerald-100 text-sm">
            Enter a GitHub username and view profile, repos, languages, and commit stats.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-medium mb-3">Search User</div>
          <SearchBar onSearch={summarize} loading={loading} />
          {error && (
            <div className="mt-3 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        {!loading && !profile && !error && (
          <div className="text-center text-slate-500 mt-4">
            Start by searching for a GitHub username.
          </div>
        )}

        {profile && (
          <>
            {/* Back to Search Button */}
            <div className="flex justify-end">
              <button
                onClick={reset}
                className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-700 active:scale-95 transition"
              >
                Back to Search
              </button>
            </div>

            {/* Profile */}
            <ProfileCard profile={profile} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Public Repos" value={profile?.public_repos ?? "—"} />
              <StatCard title="Primary Language" value={primaryLanguage} />
              <StatCard title="Languages" value={langCount} />
              <StatCard title="Followers" value={profile?.followers ?? "—"} />
              <StatCard title="Total Stars" value={repoStats.totalStars} />
              <StatCard title="Total Forks" value={repoStats.totalForks} />
              <StatCard title="Recent Commits" value={recentCommits} hint="From recent events" />
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="font-medium mb-2">Languages Breakdown</div>
              {langs.length > 0 ? (
                <LanguagePie data={langs} />
              ) : (
                <div className="text-sm text-slate-500">No language data available.</div>
              )}
            </div>

            {/* Repo List */}
            <RepoList repos={repos} />
          </>
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center text-lg text-slate-600">
          Loading…
        </div>
      )}
      
    </div>
  );
}
