import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { TileField } from "./_components/tile-field";
import { Icon } from "./_components/icons";
import { Navigation } from "./_components/navigation";
import { site } from "./_lib/site";
import "./globals.css";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

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
        <footer className="site-footer wrap">
          <span>© 2026 Sebastian Noel</span>
          <nav aria-label="Footer">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume (PDF, opens in a new tab)"
            >
              <Icon name="file" />
              Resume
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
        </footer>
      </body>
    </html>
  );
}
