import { ProjectList } from "../_components/entries";
import { collectionEntries } from "../_content/entries";
import { pageMetadata } from "../_lib/site";

export const metadata = pageMetadata(
  "Projects",
  "Explore Sebastian Noel's projects in robotics, wearable AI, and connected devices.",
  "/projects",
);

export default function Projects() {
  return (
    <div className="wrap">
      <header className="page-heading">
        <p className="eyebrow">Ideas made tangible</p>
        <h1>Projects.</h1>
        <p>
          From remembering robots to gardens with personality. A selection of
          things built with a team.
        </p>
      </header>
      <section className="section collection" aria-label="Projects">
        <ProjectList entries={collectionEntries("projects")} headingLevel={2} />
      </section>
    </div>
  );
}
