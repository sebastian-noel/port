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

export function ProjectCard({
  entry,
  featured = false,
}: {
  entry: Entry;
  featured?: boolean;
}) {
  const Heading = featured ? "h3" : "h2";
  const body = (
    <>
      {featured ? (
        <div className="featured-media">
          {entry.cover.placeholder && entry.demoVideoId ? (
            <div className="cover">
              <Image
                src={`https://i.ytimg.com/vi/${entry.demoVideoId}/hqdefault.jpg`}
                alt=""
                width={480}
                height={360}
                unoptimized
              />
            </div>
          ) : (
            <Cover entry={entry} />
          )}
          {entry.demoClip && (
            <video
              className="featured-clip"
              aria-hidden="true"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src={entry.demoClip}
                media="(prefers-reduced-motion: no-preference)"
              />
            </video>
          )}
          {entry.winnerPhoto && (
            <div className="winner-photo">
              <Cover entry={{ ...entry, cover: entry.winnerPhoto }} />
            </div>
          )}
        </div>
      ) : (
        <Cover entry={entry} />
      )}
      <div className="project-copy">
        <Heading>
          {entry.title}
          {!featured && !entry.placeholder && <Icon name="external" />}
        </Heading>
        <p>{entry.summary}</p>
        {featured && entry.award && (
          <p className="project-awards">{entry.award}</p>
        )}
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
