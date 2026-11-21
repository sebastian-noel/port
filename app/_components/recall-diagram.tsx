import { MotionFigure } from "./motion-figure";

type SymbolName = "camera" | "mic" | "store" | "question" | "search" | "speak";

const symbols: Record<SymbolName, React.ReactNode> = {
  camera: (
    <>
      <path d="M4 7h4l2-2h4l2 2h4v12H4z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M6 11v2a6 6 0 0 0 12 0v-2M12 19v3m-3 0h6" />
    </>
  ),
  store: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12a8 3 0 0 0 16 0V6M4 12a8 3 0 0 0 16 0" />
    </>
  ),
  question: <path d="M4 5h16v12H9l-5 3zM8 9h8m-8 4h5" />,
  search: (
    <>
      <circle cx="10" cy="10" r="5" />
      <path d="m14 14 5 5" />
    </>
  ),
  speak: (
    <path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10" />
  ),
};

function DiagramIcon({ name }: { name: SymbolName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {symbols[name]}
    </svg>
  );
}

export function RecallDiagram({
  kind,
}: {
  kind: "recall-capture" | "recall-retrieval";
}) {
  if (kind === "recall-capture") {
    return (
      <MotionFigure className="study-diagram recall-diagram">
        <div className="recall-inputs">
          <div className="recall-diagram-node">
            <DiagramIcon name="camera" />
            <span className="state-label">Camera</span>
            <h3>Pick a frame</h3>
            <p>
              MJPEG over Wi-Fi → YOLOv8 ranks the frames → Gemini describes the
              top three.
            </p>
          </div>
          <div className="recall-diagram-node">
            <DiagramIcon name="mic" />
            <span className="state-label">Microphone</span>
            <h3>Transcribe the audio</h3>
            <p>
              16 kHz mono WAV → ElevenLabs Scribe → latest transcript over HTTP.
            </p>
          </div>
        </div>
        <div className="flow-arrow recall-merge-arrow" aria-hidden="true">
          <span>↓</span>
        </div>
        <div className="recall-diagram-node recall-memory-node">
          <DiagramIcon name="store" />
          <div>
            <span className="state-label">Memory</span>
            <h3>Save and index the moment</h3>
            <p>
              SQLite stores the timestamp and details. ChromaDB makes the text
              searchable by meaning.
            </p>
          </div>
        </div>
        <figcaption>
          A saved moment combines a selected frame’s description with the latest
          transcript available when the batch is processed.
        </figcaption>
      </MotionFigure>
    );
  }

  return (
    <MotionFigure className="study-diagram recall-diagram">
      <ol className="recall-retrieval">
        <li className="recall-diagram-node">
          <DiagramIcon name="question" />
          <span className="state-label">Ask</span>
          <h3>“Where’s my drink?”</h3>
          <p>Ask a question in the dashboard.</p>
        </li>
        <li className="recall-diagram-node">
          <DiagramIcon name="search" />
          <span className="state-label">Retrieve</span>
          <h3>Find matching context</h3>
          <p>
            A saved description of a cup can match a question about a drink.
          </p>
        </li>
        <li className="recall-diagram-node">
          <DiagramIcon name="speak" />
          <span className="state-label">Answer</span>
          <h3>Read or listen</h3>
          <p>Gemini drafts the reply. ElevenLabs can speak it aloud.</p>
        </li>
      </ol>
      <figcaption>
        Example question. Retrieval supplies observations and timestamps before
        the model writes an answer.
      </figcaption>
    </MotionFigure>
  );
}
