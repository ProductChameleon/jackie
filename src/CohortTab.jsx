import { useCallback, useEffect, useMemo, useState } from "react";
import CohortView from "./CohortView.jsx";
import { fetchWeekSubmissions } from "./githubSubmissions.js";

const WEEKS = [1, 2, 3, 4, 5, 6];

/** @param {number} week @returns {"competing" | "demoing" | null} */
function weekFlagFilter(week) {
  if (week >= 1 && week <= 3) return "competing";
  if (week === 5) return "demoing";
  return null;
}

/** @param {number} week @param {"competing" | "demoing"} filter */
function weekFlagFilterLabel(week, filter) {
  if (filter === "demoing") return "Demoing";
  return "Competing for the Win";
}

export default function CohortTab() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [sortMode, setSortMode] = useState("newest");
  const [submissionFilter, setSubmissionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [githubByWeek, setGithubByWeek] = useState({});
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState(null);

  useEffect(() => {
    if (githubByWeek[activeWeek] !== undefined) return;

    let cancelled = false;
    setGithubLoading(true);
    setGithubError(null);

    fetchWeekSubmissions(activeWeek)
      .then((items) => {
        if (cancelled) return;
        setGithubByWeek((prev) => ({ ...prev, [activeWeek]: items }));
        setGithubLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setGithubError(err.message ?? "Failed to load submissions");
        setGithubByWeek((prev) => ({ ...prev, [activeWeek]: [] }));
        setGithubLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeWeek]);

  const weekItems = useMemo(
    () => githubByWeek[activeWeek] ?? [],
    [activeWeek, githubByWeek]
  );

  const flagFilter = weekFlagFilter(activeWeek);

  const flaggedCount = useMemo(
    () => weekItems.filter((s) => s.competeForWin).length,
    [weekItems]
  );

  const displayItems = useMemo(() => {
    if (flagFilter && submissionFilter === flagFilter) {
      return weekItems.filter((s) => s.competeForWin);
    }
    return weekItems;
  }, [weekItems, submissionFilter, flagFilter]);

  const searchFilteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return displayItems;
    return displayItems.filter((s) =>
      s.builderName.toLowerCase().includes(q)
    );
  }, [displayItems, searchQuery]);

  const onSelectAllSubmissions = useCallback(() => {
    setSubmissionFilter("all");
    setSortMode("newest");
  }, []);

  const onSelectFlaggedOnly = useCallback(() => {
    const filter = weekFlagFilter(activeWeek);
    if (filter) setSubmissionFilter(filter);
  }, [activeWeek]);

  const onWeekChange = useCallback((w) => {
    setActiveWeek(w);
    setSearchQuery("");
    setSubmissionFilter("all");
  }, []);

  return (
    <div className="cohort-tab">
      <nav className="week-tabs" aria-label="Cohort week">
        {WEEKS.map((w) => (
          <button
            key={w}
            type="button"
            className={`week-tab ${activeWeek === w ? "week-tab-selected" : ""}`}
            onClick={() => onWeekChange(w)}
          >
            Week {w}
          </button>
        ))}
      </nav>

      <p className="cohort-filters" aria-label="Submission filters">
        <button
          type="button"
          className={`cohort-filter-text ${
            submissionFilter === "all"
              ? "cohort-filter-text-active"
              : "cohort-filter-text-inactive"
          }`}
          onClick={onSelectAllSubmissions}
        >
          {githubLoading && githubByWeek[activeWeek] === undefined
            ? "…"
            : weekItems.length}{" "}
          Total Submissions
        </button>
        {flagFilter ? (
          <>
            <span className="cohort-filter-sep" aria-hidden>
              {" "}
              ·{" "}
            </span>
            <button
              type="button"
              className={`cohort-filter-text ${
                submissionFilter === flagFilter
                  ? "cohort-filter-text-active"
                  : "cohort-filter-text-inactive"
              }`}
              onClick={onSelectFlaggedOnly}
            >
              {flaggedCount} {weekFlagFilterLabel(activeWeek, flagFilter)}
            </button>
          </>
        ) : null}
      </p>

      <label className="cohort-search-label">
        <span className="visually-hidden">Search by GitHub handle</span>
        <input
          type="search"
          className="cohort-search-input"
          placeholder="Search by GitHub handle"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      {githubError ? (
        <div className="cohort-week-empty week-empty" role="alert">
          <p>Could not load submissions: {githubError}</p>
        </div>
      ) : githubLoading && githubByWeek[activeWeek] === undefined ? (
        <div className="cohort-week-empty week-empty" aria-busy="true">
          <p>Loading submissions…</p>
        </div>
      ) : searchFilteredItems.length === 0 ? (
        <div className="cohort-week-empty week-empty">
          <p>No submissions yet for week {activeWeek}.</p>
        </div>
      ) : (
        <CohortView
          items={searchFilteredItems}
          week={activeWeek}
          sortMode={sortMode}
          onSortMode={setSortMode}
        />
      )}
    </div>
  );
}
