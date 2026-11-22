"use client";
import { useRef, useState } from "react";
import type { Entry } from "../_content/entries";
import { ProjectCard } from "./entries";
import { Icon } from "./icons";

export function ProjectCatalog({ items }: { items: Entry[] }) {
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
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

  function clearSearch() {
    setQuery("");
    searchInput.current?.focus();
  }

  return (
    <>
      <div className="project-search" role="search" aria-label="Projects">
        <div className="search-field">
          <Icon name="search" className="search-symbol" />
          <label className="sr-only" htmlFor="project-search">
            Search projects
          </label>
          <input
            ref={searchInput}
            id="project-search"
            type="search"
            placeholder="Search projects"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                clearSearch();
              }
            }}
            aria-describedby="search-help"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <Icon name="close" />
            </button>
          )}
        </div>
        <div className="search-details">
          <p id="search-help">
            Search by name, technology, teammate, or event.
          </p>
          <p role="status">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}{" "}
            shown
          </p>
        </div>
      </div>
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
