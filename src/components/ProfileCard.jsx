export default function ProfileCard({ profile }) {
  if (!profile) return null;
  return (
    <div className="card flex gap-4 items-center">
      <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full" />
      <div className="flex-1">
        <div className="text-lg font-semibold">{profile.name || profile.login}</div>
        <div className="subtle">{profile.bio || '—'}</div>
        <div className="mt-2 flex gap-3 text-sm text-slate-600">
          <span className="badge">Followers: {profile.followers}</span>
          <span className="badge">Following: {profile.following}</span>
          <span className="badge">Public Repos: {profile.public_repos}</span>
          <span className="badge">Location: {profile.location || '—'}</span>
        </div>
      </div>
      <a className="primary" href={profile.html_url} target="_blank" rel="noreferrer">Open Profile</a>
    </div>
  );
}
