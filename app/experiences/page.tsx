import { ExperienceList } from "../_components/entries";
import { collectionEntries } from "../_content/entries";
import { pageMetadata } from "../_lib/site";
export const metadata = pageMetadata("Experiences", "Sebastian Noel's engineering, research, and community experience.", "/experiences");
export default function Experiences() {
  return <div className="wrap collection-page"><header className="page-heading"><h1>Experiences</h1></header><ExperienceList items={collectionEntries("experiences")} /></div>;
}
