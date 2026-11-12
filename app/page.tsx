import Link from "next/link";
import { ProjectCard } from "./_components/entries";
import { Icon } from "./_components/icons";
import { NameIntro } from "./_components/name-intro";
import { collectionEntries } from "./_content/entries";
import { pageMetadata } from "./_lib/site";

export const metadata = pageMetadata(
  "Sebastian Noel",
  "Sebastian Noel's projects, experience, and experiments in software and hardware.",
  "/",
);

const experienceHighlights = [
  { title: "2× SWE @ BNY", slugs: ["bny", "bny-spring"] },
  {
    title: "Undergrad Research @ Institute of Artificial Intelligence",
    slugs: ["ucf-ai"],
  },
  { title: "Mentor & Outreach @ Knight Hacks", slugs: ["knight-hacks"] },
];

export default function Home() {
  const experiences = collectionEntries("experiences");
  const featuredExperiences = experienceHighlights.map(({ title, slugs }) => ({
    title,
    entries: experiences.filter((entry) => slugs.includes(entry.slug)),
  }));
  const projects = collectionEntries("projects");
  const featuredProjects = ["recall", "permanence", "greghouse"].flatMap(
    (slug) => projects.filter((entry) => entry.slug === slug),
  );

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
      <section
        className="wrap featured-experiences"
        aria-labelledby="featured-experiences-heading"
      >
        <h2 id="featured-experiences-heading">Featured Experiences</h2>
        <div className="project-grid">
          {featuredExperiences
            .filter(({ entries }) => entries.length > 0)
            .map(({ title, entries }) => (
              <article className="experience-highlight" key={title}>
                <h3>{title}</h3>
                <ul>
                  {entries.map((entry) => (
                    <li key={entry.slug}>
                      <Link href={`/experiences/${entry.slug}`}>
                        {entry.summary}
                        <Icon name="arrow" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
        </div>
      </section>
      <section className="wrap game-space" aria-labelledby="game-heading">
        <h2 className="sr-only" id="game-heading">
          Typing game, coming later
        </h2>
      </section>
    </>
  );
}
