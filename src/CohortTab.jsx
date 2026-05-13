import { useCallback, useMemo, useState } from "react";
import CohortView from "./CohortView.jsx";
import CohortStatusTable from "./CohortStatusTable.jsx";
import { submissions } from "./data.js";

const WEEKS = [1, 2, 3, 4, 5, 6];

export default function CohortTab() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [cohortSubTab, setCohortSubTab] = useState("submissions");
  const [sortMode, setSortMode] = useState("date");
  const [submissionFilter, setSubmissionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const showVoteTab = activeWeek >= 1 && activeWeek <= 3;
  const showStatusTable = activeWeek >= 4 && activeWeek <= 6;

  const weekItems = useMemo(
    () => submissions.filter((s) => s.week === activeWeek),
    [activeWeek]
  );

  const competingCount = useMemo(
    () => weekItems.filter((s) => s.competeForWin).length,
    [weekItems]
  );

  const voteMode = showVoteTab && cohortSubTab === "vote";

  const displayItems = useMemo(() => {
    if (voteMode) {
      return weekItems.filter((s) => s.competeForWin);
    }
    if (submissionFilter === "competing") {
      return weekItems.filter((s) => s.competeForWin);
    }
    return weekItems;
  }, [weekItems, submissionFilter, voteMode]);

  const searchFilteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return displayItems;
    return displayItems.filter(
      (s) =>
        s.builderName.toLowerCase().includes(q) ||
        s.projectName.toLowerCase().includes(q)
    );
  }, [displayItems, searchQuery]);

  const onSelectAllSubmissions = useCallback(() => {
    setSubmissionFilter("all");
    setSortMode("date");
  }, []);

  const onSelectCompetingOnly = useCallback(() => {
    setSubmissionFilter("competing");
  }, []);

  const onWeekChange = useCallback((w) => {
    setActiveWeek(w);
    setSearchQuery("");
    setCohortSubTab("submissions");
    setSubmissionFilter("all");
  }, []);

  const onInnerTab = useCallback((tab) => {
    setCohortSubTab(tab);
    setSearchQuery("");
    if (tab === "submissions") {
      setSubmissionFilter("all");
      setSortMode("date");
    }
  }, []);

  return (
    <div className="cohort-tab">
      <nav className="tabs week-tabs" aria-label="Cohort week">
        {WEEKS.map((w) => (
          <button
            key={w}
            type="button"
            className={`tab ${activeWeek === w ? "tab-active" : ""}`}
            onClick={() => onWeekChange(w)}
          >
            Week {w}
          </button>
        ))}
      </nav>

      {showStatusTable ? (
        <CohortStatusTable week={activeWeek} />
      ) : (
        <>
          {showVoteTab ? (
            <nav className="cohort-inner-tabs" aria-label="Week view">
              <button
                type="button"
                className={`cohort-inner-tab ${
                  cohortSubTab === "submissions" ? "cohort-inner-tab-active" : ""
                }`}
                onClick={() => onInnerTab("submissions")}
              >
                Submissions
              </button>
              <button
                type="button"
                className={`cohort-inner-tab ${
                  cohortSubTab === "vote" ? "cohort-inner-tab-active" : ""
                }`}
                onClick={() => onInnerTab("vote")}
              >
                Vote
              </button>
            </nav>
          ) : null}

          {!voteMode ? (
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
                {weekItems.length} Total Submissions
              </button>
              <span className="cohort-filter-sep" aria-hidden>
                {" "}
                ·{" "}
              </span>
              <button
                type="button"
                className={`cohort-filter-text ${
                  submissionFilter === "competing"
                    ? "cohort-filter-text-active"
                    : "cohort-filter-text-inactive"
                }`}
                onClick={onSelectCompetingOnly}
              >
                {competingCount} Competing for the Win
              </button>
            </p>
          ) : null}

          <label className="cohort-search-label">
            <span className="visually-hidden">Search by name or project</span>
            <input
              type="search"
              className="cohort-search-input"
              placeholder="Search by name or project"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <CohortView
            items={searchFilteredItems}
            sortMode={sortMode}
            onSortMode={setSortMode}
          />
        </>
      )}
    </div>
  );
}
