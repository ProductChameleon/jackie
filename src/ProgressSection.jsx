import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCbSubmissionStatus } from "./cbSubmissionStatus.js";
import { getStoredGitHubHandle } from "./authStorage.js";
import { getRealWorkUrl, setRealWorkUrl } from "./realWorkStorage.js";
import { getWeekLink } from "./weekLinksStorage.js";
import { readWeekTasks } from "./weekTasksStorage.js";
import { WEEK_DELIVERABLES } from "./weekDeliverables.js";
import WeekCardDescription from "./WeekCardDescription.jsx";
import WeekCardTasks from "./WeekCardTasks.jsx";
import WeekWhatYoullNeed from "./WeekWhatYoullNeed.jsx";
import {
  WEEKS,
  formatShortDate,
  isWednesdayOrLaterInWindow,
  isWeekFuture,
  isWeekOpen,
  startOfDay,
} from "./weeksProgressConfig.js";

/** @typedef {"merged" | "open" | "none"} CbStatus */
/** @typedef {"done" | "on-track" | "at-risk" | "not-started"} OverallStatus */

/** @param {CbStatus | "loading" | undefined} cb */
function cbBadge(cb) {
  if (cb === "loading") {
    return <span className="progress-track-loading">Loading…</span>;
  }
  if (cb === "merged") {
    return <span className="badge badge-merged">Merged</span>;
  }
  if (cb === "open") {
    return <span className="badge badge-pr-open">PR Open</span>;
  }
  return <span className="badge badge-no-submission">No Submission</span>;
}

/** @param {OverallStatus} status */
function overallBadge(status) {
  const labels = {
    done: "Done",
    "on-track": "On Track",
    "at-risk": "At Risk",
    "not-started": "Not Started",
  };
  return (
    <span className={`badge badge-overall badge-overall-${status}`}>
      {labels[status]}
    </span>
  );
}

/**
 * @param {typeof WEEKS[0]} week
 * @param {CbStatus | undefined} cb
 * @param {boolean} realWorkLogged
 */
function computeOverallStatus(week, cb, realWorkLogged) {
  const today = startOfDay(new Date());
  if (isWeekFuture(week, today)) return null;

  const submission = cb ?? "none";
  const cbActive = submission === "merged" || submission === "open";

  if (week.type === "standard") {
    if (submission === "merged") return "done";
    if (isWednesdayOrLaterInWindow(week, today) && submission === "none") {
      return "at-risk";
    }
    if (submission === "open") return "on-track";
    if (isWeekOpen(week, today) && submission === "none") return "not-started";
    return "not-started";
  }

  if (submission === "merged" && realWorkLogged) return "done";
  if (isWednesdayOrLaterInWindow(week, today) && submission === "none") {
    return "at-risk";
  }
  if (cbActive || realWorkLogged) return "on-track";
  if (isWeekOpen(week, today)) return "not-started";
  return "not-started";
}

/**
 * @param {{
 *   week: typeof WEEKS[0];
 *   cbStatus: CbStatus | "loading" | undefined;
 *   realWorkUrl: string | null;
 *   repoLink: string | null;
 *   liveLink: string | null;
 *   tasks: import("./weekTasksStorage.js").WeekTask[];
 *   onRealWorkSaved: () => void;
 *   onLinksSaved: () => void;
 *   onTasksChanged: () => void;
 * }} props
 */
