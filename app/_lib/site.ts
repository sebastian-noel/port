import type { Metadata } from "next";

export const site = {
  name: "Sebastian Noel",
  origin: "https://snoel.dev",
  // Enable only after the public content and first launch are approved.
  indexable: false,
  profiles: [
    { label: "GitHub", href: "https://github.com/sebastian-noel" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sebastian-noel-ucf/" },
    { label: "Devpost", href: "https://devpost.com/sebastian-noel" },
  ],
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
