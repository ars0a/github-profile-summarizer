import { useMemo, useState } from "react";

export default function RepoList({ repos }) {
  const [sortBy, setSortBy] = useState("stars");
  const [filterLang, setFilterLang] = useState("all");

  // Extract languages for filter dropdown
  const languages = useMemo(() => {
    const set = new Set();
    if (Array.isArray(repos)) {
      repos.forEach(r => r.language && set.add(r.language));
    }
    return Array.from(set).sort();
  }, [repos]);

  // Sorting logic
  const sortedRepos = useMemo(() => {
    if (!Array.isArray(repos)) return [];
    let list = [...repos];
    if (sortBy === "stars") list.sort((a, b) => b.stargazers_count - a.stargazers_count);
    if (sortBy === "forks") list.sort((a, b) => b.forks_count - a.forks_count);
    if (sortBy === "updated") list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return list;
  }, [repos, sortBy]);

  // Filtering logic
  const filtered = useMemo(() => {
    if (filterLang === "all") return sortedRepos;
    return sortedRepos.filter(r => r.language === filterLang);
  }, [sortedRepos, filterLang]);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      {(!Array.isArray(repos) || repos.length === 0) && (
        <div className="text-sm text-slate-500">
          No repositories found.
        </div>
      )}

      {Array.isArray(repos) && repos.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="font-medium">Top Repositories</div>

            <div className="flex gap-3 text-sm">
              {/* Sort */}
              <select
                className="border rounded-md px-2 py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="stars">Sort: Stars</option>
                <option value="forks">Sort: Forks</option>
                <option value="updated">Sort: Updated</option>
              </select>

              {/* Filter */}
              <select
                className="border rounded-md px-2 py-1"
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
              >
                <option value="all">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Stars</th>
                  <th className="py-2 pr-4">Forks</th>
                  <th className="py-2 pr-4">Language</th>
                  <th className="py-2 pr-4">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-2 pr-4">
                      <a
                        className="text-blue-600 hover:underline"
                        href={r.html_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.name}
                      </a>
                    </td>
                    <td className="py-2 pr-4">{r.stargazers_count}</td>
                    <td className="py-2 pr-4">{r.forks_count}</td>
                    <td className="py-2 pr-4">{r.language || "—"}</td>
                    <td className="py-2 pr-4 text-slate-500">
                      {timeAgo(r.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = (new Date() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
