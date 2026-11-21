"use client";

import { useState } from "react";
import { DOMAINS, projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectBrowser() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      (domain === "All" || p.domain === domain),
  );

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects by title..."
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...DOMAINS].map((d) => (
          <button
            key={d}
            onClick={() => setDomain(d)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              domain === d
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {filtered.length} project{filtered.length === 1 ? "" : "s"} found
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No projects match your search. Try a different keyword or domain.
        </div>
      )}
    </div>
  );
}
