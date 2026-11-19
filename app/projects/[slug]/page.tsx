import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "../../_components/entries";
import { entries } from "../../_content/entries";
import { pageMetadata } from "../../_lib/site";

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
    <article className="wrap detail">
      <Link className="back-link" href={`/${entry.collection}`}>
        ← All {entry.collection}
      </Link>
      <header className="page-heading">
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
        {entry.award && <p className="award">{entry.award}</p>}
      </header>
      <Cover entry={entry} />
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
              <dd>{entry.team.join(", ")}</dd>
            </div>
          )}
          {!!entry.technologies?.length && (
            <div>
              <dt>Built with</dt>
              <dd>{entry.technologies.join(" · ")}</dd>
            </div>
          )}
        </dl>
        {entry.placeholder && <p>Placeholder. Details will be added later.</p>}
        {!!entry.bullets?.length && (
          <ul>
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
        {entry.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
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
    </article>
  );
}
