import Image from "next/image";
import Link from "next/link";
import type { Entry } from "../_content/entries";
import { Icon } from "./icons";

export function Cover({ entry }: { entry: Entry }) {
  return entry.cover.placeholder ? (
    <div
      className={`cover placeholder-cover tone-${entry.tone ?? "pale"}`}
      aria-hidden="true"
    >
      <span>{entry.placeholder ? "+" : entry.title.charAt(0)}</span>
    </div>
  ) : (
    <div className="cover">
      <Image
        src={entry.cover.src}
        alt={entry.cover.alt}
        width={entry.cover.width}
        height={entry.cover.height}
        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
      />
    </div>
  );
}

export function ProjectCard({ entry }: { entry: Entry }) {
  const body = (
    <>
      <Cover entry={entry} />
      <div className="project-copy">
        <h2>
          {entry.title}
          {!entry.placeholder && <Icon name="external" />}
        </h2>
        <p>{entry.summary}</p>
      </div>
    </>
  );
  return (
    <article
      className={`project-card${entry.placeholder ? " is-placeholder" : ""}`}
    >
      {entry.placeholder ? (
        body
      ) : (
        <Link href={`/projects/${entry.slug}`}>{body}</Link>
      )}
    </article>
  );
}

function month(date: string) {
  const [year, number] = date.split("-");
  return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(number) - 1]} ${year}`;
}

export function Dates({ entry }: { entry: Entry }) {
  if (!entry.startDate) return null;
  return (
    <p className="dates">
      <time dateTime={entry.startDate}>{month(entry.startDate)}</time>
      <span> — </span>
      {entry.endDate ? (
        <time dateTime={entry.endDate}>{month(entry.endDate)}</time>
      ) : (
        "Present"
      )}
    </p>
  );
}

export function ExperienceList({ items }: { items: Entry[] }) {
  return (
    <div className="timeline">
      {items.map((entry) => (
        <article
          className={`timeline-entry${entry.placeholder ? " is-placeholder" : ""}`}
          key={entry.slug}
        >
          <div className="timeline-date">
            <Dates entry={entry} />
          </div>
          <div className="experience-card">
            <div className="experience-top">
              <Cover entry={entry} />
              <div>
                <h2>
                  {entry.placeholder ? (
                    entry.title
                  ) : (
                    <Link href={`/experiences/${entry.slug}`}>
                      {entry.title}
                      <Icon name="external" />
                    </Link>
                  )}
                </h2>
                {entry.role && <p className="role">{entry.role}</p>}
              </div>
            </div>
            <p>{entry.summary}</p>
            {!!entry.bullets?.length && (
              <ul>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CompactList({
  title,
  collection,
  items,
}: {
  title: string;
  collection: "projects" | "experiences";
  items: Entry[];
}) {
  return (
    <section className="compact-section">
      <h2>
        <Link href={`/${collection}`}>
          {title}
          <Icon name="arrow" />
        </Link>
      </h2>
      <ul>
        {items.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/${collection}/${entry.slug}`}>
              <Cover entry={entry} />
              <span>{entry.title}</span>
              <Icon name="external" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
