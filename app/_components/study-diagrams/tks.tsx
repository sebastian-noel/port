import { MotionFigure } from "../motion-figure";
import styles from "./scenes.module.css";

const blocks = [
  [16, 21, 79, 68],
  [108, 17, 62, 72],
  [196, 15, 83, 31],
  [194, 61, 41, 55],
  [257, 61, 23, 71],
  [303, 74, 55, 52],
  [373, 79, 54, 79],
  [17, 126, 62, 71],
  [90, 148, 87, 49],
  [192, 162, 66, 35],
  [309, 156, 56, 41],
  [311, 17, 116, 24],
];

export function TksRoute() {
  return (
    <MotionFigure className="study-diagram">
      <svg
        className={styles.art}
        viewBox="0 0 444 215"
        role="img"
        aria-label="Illustrative top-down city route. T.K. escorts from the entry to a stop beside two enemy spawn zones, then moves to the next stop."
      >
        <rect width="444" height="215" fill="#171a37" />
        {blocks.map(([x, y, width, height]) => (
          <g key={x}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx="4"
              fill="#25284d"
              stroke="#575484"
            />
            <path
              d={`M${x + 7} ${y + 8}h${width - 14}`}
              stroke="#7666a1"
              strokeWidth="2"
            />
          </g>
        ))}
        <path
          d="M22 109H142V133H288V57H416"
          fill="none"
          stroke="#514669"
          strokeWidth="22"
        />
        <path
          d="M22 109H142V133H288V57H410"
          fill="none"
          stroke="#ff7d82"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          className={styles.trace}
        />
        <path
          d="M404 51l7 6-7 6"
          fill="none"
          stroke="#ff7d82"
          strokeWidth="3"
        />
        <g stroke="#d0a5ff" fill="#6a467f" strokeDasharray="4 3">
          <rect x="177" y="91" width="39" height="27" rx="4" />
          <rect x="225" y="145" width="42" height="36" rx="4" />
        </g>
        <g fill="#171a37" stroke="#ff7d82" strokeWidth="3">
          <circle cx="44" cy="109" r="8" />
          <circle cx="221" cy="133" r="9" />
          <circle cx="372" cy="57" r="9" />
        </g>
        <g fill="white" fontSize="13" fontWeight="600">
          <text x="18" y="142">
            Entry
          </text>
          <text x="134" y="159">
            T.K. stops
          </text>
          <text x="345" y="25">
            Next stop
          </text>
        </g>
      </svg>
      <div className={styles.key}>
        <span>
          <i className={styles.swatch} /> Escort route and stops
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.zone}`} /> Enemy spawn zones
        </span>
      </div>
      <figcaption>
        Illustrative street plan. A stop gives each encounter a fixed location.
        Enemies can start at different points within nearby spawn zones.
      </figcaption>
    </MotionFigure>
  );
}

export function TksCombat() {
  return (
    <MotionFigure className="study-diagram">
      <div className={styles.pair}>
        <div className={styles.panel}>
          <svg
            className={styles.art}
            viewBox="0 0 260 133"
            role="img"
            aria-label="A sword hitbox overlaps two nearby robots and misses a third outside the box."
          >
            <rect width="260" height="133" fill="#171a37" />
            <path d="M0 43H260M0 94H260M63 0V133M190 0V133" stroke="#363456" />
            <rect
              x="83"
              y="29"
              width="103"
              height="77"
              rx="5"
              stroke="#ff7d82"
              strokeWidth="2"
              fill="#512e53"
            />
            <rect
              x="64"
              y="21"
              width="136"
              height="95"
              rx="5"
              stroke="#d0a5ff"
              strokeDasharray="5 4"
              fill="none"
            />
            <circle cx="62" cy="67" r="12" fill="#72b7e7" />
            <path
              d="M68 67h40m-6-5 6 5-6 5"
              fill="none"
              stroke="#e2f4ff"
              strokeWidth="2"
            />
            <g fill="#ff7d82">
              <rect x="129" y="44" width="16" height="16" rx="3" />
              <rect x="160" y="78" width="16" height="16" rx="3" />
            </g>
            <rect x="217" y="53" width="16" height="16" rx="3" fill="#72b7e7" />
          </svg>
          <h3>Sword: cover an area</h3>
          <p>
            Two robots overlap the standard hitbox. The dashed outline shows the
            larger third swing.
          </p>
        </div>
        <div className={styles.panel}>
          <svg
            className={styles.art}
            viewBox="0 0 260 133"
            role="img"
            aria-label="The crossbow bolt travels through the street and hits the robot directly ahead, missing the robot standing to the side."
          >
            <rect width="260" height="133" fill="#171a37" />
            <path d="M0 43H260M0 94H260M63 0V133M190 0V133" stroke="#363456" />
            <circle cx="44" cy="67" r="12" fill="#72b7e7" />
            <rect x="162" y="24" width="16" height="16" rx="3" fill="#72b7e7" />
            <rect x="205" y="59" width="16" height="16" rx="3" fill="#ff7d82" />
            <path
              d="M61 67H201"
              stroke="#ff7d82"
              strokeWidth="3"
              fill="none"
              pathLength="1"
              className={styles.trace}
            />
            <path
              d="M193 60l8 7-8 7"
              stroke="#ff7d82"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          <h3>Crossbow: line up a shot</h3>
          <p>
            The bolt contacts one robot. The robot standing to the side is
            outside its path.
          </p>
        </div>
      </div>
      <div className={styles.key}>
        <span>
          <i className={styles.swatch} /> Hit robot
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.inactive}`} /> Player or
          unhit robot
        </span>
      </div>
      <figcaption>
        Top-down combat examples. A hit applies knockback. The sword checks an
        area, while a crossbow bolt has to make contact.
      </figcaption>
    </MotionFigure>
  );
}
