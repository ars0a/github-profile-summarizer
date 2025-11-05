export default function SearchBar({ onSearch, loading }) {
  function submit(e) {
    e.preventDefault();
    const username = new FormData(e.currentTarget).get("username").trim();
    if (username) onSearch(username);
  }
  return (
    <form onSubmit={submit} className="flex gap-3 items-center">
      <input name="username" type="text" placeholder="Enter GitHub username (e.g., torvalds)" />
      <button className="primary" disabled={loading}>{loading ? 'Loading...' : 'Summarize'}</button>
    </form>
  );
}
