import { Icon } from "./icons";
const callFeedback = {
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
};

export function NextFeedback() {
  const { steps, caption } = callFeedback;

  return (
    <figure className="study-diagram">
      <ol className="project-flow" role="list">
        {steps.map(({ label, title, text }, index) => (
          <li key={label}>
            {index > 0 && (
              <span className="project-flow-arrow" aria-hidden="true">
                <Icon name="arrow" />
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
