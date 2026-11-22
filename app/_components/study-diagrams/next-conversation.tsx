import styles from "./scenes.module.css";

export function NextConversation() {
  return (
    <figure className="study-diagram">
      <div className={styles.conversation}>
        <span className="state-label">Example auto practice session</span>
        <p>
          <strong>Voice agent</strong> You’ve been in a minor collision. What
          would you check first?
        </p>
        <p className={styles.learner}>
          <strong>Learner</strong> I’d check whether anyone needs help before
          thinking about the claim.
        </p>
        <p>
          <strong>Voice agent</strong> Once everyone is safe, what information
          would you collect before contacting your insurer?
        </p>
      </div>
      <figcaption>
        Illustrative exchange. A follow-up asks about the order of actions and
        gives the learner room to explain their reasoning. The evaluation is
        prepared after the call.
      </figcaption>
    </figure>
  );
}
