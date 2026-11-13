import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Varela_Round } from "next/font/google";
import { TileField } from "./_components/tile-field";
import { Icon } from "./_components/icons";
import { Navigation } from "./_components/navigation";
import { site } from "./_lib/site";
import "./globals.css";

const font = Varela_Round({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: site.name, template: `%s | ${site.name}` },
  robots: { index: site.indexable, follow: site.indexable },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <TileField />
        <Navigation />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer-band">
          <div className="site-footer wrap">
            <span>© 2026 Sebastian Noel</span>
            <span className="footer-credit">
              Made with{" "}
              <span className="footer-heart" role="img" aria-label="love">
                <svg viewBox="0 0 32 30" aria-hidden="true">
                  <path
                    className="heart-back"
                    d="M16 27S2 19 2 10C2 3 10 0 16 7 22 0 30 3 30 10c0 9-14 17-14 17Z"
                  />
                  <path
                    className="heart-front"
                    d="M16 24S5 17 5 10c0-5 6-7 11-1 5-6 11-4 11 1 0 7-11 14-11 14Z"
                  />
                </svg>
                <span className="heart-particles" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </span>{" "}
              by Sebastian
            </span>
            <nav aria-label="Footer">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume (PDF, opens in a new tab)"
              >
                Resume <Icon name="external" />
              </a>
              {site.profiles.map((profile) => (
                <a
                  href={profile.href}
                  key={profile.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.label}
                  <Icon name="external" />
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
