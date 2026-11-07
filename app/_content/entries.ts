import { existsSync } from "node:fs";
import { site } from "../_lib/site";

export type Collection = "projects" | "experiences";
export type Entry = {
  collection: Collection;
  slug: string;
  title: string;
  summary: string;
  context: string;
  published: boolean;
  featured: boolean;
  award?: string;
  cover: { placeholder: true } | {
    placeholder: false;
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  sections: { heading: string; text: string }[];
  links: { label: string; href: string }[];
};

// Draft summaries describe team projects, not individual ownership.
export const records: Entry[] = [
  {
    collection: "projects",
    slug: "permanence",
    title: "Permanence",
    summary: "A robot that remembers objects, even when they disappear from view.",
    context: "Robotics · Knight Hacks IX",
    published: false,
    featured: true,
    award: "1st overall · NVIDIA · Hugging Face",
    cover: { placeholder: true },
    sections: [
      {
        heading: "Out of sight. Still in memory.",
        text: "Permanence gives a rover a persistent 3D memory of its surroundings. The team combined an iPhone's camera and depth data with vision models on an NVIDIA Jetson Orin Nano to track objects through occlusion.",
      },
      {
        heading: "From perception to action",
        text: "A language request identifies a target, while a tracker maintains its identity and position. The rover can use that remembered world state when the target is no longer visible to its camera.",
      },
    ],
    links: [{ label: "View on Devpost", href: "https://devpost.com/software/permanence" }],
  },
  {
    collection: "projects",
    slug: "recall",
    title: "Recall",
    summary: "Wearable AI memory, built into a pair of glasses.",
    context: "Wearables · HackUSF 2026",
    published: false,
    featured: true,
    award: "2nd overall",
    cover: { placeholder: true },
    sections: [
      {
        heading: "A memory you can ask",
        text: "Recall is a team-built prototype that captures visual and audio context through ESP32 hardware on a glasses frame. It organizes those observations so a person can ask about something they saw or heard.",
      },
      {
        heading: "Making moments searchable",
        text: "The system combines a vision pipeline, audio transcription, and semantic search. A web dashboard presents the memory timeline and hardware status. The prototype received second place overall at HackUSF 2026.",
      },
    ],
    links: [{ label: "View on Devpost", href: "https://devpost.com/software/recall-oswlh3" }],
  },
  {
    collection: "projects",
    slug: "greghouse",
    title: "GregHouse",
    summary: "A living plant, a moisture sensor, and a multiplayer virtual garden.",
    context: "Connected devices · BloomKnights 2026",
    published: false,
    featured: true,
    award: "3rd overall",
    cover: { placeholder: true },
    sections: [
      {
        heading: "A garden in two worlds",
        text: "GregHouse connects a real plant to a shared pixel-art garden. An ESP32 reads soil moisture, and that reading influences the virtual plant's mood. Visitors can explore together and alert the owner when a plant needs water.",
      },
      {
        heading: "From sensor to shared experience",
        text: "The team's pipeline carries sensor readings through AWS into the garden. The project brings physical hardware and multiplayer web interactions together, and received third place overall at BloomKnights 2026.",
      },
    ],
    links: [{ label: "View on Devpost", href: "https://devpost.com/software/greghouse" }],
  },
  {
    collection: "experiences",
    slug: "bny",
    title: "BNY",
    summary: "Exploring engineering through UCF's experiential internship program.",
    context: "Experiential learning · UCF × BNY",
    published: false,
    featured: true,
    cover: { placeholder: true },
    sections: [],
    links: [],
  },
  {
    collection: "experiences",
    slug: "knight-hacks",
    title: "Knight Hacks",
    summary: "Outreach and involvement in UCF's hackathon community.",
    context: "Student community · Outreach",
    published: false,
    featured: true,
    cover: { placeholder: true },
    sections: [],
    links: [],
  },
  {
    collection: "experiences",
    slug: "graphics-programming-knights",
    title: "Graphics Programming Knights",
    summary: "Leading development of a student organization's website and Discord bot.",
    context: "Student organization · Development lead",
    published: false,
    featured: true,
    cover: { placeholder: true },
    sections: [],
    links: [],
  },
];

export function validateEntries(items: Entry[]) {
  const paths = new Set<string>();
  for (const entry of items) {
    const path = `/${entry.collection}/${entry.slug}`;
    if (!["projects", "experiences"].includes(entry.collection) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || paths.has(path) ||
      !entry.title.trim() || !entry.summary.trim() || !entry.context.trim()) {
      throw new Error(`Invalid or duplicate content record: ${path}`);
    }
    paths.add(path);
    for (const link of entry.links) {
      if (!link.label.trim() || new URL(link.href).protocol !== "https:") {
        throw new Error(`Invalid content link: ${path}`);
      }
    }
    if (!entry.cover.placeholder) {
      if (!/^\/media\/[a-z0-9/-]+\.(avif|webp|png|jpg|jpeg)$/.test(entry.cover.src) ||
        !entry.cover.alt.trim() || !Number.isInteger(entry.cover.width) || !Number.isInteger(entry.cover.height) || entry.cover.width <= 0 || entry.cover.height <= 0) {
        throw new Error(`Invalid cover: ${path}`);
      }
    }
    if (entry.published && (entry.cover.placeholder || entry.sections.length === 0)) {
      throw new Error(`Published record needs real media and body: ${path}`);
    }
    if (entry.sections.some((section) => !section.heading.trim() || !section.text.trim())) {
      throw new Error(`Empty content section: ${path}`);
    }
  }
}

validateEntries(records);
for (const entry of records) {
  if (!entry.cover.placeholder && !existsSync(`public${entry.cover.src}`)) {
    throw new Error(`Missing cover file: ${entry.cover.src}`);
  }
}

export function visibleEntries(items: Entry[], indexable: boolean) {
  return items.filter((entry) => entry.published || !indexable);
}

export const entries = visibleEntries(records, site.indexable);

export function collectionEntries(collection: Collection) {
  return entries.filter((entry) => entry.collection === collection);
}
