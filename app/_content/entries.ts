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
  teamProfiles?: { name: string; href: string }[];
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
  visualStudy?: boolean;
  heroCaption?: string;
  sections: {
    heading: string;
    text: string;
    id?: string;
    navLabel?: string;
    paragraphs?: string[];
    image?: ProjectPhoto & { caption: string };
    diagram?: "permanence-system" | "permanence-memory" | "permanence-states";
  }[];
  links: { label: string; href: string }[];
};

// Project copy credits team outcomes and identifies only sourced individual work.
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
      "A rover that remembers hidden objects and drives to them using a persistent 3D world map.",
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
    visualStudy: true,
    heroCaption:
      "The prototype: an iPhone supplies the eyes, a Jetson runs perception and memory, and an Arduino drives the wheels.",
    cover: {
      placeholder: false,
      src: "/media/permanence-rover.webp",
      alt: "Two views of the Permanence rover with its mounted iPhone, Jetson, and motor hardware beside cups and colored balls.",
      width: 1800,
      height: 1200,
    },
    sections: [
      {
        id: "problem",
        navLabel: "The problem",
        heading: "Out of sight. Still in memory.",
        text: "Cover a ball with a cup and move the cup. The ball disappears from the camera, but it has not disappeared from the world. A robot needs to preserve that distinction before it can find the ball again.",
        paragraphs: [
          "We built **Permanence**, a rover with a persistent 3D memory of objects. It combines a language model that identifies a target, a fast detector that follows the scene, and explicit memory that carries object identities through occlusion. The rover can then **drive toward a remembered target**.",
        ],
        diagram: "permanence-memory",
      },
      {
        id: "architecture",
        navLabel: "Architecture",
        heading: "Understand once. Track continuously.",
        text: "An iPhone streams **RGB, LiDAR depth, and camera pose** over USB to an NVIDIA Jetson Orin Nano. Qwen-3D resolves a language request against a scan. Once a target is chosen, its process exits and the system hands over to YOLOE detection and the 3D tracker.",
        paragraphs: [
          "The tracker maintains identity, position, and state across frames. Containment logic ties a hidden ball to its cup, so the ball's remembered location follows the container. The navigator uses the phone's pose and the world state to steer through an Arduino Uno and L298N motor driver.",
          "The dashboard reads the state stream, camera imagery, scene data, and compute metrics. It provides a window into the pipeline while the Jetson runs perception and control. Browser speech recognition uses an online service; the robot's models run on the Jetson.",
        ],
        diagram: "permanence-system",
      },
      {
        id: "object-states",
        navLabel: "Object states",
        heading: "Unseen does not mean forgotten",
        text: "A live detection marks an object **visible** and refreshes its position. When it disappears, the tracker retains its identity and records **time since the last observation**. Memory age describes freshness; the object's state explains its absence.",
        paragraphs: [
          "If a nearer depth surface blocks the expected location, the tracker marks the object **occluded**. If its position falls outside the camera view, it becomes **out of view**. An unexplained absence eventually becomes **lost**. LiDAR sees the foreground surface; the hidden object's position comes from memory.",
          "Containment adds another relationship: a ball **inside a cup** follows its container's position. Confidence fades with time at different rates for different hidden states, and repeated evidence stabilizes state changes across frames.",
        ],
        diagram: "permanence-states",
      },
      {
        id: "constraints",
        navLabel: "Constraints",
        heading: "An 8 GB constraint shaped the system",
        text: "The Jetson shares memory between its CPU and GPU. The team's custom 8-bit quantization reduced **Qwen-3D weight memory from 7.1 GB to 4.5 GB**. Loading one tensor at a time avoids creating a full-precision copy, and exiting the grounding process frees its memory before tracking.",
        paragraphs: [
          "Reducing stored weight memory made room for the pipeline. Scheduling the stages mattered as much as choosing the models. Stop-and-shoot scanning also let the phone settle between views, reducing blur from its tall mount.",
          "The dashboard exposes shared memory, GPU and CPU utilization, temperature, power, and swap. Those readings make resource pressure visible alongside the scene, rather than requiring a separate terminal.",
        ],
        image: {
          placeholder: false,
          src: "/media/permanence-dashboard-telemetry.webp",
          alt: "Dashboard during Qwen-3D scan processing, showing the point cloud, live camera, and Jetson compute strip.",
          width: 1800,
          height: 1125,
          caption:
            "Jetson telemetry during scan processing: 6.1 / 7.4 GiB of shared memory in use.",
        },
      },
      {
        id: "dashboard",
        navLabel: "See the memory",
        heading: "What the robot remembers",
        text: "The team connected a live 3D viewer, top-down memory map, camera feed, and object inspector in one dashboard. It makes **hidden objects visible in the robot's remembered world**, even when the current camera image cannot show them.",
        paragraphs: [
          "The calibrated robot view and camera feed sit together. An object inspector exposes distance, state, and time since the last observation; All, Observed, and Unseen filters help explore the scene. Selecting an object inspects it without commanding the rover to move.",
        ],
        image: {
          placeholder: false,
          src: "/media/permanence-dashboard-xray.webp",
          alt: "Permanence dashboard with remembered cups and hidden balls in the 3D view, an x-ray camera overlay, and object memory ages.",
          width: 1800,
          height: 1125,
          caption:
            "The dashboard shows 0 observed and 6 unseen objects. The memory view retains the cups and the balls inside them, with last-seen ages in the inspector.",
        },
      },
      {
        id: "results",
        navLabel: "Results",
        heading: "A result you can reveal",
        text: "The demonstration closes the loop: **show, hide, move, reveal**. The system commits to the ball's container, then checks the answer when the cup is lifted. A remembered position becomes something the rover can act on and an observer can verify.",
        paragraphs: [
          "Permanence received **1st Best Overall, 1st NVIDIA, and 1st Hugging Face** at Knight Hacks IX. The working prototype connected language grounding, perception, memory, visualization, and physical movement on the same edge board.",
        ],
        image: {
          placeholder: false,
          src: "/media/permanence-winners.webp",
          alt: "Permanence team on stage with awards at Knight Hacks IX.",
          width: 1280,
          height: 720,
          caption:
            "The Permanence team at Knight Hacks IX. Best Overall, NVIDIA, and Hugging Face: three first-place awards.",
        },
      },
      {
        id: "lessons",
        navLabel: "Lessons",
        heading: "What the team learned",
        text: "A useful robotics interface needs to communicate **uncertainty and freshness**, as well as position. Last-seen ages and separate observed and unseen states make the memory legible. When the display is frozen or the stream is unavailable, the viewer keeps ages tied to the displayed telemetry instead of advancing them on browser time.",
        paragraphs: [
          "The current system has been tested on small scenes with a handful of objects. Containment rules are hand-written, and grounding is weaker with viewer-relative words such as left and right. Learned prediction, re-observing aging memories, and moving beyond the tabletop remain future work.",
        ],
      },
    ],
    links: [
      {
        label: "View on Devpost",
        href: "https://devpost.com/software/permanence",
      },
      {
        label: "Source code",
        href: "https://github.com/billpquach/permanence",
      },
    ],
    technologies: [
      "Python",
      "C++",
      "PyTorch",
      "TensorRT",
      "Qwen-3D",
      "YOLOE",
      "Jetson Orin Nano",
      "Three.js",
      "Arduino",
      "Record3D",
    ],
    event: "Knight Hacks IX",
    tone: "pale",
    team: [
      "Bill Quach",
      "Isabelle Mathew",
      "Sebastian Noel",
      "Alejandro Jaimes",
    ],
    teamProfiles: [
      { name: "Bill Quach", href: "https://www.linkedin.com/in/billpquach/" },
      {
        name: "Isabelle Mathew",
        href: "https://www.linkedin.com/in/isabelle-mathew-21159a3ab/",
      },
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
      {
        name: "Alejandro Jaimes",
        href: "https://www.linkedin.com/in/alejaimes/",
      },
    ],
  },
  {
    collection: "projects",
    slug: "recall",
    featuredSummary:
      "AI memory, built into a pair of glasses. Captures everyday sights and conversations, then turns them into searchable memories you can recall with a question.",
    demoBrief: "Glasses capturing a moment. A memory recalled on screen.",
    demoVideoId: "Htq-73zA4mw",
    title: "Recall",
    summary:
      "Prototype AI glasses that turn everyday sights and conversations into memories you can search by asking a question.",
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
        text: "Recall began with everyday questions that can become difficult for someone experiencing memory loss: where did I leave my keys, and did I lock the door? The team built a wearable prototype that records visual and audio context, curates moments, and lets a person retrieve them through natural-language questions.",
      },
      {
        heading: "From glasses to searchable moments",
        text: "An ESP32-S3 and camera stream video over Wi-Fi, while a second ESP32 and microphone stream audio to a laptop. A Python pipeline batches frames, uses YOLOv8 to select relevant views, and asks Gemini for scene descriptions. SQLite stores the memories and ChromaDB indexes their meaning; ElevenLabs supplies transcription and spoken answers.",
      },
      {
        heading: "Making the pipeline visible",
        text: "The Next.js dashboard pairs a memory timeline with conversational search, mood tagging, and activity analytics. Hardware-health indicators expose connection problems. Queries retrieve relevant memories before Gemini composes a timestamped response, so a question can refer to the meaning of a scene rather than its exact stored words.",
      },
      {
        heading: "Learning the limits of wearable capture",
        text: "The team worked through Wi-Fi buffer overflows, microphone sample conversion, API limits, and concurrent database writes. Chunked transmission improved camera streaming, while larger frame batches and a local selection heuristic reduced external model calls. Coordinating the two streams and protecting SQLite writes mattered as much as the interface.",
      },
      {
        heading: "Outcome and next steps",
        text: "Recall received second overall at HackUSF 2026. The prototype demonstrated the path from wearable capture to searchable memories and spoken responses. A smaller glasses form factor, longer-term summaries, on-device processing, and offline operation remain future work. The current system uses a laptop and external AI services; it has not been established as a clinical memory aid.",
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
      "Flask",
      "YOLOv8",
      "OpenCV",
      "ChromaDB",
      "SQLite",
      "Gemini",
      "ElevenLabs",
    ],
    event: "HackUSF 2026",
    tone: "coral",
    team: ["Stevin George", "Sebastian Noel", "Nicole Bustos", "Chris Ho"],
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
      "A real plant connected to a multiplayer pixel garden, where soil readings shape its mood.",
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
        heading: "Making plant care social",
        text: "Greghouse connects the plant on your desk to a shared pixel-art garden. Friends can visit through a link, walk around as customizable avatars, chat, and remind the owner when a plant needs water. Expressive plants, recorded voices, and proximity audio make the garden feel inhabited.",
      },
      {
        heading: "One real plant, one shared world",
        text: "A capacitive soil probe and ESP32 send moisture readings through AWS API Gateway, Lambda, and DynamoDB. A Node.js server proxies the latest reading to the React garden and uses WebSockets for multiplayer updates. A shared seed generates the same map for every visitor. The demonstration used one physical device alongside clearly labeled simulated plants.",
      },
      {
        heading: "My contribution",
        text: "I set up the AWS connection between the ESP32 and web app, using DynamoDB to track soil-moisture readings. I also built procedural map generation, owner notifications, player quality-of-life features, and debug systems. These pieces connect the physical plant to a garden that multiple people can explore together.",
      },
      {
        heading: "Keeping the device and garden in agreement",
        text: "Live sensor values must not be overwritten by stale browser state. The team kept live-plant moisture under the telemetry pipeline's control and matched mood thresholds across JavaScript and C++. Persistent TLS connections helped maintain the sampling cadence. When the probe stops reporting, the app freezes the last reading and shows that the probe is offline.",
      },
      {
        heading: "Outcome and future growth",
        text: "Greghouse received third overall at BloomKnights 2026. The team demonstrated a working loop from real soil to the device display and shared garden. Watering a simulated plant changes its virtual state; a real plant still needs physical care. Additional devices, more sensor types, and simpler hardware onboarding are planned extensions.",
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
      "Node.js",
      "WebSockets",
      "Canvas",
      "AWS",
      "API Gateway",
      "Lambda",
      "DynamoDB",
    ],
    event: "BloomKnights 2026",
    tone: "slate",
    team: [
      "Sebastian Noel",
      "Alejandro Jaimes",
      "Stevin George",
      "Otavio Borrelly",
    ],
    role: "Cloud telemetry and garden systems",
  },
  {
    collection: "projects",
    slug: "tks-revenge",
    title: "T.K.'s Revenge",
    summary:
      "A solo or co-op Roblox dungeon adventure with sword and bow classes, a cyber city, and payload progression.",
    context: "Game development · Knight Hacks Project Launch, Spring 2026",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "deep",
    sections: [
      {
        heading: "An invitation to make games",
        text: "After showing software to K-12 students through Knight Hacks outreach, the team noticed how games sparked curiosity about building things. T.K.'s Revenge became a way to introduce young students to what software development can create, using characters inspired by Knight Hacks.",
      },
      {
        heading: "A dungeon run with friends",
        text: "Players choose a short-range sword or a long-range bow, then explore a cyber city alone or with a team. Lenny has taken over T.K.'s friends, and players fight through his forces to help T.K. take revenge. A payload system guides progression through the adventure.",
      },
      {
        heading: "Building the experience",
        text: "The team used Roblox Studio and Luau for gameplay, with Blender and Maya for modeling and rigging. The repository uses Rojo to organize and synchronize scripts between the local codebase and Studio. Development ran across the spring semester as part of Knight Hacks Project Launch.",
      },
      {
        heading: "Learning to control scope",
        text: "For many teammates, Roblox or game development itself was new. Learning the engine and Luau happened alongside building gameplay and animations. Limited art resources and several changes in direction made scope management a central challenge; the team focused on delivering a working experience within the project deadlines.",
      },
      {
        heading: "Outcome and next steps",
        text: "T.K.'s Revenge received second overall and first in the community vote at Knight Hacks Spring 2026 Project Launch. The result is a playable adventure built around solo and cooperative runs. Additional levels, classes, customization, and expanded mechanics were proposed as future work.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/tk-s-revenge",
      },
    ],
    technologies: ["Luau", "Roblox Studio", "Blender", "Maya", "Rojo"],
    event: "Knight Hacks Project Launch, Spring 2026",
    team: [
      "Alejandro Jaimes",
      "Stevin George",
      "Sebastian Noel",
      "Chris Ho",
      "Nicole Bustos",
      "Johaan Riat",
    ],
    award: "2nd overall · 1st community vote",
    demoVideoId: "i1DoCyYBnj4",
    demoBrief:
      "Sword and bow gameplay, the cyber-city setting, and T.K.'s payload adventure.",
  },
  {
    collection: "projects",
    slug: "debt-escape",
    title: "Debt Escape",
    summary:
      "Four Roblox minigames teach financial concepts as players work their way out of virtual debt.",
    context: "Financial learning · SASEHacks 2026",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "coral",
    sections: [
      {
        heading: "Financial learning through play",
        text: "Debt Escape brings financial concepts into a game young players can explore. Players begin with $10,000 of virtual debt and earn their way out through four minigames, then face a final boss named Bill. Progress gives the learning activities a shared goal.",
      },
      {
        heading: "Four ways to practice",
        text: "Common Cents quizzes financial terms under time pressure. Bill Blaster introduces the debt avalanche method, Side Hustle explores entrepreneurial basics, and Budget Factory asks players to sort bills into needs, wants, and savings. The final encounter adds movement, dodging, and combat to the progression.",
      },
      {
        heading: "My contribution",
        text: "I scripted all four minigames, helped build their environments and game spaces, and recorded and edited the demo video. This was an introduction to Roblox Studio and Luau scripting for me. My teammate Stevin handled level planning, the final boss's move set, modeling and textures, and visual design.",
      },
      {
        heading: "Building around an animation constraint",
        text: "The team built the experience in Roblox Studio with Luau, using Blender and Photoshop for the boss and Figma for interface design. When rigging the boss took too much time, the team switched to trigonometric animation, using sine waves to produce fluid movement without the original rigging approach.",
      },
      {
        heading: "Outcome and next steps",
        text: "Debt Escape won first place for Best Use of Roblox Studio, issued by VuPlay. The finished project combines financial activities with a playable progression and boss encounter. More minigames, bosses, and educational topics are future additions; the project does not claim measured improvements in financial literacy.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/debt-escape",
      },
    ],
    technologies: ["Luau", "Roblox Studio", "Blender", "Photoshop", "Figma"],
    team: ["Stevin George", "Sebastian Noel"],
    award: "1st Best Use of Roblox Studio · VuPlay",
    role: "Minigame scripting, environment building, and demo production",
    demoVideoId: "319Eb29HI24",
    demoBrief:
      "Four financial-learning minigames and the final encounter with Bill.",
    event: "SASEHacks 2026",
  },
  {
    collection: "projects",
    slug: "tidesense",
    title: "TideSense",
    summary:
      "A mobile prototype exploring computer vision for rip-current awareness, with beach conditions and scan history.",
    context: "Mobile computer vision · SharkByte 2025",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "slate",
    sections: [
      {
        heading: "Starting with a beach photo",
        text: "TideSense explores whether a phone camera can make rip-current information easier to understand. The team built a mobile prototype that accepts a shoreline photo and presents a model-generated risk estimate alongside weather, location, and explanatory context.",
      },
      {
        heading: "Putting the scan in context",
        text: "The app combines camera capture with risk displays, detection history, analytics, and a safety-map interface. A Gemini assistant answers questions using the current detection context, and ElevenLabs provides audio summaries. Weather integrations bring forecast information into the same experience.",
      },
      {
        heading: "The mobile and model pipeline",
        text: "React Native, Expo, and TypeScript provide the mobile interface. A Python FastAPI backend handles image analysis with TensorFlow Lite and connects external AI and weather services. SQLite stores scans with their timestamps, locations, and confidence values for later review.",
      },
      {
        heading: "My contribution",
        text: "I integrated the National Weather Service API for current weather data and worked on the risk levels and safety status shown for detected rip currents. My focus was connecting environmental context to the result presented in the app, alongside the team's computer-vision and mobile work.",
      },
      {
        heading: "Stabilizing noisy predictions",
        text: "Identical images initially produced inconsistent risk estimates. The team combined the average of the five highest confidence scores with the maximum score, weighting them 70% and 30%. Other work included fixing conditional React hooks, checking Gemini model availability, and configuring different backend addresses for emulators and physical phones.",
      },
      {
        heading: "What the prototype establishes",
        text: "Built for SharkByte 2025, TideSense brought mobile capture, model inference, history, and AI explanations into one prototype. It does not establish that a shoreline is safe to enter. The backend includes simulated fallback results when inference is unavailable, so validating detection reliability and clearly separating test output are necessary before any real safety use. Community reporting and richer mapping remain future ideas.",
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
      "TensorFlow Lite",
      "Gemini",
      "ElevenLabs",
      "SQLite",
      "NOAA",
    ],
    event: "SharkByte 2025",
    team: ["Chris Ho", "Nicole Bustos", "Stevin George", "Sebastian Noel"],
    demoVideoId: "cJQApi3ehAw",
    demoBrief:
      "The mobile camera, risk-analysis screens, scan history, and beach-information tools.",
    role: "Weather integration and risk-status presentation",
  },
  {
    collection: "projects",
    slug: "next-step",
    title: "Next Step",
    summary:
      "Practice auto, home, and health insurance emergencies through realistic conversations with an AI voice agent.",
    context: "Conversational learning · ShellHacks 2025",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "slate",
    sections: [
      {
        heading: "Practicing the difficult moment",
        text: "Next Step explores how to teach insurance through decisions rather than static reading. The team built an interactive practice environment where a person can rehearse responding to an insurance-related emergency, with a voice agent keeping the scenario conversational and time-sensitive.",
      },
      {
        heading: "A scenario, a conversation, and feedback",
        text: "Users choose auto, home, or health insurance and talk through a realistic situation. The experience scores responses from 0 to 100 across safety awareness, insurance knowledge, procedural understanding, and decision-making quality. The goal is to practice how to respond when the order of actions matters.",
      },
      {
        heading: "Connecting voice and web interfaces",
        text: "The frontend uses Next.js, React, TypeScript, and Tailwind CSS, backed by Python and Flask. Vapi drives the voice agent. The interface supports selecting a scenario, participating in the conversation, and reviewing results, bringing the learning flow into one web experience.",
      },
      {
        heading: "My contribution",
        text: "I worked on the frontend design and implementation with React, TypeScript, and Tailwind CSS, set up pages and routing in Next.js, and helped teammates with Git version control. This work connected the scenario-selection and conversation experience within a framework we were learning as we built.",
      },
      {
        heading: "Learning a new interaction model",
        text: "The team worked through unfamiliar Next.js routing, inconsistent Python environment setup, and a backend-to-agent connection problem caused by missing API configuration. Voice interactions also required attention to conversation flow and retained context, rather than treating the experience as a sequence of static pages.",
      },
      {
        heading: "Outcome and next steps",
        text: "Next Step received third place in State Farm's Best Insurance Learning Platform challenge at ShellHacks 2025. The prototype demonstrates scenario-based practice across three insurance categories. Additional categories such as renters, life, business, and pet insurance were proposed for later development.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/next-step-cme06a",
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Flask",
      "Python",
      "Vapi",
    ],
    event: "ShellHacks 2025",
    team: [
      "Sebastian Noel",
      "Alejandro Jaimes",
      "Stevin George",
      "Carlos Rincon",
    ],
    award: "3rd Best Insurance Learning Platform · State Farm",
    demoVideoId: "72e2HA9fW8Y",
    demoBrief:
      "Choosing an insurance scenario, speaking with the voice agent, and reviewing feedback.",
    role: "Frontend development and Next.js routing",
  },
  {
    collection: "projects",
    slug: "dishdash",
    title: "DishDash",
    summary:
      "Enter the ingredients you have and browse up to 100 matching recipes from a recipe database.",
    context: "Recipe search · Knight Hacks VII, 2024",
    published: false,
    featured: false,
    cover: {
      placeholder: true,
    },
    tone: "coral",
    sections: [
      {
        heading: "The ingredients already in the fridge",
        text: "DishDash began with a familiar student problem: deciding what to cook from the food already available. The team built a simple web app where users enter ingredients and receive recipe ideas from an existing dataset.",
      },
      {
        heading: "Matching instead of generating",
        text: "The React interface sends ingredient selections to a Node.js and Express API. MongoDB aggregates matching recipes, sorts them by the number of matching ingredients, and returns up to 100 results. These are retrieved recipes; a match can still require ingredients beyond those the user entered.",
      },
      {
        heading: "Building a first full-stack app",
        text: "DishDash was my first project of this kind, built with Ibrahim Shaqqou at Knight Hacks VII in 2024. We came in with basic C and Java experience and learned JavaScript, React, Node.js, MongoDB, CSS, APIs, and Git while connecting the frontend, server, and database.",
      },
      {
        heading: "Learning by debugging the connections",
        text: "The backend and API failed before the frontend could show useful results, and further interface errors appeared once those connections worked. We used documentation, debugging, and AI assistance while learning the stack, including working through suggestions that did not solve the underlying problems.",
      },
      {
        heading: "Outcome and next steps",
        text: "The result was a working ingredient-to-recipe search flow and a first experience building a full-stack web application. The project's value was in completing that connection and learning how its pieces fit together. Further interface and functionality improvements remained ideas for a later iteration.",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/dishdash-iy7rah",
      },
    ],
    technologies: [
      "JavaScript",
      "CSS",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    event: "Knight Hacks VII",
    team: ["Ibrahim Shaqqou", "Sebastian Noel"],
    demoVideoId: "Vx3j4eic42Q",
    demoBrief: "Entering ingredients and browsing the matching recipe results.",
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
    if (entry.demoVideoId && !/^[a-zA-Z0-9_-]{11}$/.test(entry.demoVideoId)) {
      throw new Error(`Invalid demo video ID: ${path}`);
    }
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
    for (const photo of [
      entry.cover,
      entry.winnerPhoto,
      ...entry.sections.map((section) => section.image),
    ]) {
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
  for (const photo of [
    entry.cover,
    entry.winnerPhoto,
    ...entry.sections.map((section) => section.image),
  ]) {
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
