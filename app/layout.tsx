import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
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
        <a className="skip-link" href="#content">Skip to content</a>
        <Navigation />
        <main id="content" tabIndex={-1}>{children}</main>
        <footer className="site-footer wrap">
          <div><Link className="footer-name" href="/">Sebastian Noel<span aria-hidden="true">.</span></Link><p>A little curiosity. A lot of building.</p></div>
          <nav aria-label="Footer"><Link href="/resume">Resume</Link>{site.profiles.map((profile) => <a href={profile.href} key={profile.label}>{profile.label} ↗</a>)}</nav>
        </footer>
      </body>
    </html>
  );
}
