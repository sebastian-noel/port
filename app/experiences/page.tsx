import { ExperienceList } from "../_components/entries";
import { collectionEntries } from "../_content/entries";
import { pageMetadata } from "../_lib/site";

export const metadata = pageMetadata("Experiences", "Sebastian Noel's engineering, experiential learning, and student organization involvement.", "/experiences");

export default function Experiences() {
  return <div className="wrap"><header className="page-heading"><p className="eyebrow">Learning together</p><h1>Experiences.</h1><p>The teams and communities that have shaped how I build.</p></header><section className="section collection" aria-label="Experiences"><ExperienceList entries={collectionEntries("experiences")} /></section></div>;
}
