import Link from "next/link";
import Image from "next/image";
import { ProjectDiagram } from "../../_components/project-diagrams";
import { notFound } from "next/navigation";
import { Cover } from "../../_components/entries";
import { entries } from "../../_content/entries";
import { pageMetadata } from "../../_lib/site";

function Emphasis({ text }: { text: string }) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) =>
      part.startsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return entries
    .filter((entry) => entry.collection === "projects")
    .map(({ slug }) => ({ slug }));
}

async function getEntry(params: Props["params"]) {
  const { slug } = await params;
  const entry = entries.find(
    (entry) => entry.collection === "projects" && entry.slug === slug,
  );
  if (!entry) notFound();
  return entry;
}

export async function generateMetadata({ params }: Props) {
  const entry = await getEntry(params);
  return pageMetadata(
    entry.title,
    entry.summary,
    `/${entry.collection}/${entry.slug}`,
  );
}

export default async function Detail({ params }: Props) {
  const entry = await getEntry(params);
  return (
    <article
      className={`wrap detail${entry.visualStudy ? " visual-study" : ""}`}
    >
      <Link className="back-link" href={`/${entry.collection}`}>
        ← All {entry.collection}
      </Link>
      <div className={entry.visualStudy ? "study-intro" : undefined}>
        <header className="page-heading">
          <h1>{entry.title}</h1>
          <p>{entry.summary}</p>
          {entry.award && <p className="award">{entry.award}</p>}
        </header>
        {entry.visualStudy ? (
          <figure className="study-hero">
            <Cover entry={entry} />
            {entry.heroCaption && <figcaption>{entry.heroCaption}</figcaption>}
          </figure>
        ) : (
          <Cover entry={entry} />
        )}
      </div>
      <div className={entry.visualStudy ? "study-layout" : undefined}>
        {entry.visualStudy && (
          <nav className="study-nav" aria-label="Case study sections">
            <span className="study-nav-title">On this page</span>
            {entry.sections.map((section) => (
              <a key={section.id ?? section.heading} href={`#${section.id}`}>
                {section.navLabel ?? section.heading}
              </a>
            ))}
            <a href="#demo-heading">Demo</a>
          </nav>
        )}
        <div className="detail-body">
          <dl className="project-facts">
            {entry.event && (
              <div>
                <dt>Event</dt>
                <dd>{entry.event}</dd>
              </div>
            )}
            {entry.role && (
              <div>
                <dt>My role</dt>
                <dd>{entry.role}</dd>
              </div>
            )}
            {!!entry.team?.length && (
              <div>
                <dt>Team</dt>
                <dd>
                  {entry.team.map((name, index) => {
                    const profile = entry.teamProfiles?.find(
                      (person) => person.name === name,
                    );
                    return (
                      <span key={name}>
                        {index > 0 ? ", " : ""}
                        {profile ? (
                          <a
                            href={profile.href}
                            aria-label={`${name} on LinkedIn`}
                          >
                            {name}
                          </a>
                        ) : (
                          name
                        )}
                      </span>
                    );
                  })}
                </dd>
              </div>
            )}
            {!!entry.technologies?.length && (
              <div>
                <dt>Built with</dt>
                <dd>{entry.technologies.join(" · ")}</dd>
              </div>
            )}
          </dl>
          {entry.placeholder && (
            <p>Placeholder. Details will be added later.</p>
          )}
          {!!entry.bullets?.length && (
            <ul>
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {entry.sections.map((section) => (
            <section key={section.heading} id={section.id}>
              <h2>{section.heading}</h2>
              <p>
                <Emphasis text={section.text} />
              </p>
              {section.paragraphs?.map((text) => (
                <p key={text}>
                  <Emphasis text={text} />
                </p>
              ))}
              {section.diagram && <ProjectDiagram kind={section.diagram} />}
              {section.image && (
                <figure className="study-image">
                  <a
                    href={section.image.src}
                    aria-label={`Open full image: ${section.image.alt}`}
                  >
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={section.image.width}
                      height={section.image.height}
                      sizes="(max-width: 900px) 100vw, 1100px"
                    />
                  </a>
                  <figcaption>{section.image.caption}</figcaption>
                </figure>
              )}
            </section>
          ))}
          {entry.demoVideoId && (
            <section className="project-demo" aria-labelledby="demo-heading">
              <h2 id="demo-heading">Watch the demo</h2>
              <p>{entry.demoBrief}</p>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${entry.demoVideoId}`}
                title={`${entry.title} demo`}
                width="560"
                height="315"
                loading="lazy"
                allow="encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                className="text-link"
                href={`https://www.youtube.com/watch?v=${entry.demoVideoId}`}
              >
                Watch {entry.title} on YouTube
              </a>
            </section>
          )}
          {entry.collection === "projects" && entry.links.length > 0 && (
            <nav className="detail-links" aria-label="Project links">
              {entry.links.map((link) => (
                <a className="text-link" href={link.href} key={link.href}>
                  {link.label} ↗
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
