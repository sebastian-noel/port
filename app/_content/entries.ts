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

type StudyImage = ProjectPhoto & { caption: string };

type StudyClip = {
  src: string;
  poster: string;
  caption: string;
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
    images?: StudyImage[];
    clip?: StudyClip;
    diagram?:
      | "permanence-system"
      | "permanence-memory"
      | "permanence-states"
      | "recall-capture"
      | "recall-retrieval"
      | "greghouse-telemetry"
      | "greghouse-multiplayer"
      | "tks-progression"
      | "tks-combat"
      | "tide-scan"
      | "next-practice"
      | "next-feedback"
      | "dish-ranking";
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
          "Permanence is a rover with a persistent 3D memory of objects. It combines a language model that identifies a target, a fast detector that follows the scene, and explicit memory that carries object identities through occlusion. The rover can then **drive toward a remembered target**.",
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
        text: "The Jetson shares memory between its CPU and GPU. Custom 8-bit quantization reduced **Qwen-3D weight memory from 7.1 GB to 4.5 GB**. Loading one tensor at a time avoids creating a full-precision copy, and exiting the grounding process frees its memory before tracking.",
        paragraphs: [
          "Reducing stored weight memory made room for the pipeline. Scheduling the stages mattered as much as choosing the models. Stop-and-shoot scanning let the phone settle between views, reducing blur from its tall mount.",
          "The dashboard exposes shared memory, GPU and CPU utilization, temperature, power, and swap. Those readings make resource pressure visible alongside the scene, rather than requiring a separate terminal.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/permanence-dashboard-telemetry.webp",
            alt: "Dashboard during Qwen-3D scan processing, showing the point cloud, live camera, and Jetson compute strip.",
            width: 1800,
            height: 1125,
            caption:
              "Jetson telemetry during scan processing: 6.1 / 7.4 GiB of shared memory in use.",
          },
        ],
      },
      {
        id: "dashboard",
        navLabel: "See the memory",
        heading: "What the robot remembers",
        text: "A live 3D viewer, top-down memory map, camera feed, and object inspector come together in one dashboard. It makes **hidden objects visible in the robot's remembered world**, even when the current camera image cannot show them.",
        paragraphs: [
          "The calibrated robot view and camera feed sit together. An object inspector exposes distance, state, and time since the last observation; All, Observed, and Unseen filters help explore the scene. Selecting an object inspects it without commanding the rover to move.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/permanence-dashboard-xray.webp",
            alt: "Permanence dashboard with remembered cups and hidden balls in the 3D view, an x-ray camera overlay, and object memory ages.",
            width: 1800,
            height: 1125,
            caption:
              "The dashboard shows 0 observed and 6 unseen objects. The memory view retains the cups and the balls inside them, with last-seen ages in the inspector.",
          },
        ],
      },
      {
        id: "results",
        navLabel: "Results",
        heading: "A result you can reveal",
        text: "The demonstration closes the loop: **show, hide, move, reveal**. The system commits to the ball's container, then checks the answer when the cup is lifted. A remembered position becomes something the rover can act on and an observer can verify.",
        paragraphs: [
          "Permanence received **1st Best Overall, 1st NVIDIA, and 1st Hugging Face** at Knight Hacks IX. The working prototype connected language grounding, perception, memory, visualization, and physical movement on the same edge board.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/permanence-winners.webp",
            alt: "Permanence team on stage with awards at Knight Hacks IX.",
            width: 1280,
            height: 720,
            caption:
              "Permanence at Knight Hacks IX: first place for Best Overall, NVIDIA, and Hugging Face.",
          },
        ],
      },
      {
        id: "lessons",
        navLabel: "Lessons",
        heading: "What we learned",
        text: "A useful robotics interface needs to communicate **uncertainty and freshness**, as well as position. Last-seen ages and separate observed and unseen states make the memory legible. When the display is frozen or the stream is unavailable, the viewer keeps ages tied to the displayed telemetry instead of advancing them on browser time.",
        paragraphs: [
          "The current system has been tested on small scenes with a handful of objects. Containment rules are hand-written, and grounding is weaker with viewer-relative words such as left and right. Learned prediction, re-observing aging memories, and moving beyond the tabletop remain future work.",
        ],
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/permanence",
      },
      {
        label: "GitHub",
        href: "https://github.com/billpquach/permanence",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7516558684559294465/",
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
    visualStudy: true,
    cover: {
      placeholder: false,
      src: "/media/recall-glasses.webp",
      alt: "Recall prototype glasses on a table, with a camera, microphone, and wired electronics attached to the frame.",
      width: 1210,
      height: 999,
    },
    heroCaption:
      "The wearable prototype mounts a camera and microphone on opposite sides of a glasses frame.",
    sections: [
      {
        id: "problem",
        navLabel: "The idea",
        heading: "Make a moment easy to find again",
        text: "Where did I put my keys? A recording might hold the answer, but scrolling through footage still leaves the search to the wearer. Recall explores a different approach for people who have difficulty remembering everyday details: **turn a moment into a short, searchable memory**.",
        paragraphs: [
          "The prototype captures sights and speech from the wearer's point of view. A laptop turns selected frames and available transcripts into timestamped entries that can be browsed or retrieved with a question.",
        ],
      },
      {
        id: "hardware",
        navLabel: "The glasses",
        heading: "Two boards on one frame",
        text: "The video side pairs an **ESP32-S3 with an OV2640 camera** and sends MJPEG over Wi-Fi. The audio side pairs an **ESP32-WROOM-32E with an INMP441 microphone** and records short windows of 16 kHz mono audio.",
        paragraphs: [
          "The camera sends each JPEG in chunks to keep writes manageable. The audio firmware sends a WAV recording to ElevenLabs Scribe and exposes the latest transcript over HTTP, where the laptop can pick it up.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/recall-video-left.webp",
            alt: "Left side of the Recall glasses being worn, showing the camera hardware mounted near the temple.",
            width: 960,
            height: 1280,
            caption:
              "Video side. The ESP32-S3 streams frames from the glasses over Wi-Fi.",
          },
          {
            placeholder: false,
            src: "/media/recall-audio-right.webp",
            alt: "Right side of the Recall glasses being worn, showing the wired audio hardware attached to the frame.",
            width: 960,
            height: 1280,
            caption:
              "Audio side. The INMP441 microphone captures speech near the wearer.",
          },
        ],
      },
      {
        id: "capture",
        navLabel: "Capture pipeline",
        heading: "Describe the useful frames",
        text: "On the laptop, OpenCV collects a batch of frames and **YOLOv8 tags the objects** in each one. A local heuristic ranks frames by the number of detected tags. Only the top three go to Gemini 2.5 Flash for descriptions that focus on actions and where objects are.",
        paragraphs: [
          "Each selected frame becomes a record with its capture time, scene description, object tags, and the latest transcript when available. **SQLite stores the record**, and **ChromaDB indexes its text** so retrieval can match meaning.",
        ],
        diagram: "recall-capture",
        images: [
          {
            placeholder: false,
            src: "/media/recall-sqlite-db.webp",
            alt: "SQLite table showing timestamped Recall memories with summaries, object tags, and a transcript column.",
            width: 874,
            height: 598,
            caption:
              "The SQLite table keeps each timestamp, generated scene summary, detected objects, and any accompanying transcript together.",
          },
        ],
      },
      {
        id: "retrieval",
        navLabel: "Memory search",
        heading: "Find a memory by meaning",
        text: "A question about a drink can surface a memory about a cup. Recall searches ChromaDB for **related memories**, then adds recent SQLite entries and the latest available transcript. Gemini uses that context to draft a short answer and is prompted to say when the evidence is missing.",
        paragraphs: [
          "The answer appears in the dashboard chat, and ElevenLabs can read it aloud. The pipeline uses a short list of stored observations so it can give a time or location when the record supports one.",
        ],
        diagram: "recall-retrieval",
        images: [
          {
            placeholder: false,
            src: "/media/recall-dashboard.webp",
            alt: "Recall dashboard with a timestamped memory timeline beside a conversational query panel.",
            width: 1903,
            height: 907,
            caption:
              "The timeline makes saved moments browsable alongside the chat for asking a specific question.",
          },
        ],
      },
      {
        id: "dashboard",
        navLabel: "Dashboard",
        heading: "See what the system captured",
        text: "The Next.js dashboard shows **connection status and recent memories** alongside the conversation. The analytics view groups captures by hour and counts recurring object tags. Mood labels are added by hand in the timeline and kept in the browser session.",
        images: [
          {
            placeholder: false,
            src: "/media/recall-analytics.webp",
            alt: "Recall memory analytics showing an hourly activity histogram, frequent objects, and mood totals.",
            width: 1895,
            height: 785,
            caption:
              "The analytics view summarizes the saved captures by hour, frequently detected objects, and user-applied mood tags.",
          },
        ],
      },
      {
        id: "results",
        navLabel: "Results",
        heading: "From a wearable prototype to a spoken answer",
        text: "Recall placed **2nd Best Overall at HackUSF 2026**. The prototype demonstrated a complete path from glasses-mounted capture to a timestamped memory and a spoken response.",
        paragraphs: [
          "The build exposed three practical constraints: keeping the camera stream stable, limiting model requests, and coordinating reads and writes to the same memory store. Chunked camera writes, local frame selection, and a lock around SQLite access addressed those constraints.",
          "The prototype depends on a laptop, Wi-Fi, and cloud services that process selected images and audio. A smaller frame, longer-term summaries, and local processing are the next directions for making the device more practical.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/recall-awards.webp",
            alt: "Recall teammates on stage with a boxed prize.",
            width: 800,
            height: 533,
            caption: "Recall placed second overall at HackUSF 2026.",
          },
        ],
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/recall-oswlh3",
      },
      {
        label: "GitHub",
        href: "https://github.com/sebastian-noel/recall",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/posts/sebastian-noel-ucf_hackathon-hackusf-knighthacks-activity-7445107718484496384-0lck",
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
    teamProfiles: [
      {
        name: "Stevin George",
        href: "https://www.linkedin.com/in/georgestevin/",
      },
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
      {
        name: "Nicole Bustos",
        href: "https://www.linkedin.com/in/nicolebustos/",
      },
      {
        name: "Chris Ho",
        href: "https://www.linkedin.com/in/chris-ho-15a039329/",
      },
    ],
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
    visualStudy: true,
    heroCaption:
      "Greg’s soil-monitoring device alongside the shared pixel garden where his digital twin lives.",
    cover: {
      placeholder: false,
      src: "/media/greghouse/device-and-garden.webp",
      alt: "Cover montage of Greg’s touchscreen diagnostic device in a blue planter beside the multiplayer pixel garden.",
      width: 1440,
      height: 540,
    },
    sections: [
      {
        heading: "Give a real plant a place online",
        navLabel: "The idea",
        id: "idea",
        text: "Greghouse makes plant care something friends can do together. Visitors join through a link and walk around a shared pixel garden, where plants have personalities, talk in a live feed, and can play a recorded voice as you approach.",
        paragraphs: [
          "One of those plants is **Greg, a living plant with a digital twin**. His mood in the garden follows a probe in his pot. Other plants are clearly marked as simulated, and players can water them with a virtual watering can.",
        ],
        clip: {
          src: "/media/greghouse/garden-features.webm",
          poster: "/media/greghouse/garden-features.webp",
          caption:
            "Exploring the garden and opening plant profiles with the real plant pictured beside its virtual twin.",
        },
      },
      {
        heading: "From soil to the shared garden",
        navLabel: "Sensor and telemetry",
        id: "telemetry",
        text: "A capacitive probe sits in Greg’s soil and connects to an ESP32 inside a 3D-printed enclosure. The device reads the soil about every two seconds, updates the face on its touchscreen, and sends the reading to AWS.",
        paragraphs: [
          "**API Gateway, Lambda, and DynamoDB** accept and store the timestamps and moisture readings. A Node.js proxy retrieves the latest value, and the browser applies the same mood thresholds as the device. The screen on the desk and Greg’s digital twin respond to the same measurement.",
        ],
        diagram: "greghouse-telemetry",
        clip: {
          src: "/media/greghouse/device-demo.webm",
          poster: "/media/greghouse/device-demo.webp",
          caption:
            "The handheld prototype and its live touchscreen, with Greg’s face and a separate soil stats view.",
        },
        images: [
          {
            placeholder: false,
            src: "/media/greghouse/setup.webp",
            alt: "A laptop showing the virtual garden beside the diagnostic device mounted on Greg’s planter.",
            width: 430,
            height: 573,
            caption:
              "The demo setup puts the real plant beside its virtual garden.",
          },
        ],
      },
      {
        heading: "One map for everyone",
        navLabel: "Multiplayer",
        id: "multiplayer",
        text: "**A shared seed** generates the same paths, ponds, trees, and decorations in each visitor’s browser. The Node.js server uses WebSockets to relay positions, chat, and garden updates to everyone in the room.",
        paragraphs: [
          "Friends can wander with custom avatars and send the owner a watering reminder. The reminder arrives as a banner and chime, so someone visiting the digital garden can prompt care for the real plant.",
          "**The seed and map dimensions travel together.** Browsers can recreate the terrain locally, and the server can send smaller updates for things that change during a session, such as which way another player is facing. A fresh soil reading follows a separate path so all visitors can see Greg’s mood without one player’s garden state overwriting it.",
        ],
        diagram: "greghouse-multiplayer",
        clip: {
          src: "/media/greghouse/multiplayer.webm",
          poster: "/media/greghouse/multiplayer.webp",
          caption:
            "Several visitors move through the same garden while their positions and chat update live.",
        },
      },
      {
        heading: "Give Greg a voice in both worlds",
        navLabel: "Plant voices",
        id: "plant-voices",
        text: "The owner can record a greeting and a thirsty message for each plant in the browser. As a visitor approaches, **the plant’s voice gets louder**. Which recording plays depends on its mood, and plants without a recording use synthesized chirps.",
        paragraphs: [
          "Greg’s physical device can play his greeting through its speaker, too. The Node.js server uses FFmpeg to convert that recording into **8 kHz mono PCM** for the ESP32. When the device receives a new greeting, it stops the playback timer, switches to the new audio buffer, and restarts the timer before freeing the old buffer. That keeps the timer from reading memory that has already been released.",
        ],
      },
      {
        heading: "Keeping the readings honest",
        navLabel: "What broke",
        id: "constraints",
        text: "Opening a fresh TLS connection for every reading took too much of the two-second interval. The firmware reused the connection, and the server cached readings so several visitors could view the same garden without each polling AWS directly.",
        paragraphs: [
          "A browser with stale garden state could overwrite a newer reading. The server excludes live moisture from garden sync and lets the telemetry path own it. If a reading is more than ten seconds old, the garden shows **Probe offline** and keeps the last value.",
        ],
      },
      {
        heading: "My contribution",
        navLabel: "My contribution",
        id: "contribution",
        text: "I built the AWS telemetry path from the ESP32 through API Gateway, Lambda, and DynamoDB so the garden could display live soil readings. I also implemented procedural map generation, watering reminders, and tools for testing garden behavior during development.",
      },
      {
        heading: "A working garden in twelve hours",
        navLabel: "Results",
        id: "results",
        text: "Greghouse earned **3rd Best Overall out of 86 projects** at BloomKnights 2026. The demo paired one working diagnostic device with a multiplayer garden, so visitors could see a real reading reach both the device and the browser.",
        paragraphs: [
          "More devices, light and temperature sensors, and a simpler pairing flow would extend the prototype from one instrumented plant to a larger garden.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/greghouse/awards.webp",
            alt: "The four Greghouse teammates holding their prize bears in front of the BloomKnights presentation slide.",
            width: 800,
            height: 533,
            caption:
              "The Greghouse team with their third-place prizes at BloomKnights.",
          },
        ],
      },
    ],
    links: [
      { label: "Devpost", href: "https://devpost.com/software/greghouse" },
      { label: "GitHub", href: "https://github.com/sebastian-noel/greghouse" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/posts/snoel-dev_greghouse-hackathon-bloomknights-ugcPost-7483158821662769152-rfww/",
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
    teamProfiles: [
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
      {
        name: "Alejandro Jaimes",
        href: "https://www.linkedin.com/in/alejaimes/",
      },
      {
        name: "Stevin George",
        href: "https://www.linkedin.com/in/georgestevin/",
      },
      {
        name: "Otavio Borrelly",
        href: "https://www.linkedin.com/in/otavioborrelly/",
      },
    ],
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
    visualStudy: true,
    heroCaption:
      "T.K. stands above the streets of the cyber city as a robot approaches.",
    cover: {
      placeholder: false,
      src: "/media/tks-revenge/cover.webp",
      alt: "T.K. towers over a small red robot in a neon-lit Roblox city.",
      width: 1440,
      height: 811,
    },
    tone: "deep",
    sections: [
      {
        heading: "Start with a game students already know",
        navLabel: "The idea",
        id: "idea",
        text: "During a Knight Hacks outreach event, K–12 students got especially curious when the conversation turned to games they recognized. We used **Roblox as an entry point into making games** and built a dungeon adventure around characters from Knight Hacks.",
        paragraphs: [
          "Lenny takes control of T.K.’s friends and turns them against him. Players head into the cyber city alone or together, choosing between a close-range sword and a ranged crossbow before taking on Lenny’s robots.",
        ],
      },
      {
        heading: "Build the run around T.K.",
        navLabel: "Progression",
        id: "progression",
        text: "T.K. is a **moving objective**. The server moves him toward a stop authored in the map, then starts a robot encounter around that point. Players work through encounters to power up T.K. and advance toward the fight with Lenny.",
        paragraphs: [
          "Each level has its own stop and spawn zones. The enemy controller places robots within those zones, giving level designers control over where a fight happens while allowing the exact starting positions to vary.",
          "The **server waits for the movement to finish** before starting the encounter. That handoff ties the encounter to a place in the city. The stop, nearby robot placement, and next destination can then be authored as part of the level itself.",
        ],
        diagram: "tks-progression",
        images: [
          {
            placeholder: false,
            src: "/media/tks-revenge/map.webp",
            width: 1100,
            height: 622,
            alt: "Overhead view of the cyber city, showing streets between blocks of neon-lit buildings.",
            caption:
              "The city from above. Encounters take place along T.K.’s route through its streets.",
          },
        ],
      },
      {
        heading: "Two classes, two ways to land a hit",
        navLabel: "Combat",
        id: "combat",
        text: "Sword attacks check a box in front of the player and apply knockback to each enemy caught in it. The third swing in the combo uses a **larger hitbox and a stronger push**. A crossbow shot spawns a physical bolt and applies knockback when it touches a robot.",
        paragraphs: [
          "The two classes give players different reasons to move. Getting close puts more robots within a sword swing. Keeping distance gives the crossbow player room to line up a shot.",
          "The sword tracks where the player is in a three-swing combo. The crossbow shows **charge and cooldown** in the aim interface, so lining up a shot and choosing when to release it are part of the interaction. Once a bolt is fired, the server lets physics carry it through the world with reduced gravity.",
        ],
        diagram: "tks-combat",
        images: [
          {
            placeholder: false,
            src: "/media/tks-revenge/enemies.webp",
            width: 1100,
            height: 621,
            alt: "Red hovering robots on a purple-lit city street.",
            caption: "The common robot enemies in the cyber city.",
          },
        ],
      },
      {
        heading: "Build the world and the scripts together",
        navLabel: "Production",
        id: "production",
        text: "The city, encounters, and character animations came together in **Roblox Studio**, with models and rigs built in Blender and Maya. Gameplay scripts were written in Luau, with Rojo connecting the local source files to the Studio project.",
        paragraphs: [
          "Several of us were new to Roblox development. Building a playable run for the spring showcase meant learning the engine while settling on a scope we could finish: a cyber city, two classes, a shared objective, and a final encounter.",
          "Roblox Studio held the scene and its authored waypoints and spawn parts. Luau code ran the encounters against those parts, and Rojo kept the scripts available for local collaboration. This division gave the level layout and the rules that use it separate places to change.",
        ],
      },
      {
        heading: "My contribution",
        navLabel: "My contribution",
        id: "contribution",
        text: "I scripted enemy attacks and tuned their health, damage, and placement. I also recorded and edited the demo so it could show how the classes, city, and payload fit together in one run.",
      },
      {
        heading: "Second overall and the community vote",
        navLabel: "Results",
        id: "results",
        text: "T.K.’s Revenge placed **second overall out of 33 finished projects** and won **first in the community vote with 96 of 256 votes** at Knight Hacks Project Launch. At the expo, visitors could try the game and see how the sword, crossbow, and payload worked together.",
        images: [
          {
            placeholder: false,
            src: "/media/tks-revenge/demo-table.webp",
            width: 800,
            height: 536,
            alt: "Teammates at the T.K.’s Revenge demo table with laptops, a game display, and a sign.",
            caption: "The playable demo at Project Launch.",
          },
          {
            placeholder: false,
            src: "/media/tks-revenge/awards.webp",
            width: 800,
            height: 533,
            alt: "The T.K.’s Revenge group poses in front of the game’s title art at Project Launch.",
            caption: "The group after the Project Launch awards.",
          },
        ],
      },
    ],
    links: [
      { label: "Devpost", href: "https://devpost.com/software/tk-s-revenge" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/posts/snoel-dev_knighthacks-projectlaunch-roblox-activity-7454907280065687553-Z_3d",
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
    teamProfiles: [
      {
        name: "Alejandro Jaimes",
        href: "https://www.linkedin.com/in/alejaimes/",
      },
      {
        name: "Stevin George",
        href: "https://www.linkedin.com/in/georgestevin/",
      },
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
      {
        name: "Chris Ho",
        href: "https://www.linkedin.com/in/chris-ho-15a039329/",
      },
      {
        name: "Nicole Bustos",
        href: "https://www.linkedin.com/in/nicolebustos/",
      },
      {
        name: "Johaan Riat",
        href: "https://www.linkedin.com/in/johaan-riat-238aa2330/",
      },
    ],
    award: "2nd overall · 1st community vote",
    demoVideoId: "i1DoCyYBnj4",
    demoBrief:
      "Sword and bow gameplay, the cyber-city setting, and T.K.'s payload adventure.",
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
    visualStudy: true,
    cover: {
      placeholder: false,
      src: "/media/tidesense/cover.webp",
      width: 1440,
      height: 872,
      alt: "TideSense wordmark with a stylized wave.",
    },
    tone: "slate",
    sections: [
      {
        heading: "Start with a photo of the shoreline",
        navLabel: "The idea",
        id: "idea",
        text: "TideSense explores how **a phone camera and computer vision** could help people learn about rip-current conditions. The prototype puts photo capture, a model estimate, and local conditions on the same screen flow. A single photo captures one view at one moment. That constraint shaped what the project could test: how an estimate, its context, and its uncertainty can be presented on a small screen.",
      },
      {
        heading: "Turn a capture into a model estimate",
        navLabel: "Capture and inference",
        id: "scan",
        text: "The Expo app sends the image to a **Python FastAPI server**. The server prepares it for TensorFlow Lite and translates model output into a low, moderate, or high risk label for the results screen.",
        paragraphs: [
          "To reduce the influence of one unusually high score, the server blends the mean of the five strongest detection scores with the maximum score, weighted **70% and 30%**. That changes how scores are combined. Establishing reliability would require testing on labeled shoreline images and comparing the output with observed conditions.",
          "The server reads the model’s input dimensions and data type, converts the image to RGB, and resizes it before inference. For detection-shaped output, it blends the confidence scores before separately mapping the result to the value shown in the app. A high model score in this flow is a signal from the prototype, with no field calibration to interpret it as a measured probability.",
        ],
        diagram: "tide-scan",
        images: [
          {
            placeholder: false,
            src: "/media/tidesense/camera.webp",
            width: 499,
            height: 1080,
            alt: "TideSense camera screen showing a shoreline preview and capture button.",
            caption:
              "The camera screen frames the part of the shoreline to analyze.",
          },
          {
            placeholder: false,
            src: "/media/tidesense/analysis.webp",
            width: 499,
            height: 1080,
            alt: "Dark TideSense screen displaying the photo-analysis progress state.",
            caption:
              "The app shows a progress screen while it waits for inference.",
          },
        ],
      },
      {
        heading: "Put the estimate beside local conditions",
        navLabel: "Results and history",
        id: "context",
        text: "The result page pairs the estimate with local context. National Weather Service lookups use the phone’s coordinates, and a **Gemini assistant** can use the scan context in its explanation. ElevenLabs provides an audio version of the generated summary.",
        paragraphs: [
          "Scan history is stored on the phone using SQLite. A visitor can return to the saved result and compare it with earlier scans instead of relying on a screenshot or memory.",
          "**The saved record contains the estimate and its context.** It records a timestamp, the confidence, and the coordinates when the location lookup succeeds. The history view reconstructs the result from those fields. The live capture flow leaves the stored photo field empty, so the record captures what the app reported without storing the original image.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/tidesense/risk.webp",
            width: 499,
            height: 1080,
            alt: "TideSense risk result with a category, confidence, and scan details.",
            caption: "Example result from the prototype interface.",
          },
          {
            placeholder: false,
            src: "/media/tidesense/history.webp",
            width: 499,
            height: 1080,
            alt: "TideSense history screen displaying previous detection entries.",
            caption: "Saved scans include the result and when it was captured.",
          },
        ],
      },
      {
        heading: "My contribution",
        navLabel: "My contribution",
        id: "contribution",
        text: "I integrated National Weather Service data and worked on how the app shows risk levels and safety status. This brought weather context into the same experience as the model output.",
      },
      {
        heading: "What the prototype demonstrates",
        navLabel: "Prototype limits",
        id: "results",
        text: "The demo connects capture, inference, context, and history in one mobile app. The server can produce **simulated results when inference is unavailable**. Those values are for testing the interface. TideSense remains an exploratory prototype. It cannot establish that the water is safe to enter.",
        paragraphs: [
          "Before any field use, the app would need to distinguish simulated results from model output in the interface and validate the model against observed rip currents.",
          "The simulated path returns the same category and score fields as the real path. That helped the rest of the app run while the interpreter was unavailable, but it also made the origin of a result invisible to a viewer. Carrying a source field into the result and saved history would make a repeat test understandable.",
        ],
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/StevScripts/TideSense" },
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
    teamProfiles: [
      {
        name: "Chris Ho",
        href: "https://www.linkedin.com/in/chris-ho-15a039329/",
      },
      {
        name: "Nicole Bustos",
        href: "https://www.linkedin.com/in/nicolebustos/",
      },
      {
        name: "Stevin George",
        href: "https://www.linkedin.com/in/georgestevin/",
      },
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
    ],
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
    visualStudy: true,
    heroCaption: "Choose a topic to begin a guided practice conversation.",
    cover: {
      placeholder: false,
      src: "/media/next-step/cover.webp",
      width: 1440,
      height: 900,
      alt: "Next Step landing page with auto, home, and health practice cards.",
    },
    tone: "slate",
    sections: [
      {
        heading: "Practice a decision out loud",
        navLabel: "The idea",
        id: "idea",
        text: "Next Step puts learners in a **simulated insurance emergency** and asks what they would do next. A voice conversation lets them explain their reasoning in their own words and see how their response holds up against a rubric.",
      },
      {
        heading: "Choose a scenario and start a conversation",
        navLabel: "Voice practice",
        id: "practice",
        text: "The landing page offers **auto, home, and health** scenarios. The choice travels into the practice page through the route, where the user can start and end a Vapi call. The page shows when the call is connecting or active.",
        paragraphs: [
          "Spoken answers give the session context across turns. A learner can explain the steps they would take and respond to follow-up questions as the scenario unfolds.",
          "The practice page separates **connecting, active, and finished** states. The microphone interface belongs to the active call. Once the learner ends the session, the next task is evaluation, so the results page can open immediately even when the score is still being prepared.",
        ],
        diagram: "next-practice",
        images: [
          {
            placeholder: false,
            src: "/media/next-step/scenarios.webp",
            width: 1100,
            height: 688,
            alt: "Three Next Step scenario cards for auto, home, and health insurance.",
            caption:
              "Choose one of three insurance categories before starting the practice call.",
          },
        ],
      },
      {
        heading: "Turn the completed call into feedback",
        navLabel: "Feedback",
        id: "feedback",
        text: "When the call ends, the browser opens the results page in a **pending state**. The app polls a Flask endpoint using the call ID. Flask retrieves the call analysis and summary from Vapi, and the browser stores the returned result in session storage so the results view can pick it up.",
        paragraphs: [
          "The rubric focuses on safety awareness, insurance knowledge, procedure, and decision quality. The results page gives the learner a score and a written summary to reflect on before trying again.",
          "The results page reads the four category values from the structured response, uses their total when available, and falls back to an overall score returned by the analysis. The written summary gives context for the numeric result. This is feedback from the practice agent’s rubric, with no independent assessment of the learner’s insurance knowledge.",
        ],
        diagram: "next-feedback",
        images: [
          {
            placeholder: false,
            src: "/media/next-step/results.webp",
            width: 1100,
            height: 618,
            alt: "Next Step results page with a score, written summary, and breakdown cards.",
            caption:
              "A completed practice session opens a score and a written summary.",
          },
        ],
      },
      {
        heading: "My contribution",
        navLabel: "My contribution",
        id: "contribution",
        text: "I designed and built parts of the frontend with React, TypeScript, and Tailwind CSS, set up Next.js pages and routing, and helped teammates work with Git. The routing connected the scenario choice to the practice session and the results page.",
      },
      {
        heading: "Build the experience around the wait",
        navLabel: "Design tradeoff",
        id: "tradeoff",
        text: "The voice call and its evaluation finish on different timelines. Opening the results page in a pending state gives the learner a clear place to go while the client checks for both structured analysis and a summary. Using **session storage** lets the practice and results pages share that completed response in the same browser session.",
        paragraphs: [
          "A follow-on version could give this wait a defined timeout and a way to resume a pending result. That would make the transition clearer when an evaluation takes longer than expected.",
        ],
      },
      {
        heading: "A working practice loop in three categories",
        navLabel: "Results",
        id: "results",
        text: "Next Step earned **third place in State Farm’s Best Insurance Learning Platform challenge** at ShellHacks 2025. The demo delivered a full loop from scenario choice to spoken practice and feedback. Renters, life, business, and pet insurance were proposed as future scenarios.",
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
    teamProfiles: [
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
      {
        name: "Alejandro Jaimes",
        href: "https://www.linkedin.com/in/alejaimes/",
      },
      {
        name: "Stevin George",
        href: "https://www.linkedin.com/in/georgestevin/",
      },
    ],
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
    visualStudy: true,
    cover: {
      placeholder: false,
      src: "/media/dishdash/cover.webp",
      width: 1329,
      height: 662,
      alt: "DishDash wordmark with colorful circles inside the letter D.",
    },
    tone: "coral",
    sections: [
      {
        heading: "Start with the food you already have",
        navLabel: "The idea",
        id: "idea",
        text: "DishDash came from a question we kept asking as students: what can I cook with what’s left in the fridge? The project gives people **a starting point for dinner** by searching a recipe collection using the ingredients they enter.",
      },
      {
        heading: "Make an ingredient list easy to change",
        navLabel: "Ingredient entry",
        id: "input",
        text: "A React search field suggests common ingredient names as the user types. Each accepted ingredient becomes a removable chip. Adding or removing a chip sends the updated list to the Express API, so the result set changes as the user revises what they have.",
        paragraphs: [
          "The suggestions use a list built into the frontend. The recipe search itself runs against the database.",
          "Suggestions match the beginning of the text as the user types, and the interface shows up to three choices. A cook can also submit a term directly. Keeping these two interactions separate means suggesting an ingredient only needs a local list, while accepting it can trigger a full database search.",
        ],
        images: [
          {
            placeholder: false,
            src: "/media/dishdash/ingredients.webp",
            width: 1100,
            height: 688,
            alt: "DishDash page with an ingredient field, selected chips, and visible recipe text.",
            caption: "Selected ingredients are kept in editable chips.",
          },
          {
            placeholder: false,
            src: "/media/dishdash/suggestions.webp",
            width: 1100,
            height: 619,
            alt: "DishDash showing green ingredient suggestions beneath the search field.",
            caption:
              "Autocomplete provides a quick way to add common ingredients.",
          },
        ],
      },
      {
        heading: "Rank recipes by the overlap",
        navLabel: "Recipe ranking",
        id: "ranking",
        text: "The API lowercases the submitted names. **MongoDB counts the unique names shared** by the submitted list and each recipe’s searchable ingredient tags, drops recipes with zero matches, and sorts the rest by the number of matches.",
        paragraphs: [
          "For example, if the list contains tomato and rice, a recipe tagged with both ranks above a recipe tagged only with tomato. The endpoint returns up to 100 existing recipes. A highly ranked result can still require other ingredients, which the full ingredient list shows.",
          "**The searchable tags and the recipe’s ingredient list serve different purposes.** Matching against tags can find a recipe without comparing an input like “tomato” to a line containing quantities or preparation notes. The results still show those original ingredient lines and the directions needed to cook it.",
        ],
        diagram: "dish-ranking",
        images: [
          {
            placeholder: false,
            src: "/media/dishdash/recipes.webp",
            width: 1100,
            height: 688,
            alt: "DishDash results showing recipe titles, ingredients, and cooking instructions.",
            caption:
              "Results show the full ingredients and instructions for each matching recipe.",
          },
        ],
      },
      {
        heading: "Connect the frontend, API, and database",
        navLabel: "Building it",
        id: "implementation",
        text: "With only introductory C and Java experience between us, getting the first request to work was a milestone. We built the core search across **React, Node.js, Express, and MongoDB** and debugged the API and frontend until a change in the input reliably produced a new list of recipes.",
      },
      {
        heading: "What overlap leaves out",
        navLabel: "Ranking tradeoff",
        id: "tradeoff",
        text: "Counting shared tags gives the search a predictable rule. It does not account for what’s missing, quantities, or substitutions. Two recipes can tie on overlap while requiring very different shopping lists.",
        paragraphs: [
          "Keeping the full ingredient list in the result makes that limit visible. A pantry-focused ranking could show **matched and missing ingredients** together and let a cook choose between maximum overlap and the fewest extra items.",
        ],
      },
      {
        heading: "A working first full-stack project",
        navLabel: "Outcome",
        id: "results",
        text: "The demo at Knight Hacks VII showed the complete ingredient-to-recipe flow. It was our first full-stack project and a practical way to learn how a browser, server, and database exchange data.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sebastian-noel/DishDash" },
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
    teamProfiles: [
      {
        name: "Ibrahim Shaqqou",
        href: "https://www.linkedin.com/in/ibrahim-shaqqou-5866b0329/",
      },
      {
        name: "Sebastian Noel",
        href: "https://www.linkedin.com/in/snoel-dev/",
      },
    ],
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
      ...entry.sections.flatMap((section) => section.images ?? []),
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
    ...entry.sections.flatMap((section) => section.images ?? []),
  ]) {
    if (photo && !photo.placeholder && !existsSync(`public${photo.src}`)) {
      throw new Error(`Missing cover file: ${photo.src}`);
    }
  }
  for (const { clip } of entry.sections) {
    if (
      clip &&
      (!/^\/media\/[a-z0-9/-]+\.(webm|mp4)$/.test(clip.src) ||
        !/^\/media\/[a-z0-9/-]+\.(avif|webp|png|jpg|jpeg)$/.test(clip.poster) ||
        !clip.caption.trim() ||
        !existsSync(`public${clip.src}`) ||
        !existsSync(`public${clip.poster}`))
    ) {
      throw new Error(`Invalid section clip: ${clip.src}`);
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
