import Link from "next/link";
import { collectionEntries, type Entry } from "../_content/entries";
import { Icon } from "./icons";
import { ShowcaseMotion } from "./showcase-motion";
import styles from "./showcase.module.css";

function FeaturedProject({ entry }: { entry: Entry }) {
  const centerpiece = entry.slug === "permanence";
  const awards = entry.award?.split(" · ") ?? [];
  return (
    <article
      className={`${styles.project} ${centerpiece ? styles.centerpiece : ""}`}
      data-project={entry.slug}
      style={{ gridArea: entry.slug }}
    >
      <Link
        href={`/projects/${entry.slug}`}
        className={styles.projectLink}
        aria-labelledby={`${entry.slug}-title`}
      >
        <div className={styles.projectTopline}>
          <span>{entry.event}</span>
          <Icon name="external" />
        </div>
        <div className={styles.media} data-showcase-media>
          <div className={styles.mediaPlaceholder}>
            <span className={styles.placeholderLabel}>Video placeholder</span>
            <p>{entry.demoBrief}</p>
            <span className={styles.placeholderFooter}>
              <span>Short, silent loop</span>
              <Icon name="play" />
            </span>
          </div>
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
          {awards[0] && (
            <span className={styles.awardFlag}>
              <span aria-hidden="true">✳</span> {awards[0]}
            </span>
          )}
        </div>
        <div className={styles.projectTitle}>
          <h3 id={`${entry.slug}-title`}>{entry.title}</h3>
          <span className={styles.projectArrow}>
            <Icon name="external" />
          </span>
        </div>
        <p className={styles.summary}>{entry.summary}</p>
        {awards.length > 1 && (
          <p className={styles.otherAwards}>
            {awards.slice(1).map((award) => (
              <span key={award}>✳ {award}</span>
            ))}
          </p>
        )}
        <span className={styles.projectCta}>
          Explore project <Icon name="arrow" />
        </span>
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
  // Source order is the reveal order and the natural reading order on phones.
  const featured = ["recall", "greghouse", "permanence"].flatMap((slug) =>
    projects.filter((entry) => entry.slug === slug),
  );

  return (
    <ShowcaseMotion>
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
          <Link className={styles.allLink} href="/projects">
            All projects <Icon name="external" />
          </Link>
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
