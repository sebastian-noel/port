import Link from "next/link";
import Image from "next/image";
import { collectionEntries, type Entry } from "../_content/entries";
import { Icon } from "./icons";
import { ShowcaseMotion } from "./showcase-motion";
import styles from "./showcase.module.css";

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
    detail: "Two internships through UCF's experiential program.",
    slugs: ["bny", "bny-spring"],
    labels: ["Infrastructure engineering", "Fault remediation"],
    mark: "2×",
  },
  {
    name: "UCF Institute of AI",
    role: "Undergraduate research",
    detail: "Efficient long-video understanding and test-time training.",
    slugs: ["ucf-ai"],
    labels: ["Explore the research"],
    mark: "AI",
  },
  {
    name: "Knight Hacks",
    role: "Mentoring & outreach",
    detail: "Supporting UCF's hackathon community.",
    slugs: ["knight-hacks"],
    labels: ["Explore the experience"],
    mark: "KH",
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
        className={styles.experiences}
        aria-labelledby="featured-experiences-heading"
      >
        <div className={styles.experienceIntro}>
          <h2
            id="featured-experiences-heading"
            aria-label="Featured Experiences"
          >
            Featured
            <br />
            Experiences<span className={styles.period}>.</span>
          </h2>
          <Link className={styles.allLink} href="/experiences">
            All experiences <Icon name="external" />
          </Link>
        </div>
        <div className={styles.experienceList}>
          {experienceHighlights.map((highlight) => {
            const links = highlight.slugs.flatMap((slug, index) =>
              experiences
                .filter((entry) => entry.slug === slug)
                .map((entry) => ({ entry, label: highlight.labels[index] })),
            );
            if (!links.length) return null;
            return (
              <article
                className={styles.experience}
                key={highlight.name}
                data-experience
              >
                <div className={styles.experienceMark} aria-hidden="true">
                  {highlight.mark}
                </div>
                <div className={styles.experienceCopy}>
                  <p className={styles.experienceRole}>{highlight.role}</p>
                  <h3>{highlight.name}</h3>
                  <p className={styles.experienceDetail}>{highlight.detail}</p>
                  <div className={styles.experienceLinks}>
                    {links.map(({ entry, label }) => (
                      <Link
                        href={`/experiences/${entry.slug}`}
                        key={entry.slug}
                      >
                        {label}
                        <Icon name="external" />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </ShowcaseMotion>
  );
}
