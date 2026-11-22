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
      | "greghouse-multiplayer";
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
