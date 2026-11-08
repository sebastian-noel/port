import { ProjectCatalog } from "../_components/project-catalog";
import { collectionEntries } from "../_content/entries";
import { pageMetadata } from "../_lib/site";
export const metadata = pageMetadata(
  "Projects",
  "Explore Sebastian Noel's projects in robotics, AI, games, and web development.",
  "/projects",
);
export default function Projects() {
  return (
    <div className="wrap collection-page">
      <header className="page-heading">
        <h1>Projects</h1>
      </header>
      <ProjectCatalog items={collectionEntries("projects")} />
    </div>
  );
}
