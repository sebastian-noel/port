import styles from "./scenes.module.css";

const pantry = ["tomato", "rice"];
const recipes = [
  { name: "Tomato rice bowl", tags: ["tomato", "rice", "onion"] },
  { name: "Tomato soup", tags: ["tomato", "basil", "cream"] },
  { name: "Lemon pasta", tags: ["pasta", "lemon", "butter"] },
];

export function PantryRanking() {
  return (
    <figure className="study-diagram">
      <div className={styles.pantry}>
        <span className="state-label">In the pantry</span>
        <div className={styles.ingredients}>
          {pantry.map((ingredient) => (
            <span className={styles.match} key={ingredient}>
              {ingredient}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.recipeRows}>
        {recipes.map(({ name, tags }) => {
          const matched = tags.filter((tag) => pantry.includes(tag)).length;
          return (
            <div
              className={
                matched
                  ? styles.recipeRow
                  : `${styles.recipeRow} ${styles.filtered}`
              }
              key={name}
            >
              <div>
                <p>{name}</p>
                <div className={styles.ingredients}>
                  {tags.map((tag) => (
                    <span
                      className={
                        pantry.includes(tag) ? styles.match : undefined
                      }
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <strong>{matched ? `${matched} matched` : "Filtered out"}</strong>
            </div>
          );
        })}
      </div>
      <figcaption>
        Example recipes show what the overlap score counts. The rice bowl ranks
        first even though it still needs onion. A recipe with zero overlap is
        filtered out.
      </figcaption>
    </figure>
  );
}
