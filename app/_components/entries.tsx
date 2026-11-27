import Image from "next/image";
import Link from "next/link";
import type { Entry } from "../_content/entries";
import { Icon } from "./icons";
import { ExperienceGallery } from "./experience-gallery";
import { ExperienceTimeline } from "./experience-timeline";
import styles from "./experiences.module.css";

export function Cover({ entry }: { entry: Entry }) {
  return entry.cover.placeholder && entry.demoVideoId ? (
    <div className="cover">
      <Image
        src={`https://i.ytimg.com/vi/${entry.demoVideoId}/hqdefault.jpg`}
        alt={`${entry.title} demo video thumbnail`}
        width={480}
        height={360}
        sizes="(max-width: 900px) 100vw, 50vw"
        unoptimized
      />
    </div>
  ) : entry.cover.placeholder ? (
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
        sizes="(max-width: 900px) 100vw, 50vw"
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
      {!featured && (
        <div className="project-title">
          <h2>
            {entry.title}
            {!entry.placeholder && <Icon name="external" />}
          </h2>
        </div>
      )}
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
        {featured && <Heading>{entry.title}</Heading>}
        <p>{entry.summary}</p>
        {!featured && (
          <div className="catalog-footer">
            {entry.award ? (
              <p className="catalog-result">
                <span aria-hidden="true">✦</span>
                <span>{entry.award}</span>
              </p>
            ) : (
              <span>Explore the project</span>
            )}
          </div>
        )}
        {featured && entry.award && (
          <p className="project-awards">{entry.award}</p>
        )}
      </div>
    </>
  );
  return (
    <article
      className={`project-card${featured ? "" : " catalog-card"}${entry.placeholder ? " is-placeholder" : ""}`}
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
      <span> to </span>
      {entry.endDate ? (
        <time dateTime={entry.endDate}>{month(entry.endDate)}</time>
      ) : (
        "Present"
      )}
    </p>
  );
}

export function ExperienceRoles({ entry }: { entry: Entry }) {
  if (!entry.roles?.length) return null;
  return (
    <div className="experience-roles">
      {entry.roles.map((role) => (
        <div key={role.title}>
          <p className="role">{role.title}</p>
          <Dates entry={{ ...entry, ...role }} />
        </div>
      ))}
    </div>
  );
}

export function ExperienceResources({ entry }: { entry: Entry }) {
  if (!entry.links.length) return null;
  return (
    <section
      className="experience-resources"
      aria-label={`${entry.title} resources`}
    >
      <h3>Links & Resources</h3>
      <div className="detail-links">
        {entry.links.map((link) => (
          <a className="text-link" href={link.href} key={link.href}>
            {link.label} <Icon name="external" />
          </a>
        ))}
      </div>
    </section>
  );
}

export function ExperienceList({ items }: { items: Entry[] }) {
  return (
    <ExperienceTimeline
      items={items.map((entry) => ({
        slug: entry.slug,
        title: entry.organizationShortName ?? entry.title,
        date: entry.startDate ? month(entry.startDate) : "",
      }))}
    >
      {items.map((entry) => (
        <article
          className={`timeline-entry ${styles.entry}`}
          id={entry.slug}
          key={entry.slug}
          aria-labelledby={`${entry.slug}-role`}
        >
          <div className={styles.cardDate}>
            <Dates entry={entry} />
          </div>
          <div
            className={`experience-card ${styles.card}`}
            data-experience-card
          >
            <div className={styles.identity}>
              <div
                className={styles.logo}
                data-logo={entry.logoText?.toLowerCase()}
              >
                {entry.logo ? (
                  <Image
                    src={entry.logo.src}
                    alt={entry.logo.alt}
                    width={64}
                    height={64}
                  />
                ) : (
                  <span aria-label={entry.title}>
                    {entry.logoText ?? entry.title.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h2 id={`${entry.slug}-role`} tabIndex={-1}>
                  {entry.role}
                </h2>
                <p className={`organization ${styles.organization}`}>
                  {entry.title}
                </p>
              </div>
              <p className={styles.description}>{entry.summary}</p>
            </div>
            <ExperienceGallery
              entry={{ title: entry.title, gallery: entry.gallery }}
            />
            <div className={styles.copy}>
              <details className={styles.details}>
                <summary>
                  <span className={styles.showLabel}>Show more details</span>
                  <span className={styles.hideLabel}>Hide details</span>
                  <span className="sr-only">
                    {" "}
                    for {entry.title},{" "}
                    {entry.startDate ? month(entry.startDate) : entry.role}
                  </span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className={styles.detailsBody}>
                  <ExperienceRoles entry={entry} />
                  {!!entry.bullets?.length && (
                    <ul>
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>
                          {bullet
                            .split(/(\*\*[^*]+\*\*)/g)
                            .map((part, index) =>
                              part.startsWith("**") ? (
                                <strong key={index}>{part.slice(2, -2)}</strong>
                              ) : (
                                part
                              ),
                            )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {entry.sections.map((section) => (
                    <section
                      className={styles.extraSection}
                      key={section.heading}
                    >
                      <h3>{section.heading}</h3>
                      <p>{section.text}</p>
                    </section>
                  ))}
                  <ExperienceResources entry={entry} />
                </div>
              </details>
            </div>
          </div>
        </article>
      ))}
    </ExperienceTimeline>
  );
}
