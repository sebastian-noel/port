import type { Metadata } from "next";

// Enable only after the public content and first launch are approved.
const launchApproved = false;

export const site = {
  name: "Sebastian Noel",
  origin: "https://snoel.dev",
  indexable: launchApproved && process.env.VERCEL_ENV === "production",
  profiles: [
    { label: "GitHub", href: "https://github.com/sebastian-noel" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sebastian-noel-ucf/",
    },
    { label: "Devpost", href: "https://devpost.com/sebastian-noel" },
  ],
};

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
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
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: site.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
