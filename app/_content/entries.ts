import { existsSync } from "node:fs";
import { site } from "../_lib/site";

export type Collection = "projects" | "experiences";
type ProjectPhoto = {
  placeholder: false;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Entry = {
  collection: Collection;
  slug: string;
  title: string;
  summary: string;
  featuredSummary?: string;
  context: string;
  published: boolean;
  featured: boolean;
  award?: string;
  featuredAwards?: {
    id: string;
    label: string;
    placement: string;
    total: number;
    logo: string;
  }[];
  placeholder?: boolean;
  tone?: "pale" | "coral" | "slate" | "deep" | "muted";
  technologies?: string[];
  team?: string[];
  event?: string;
  role?: string;
  startDate?: string;
  endDate?: string | null;
  bullets?: string[];
  roles?: { title: string; startDate: string; endDate: string | null }[];
  cover: { placeholder: true } | ProjectPhoto;
  demoVideoId?: string;
  demoClip?: string;
  demoPoster?: string;
  demoPosterAlt?: string;
  demoBrief?: string;
  winnerPhoto?: ProjectPhoto;
  sections: { heading: string; text: string }[];
  links: { label: string; href: string }[];
};

// Draft summaries describe team projects, not individual ownership.
export const records: Entry[] = [
  {
    collection: "projects",
    slug: "permanence",
    featuredSummary:
      "A robot with a persistent 3D memory. It tracks objects through occlusion and follows language commands to find them, even when its camera can no longer see them. Running on an NVIDIA Jetson Orin Nano, it turns that memory into action, driving toward hidden objects while a live 3D dashboard shows what it remembers.",
    demoBrief: "Robot tracking an object as it disappears from view.",
    demoVideoId: "GexOIHp7s1w",
    title: "Permanence",
    summary:
      "A robot that remembers objects, even when they disappear from view.",
    context: "Robotics · Knight Hacks IX",
    published: false,
    featured: true,
    award: "1st Best Overall · 1st NVIDIA · 1st Hugging Face",
    featuredAwards: [
      {
        id: "nvidia",
        label: "NVIDIA",
        placement: "1st",
        total: 21,
        logo: "/media/awards/nvidia.svg",
      },
      {
        id: "overall",
        label: "Best Overall",
        placement: "1st",
        total: 212,
        logo: "/media/awards/knight-hacks-ix.svg",
      },
      {
        id: "hugging-face",
        label: "Hugging Face",
        placement: "1st",
        total: 78,
        logo: "/media/awards/hugging-face.svg",
      },
    ],
    demoPoster: "/media/permanence-winners.webp",
    demoPosterAlt:
      "Permanence's winning team on stage for Best Overall, NVIDIA, and Hugging Face at Knight Hacks IX.",
    cover: {
      placeholder: true,
    },
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
    links: [
      {
        label: "View on Devpost",
        href: "https://devpost.com/software/permanence",
      },
    ],
    technologies: ["Python", "C++", "PyTorch", "Jetson Orin Nano", "Three.js"],
    event: "Knight Hacks IX",
    tone: "pale",
  },
  {
    collection: "projects",
    slug: "recall",
    featuredSummary:
      "AI memory, built into a pair of glasses. Captures everyday sights and conversations, then turns them into searchable memories you can recall with a question.",
    demoBrief: "Glasses capturing a moment. A memory recalled on screen.",
    demoVideoId: "Htq-73zA4mw",
    title: "Recall",
    summary: "Wearable AI memory, built into a pair of glasses.",
    context: "Wearables · HackUSF 2026",
    published: false,
    featured: true,
    award: "2nd Best Overall",
    featuredAwards: [
      {
        id: "overall",
        label: "Best Overall",
        placement: "2nd",
        total: 85,
        logo: "/media/awards/hackusf-transparent.webp",
      },
    ],
    cover: {
      placeholder: true,
    },
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
    links: [
      {
        label: "View on Devpost",
        href: "https://devpost.com/software/recall-oswlh3",
      },
    ],
    technologies: [
      "Python",
      "C++",
      "TypeScript",
      "ESP32",
      "Next.js",
      "SQLite",
      "Gemini",
      "ElevenLabs",
    ],
    event: "HackUSF 2026",
    tone: "coral",
  },
  {
    collection: "projects",
    slug: "greghouse",
    featuredSummary:
      "A real plant, connected to a shared pixel garden. Soil sensors shape its virtual mood while friends explore, leave messages, and remind you when it needs water.",
    demoBrief: "A real plant. Its pixel garden responding to water.",
    demoVideoId: "eeHd84B9r5A",
    title: "Greghouse",
    summary:
      "A living plant, a moisture sensor, and a multiplayer virtual garden.",
    context: "Connected devices · BloomKnights 2026",
    published: false,
    featured: true,
    award: "3rd Best Overall",
    featuredAwards: [
      {
        id: "overall",
        label: "Best Overall",
        placement: "3rd",
        total: 86,
        logo: "/media/awards/bloomknights.svg",
      },
    ],
    cover: {
      placeholder: true,
    },
    sections: [
      {
        heading: "A garden in two worlds",
        text: "Greghouse connects a real plant to a shared pixel-art garden. An ESP32 reads soil moisture, and that reading influences the virtual plant's mood. Visitors can explore together and alert the owner when a plant needs water.",
      },
      {
        heading: "From sensor to shared experience",
        text: "The team's pipeline carries sensor readings through AWS into the garden. The project brings physical hardware and multiplayer web interactions together, and received third place overall at BloomKnights 2026.",
      },
    ],
    links: [
      {
        label: "View on Devpost",
        href: "https://devpost.com/software/greghouse",
      },
    ],
    technologies: [
      "C++",
      "JavaScript",
      "ESP32",
      "React",
      "AWS",
      "Lambda",
      "DynamoDB",
    ],
    event: "BloomKnights 2026",
    tone: "slate",
  },
  {
    collection: "projects",
    slug: "tks-revenge",
    title: "T.K.'s Revenge",
    summary:
      "A dungeon adventure on Roblox, built for solo runs and playing with friends.",
    context: "Knight Hacks Project Launch 2026",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "deep",
    sections: [
      {
        heading: "The project",
        text: "A dungeon adventure on Roblox, built for solo runs and playing with friends.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/tk-s-revenge",
      },
    ],
    technologies: ["Luau", "Roblox Studio", "Blender", "Maya"],
    event: "Knight Hacks Project Launch 2026",
    team: [
      "Alejandro Jaimes",
      "Stevin George",
      "Sebastian Noel",
      "Chris Ho",
      "Nicole Bustos",
      "Johaan Riat",
    ],
    award: "2nd place",
  },
  {
    collection: "projects",
    slug: "debt-escape",
    title: "Debt Escape",
    summary:
      "Four Roblox minigames that turn financial literacy into something you can play.",
    context: "Team project",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "coral",
    sections: [
      {
        heading: "The project",
        text: "Four Roblox minigames that turn financial literacy into something you can play.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/debt-escape",
      },
    ],
    technologies: ["Roblox"],
    team: ["Stevin George", "Sebastian Noel"],
  },
  {
    collection: "projects",
    slug: "tidesense",
    title: "TideSense",
    summary:
      "A prototype exploring how beach photos could help identify rip currents.",
    context: "Team project",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "slate",
    sections: [
      {
        heading: "The project",
        text: "A prototype exploring how beach photos could help identify rip currents.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/riptide-wip",
      },
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Python",
      "FastAPI",
      "Gemini",
      "SQLite",
    ],
  },
  {
    collection: "projects",
    slug: "alto",
    title: "Alto",
    summary:
      "A financial calendar and AI spending assistant, demonstrated with sample transactions.",
    context: "Knight Hacks VIII",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "pale",
    sections: [
      {
        heading: "The project",
        text: "A financial calendar and AI spending assistant, demonstrated with sample transactions.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/alto-m96ytw",
      },
    ],
    technologies: ["Next.js", "React", "Python", "TypeScript", "Google ADK"],
    event: "Knight Hacks VIII",
    team: [
      "Stevin George",
      "Sebastian Noel",
      "Christian Evans",
      "Ibrahim Shaqqou",
    ],
  },
  {
    collection: "projects",
    slug: "fe-ai",
    title: "FE AI",
    summary:
      "An exam-practice whiteboard that uses Gemini to give feedback on worked solutions.",
    context: "GemiKnights",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "deep",
    sections: [
      {
        heading: "The project",
        text: "An exam-practice whiteboard that uses Gemini to give feedback on worked solutions.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/untitled-project-g6fl50ordx7m",
      },
    ],
    technologies: ["React", "Vite", "JavaScript", "TLDraw", "Gemini"],
    event: "GemiKnights",
    team: ["Christian Evans", "Stevin George", "Sebastian Noel"],
  },
  {
    collection: "projects",
    slug: "next-step",
    title: "Next Step",
    summary:
      "Voice-based practice conversations for explaining insurance and answering customer questions.",
    context: "ShellHacks 2025",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "slate",
    sections: [
      {
        heading: "The project",
        text: "Voice-based practice conversations for explaining insurance and answering customer questions.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/next-step-cme06a",
      },
    ],
    technologies: ["Next.js", "React", "TypeScript", "Flask", "Python", "Vapi"],
    event: "ShellHacks 2025",
    team: [
      "Sebastian Noel",
      "Alejandro Jaimes",
      "Stevin George",
      "Carlos Rincon",
    ],
    award: "State Farm challenge winner",
  },
  {
    collection: "projects",
    slug: "dishdash",
    title: "DishDash",
    summary: "Find recipes from the ingredients you already have.",
    context: "Knight Hacks VII",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "coral",
    sections: [
      {
        heading: "The project",
        text: "Find recipes from the ingredients you already have.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/dishdash-iy7rah",
      },
    ],
    technologies: ["JavaScript", "React", "Node.js", "MongoDB"],
    event: "Knight Hacks VII",
    team: ["Ibrahim Shaqqou", "Sebastian Noel"],
  },
  {
    collection: "experiences",
    slug: "bny",
    title: "BNY",
    role: "Software Engineer Intern",
    startDate: "2026-08",
    endDate: null,
    summary:
      "Building cloud infrastructure, service monitoring, and recovery workflows for financial microservices.",
    bullets: [
      "Provisioned **Azure VMs** with **Terraform** to host **five Spring Boot** services via **Docker Compose** for repeatable builds.",
      "Balanced traffic across **two VMs** using **Azure Application Gateway** and health probes for node failover.",
      "Reduced fund-query database reads by **40%** with **Azure Managed Redis** caching, easing **PostgreSQL** load during valuation.",
      "Instrumented **five** services with **Prometheus** and **Grafana** for health tracking at **15-second** intervals with **200-hour** retention.",
    ],
    tone: "coral",
    context: "Software Engineer Intern",
    published: false,
    featured: true,
    cover: {
      placeholder: true,
    },
    sections: [],
    links: [
      {
        label: "LinkedIn experience",
        href: "https://www.linkedin.com/in/snoel-dev/details/experience/",
      },
    ],
  },
  {
    collection: "experiences",
    slug: "bny-spring",
    title: "BNY",
    role: "Software Engineer Intern",
    startDate: "2026-01",
    endDate: "2026-04",
    summary:
      "Built automated issue detection and remediation for financial microservices.",
    bullets: [
      "Architected a **four-stage** fault-remediation agent pipeline with **Python**, **FastAPI**, and **Docker**, handling **more than ten** fault types end to end.",
      "Sped up fault detection by **75%** by parallelizing **Prometheus**, **Grafana**, and **Docker SDK** operations across **five Java Spring Boot** services.",
      "Achieved microservice health remediation in **under 90 seconds** by routing edge cases to an **LLM** fallback and persisting results to **PostgreSQL**.",
      "Trained **IsolationForest**, **RandomForest**, and **XGBoost** on **4,250** samples to classify **six** microservice fault types.",
    ],
    tone: "pale",
    context: "Software Engineer Intern",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    sections: [],
    links: [
      {
        label: "LinkedIn experience",
        href: "https://www.linkedin.com/in/snoel-dev/details/experience/",
      },
    ],
  },
  {
    collection: "experiences",
    slug: "ucf-ai",
    title: "UCF Institute of Artificial Intelligence",
    role: "Undergraduate Researcher",
    startDate: "2026-01",
    endDate: "2026-04",
    summary:
      "Studied efficient test-time adaptation for long videos, reducing repeated computation while preserving temporal context.",
    bullets: [
      "Co-authored an **ECCV 2026** paper on a **Frame Forgetting Network** for **Test-Time Training**.",
      "Optimized long-form video segmentation by eliminating redundant sliding-window computations to process only **three frames** per update.",
      "Established ground-truth evaluation baselines across **2.5 million** frames from **47** videos using **SAM 3** and **Slurm** on an **HPC** cluster.",
      "Automated **COCO** and **RLE** data parsing with **Python**, **PyTorch**, and **Bash** pipelines to standardize research preprocessing.",
    ],
    tone: "slate",
    context: "Undergraduate Researcher",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    sections: [
      {
        heading: "Mentors",
        text: "Yogesh S. Rawat and Rajat Modi.",
      },
    ],
    links: [
      {
        label: "Paper: Forget, Anticipate and Adapt",
        href: "https://arxiv.org/abs/2606.26515v2",
      },
    ],
  },
  {
    collection: "experiences",
    slug: "graphics-programming-knights",
    title: "Graphics Programming Knights",
    role: "Co-founder, Secretary & Software Engineer Lead",
    startDate: "2025-07",
    endDate: null,
    summary:
      "Co-founded a graphics programming community at UCF and now lead its website and Discord bot development team.",
    bullets: [
      "**Co-founded** the student organization, growing membership to **more than 200** through outreach and events.",
      "Led **ten developers** building the organization’s website with **TypeScript** and **Next.js**.",
      "Reduced website deployment time by **25%** with **Docker** and **GitHub Actions CI/CD**.",
    ],
    tone: "deep",
    context: "Co-founder, Secretary & Software Engineer Lead",
    published: false,
    featured: true,
    cover: {
      placeholder: true,
    },
    sections: [],
    links: [
      {
        label: "LinkedIn experience",
        href: "https://www.linkedin.com/in/snoel-dev/details/experience/",
      },
    ],
    roles: [
      {
        title: "Software Engineer Lead",
        startDate: "2026-05",
        endDate: null,
      },
      {
        title: "Co-founder, Secretary",
        startDate: "2025-07",
        endDate: "2026-04",
      },
    ],
  },
  {
    collection: "experiences",
    slug: "knight-hacks",
    title: "Knight Hacks",
    role: "Mentor & Outreach Board Member",
    startDate: "2026-01",
    endDate: null,
    summary:
      "Mentor students in the Kickstart program and support UCF’s software development and hackathon community through social media, tabling, and presentations.",
    bullets: [
      "Mentoring four students in the Kickstart Mentorship Program.",
      "(bullet 2)",
      "(bullet 3)",
      "(bullet 4)",
    ],
    tone: "pale",
    context: "Mentor & Outreach Board Member",
    published: false,
    featured: true,
    cover: {
      placeholder: true,
    },
    sections: [],
    links: [
      {
        label: "LinkedIn experience",
        href: "https://www.linkedin.com/in/snoel-dev/details/experience/",
      },
    ],
    roles: [
      {
        title: "Mentor",
        startDate: "2026-09",
        endDate: null,
      },
      {
        title: "Outreach Board Member",
        startDate: "2026-01",
        endDate: null,
      },
    ],
  },
  {
    collection: "experiences",
    slug: "ucf-ist",
    title: "UCF Institute for Simulation and Training",
    role: "Research & Development Intern",
    startDate: "2026-05",
    endDate: "2026-07",
    summary:
      "Investigated reproducible 3D reconstruction from photos and evaluated workflows for creating textured, riggable assets for Unity VR.",
    bullets: [
      "Researched and validated a **four-stage photogrammetry pipeline**, converting photos into textured, **VR**-ready 3D assets.",
      "Evaluated **RealityScan** alignment and reconstruction workflows, producing **more than ten 3D models** to demonstrate pipeline reproducibility.",
      "Authored a **23-page research guide** and **more than 17 minutes** of tutorials documenting methods, tradeoffs, and common pitfalls.",
      "Used **Blender** decimation to simplify geometry by **99.5%**, from **two million** to **ten thousand**, for **VR** applications.",
    ],
    tone: "slate",
    context: "Research & Development Intern",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    sections: [
      {
        heading: "Mentor",
        text: "Lauren Speer.",
      },
    ],
    links: [
      {
        label: "LinkedIn experience",
        href: "https://www.linkedin.com/in/snoel-dev/details/experience/",
      },
    ],
  },
  {
    collection: "experiences",
    slug: "fsec",
    title: "FSEC · Florida Solar Energy Center",
    role: "Software Engineer Intern",
    startDate: "2025-05",
    endDate: "2025-09",
    summary:
      "Studied solar cell defects and electrical performance by combining image analysis with voltage prediction. Built photovoltaic image-processing pipelines and refactored Python and Marimo tooling.",
    bullets: [
      "Engineered a **Python** multimodal pipeline aligning **2,075** solar cell images with IV performance data for photovoltaic defect analysis.",
      "Implemented wavelet-enhanced **LSTM** models for time-series analysis, achieving **77%** voltage prediction accuracy.",
      "Developed an image-processing pipeline with **Marimo** notebooks, decreasing data processing time by **30%**.",
    ],
    tone: "coral",
    context: "Software Engineer Intern",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    sections: [
      {
        heading: "Mentor",
        text: "Joseph Raby.",
      },
    ],
    links: [
      {
        label: "LinkedIn experience",
        href: "https://www.linkedin.com/in/snoel-dev/details/experience/",
      },
    ],
  },
  {
    collection: "projects",
    slug: "placeholder-1",
    title: "Future project 1",
    summary: "Placeholder · Details to come",
    context: "Placeholder",
    published: false,
    featured: false,
    placeholder: true,
    cover: {
      placeholder: true,
    },
    tone: "muted",
    sections: [],
    links: [],
  },
  {
    collection: "projects",
    slug: "placeholder-2",
    title: "Future project 2",
    summary: "Placeholder · Details to come",
    context: "Placeholder",
    published: false,
    featured: false,
    placeholder: true,
    cover: {
      placeholder: true,
    },
    tone: "muted",
    sections: [],
    links: [],
  },
];

export function validateEntries(items: Entry[]) {
  const paths = new Set<string>();
  for (const entry of items) {
    const path = `/${entry.collection}/${entry.slug}`;
    if (
      !["projects", "experiences"].includes(entry.collection) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) ||
      paths.has(path) ||
      !entry.title.trim() ||
      !entry.summary.trim() ||
      !entry.context.trim()
    ) {
      throw new Error(`Invalid or duplicate content record: ${path}`);
    }
    paths.add(path);
    if (
      [entry.startDate, entry.endDate].some(
        (date) => date != null && !/^\d{4}-(0[1-9]|1[0-2])$/.test(date),
      ) ||
      (entry.endDate &&
        (!entry.startDate || entry.endDate < entry.startDate)) ||
      (entry.endDate === null && !entry.startDate)
    ) {
      throw new Error(`Invalid timeline dates: ${path}`);
    }
    for (const link of entry.links) {
      if (!link.label.trim() || new URL(link.href).protocol !== "https:") {
        throw new Error(`Invalid content link: ${path}`);
      }
    }
    for (const photo of [entry.cover, entry.winnerPhoto]) {
      if (!photo || photo.placeholder) continue;
      if (
        !/^\/media\/[a-z0-9/-]+\.(avif|webp|png|jpg|jpeg)$/.test(photo.src) ||
        !photo.alt.trim() ||
        !Number.isInteger(photo.width) ||
        !Number.isInteger(photo.height) ||
        photo.width <= 0 ||
        photo.height <= 0
      ) {
        throw new Error(`Invalid cover: ${path}`);
      }
    }
    if (
      entry.published &&
      (entry.placeholder ||
        entry.cover.placeholder ||
        entry.sections.length === 0)
    ) {
      throw new Error(`Published record needs real media and body: ${path}`);
    }
    if (
      entry.sections.some(
        (section) => !section.heading.trim() || !section.text.trim(),
      )
    ) {
      throw new Error(`Empty content section: ${path}`);
    }
  }
}

