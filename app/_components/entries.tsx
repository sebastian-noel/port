import Image from "next/image";
import Link from "next/link";
import type { Entry } from "../_content/entries";

export function Cover({ entry }: { entry: Entry }) {
  if (!entry.cover.placeholder) {
    return <Image className="cover-image" src={entry.cover.src} alt={entry.cover.alt} width={entry.cover.width} height={entry.cover.height} sizes="(max-width: 700px) 100vw, 65vw" />;
  }
  return (
    <div className={`cover-placeholder cover-${entry.slug}`}>
      <div className="cover-tiles" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
      <span className="cover-initial" aria-hidden="true">{entry.title.slice(0, 1)}</span>
      <span className="placeholder-label">Project photo coming soon</span>
    </div>
  );
}

export function ProjectList({ entries }: { entries: Entry[] }) {
  return (
    <div className="project-list">
      {entries.map((entry, index) => (
        <article className="project" key={entry.slug}>
          <Link className="project-link" href={`/projects/${entry.slug}`}>
            <Cover entry={entry} />
            <div className="project-copy">
              <span className="eyebrow">{String(index + 1).padStart(2, "0")} / {entry.context}</span>
              <h3>{entry.title} <span className="project-arrow" aria-hidden="true">↗</span></h3>
              <p>{entry.summary}</p>
              {entry.award && <p className="award">{entry.award}</p>}
              <span className="text-link">Explore project</span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function ExperienceList({ entries }: { entries: Entry[] }) {
  return (
    <div className="experience-list">
      {entries.map((entry) => (
        <article key={entry.slug}>
          <Link href={`/experiences/${entry.slug}`}>
            <span className="eyebrow">{entry.context}</span>
            <h3>{entry.title} <span aria-hidden="true">↗</span></h3>
            <p>{entry.summary}</p>
          </Link>
        </article>
      ))}
    </div>
  );
}
