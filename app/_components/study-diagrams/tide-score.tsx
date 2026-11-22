import { MotionFigure } from "../motion-figure";
import styles from "./scenes.module.css";

const sample = [0.34, 0.26, 0.22, 0.18, 0.15];
const peak = Math.max(...sample);
const average = sample.reduce((sum, score) => sum + score, 0) / sample.length;

export function TideScore() {
  return (
    <MotionFigure className="study-diagram">
      <div className={styles.pair}>
        <div className={styles.panel}>
          <span className="state-label">Example model output</span>
          <h3>Five strongest detections</h3>
          <div
            className={styles.scoreChart}
            aria-label="Illustrative detection scores, scaled from zero to one"
          >
            {sample.map((score) => (
              <div key={score}>
                <span>{score.toFixed(2)}</span>
                <div className={styles.barWell} aria-hidden="true">
                  <div
                    className={
                      score === peak
                        ? `${styles.bar} ${styles.barPeak}`
                        : styles.bar
                    }
                    style={{ height: `${score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.key}>
            <span>
              <i className={styles.swatch} /> Highest score
            </span>
            <span>
              <i className={`${styles.swatch} ${styles.inactive}`} /> Other top
              scores
            </span>
          </div>
        </div>
        <div className={`${styles.panel} ${styles.formula}`}>
          <h3>Blend the average and peak</h3>
          <div className={styles.weight} aria-hidden="true">
            <span />
            <span />
          </div>
          <p>
            70% × {average.toFixed(2)} (top-five average)
            <br />+ 30% × {peak.toFixed(2)} (peak)
          </p>
          <div>
            <strong>{(0.7 * average + 0.3 * peak).toFixed(3)}</strong>
            <span>Blended detection score</span>
          </div>
        </div>
      </div>
      <figcaption>
        Illustrative numbers. Blending pulls a lone peak toward the other
        detections. The server maps this intermediate score to the prototype’s
        displayed risk estimate in a separate step.
      </figcaption>
    </MotionFigure>
  );
}
