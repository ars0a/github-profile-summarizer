export default function RepoList({ repos }) {
  if (!repos?.length) return null;
  return (
    <div className="card">
      <div className="font-medium mb-2">Top Repositories (by stars)</div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
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
            {repos.map(r => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 pr-4"><a className="text-indigo-600" href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a></td>
                <td className="py-2 pr-4">{r.stargazers_count}</td>
                <td className="py-2 pr-4">{r.forks_count}</td>
                <td className="py-2 pr-4">{r.language || '—'}</td>
                <td className="py-2 pr-4">{new Date(r.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