function WeekProgressCard({
  week,
  cbStatus,
  realWorkUrl,
  repoLink,
  liveLink,
  tasks,
  onRealWorkSaved,
  onLinksSaved,
  onTasksChanged,
}) {
  const today = startOfDay(new Date());
  const future = isWeekFuture(week, today);
  const [urlInput, setUrlInput] = useState("");
  const [editingRealWork, setEditingRealWork] = useState(false);

  const deliverable = WEEK_DELIVERABLES[week.number] ?? "";

  const overall = useMemo(
    () =>
      computeOverallStatus(
        week,
        cbStatus === "loading" ? undefined : cbStatus,
        Boolean(realWorkUrl)
      ),
    [week, cbStatus, realWorkUrl]
  );

  const showWednesdayWarning =
    !future &&
    cbStatus !== "loading" &&
    cbStatus === "none" &&
    isWednesdayOrLaterInWindow(week, today);

  const showRealWorkForm = !realWorkUrl || editingRealWork;

  function handleSaveRealWork(e) {
    e.preventDefault();
    const url = urlInput.trim();
    if (!url) return;
    setRealWorkUrl(week.number, url);
    setEditingRealWork(false);
    setUrlInput("");
    onRealWorkSaved();
  }

  function handleEditRealWork() {
    setUrlInput(realWorkUrl ?? "");
    setEditingRealWork(true);
  }

  return (
    <article
      className={`progress-week-card${future ? " progress-week-card-future" : ""}`}
    >
      <header className="progress-week-header">
        <div className="progress-week-header-main">
          <h3 className="progress-week-title">
            Week {week.number} · {week.label}
          </h3>
          {future ? (
            <p className="progress-week-opens">
              Opens {formatShortDate(week.opens)}
            </p>
          ) : overall ? (
            <div className="progress-week-overall">{overallBadge(overall)}</div>
          ) : null}
        </div>
        <span className="progress-week-deadline">
          Due {formatShortDate(week.deadline)}
        </span>
      </header>

      {deliverable ? <WeekCardDescription text={deliverable} /> : null}

      {week.number >= 4 ? (
        <WeekWhatYoullNeed
          weekNumber={week.number}
          repoUrl={repoLink}
          liveUrl={liveLink}
          onSaved={onLinksSaved}
        />
      ) : null}

      <div
        className={`progress-week-tracks${future ? " progress-week-tracks-future" : ""}`}
      >
        <div className="progress-track">
          <div className="progress-track-head">
            <span className="progress-track-name">Cursor Boston Repo</span>
            {future ? (
              <span className="badge badge-repo-opens">
                Opens {formatShortDate(week.opens)}
              </span>
            ) : (
              cbBadge(cbStatus)
            )}
          </div>
          {showWednesdayWarning ? (
            <p className="progress-track-warning" role="status">
              No submission yet — Friday deadline is approaching.
            </p>
          ) : null}
        </div>

        {!future && week.type === "extended" ? (
            <div className="progress-track">
              <div className="progress-track-head">
                <span className="progress-track-name">{week.realWorkLabel}</span>
                {realWorkUrl && !editingRealWork ? (
                  <span className="badge badge-no-submission">Logged</span>
                ) : (
                  <span className="badge badge-no-submission">Not Started</span>
                )}
              </div>
              <p className="progress-track-hint">{week.realWorkInstructions}</p>
              {showRealWorkForm ? (
                <form className="progress-realwork-form" onSubmit={handleSaveRealWork}>
                  <input
                    type="url"
                    className="progress-realwork-input"
                    placeholder="Paste URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <button type="submit" className="btn-primary progress-realwork-save">
                    Save
                  </button>
                  {realWorkUrl && editingRealWork ? (
                    <button
                      type="button"
                      className="btn-secondary progress-realwork-cancel"
                      onClick={() => {
                        setEditingRealWork(false);
                        setUrlInput("");
                      }}
                    >
                      Cancel
                    </button>
                  ) : null}
                </form>
              ) : (
                <div className="progress-realwork-saved">
                  <a
                    href={realWorkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="progress-realwork-link"
                  >
                    {realWorkUrl}
                  </a>
                  <button
                    type="button"
                    className="progress-realwork-edit"
                    onClick={handleEditRealWork}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ) : null}
      </div>

      <WeekCardTasks
        weekNumber={week.number}
        tasks={tasks}
        onChange={onTasksChanged}
      />
    </article>
  );
}

export default function ProgressSection() {
  const handle = getStoredGitHubHandle() ?? "";
  /** @type {Record<number, CbStatus | "loading">} */
  const [cbByWeek, setCbByWeek] = useState(() => {
    const initial = {};
    for (const w of WEEKS) {
      if (!isWeekFuture(w)) initial[w.number] = "loading";
    }
    return initial;
  });
  const [realWorkTick, setRealWorkTick] = useState(0);
  const [linksTick, setLinksTick] = useState(0);
  const [tasksTick, setTasksTick] = useState(0);

  const refreshRealWork = useCallback(() => {
    setRealWorkTick((n) => n + 1);
  }, []);

  const refreshLinks = useCallback(() => {
    setLinksTick((n) => n + 1);
  }, []);

  const refreshTasks = useCallback(() => {
    setTasksTick((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!handle) return;

    const openWeeks = WEEKS.filter((w) => !isWeekFuture(w));

    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        openWeeks.map(async (w) => {
          try {
            const status = await fetchCbSubmissionStatus(w.branch, handle);
            return [w.number, status];
          } catch {
            return [w.number, "none"];
          }
        })
      );

      if (cancelled) return;

      setCbByWeek((prev) => {
        const next = { ...prev };
        for (const [num, status] of entries) {
          next[num] = status;
        }
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [handle]);

  const realWorkUrls = useMemo(() => {
    void realWorkTick;
    const map = {};
    for (const w of WEEKS) {
      if (w.type === "extended") {
        map[w.number] = getRealWorkUrl(w.number);
      }
    }
    return map;
  }, [realWorkTick]);

  const weekLinks = useMemo(() => {
    void linksTick;
    const map = {};
    for (const w of WEEKS) {
      if (w.number >= 4) {
        map[w.number] = {
          repo: getWeekLink(w.number, "repo"),
          live: getWeekLink(w.number, "live"),
        };
      }
    }
    return map;
  }, [linksTick]);

  const tasksByWeek = useMemo(() => {
    void tasksTick;
    const map = {};
    for (const w of WEEKS) {
      map[w.number] = readWeekTasks(w.number);
    }
    return map;
  }, [tasksTick]);

  return (
    <section className="progress-section" aria-labelledby="progress-section-title">
      <h2 id="progress-section-title" className="progress-section-title">
        Progress
      </h2>
      <div className="progress-week-list">
        {WEEKS.map((week) => (
          <WeekProgressCard
            key={week.number}
            week={week}
            cbStatus={cbByWeek[week.number]}
            realWorkUrl={realWorkUrls[week.number] ?? null}
            repoLink={weekLinks[week.number]?.repo ?? null}
            liveLink={weekLinks[week.number]?.live ?? null}
            tasks={tasksByWeek[week.number] ?? []}
            onRealWorkSaved={refreshRealWork}
            onLinksSaved={refreshLinks}
            onTasksChanged={refreshTasks}
          />
        ))}
      </div>
    </section>
  );
}
