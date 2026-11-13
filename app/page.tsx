import { HomeShowcase } from "./_components/home-showcase";
import { NameIntro } from "./_components/name-intro";
import { pageMetadata } from "./_lib/site";

export const metadata = pageMetadata(
  "Sebastian Noel",
  "Sebastian Noel's projects, experience, and experiments in software and hardware.",
  "/",
);

export default function Home() {
  return (
    <>
      <div className="wrap home">
        <NameIntro />
      </div>
      <HomeShowcase />
      <section className="wrap game-space" aria-labelledby="game-heading">
        <h2 className="sr-only" id="game-heading">
          Typing game, coming later
        </h2>
      </section>
    </>
  );
}
