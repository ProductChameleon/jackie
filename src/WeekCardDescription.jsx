import { useState } from "react";

const PREVIEW_LEN = 200;

/**
 * @param {{ text: string }} props
 */
export default function WeekCardDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = text.length > PREVIEW_LEN;

  let preview = text;
  if (needsToggle) {
    preview = text.slice(0, PREVIEW_LEN).trimEnd();
    const lastSpace = preview.lastIndexOf(" ");
    if (lastSpace > PREVIEW_LEN - 30) {
      preview = preview.slice(0, lastSpace);
    }
    preview = `${preview}…`;
  }

  return (
    <p className="progress-week-description">
      {expanded ? text : preview}
      {needsToggle ? (
        <>
          {" "}
          <button
            type="button"
            className="progress-week-description-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "less" : "more"}
          </button>
        </>
      ) : null}
    </p>
  );
}
