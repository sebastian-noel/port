import { MotionFigure } from "./motion-figure";

export function ProjectDiagram({
  kind,
}: {
  kind: "permanence-system" | "permanence-memory" | "permanence-states";
}) {
  if (kind === "permanence-states") {
    return (
      <MotionFigure className="study-diagram">
        <ol className="navigation-sequence state-sequence">
          <li>
            <div className="diagram-art state-art">
              <svg viewBox="0 0 220 150" aria-hidden="true">
                <rect
                  x="20"
                  y="57"
                  width="32"
                  height="36"
                  rx="7"
                  fill="var(--sky)"
                />
                <path
                  d="M54 65L163 43M54 85L163 107"
                  stroke="var(--sky)"
                  strokeDasharray="4 5"
                />
                <path
                  d="M173 44H195L205 106H163Z"
                  fill="var(--canvas)"
                  stroke="var(--accent)"
                  strokeWidth="3"
                />
                <circle
                  cx="184"
                  cy="75"
                  r="32"
                  fill="none"
                  stroke="var(--accent)"
                  opacity=".3"
                />
              </svg>
              <span className="diagram-radar" aria-hidden="true" />
            </div>
            <span className="state-label">Visible</span>
            <h3>Seen now</h3>
            <p>
              A matched detection updates the object&apos;s position and
              last-seen time.
            </p>
          </li>
          <li>
            <div className="diagram-art state-art">
              <svg viewBox="0 0 220 150" aria-hidden="true">
                <rect
                  x="22"
                  y="20"
                  width="176"
                  height="110"
                  rx="12"
                  fill="var(--canvas)"
                  stroke="var(--sky)"
                />
                <path
                  d="M50 43H72L82 105H40Z"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="143"
                  cy="65"
                  r="24"
                  fill="none"
                  stroke="var(--sky)"
                  strokeWidth="2"
                />
                <path
                  d="M143 49V65L155 72M115 108H171"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span className="diagram-radar" aria-hidden="true" />
            </div>
            <span className="state-label">Last seen</span>
            <h3>Keep the memory</h3>
            <p>
              Identity and position persist. Time since the last observation
              communicates freshness.
            </p>
          </li>
          <li>
            <div className="diagram-art state-art">
              <svg viewBox="0 0 220 150" aria-hidden="true">
                <rect
                  x="20"
                  y="57"
                  width="32"
                  height="36"
                  rx="7"
                  fill="var(--sky)"
                />
                <path
                  d="M54 65L110 47M54 75H110M54 85L110 103"
                  stroke="var(--sky)"
                  strokeDasharray="4 5"
                />
                <rect
                  x="110"
                  y="27"
                  width="12"
                  height="96"
                  rx="3"
                  fill="var(--sky)"
                />
                <path
                  d="M173 44H195L205 106H163Z"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <span className="diagram-radar" aria-hidden="true" />
            </div>
            <span className="state-label">Occluded</span>
            <h3>Explain the absence</h3>
            <p>
              A nearer depth surface blocks the expected position. The hidden
              object remains a memory.
            </p>
          </li>
        </ol>
        <figcaption>
          LiDAR measures the visible surface. Dashed objects mark remembered
          positions, while last-seen age records how long they have been unseen.
        </figcaption>
      </MotionFigure>
    );
  }
  if (kind === "permanence-memory") {
    return (
      <MotionFigure className="study-diagram">
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
              <div className={`diagram-art memory-art memory-art-${index}`}>
                <svg viewBox="0 0 160 100" aria-hidden="true">
                  <path d="M12 85H148" stroke="currentColor" opacity=".25" />
                  <circle
                    className="memory-ball"
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
                <span className="diagram-radar" aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <figcaption>
          The ball&apos;s remembered position follows its container. Dashed
          outlines distinguish memory from a current observation.
        </figcaption>
      </MotionFigure>
    );
  }
  return (
    <MotionFigure className="study-diagram architecture-diagram">
      <div className="system-input">
        <span>Sensor input</span>
        <h3>iPhone + Record3D</h3>
        <p className="system-input-detail">RGB · LiDAR depth · ARKit pose</p>
      </div>
      <div className="flow-arrow" aria-hidden="true">
        <span>↓</span>
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
            <span>→</span>
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
        <span>↓</span>
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
        The Jetson runs perception, memory, and control. The dashboard turns its
        state stream into an inspectable view of the world.
      </figcaption>
    </MotionFigure>
  );
}
