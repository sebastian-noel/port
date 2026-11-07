import { pageMetadata } from "../_lib/site";
import { Icon } from "../_components/icons";
export const metadata = pageMetadata("Resume", "Sebastian Noel's resume: engineering, research, projects, and skills.", "/resume");
export default function Resume() {
  return <div className="wrap resume-page"><header className="page-heading"><h1>Resume</h1></header><a className="button" href="/resume.pdf" target="_blank" rel="noopener noreferrer"><Icon name="file" />Open resume PDF<Icon name="external" /><span className="sr-only"> (opens in a new tab)</span></a><p className="resume-caption">Sebastian Noel · Engineering, research, and projects</p></div>;
}
