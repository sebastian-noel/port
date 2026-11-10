import { NameIntro } from "./_components/name-intro";
import { CompactList, ProjectCard } from "./_components/entries";
import { collectionEntries } from "./_content/entries";
import { pageMetadata } from "./_lib/site";

export const metadata = pageMetadata(
  "Sebastian Noel",
  "Sebastian Noel's projects, experience, and experiments in software and hardware.",
  "/",
);

export default function Home() {
  const featuredProjects = collectionEntries("projects")
    .filter((entry) => entry.featured)
    .slice(0, 3);

  return (
    <>
      <div className="wrap home">
        <NameIntro />
      </div>
      <section
        className="featured-projects"
        id="workspace"
        aria-labelledby="featured-projects-heading"
      >
        <div className="wrap">
          <h2 id="featured-projects-heading">Featured Projects</h2>
          <div className="project-grid">
            {featuredProjects.map((entry) => (
              <ProjectCard key={entry.slug} entry={entry} featured />
            ))}
          </div>
        </div>
      </section>
      <div className="wrap home-workspace">
        <section className="game-space" aria-labelledby="game-heading">
          <h2 className="sr-only" id="game-heading">
            Typing game, coming later
          </h2>
        </section>
        <aside className="home-sidebar" aria-label="Selected work">
          <CompactList
            title="Experiences"
            collection="experiences"
            items={collectionEntries("experiences")
              .filter((entry) => entry.featured)
              .slice(0, 3)}
          />
        </aside>
      </div>
    </>
  );
}
