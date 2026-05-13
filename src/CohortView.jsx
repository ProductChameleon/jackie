import { useCallback, useState } from "react";

/** First token and last token for “First Last …” display names. */
function nameSortKeys(builderName) {
  const parts = builderName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return { first, last };
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
                    <h3 className="card-name">{s.builderName}</h3>
                    <p className="card-project">{s.projectName}</p>
                  </div>
                </div>
              </div>
              <p className="card-description">{s.description}</p>
              {s.competeForWin && s.pitch ? (
                <p className="card-compete-pitch">{s.pitch}</p>
              ) : null}
              <div className="card-links">
                <a href={s.loomUrl} target="_blank" rel="noopener noreferrer">
                  Loom
                </a>
                <a href={s.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live URL
                </a>
                <a href={s.repoUrl} target="_blank" rel="noopener noreferrer">
                  Repo
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
