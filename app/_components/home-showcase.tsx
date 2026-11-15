import Link from "next/link";
import Image from "next/image";
import { collectionEntries, type Entry } from "../_content/entries";
import { Icon } from "./icons";
import { ShowcaseMotion } from "./showcase-motion";
import styles from "./showcase.module.css";
import impact from "./home-experiences.module.css";

function FeaturedProject({ entry }: { entry: Entry }) {
  const centerpiece = entry.slug === "permanence";
  const awards = entry.featuredAwards ?? [];
  return (
    <article
      className={`${styles.project} ${centerpiece ? styles.centerpiece : ""}`}
      data-project={entry.slug}
    >
      <div className={styles.skeleton} data-project-skeleton aria-hidden="true">
        <div className={styles.skeletonMedia} />
        <div className={styles.skeletonLines}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <Link
        href={`/projects/${entry.slug}`}
        className={styles.projectLink}
        aria-labelledby={`${entry.slug}-title`}
        data-project-reveal
      >
        <div className={styles.projectPreview}>
          <div className={styles.projectHeader}>
            {awards.length > 0 && (
              <ul
                className={styles.awards}
                aria-label={`${entry.title} awards`}
              >
                {awards.map((award) => (
                  <li
                    className={styles.awardFlag}
                    key={award.id}
                    data-award={award.id}
                    aria-label={`${award.placement} ${award.label}, out of ${award.total} projects`}
                  >
                    <span className={styles.awardLogo}>
                      <Image src={award.logo} alt="" width={64} height={64} />
                    </span>
                    <span className={styles.awardCopy}>
                      <span className={styles.awardRank} aria-hidden="true">
                        <strong>{award.placement}</strong>
                        <span> / {award.total}</span>
                      </span>
                      <span className={styles.awardLabel}>{award.label}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.media} data-showcase-media>
            <div className={styles.mediaVisual} data-showcase-visual>
              {entry.demoPoster ? (
                <Image
                  className={styles.clip}
                  src={entry.demoPoster}
                  alt={entry.demoPosterAlt ?? ""}
                  fill
                  sizes="(max-width: 899px) 94vw, (max-width: 1199px) 820px, (max-width: 2200px) 40vw, 880px"
                />
              ) : (
                <div className={styles.mediaPlaceholder}>
                  <span>Video placeholder</span>
                  <p>{entry.demoBrief}</p>
                </div>
              )}
              {entry.demoClip && (
                <video
                  className={styles.clip}
                  data-src={entry.demoClip}
                  poster={entry.demoPoster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className={styles.projectCopy} data-project-copy>
              <div className={styles.projectTitle}>
                <h3 id={`${entry.slug}-title`}>{entry.title}</h3>
                <span className={styles.projectArrow}>
                  <Icon name="external" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.summary} data-project-description>
          {entry.featuredSummary ?? entry.summary}
        </p>
      </Link>
    </article>
  );
}

const experienceHighlights = [
  {
    name: "BNY",
    role: "Software engineering",
    detail:
      "Cloud infrastructure, service monitoring, and automated recovery for financial microservices.",
    slugs: ["bny", "bny-spring"],
    labels: ["Infrastructure engineering", "Fault remediation"],
    metric: "2×",
    metricLabel: "software engineering internships",
  },
  {
    name: "UCF Institute of AI",
    role: "Undergraduate research",
    detail:
      "Making long-video understanding more efficient, with less repeated computation and more temporal context.",
    slugs: ["ucf-ai"],
    labels: ["Explore the research"],
    metric: "2.5M",
    metricLabel: "frames evaluated across 47 videos",
  },
  {
    name: "Knight Hacks",
    role: "Mentoring & outreach",
    detail:
      "Helping students find their footing through Kickstart mentorship, projects, and hackathon outreach.",
    slugs: ["knight-hacks"],
    labels: ["Mentorship & outreach"],
    metric: "4",
    metricLabel: "students mentored through Kickstart",
  },
];

export function HomeShowcase() {
  const projects = collectionEntries("projects");
  const experiences = collectionEntries("experiences");
  // Source order keeps the lead project first for mobile and keyboard navigation.
  const featured = ["permanence", "recall", "greghouse"].flatMap((slug) =>
    projects.filter((entry) => entry.slug === slug),
  );

  return (
    <ShowcaseMotion>
      <svg
        className={styles.filters}
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="award-logo-outline"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
          >
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="0.4"
              result="outline"
            />
            <feFlood floodColor="white" />
            <feComposite in2="outline" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <section
        className={styles.work}
        id="workspace"
        aria-labelledby="featured-projects-heading"
      >
        <div className={styles.sectionHeading}>
          <h2 id="featured-projects-heading" aria-label="Featured Projects">
            Featured
            <br />
            <span>
              Projects<span className={styles.period}>.</span>
            </span>
          </h2>
        </div>
        <div className={styles.projectStage} data-project-stage>
          {featured.map((entry) => (
            <FeaturedProject key={entry.slug} entry={entry} />
          ))}
        </div>
      </section>
      <section
        className={impact.section}
        aria-labelledby="home-experiences-heading"
      >
        <div className={impact.inner}>
          <div className={impact.heading}>
            <h2 id="home-experiences-heading" aria-label="In Good Company">
              In Good{" "}
              <span>
                Company<span className={styles.period}>.</span>
              </span>
            </h2>
            <Link className={impact.allLink} href="/experiences">
              All experiences <Icon name="arrow" />
            </Link>
          </div>
          <div className={impact.highlights}>
            {experienceHighlights.map((highlight) => {
              const links = highlight.slugs.flatMap((slug, index) =>
                experiences
                  .filter((entry) => entry.slug === slug)
                  .map((entry) => ({ entry, label: highlight.labels[index] })),
              );
              if (!links.length) return null;
              return (
                <article
                  className={impact.experience}
                  key={highlight.name}
                  data-experience={highlight.slugs[0]}
                  aria-labelledby={`home-${highlight.slugs[0]}-role`}
                >
                  <div className={impact.copy}>
                    <p className={impact.organization}>{highlight.name}</p>
                    <h3 id={`home-${highlight.slugs[0]}-role`}>
                      {highlight.role}
                    </h3>
                    <p className={impact.detail}>{highlight.detail}</p>
                  </div>
                  <p className={impact.metric}>
                    <span className={impact.figure}>{highlight.metric}</span>
                    <span>{highlight.metricLabel}</span>
                  </p>
                  <div className={impact.links}>
                    {links.map(({ entry, label }) => (
                      <Link
                        href={`/experiences#${entry.slug}`}
                        key={entry.slug}
                      >
                        {label}
                        <Icon name="arrow" />
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </ShowcaseMotion>
  );
}
