import { useCallback, useState } from "react";

const submittedDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

/** @param {string} isoDate `YYYY-MM-DD` from cohort data */
function formatSubmittedCaption(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate));
  if (!m) return `Submitted ${isoDate}`;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const date = new Date(y, mo, d);
  return `Submitted ${submittedDateFormatter.format(date)}`;
}

/** First token and last token for “First Last …” display names. */
function nameSortKeys(builderName) {
  const parts = builderName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return { first, last };
}

const PITCH_PREVIEW_LEN = 100;

function RepoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12a9.99 9.99 0 0 0 6.86 9.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.87v2.77c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 20 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 10l4.55-2.73A1 1 0 0 1 21 8.18v7.64a1 1 0 0 1-1.45.91L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LINK_ICONS = {
  Repo: RepoIcon,
  Live: ExternalLinkIcon,
  Loom: VideoIcon,
};

function LinkChip({ label, url }) {
  const Icon = LINK_ICONS[label] ?? ExternalLinkIcon;
  const content = (
    <>
      <Icon />
      <span>{label}</span>
    </>
  );

  if (url) {
    return (
      <a
        href={url}
        className="card-link-chip card-link-chip-active"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <span className="card-link-chip card-link-chip-muted" aria-disabled="true">
      {content}
    </span>
  );
}

function CardPitch({ text }) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = text?.trim() ?? "";

  const needsToggle = trimmed.length > PITCH_PREVIEW_LEN;
  let preview = trimmed;
  if (needsToggle) {
    preview = trimmed.slice(0, PITCH_PREVIEW_LEN).trimEnd();
    const lastSpace = preview.lastIndexOf(" ");
    if (lastSpace > PITCH_PREVIEW_LEN - 30) {
      preview = preview.slice(0, lastSpace);
    }
    preview = `${preview}…`;
  }

  return (
    <div className="card-pitch-row">
      <span className="card-field-label">Pitch:</span>
      <p className={`card-pitch${trimmed ? "" : " card-pitch-empty"}`}>
        {trimmed ? (
          <>
            {expanded ? trimmed : preview}
            {needsToggle ? (
              <>
                {" "}
                <button
                  type="button"
                  className="card-pitch-toggle"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                >
                  {expanded ? "less" : "more"}
                </button>
              </>
            ) : null}
          </>
        ) : (
          "N/A"
        )}
      </p>
    </div>
  );
}

function TrophyIcon({ flagged }) {
  return (
    <svg
      className={flagged ? "card-award-svg card-award-svg-on" : "card-award-svg card-award-svg-off"}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden
    >
      {flagged ? (
        <path
          fill="currentColor"
          d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.63 1.98 2.91 3.61 3.46V19H7v2h10v-2h-4v-2.1c1.63-.55 2.98-1.83 3.61-3.46C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
        />
      ) : (
        <>
          <path
            d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 4H5a1.5 1.5 0 0 0 0 3h2M17 4h2a1.5 1.5 0 0 1 0 3h-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

export default function CohortView({ items, sortMode, onSortMode }) {
  const [awardFlags, setAwardFlags] = useState({});

  const orderIndex = Object.fromEntries(items.map((s, i) => [s.id, i]));

  const sorted = [...items].sort((a, b) => {
    const tieBreak = () => orderIndex[a.id] - orderIndex[b.id];
    if (sortMode === "newest" || sortMode === "oldest") {
      const da = new Date(a.submissionDate).getTime();
      const db = new Date(b.submissionDate).getTime();
      if (da !== db) return sortMode === "newest" ? db - da : da - db;
      return tieBreak();
    }
    const ka = nameSortKeys(a.builderName);
    const kb = nameSortKeys(b.builderName);
    const keyA = sortMode === "firstName" ? ka.first : ka.last;
    const keyB = sortMode === "firstName" ? kb.first : kb.last;
    const cmp = keyA.localeCompare(keyB, undefined, { sensitivity: "base" });
    if (cmp !== 0) return cmp;
    const full = a.builderName.localeCompare(b.builderName, undefined, {
      sensitivity: "base",
    });
    if (full !== 0) return full;
    return tieBreak();
  });

  const toggleAward = useCallback((id) => {
    setAwardFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className="view">
      <div className="cohort-toolbar">
        <label className="cohort-toolbar-label" htmlFor="cohort-sort-select">
          Sort
        </label>
        <select
          id="cohort-sort-select"
          className="cohort-sort-select"
          value={sortMode}
          onChange={(e) => onSortMode(e.target.value)}
          aria-label="Sort submissions"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="firstName">First name A-Z</option>
          <option value="lastName">Last name A-Z</option>
        </select>
      </div>

      <div className="card-grid">
        {sorted.map((s) => {
          const flagged = Boolean(awardFlags[s.id]);
          return (
            <article key={s.id} className="card">
              {s.competeForWin ? (
                <button
                  type="button"
                  className="card-award-btn"
                  onClick={() => toggleAward(s.id)}
                  aria-pressed={flagged}
                  aria-label={
                    flagged ? "Clear award highlight" : "Flag with award"
                  }
                >
                  <TrophyIcon flagged={flagged} />
                </button>
              ) : null}
              <div className="card-top">
                <div className="card-identity">
                  <img
                    className="card-avatar"
                    src={s.photo}
                    alt=""
                    width={48}
                    height={48}
                  />
                  <div>
                    <h3 className="card-name">@{s.builderName}</h3>
                    {s.displayName ? (
                      <p className="card-display-name">{s.displayName}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="card-link-row">
                <LinkChip label="Repo" url={s.repoUrl} />
                <LinkChip label="Live" url={s.liveUrl} />
                <LinkChip label="Loom" url={s.loomUrl} />
              </div>
              <CardPitch text={s.pitch} />
              <p className="card-submitted">{formatSubmittedCaption(s.submissionDate)}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
