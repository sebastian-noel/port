import Link from "next/link";
import { collectionEntries } from "../_content/entries";
import { pageMetadata, site } from "../_lib/site";

export const metadata = pageMetadata("Resume", "Sebastian Noel's selected experience, projects, and public profiles.", "/resume");

export default function Resume() {
  return <div className="wrap resume-page"><header className="page-heading"><p className="eyebrow">Selected experience & work</p><h1>Resume.</h1><p>Sebastian Noel</p><p className="draft-note">A first look at my work. The full resume and downloadable PDF are being prepared.</p></header>
    {(["experiences", "projects"] as const).map((collection) => <section className="resume-section" key={collection}><h2>{collection === "experiences" ? "Experience" : "Projects"}</h2><div>{collectionEntries(collection).map((entry) => <article key={entry.slug}><h3><Link href={`/${collection}/${entry.slug}`}>{entry.title} ↗</Link></h3><p className="eyebrow">{entry.context}</p><p>{entry.summary}</p>{entry.award && <p className="award">{entry.award}</p>}</article>)}</div></section>)}
    <nav className="profile-links" aria-label="Resume profiles">{site.profiles.map((profile) => <a className="text-link" href={profile.href} key={profile.label}>{profile.label} ↗</a>)}</nav>
  </div>;
}