validateEntries(records);
for (const entry of records) {
  if (
    entry.demoClip &&
    (!/^\/media\/[a-z0-9/-]+\.(webm|mp4)$/.test(entry.demoClip) ||
      !existsSync(`public${entry.demoClip}`))
  ) {
    throw new Error(`Invalid demo clip: ${entry.demoClip}`);
  }
  if (
    entry.demoPoster &&
    (!/^\/media\/[a-z0-9/-]+\.(avif|webp|png|jpg|jpeg)$/.test(
      entry.demoPoster,
    ) ||
      !existsSync(`public${entry.demoPoster}`))
  ) {
    throw new Error(`Invalid demo poster: ${entry.demoPoster}`);
  }
  for (const photo of [entry.cover, entry.winnerPhoto]) {
    if (photo && !photo.placeholder && !existsSync(`public${photo.src}`)) {
      throw new Error(`Missing cover file: ${photo.src}`);
    }
  }
}

export function visibleEntries(items: Entry[], indexable: boolean) {
  return items.filter((entry) => entry.published || !indexable);
}

export const entries = visibleEntries(records, site.indexable);

export function collectionEntries(collection: Collection) {
  const items = entries.filter((entry) => entry.collection === collection);
  return collection === "experiences"
    ? items.sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""))
    : items;
}
