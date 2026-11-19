export function ProjectDiagram({
  kind,
}: {
  kind: "permanence-system" | "permanence-memory" | "permanence-navigation";
}) {
  if (kind === "permanence-navigation") {
    return (
      <figure className="study-diagram">
        <ol className="navigation-sequence">
          {[
            [
              "Choose a target",
              "A language request identifies an object in the scanned scene.",
            ],
            [
              "Keep its location",
              "The world state retains the target when it is hidden or out of view.",
            ],
            [
              "Move toward it",
              "The rover approaches the remembered target while routing around other objects.",
            ],
          ].map(([title, description], index) => (
            <li key={title}>
              <svg viewBox="0 0 220 150" aria-hidden="true">
                <path
                  d="M20 135H200M20 15V135"
                  fill="none"
                  stroke="var(--sky)"
                  opacity=".25"
                />
                <rect
                  x="38"
                  y="100"
                  width="30"
                  height="26"
                  rx="5"
                  fill="var(--sky)"
                />
                <path
                  d="M35 106V119M71 106V119M53 100V90"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <rect
                  x="95"
                  y="65"
                  width="34"
                  height="34"
                  rx="3"
                  fill="var(--canvas)"
                  stroke="var(--sky)"
                  strokeWidth="2"
                />
                <path
                  d="M162 30H182L189 59H155Z"
                  fill="var(--canvas)"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray={index === 0 ? undefined : "4 3"}
                />
                <circle
                  cx="172"
                  cy="45"
                  r="24"
                  fill="none"
                  stroke="var(--accent)"
                  opacity=".4"
                />
                {index === 0 ? (
                  <path
                    d="M53 90L147 38M53 90L160 66"
                    stroke="var(--sky)"
                    strokeDasharray="3 4"
                    opacity=".6"
                  />
                ) : index === 1 ? (
                  <path d="M140 15V80" stroke="currentColor" strokeWidth="5" />
                ) : (
                  <path
                    d="M53 90C53 45 90 40 142 45M134 38L143 45L134 52"
                    stroke="var(--accent)"
                    strokeWidth="3"
                    fill="none"
                  />
                )}
              </svg>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <figcaption>
          Conceptual top-down sequence, not a recorded trajectory. The dashed
          cup marks a remembered target; the curved route illustrates
          approaching around an obstacle.
        </figcaption>
      </figure>
    );
  }
  if (kind === "permanence-memory") {
    return (
      <figure className="study-diagram">
        <ol className="memory-sequence">
          {[
            ["Show", "A visible ball gets an identity and a 3D position."],
            [
              "Hide",
              "Containment checks associate the hidden ball with a cup.",
            ],
            ["Move", "The remembered ball follows the cup's position."],
            ["Reveal", "Lifting the cup lets the system check its answer."],
          ].map(([title, description], index) => (
            <li key={title}>
              <svg viewBox="0 0 160 100" aria-hidden="true">
                <path d="M12 85H148" stroke="currentColor" opacity=".25" />
                <circle
                  cx={index === 2 ? 103 : 80}
                  cy="73"
                  r="10"
                  fill="var(--accent)"
                  opacity={index === 1 || index === 2 ? ".65" : "1"}
                />
                {index > 0 && (
                  <path
                    d={
                      index === 2
                        ? "M83 32H123L134 85H72Z"
                        : index === 3
                          ? "M60 10H100L111 52H49Z"
                          : "M60 32H100L111 85H49Z"
                    }
                    fill="var(--canvas)"
                    fillOpacity=".45"
                    stroke="var(--sky)"
                    strokeWidth="2"
                  />
                )}
                {(index === 1 || index === 2) && (
                  <circle
                    cx={index === 2 ? 103 : 80}
                    cy="73"
                    r="13"
                    fill="none"
                    stroke="var(--accent)"
                    strokeDasharray="3 3"
                  />
                )}
                {index === 2 && (
                  <path
                    d="M27 50H60M53 43L60 50L53 57"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
              </svg>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <figcaption>
          Conceptual illustration of the shell-game demonstration. The dashed
          ball represents remembered position, not a camera observation.
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="study-diagram architecture-diagram">
      <div className="system-input">
        <span>Sensor input</span>
        <h3>iPhone + Record3D</h3>
        <p>RGB · LiDAR depth · ARKit pose</p>
      </div>
      <div className="flow-arrow" aria-hidden="true">
        ↓
      </div>
      <div className="jetson-system">
        <p className="system-label">
          NVIDIA Jetson Orin Nano · 8 GB shared memory
        </p>
        <div className="system-stages">
          <div>
            <span>Ground a request</span>
            <h3>Scan + Qwen-3D</h3>
            <p>Language and scene → selected target</p>
            <small>Process exits at handoff</small>
          </div>
          <div className="flow-arrow" aria-hidden="true">
            →
          </div>
          <div>
            <span>Track the scene</span>
            <h3>YOLOE + 3D memory</h3>
            <p>Live detections → identity, position, containment</p>
            <small>Target retained through occlusion</small>
          </div>
        </div>
      </div>
      <div className="flow-arrow" aria-hidden="true">
        ↓
      </div>
      <div className="system-outputs">
        <div>
          <span>Act on memory</span>
          <h3>Navigator → motors</h3>
          <p>Arduino Uno + L298N drive the rover toward its target.</p>
        </div>
        <div className="system-view">
          <span>Inspect the world state</span>
          <h3>Three.js dashboard</h3>
          <p>
            State, scene, camera feed, and metrics make the robot&apos;s memory
            inspectable.
          </p>
        </div>
      </div>
      <figcaption>
        Simplified architecture reconstructed from the project README and viewer
        interface contract. The dashboard consumes data from the system; it does
        not run the perception models.
      </figcaption>
    </figure>
  );
}
