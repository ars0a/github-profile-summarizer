import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  function submit(e) {
    e.preventDefault();
    const username = new FormData(e.currentTarget).get("username").trim();
    if (username) onSearch(username);
  }

  return (
    <form onSubmit={submit} className="flex gap-3 items-center">
      <input
        name="username"
        type="text"
        placeholder="Search GitHub username…"
        className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-emerald-400"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="
          bg-emerald-600 text-white px-4 py-2 rounded-xl
          hover:bg-emerald-700 active:scale-95 transition
          disabled:bg-slate-300 disabled:cursor-not-allowed
        "
      >
        {loading ? "Loading…" : "Summarize"}
      </button>
    </form>
  );
}
