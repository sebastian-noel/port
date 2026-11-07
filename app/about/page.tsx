import Link from "next/link";
import { pageMetadata, site } from "../_lib/site";

export const metadata = pageMetadata("About", "Meet Sebastian Noel and explore his work, experiences, and public profiles.", "/about");

export default function About() {
  const profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.origin}/about`,
    mainEntity: {
      "@type": "Person",
      "@id": `${site.origin}/about#sebastian-noel`,
      name: site.name,
      url: site.origin,
      sameAs: site.profiles.map((profile) => profile.href),
    },
  };
  return <div className="wrap about-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, "\\u003c") }} />
    <header className="page-heading"><p className="eyebrow">The person behind the projects</p><h1>Hi, I’m Sebastian.</h1></header>
    <div className="about-columns"><div className="portrait-placeholder"><div className="personal-tiles" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div><p>Portrait coming soon</p></div><div className="prose"><p className="lead">I’m interested in what happens when software meets the physical world.</p><p>My projects explore that connection through robotics, wearable AI, and connected devices. Hackathons give me a chance to build alongside friends and turn an idea into something we can try.</p><p>At UCF, I’m involved in the Knight Hacks community and lead development for Graphics Programming Knights.</p><Link className="text-link" href="/experiences">Explore my experiences ↗</Link><nav className="profile-links" aria-label="Public profiles">{site.profiles.map((profile) => <a className="text-link" href={profile.href} key={profile.label}>{profile.label} ↗</a>)}</nav></div></div>
  </div>;
}
