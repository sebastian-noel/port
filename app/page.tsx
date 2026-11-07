import Link from "next/link";
import { ExperienceList, ProjectList } from "./_components/entries";
import { collectionEntries } from "./_content/entries";
import { pageMetadata } from "./_lib/site";

export const metadata = pageMetadata("Home", "Sebastian Noel's portfolio of software, robotics, hackathon projects, and engineering experiences.", "/");

export default function Home() {
  return (
    <>
      <section className="hero wrap" aria-labelledby="home-title">
        <div className="hero-tiles" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <span key={i} />)}</div>
        <div className="hero-content">
          <p className="eyebrow">Software, hardware & a healthy dose of curiosity</p>
          <h1 id="home-title">Sebastian Noel</h1>
          <p className="hero-intro">I like making things that connect the digital world to the one around us.</p>
          <div className="hero-actions"><Link className="button" href="/projects">Explore my work <span aria-hidden="true">↗</span></Link><Link className="hero-secondary" href="/about">A bit about me <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>
      <section className="section wrap" aria-labelledby="work-title">
        <div className="section-heading"><div><p className="eyebrow">Built with a team. Learned by doing.</p><h2 id="work-title">Selected work.</h2></div><Link className="text-link" href="/projects">All projects ↗</Link></div>
        <ProjectList entries={collectionEntries("projects").filter((entry) => entry.featured)} />
      </section>
      <section className="experience-section" aria-labelledby="experience-title"><div className="wrap section">
        <div className="section-heading"><div><p className="eyebrow">People, teams & places</p><h2 id="experience-title">Along the way.</h2></div><Link className="text-link" href="/experiences">All experiences ↗</Link></div>
        <ExperienceList entries={collectionEntries("experiences").filter((entry) => entry.featured)} />
      </div></section>
      <section className="about-teaser wrap section" aria-labelledby="about-title">
        <div className="personal-tiles" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div>
        <div><p className="eyebrow">Outside the project window</p><h2 id="about-title">Hi, I’m Sebastian.</h2><p>Building with friends, getting involved in the UCF community, and finding another idea to try.</p><Link className="text-link" href="/about">More about me ↗</Link></div>
      </section>
    </>
  );
}
