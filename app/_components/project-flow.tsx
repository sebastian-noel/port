const flows = {
  "greghouse-telemetry": {
    steps: [
      {
        label: "In the pot",
        title: "Measure the soil",
        text: "The probe reads the soil. The ESP32 uses the reading to update Greg’s face and posts it over HTTPS.",
      },
      {
        label: "In AWS",
        title: "Store the reading",
        text: "API Gateway receives the reading. Lambda writes the value, plant ID, and timestamp to DynamoDB.",
      },
      {
        label: "In the browser",
        title: "Update the garden",
        text: "The client polls a Node.js proxy and applies the same moisture thresholds as the device.",
      },
    ],
    caption:
      "The probe drives both displays. The garden holds the last reading and marks it stale if the probe falls behind.",
  },
  "greghouse-multiplayer": {
    steps: [
      {
        label: "Invite",
        title: "Join the same room",
        text: "A share link brings visitors into the owner’s garden with a name and avatar.",
      },
      {
        label: "Build",
        title: "Generate the same map",
        text: "Each browser builds the terrain and decorations using the garden’s shared seed.",
      },
      {
        label: "Sync",
        title: "Share what changes",
        text: "WebSockets relay avatar positions, chat, and garden updates. Sensor readings arrive through the telemetry proxy.",
      },
    ],
    caption:
      "Clients generate the scenery locally. The server sends room state and events as visitors move around.",
  },
  "tks-progression": {
    steps: [
      {
        label: "Escort",
        title: "Reach the next stop",
        text: "T.K. moves to a waypoint placed in the level.",
      },
      {
        label: "Fight",
        title: "Face a robot encounter",
        text: "The server spawns robots inside zones authored for that level.",
      },
      {
        label: "Advance",
        title: "Push deeper into the city",
        text: "Build up T.K.’s power to continue toward Lenny.",
      },
    ],
    caption:
      "The route alternates movement through the city with encounters at T.K.’s stops.",
  },
  "tks-combat": {
    steps: [
      {
        label: "Sword",
        title: "Check the space ahead",
        text: "A box in front of the player finds enemies in striking distance.",
      },
      {
        label: "Crossbow",
        title: "Send a bolt into the world",
        text: "A physics-driven projectile checks for contact along its path.",
      },
      {
        label: "On hit",
        title: "Push the enemy back",
        text: "The server applies an impulse so a successful hit moves the robot.",
      },
    ],
    caption:
      "The first two cards show alternate ways to land the same kind of knockback.",
  },
  "tide-scan": {
    steps: [
      {
        label: "Mobile",
        title: "Frame the shoreline",
        text: "The camera supplies a still image to the server.",
      },
      {
        label: "FastAPI",
        title: "Run TensorFlow Lite",
        text: "The server prepares the image and combines model scores.",
      },
      {
        label: "Results",
        title: "Show the risk estimate",
        text: "The app displays the category and confidence from the response.",
      },
    ],
    caption:
      "This is a prototype inference path. A simulated response can appear when the model is unavailable.",
  },
  "tide-context": {
    steps: [
      {
        label: "Result",
        title: "Review the estimate",
        text: "The results view displays the scan and local conditions together.",
      },
      {
        label: "Explanation",
        title: "Ask about this scan",
        text: "The assistant can use the detection context in its reply.",
      },
      {
        label: "History",
        title: "Reopen a previous scan",
        text: "SQLite keeps the result on the device for later review.",
      },
    ],
    caption:
      "The estimate, explanation, and saved record serve different purposes.",
  },
  "next-practice": {
    steps: [
      {
        label: "Pick",
        title: "Choose a category",
        text: "Start with auto, home, or health insurance.",
      },
      {
        label: "Speak",
        title: "Work through the situation",
        text: "Explain what you would do and respond to follow-up questions.",
      },
      {
        label: "Finish",
        title: "End the practice call",
        text: "The app opens the results view while the analysis is prepared.",
      },
    ],
    caption:
      "A session takes a learner from scenario choice to a spoken response and feedback.",
  },
  "next-feedback": {
    steps: [
      {
        label: "Browser",
        title: "Request the call result",
        text: "The client sends the completed call ID to Flask.",
      },
      {
        label: "Flask and Vapi",
        title: "Retrieve the analysis",
        text: "Flask fetches the structured evaluation and summary for that call.",
      },
      {
        label: "Results",
        title: "Show feedback",
        text: "The results view reads the returned score and summary from session storage.",
      },
    ],
    caption:
      "The browser can display a pending state while it waits for the evaluation.",
  },
  "dish-input": {
    steps: [
      {
        label: "Type",
        title: "Find a common ingredient",
        text: "The search field filters a list of suggested ingredients.",
      },
      {
        label: "Select",
        title: "Keep each choice visible",
        text: "Accepted ingredients appear as removable chips.",
      },
      {
        label: "Search",
        title: "Send the updated list",
        text: "Each change starts a new recipe search against the server.",
      },
    ],
    caption:
      "The frontend manages suggestions and the selected list. The backend finds the recipes.",
  },
  "dish-ranking": {
    steps: [
      {
        label: "Normalize",
        title: "Lowercase the query",
        text: "The API prepares the submitted ingredient names for lookup.",
      },
      {
        label: "Match",
        title: "Count the shared names",
        text: "MongoDB compares the submitted names with each recipe’s ingredient tags.",
      },
      {
        label: "Rank",
        title: "Return the strongest matches",
        text: "Recipes with at least one match are sorted by overlap, up to 100 results.",
      },
    ],
    caption:
      "For tomato and rice, a recipe tagged with both appears above a recipe tagged only with tomato.",
  },
};

export function ProjectFlow({ kind }: { kind: keyof typeof flows }) {
  const { steps, caption } = flows[kind];

  const branches = kind === "tks-combat";

  return (
    <figure className="study-diagram">
      <ol
        className={
          branches ? "project-flow project-flow-branches" : "project-flow"
        }
        role="list"
      >
        {steps.map(({ label, title, text }, index) => (
          <li key={label}>
            {(branches ? index === steps.length - 1 : index > 0) && (
              <span className="project-flow-arrow" aria-hidden="true">
                →
              </span>
            )}
            <span className="state-label">{label}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
