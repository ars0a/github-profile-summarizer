export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center gap-4">
      
      {/* Avatar */}
      <img
        src={profile.avatar_url}
        alt="avatar"
        className="w-24 h-24 rounded-full border border-slate-200 object-cover hover:scale-105 transition-transform duration-150"
      />

      {/* Info */}
      <div className="flex-1 space-y-1 text-center sm:text-left">
        <div className="text-xl font-semibold tracking-tight">
          {profile.name || profile.login}
        </div>

        <div className="text-sm text-slate-500">
          @{profile.login}
        </div>

        <div className="text-sm text-slate-700">
          {profile.bio || "No bio available."}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600 justify-center sm:justify-start">
          <span className="px-2 py-1 bg-slate-100 rounded-full">Followers: {profile.followers}</span>
          <span className="px-2 py-1 bg-slate-100 rounded-full">Following: {profile.following}</span>
          <span className="px-2 py-1 bg-slate-100 rounded-full">Repos: {profile.public_repos}</span>
          {profile.location && (
            <span className="px-2 py-1 bg-slate-100 rounded-full">{profile.location}</span>
          )}
        </div>

        {/* Optional fields */}
        <div className="flex flex-col gap-1 mt-3 text-xs text-slate-500">
          {profile.company && <span>🏢 {profile.company}</span>}
          {profile.blog && profile.blog.trim() !== "" && (
            <a
              href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              🔗 {profile.blog}
            </a>
          )}
        </div>
      </div>

      {/* Button */}
      <a
        href={profile.html_url}
        target="_blank"
        rel="noreferrer"
        className="
          mt-2 sm:mt-0
          px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium
          hover:bg-blue-500 active:scale-95
          transition-all duration-150
        "
      >
        Open on GitHub
      </a>
    </div>
  );
}
