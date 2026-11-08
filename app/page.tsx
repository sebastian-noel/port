import { NameIntro } from "./_components/name-intro";
import { CompactList } from "./_components/entries";
import { collectionEntries } from "./_content/entries";
import { pageMetadata } from "./_lib/site";

export const metadata = pageMetadata(
  "Sebastian Noel",
  "Sebastian Noel's projects, experience, and experiments in software and hardware.",
  "/",
);

export default function Home() {
  return (
    <div className="wrap home">
      <NameIntro />
      <div className="home-workspace" id="workspace">
        <section className="game-space" aria-labelledby="game-heading">
          <h2 className="sr-only" id="game-heading">
            Typing game, coming later
          </h2>
        </section>
        <aside className="home-sidebar" aria-label="Selected work">
          <CompactList
            title="Projects"
            collection="projects"
            items={collectionEntries("projects")
              .filter((entry) => entry.featured)
              .slice(0, 3)}
          />
          <CompactList
            title="Experiences"
            collection="experiences"
            items={collectionEntries("experiences")
              .filter((entry) => entry.featured)
              .slice(0, 3)}
          />
        </aside>
      </div>
    </div>
  );
}
