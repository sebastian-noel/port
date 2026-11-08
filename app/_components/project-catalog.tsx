"use client";
import { useState } from "react";
import type { Entry } from "../_content/entries";
import { ProjectCard } from "./entries";
import { Icon } from "./icons";

export function ProjectCatalog({ items }: { items: Entry[] }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLocaleLowerCase();
  const filtered = items.filter(
    (entry) =>
      !needle ||
      (!entry.placeholder &&
        [
          entry.title,
          entry.event ?? "",
          ...(entry.technologies ?? []),
          ...(entry.team ?? []),
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle)),
  );
  return (
    <>
      <div className="search-field">
        <Icon name="search" />
        <label className="sr-only" htmlFor="project-search">
          Search projects
        </label>
        <input
          id="project-search"
          type="search"
          placeholder="Search projects"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby="search-help"
        />
        {query && (
          <button
            className="icon-button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      <p className="sr-only" id="search-help">
        Search by project name, technology, teammate, or event.
      </p>
      <p className="sr-only" role="status">
        {filtered.length} projects shown
      </p>
      {filtered.length ? (
        <div className="project-grid">
          {filtered.map((entry) => (
            <ProjectCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="empty-results">
          No projects match “{query}”. Try another search.
        </p>
      )}
    </>
  );
}
