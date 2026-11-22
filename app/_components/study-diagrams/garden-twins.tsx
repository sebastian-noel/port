import { MotionFigure } from "../motion-figure";
import styles from "./scenes.module.css";

export function GardenReading() {
  return (
    <MotionFigure className="study-diagram">
      <div className={styles.pair}>
        <div className={styles.panel}>
          <svg
            className={styles.art}
            viewBox="0 0 240 156"
            role="img"
            aria-label="A capacitive probe sits in the pot below the ESP32 display."
          >
            <rect width="240" height="156" fill="#102936" />
            <path d="M68 91h82l-12 46H80z" fill="#74a4c7" />
            <ellipse cx="109" cy="92" rx="41" ry="8" fill="#7a5747" />
            <path
              d="M109 92V53m0 25q-19 0-24-14 19-1 24 14m0-9q17 0 24-16-19-2-24 16"
              fill="#9ac781"
              stroke="#9ac781"
              strokeWidth="3"
            />
            <path
              d="M132 105V73q0-20 23-20h9"
              fill="none"
              stroke="#ff7d82"
              strokeWidth="4"
              pathLength="1"
              className={styles.trace}
            />
            <rect x="156" y="30" width="63" height="45" rx="7" fill="#eedac7" />
            <rect x="162" y="36" width="51" height="33" rx="4" fill="#547c59" />
            <path
              d="M176 49v3m22-3v3m-16 5q5 7 11 0"
              fill="none"
              stroke="#ddf1c5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <h3>In the pot</h3>
          <p>
            The ESP32 reads the soil probe, updates the touchscreen face, and
            sends the reading to AWS.
          </p>
        </div>
        <div className={styles.panel}>
          <svg
            className={styles.art}
            viewBox="0 0 240 156"
            role="img"
            aria-label="A pixel-art plant avatar shows the same smile as the physical device."
          >
            <rect width="240" height="156" fill="#214337" />
            <path
              d="M0 39H240M0 78H240M0 117H240M40 0V156M80 0V156M120 0V156M160 0V156M200 0V156"
              stroke="#315347"
            />
            <path d="M0 132h70v-13h100v13h70v24H0z" fill="#97775a" />
            <path d="M114 75V48h-13V36h14v9h9V32h17v12h-13v31" fill="#acd48a" />
            <path d="M89 73h62v35h-9v11h-44v-11h-9z" fill="#81aecd" />
            <path
              d="M103 83h8v8h-8zm25 0h8v8h-8zm-18 17h5v4h11v-4h5v8h-21z"
              fill="#102936"
            />
          </svg>
          <h3>In the garden</h3>
          <p>
            The browser gets the latest reading through the Node.js proxy and
            renders the same mood on Greg’s sprite.
          </p>
        </div>
      </div>
      <figcaption>
        One soil reading drives two displays. Both apply the same species
        thresholds. If the reading goes stale, the garden retains the last value
        and marks the probe offline.
      </figcaption>
    </MotionFigure>
  );
}

function GardenMap({
  label,
  player,
}: {
  label: string;
  player: "left" | "right";
}) {
  return (
    <div className={styles.panel}>
      <span className={styles.seed}>seed + map dimensions</span>
      <svg
        className={styles.art}
        viewBox="0 0 240 134"
        role="img"
        aria-label={label}
      >
        <rect width="240" height="134" fill="#244d36" />
        <path
          d="M0 33H240M0 66H240M0 99H240M40 0V134M80 0V134M120 0V134M160 0V134M200 0V134"
          stroke="#315e43"
        />
        <path
          d="M0 89h78V62h64v22h98"
          fill="none"
          stroke="#aa8960"
          strokeWidth="18"
        />
        <path d="M29 13h55v12h13v28H58v8H26V28h3z" fill="#4688ae" />
        <path
          d="M157 24h15v10h10v12h-36V33h11zm47 8h15v10h10v12h-36V41h11z"
          fill="#7faf68"
        />
        <path d="M98 95h21v21H98zm41 7h21v21h-21z" fill="#90af69" />
        <rect
          x={player === "left" ? 49 : 192}
          y="76"
          width="12"
          height="18"
          rx="3"
          fill="#ffd18d"
          stroke="#27251f"
        />
        <rect
          x={player === "left" ? 192 : 49}
          y="76"
          width="12"
          height="18"
          rx="3"
          fill="#ff94a6"
          stroke="#27251f"
        />
      </svg>
      <h3>{player === "left" ? "Owner’s browser" : "Visitor’s browser"}</h3>
      <p>
        {player === "left"
          ? "Gold marks the owner’s local player."
          : "Gold marks the visitor’s local player."}
      </p>
    </div>
  );
}

export function SharedGarden() {
  return (
    <figure className="study-diagram">
      <div className={styles.pair}>
        <GardenMap
          player="left"
          label="Owner view of the garden. A pond and two trees frame a path. The owner’s avatar is on the left."
        />
        <GardenMap
          player="right"
          label="Visitor view of the same terrain. The local visitor avatar is on the right."
        />
      </div>
      <figcaption>
        Illustrative maps. Both browsers build the same terrain from the seed
        and dimensions. WebSocket messages carry where players are standing and
        which way they face.
      </figcaption>
    </figure>
  );
}
