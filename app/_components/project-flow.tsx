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
