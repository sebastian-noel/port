import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover, Dates } from "../../_components/entries";
import { entries } from "../../_content/entries";
import { pageMetadata } from "../../_lib/site";

type Props = { params: Promise<{ collection: string; slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map(({ collection, slug }) => ({ collection, slug }));
}

async function getEntry(params: Props["params"]) {
  const { collection, slug } = await params;
  const entry = entries.find(
    (entry) => entry.collection === collection && entry.slug === slug,
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
        {entry.role && <p>{entry.role}</p>}
        <Dates entry={entry} />
        <p>{entry.summary}</p>
        {entry.award && <p className="award">{entry.award}</p>}
      </header>
      {entry.collection === "projects" && <Cover entry={entry} />}
      <div className="detail-body">
        {entry.placeholder && <p>Placeholder. Details will be added later.</p>}
        {!!entry.bullets?.length && <ul>{entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
        {entry.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        {entry.links.length > 0 && (
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
