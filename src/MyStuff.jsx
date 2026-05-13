import { useCallback, useMemo, useState } from "react";
import {
  WEEK_DEADLINE_ISO,
  WEEK_REMINDER_TITLES,
  WEEK_TRACK_LABELS,
  getRequiredTaskCount,
} from "./myStuffConfig.js";
import { readRequiredChecked } from "./weekTaskStorage.js";
import WeekTaskView from "./WeekTaskView.jsx";

function parseLocalDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function calendarDiffDays(fromStart, toStart) {
  return Math.round((toStart - fromStart) / 86400000);
}

function formatDueShort(iso) {
  return parseLocalDate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysAwayLabel(diff) {
  if (diff <= 0) return "Due today";
  if (diff === 1) return "1 day away";
  return `${diff} days away`;
}

function buildReminderEntries(today = new Date()) {
  const t0 = startOfDay(today);
  const entries = [];
  for (let w = 1; w <= 6; w++) {
    const iso = WEEK_DEADLINE_ISO[w - 1];
    const due = startOfDay(parseLocalDate(iso));
    const diff = calendarDiffDays(t0, due);
    if (diff < 0) {
      entries.push({
        week: w,
        iso,
        overdue: true,
        sort: diff,
      });
    } else if (diff <= 7) {
      entries.push({
        week: w,
        iso,
        overdue: false,
        daysAway: diff,
        sort: diff + 1000,
      });
    }
  }
  entries.sort((a, b) => a.sort - b.sort);
  return entries.slice(0, 2);
}

export default function MyStuff() {
  const [manageWeek, setManageWeek] = useState(null);
  const [progressTick, setProgressTick] = useState(0);

  const onTasksUpdated = useCallback(() => {
    setProgressTick((x) => x + 1);
  }, []);

  const reminderEntries = useMemo(() => buildReminderEntries(), []);

  const trackProgress = useMemo(() => {
    void progressTick;
    return [1, 2, 3, 4, 5, 6].map((week) => {
      const total = getRequiredTaskCount(week);
      const done = readRequiredChecked(week, total).filter(Boolean).length;
      return { week, total, done };
    });
  }, [progressTick]);

  const today = startOfDay(new Date());

  if (manageWeek != null) {
    return (
      <WeekTaskView
        key={manageWeek}
        week={manageWeek}
        onBack={() => setManageWeek(null)}
        onTasksUpdated={onTasksUpdated}
      />
    );
  }

  return (
    <div className="my-stuff">
      {reminderEntries.length > 0 ? (
        <div className="reminders-strip" role="status">
          {reminderEntries.map((e) => {
            const title = WEEK_REMINDER_TITLES[e.week - 1];
            const dueFmt = formatDueShort(e.iso);
            if (e.overdue) {
              return (
                <div key={e.week} className="reminders-line reminders-line-overdue">
                  Week {e.week}: {title} {dueFmt} · Overdue
                </div>
              );
            }
            return (
              <div key={e.week} className="reminders-line">
                Week {e.week}: {title} {dueFmt} · {daysAwayLabel(e.daysAway)}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="progress-tracks">
        {[1, 2, 3, 4, 5, 6].map((week) => {
          const { total, done } = trackProgress[week - 1];
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const iso = WEEK_DEADLINE_ISO[week - 1];
          const due = startOfDay(parseLocalDate(iso));
          const daysUntil = calendarDiffDays(today, due);
          const showAlarm =
            daysUntil >= 0 &&
            daysUntil <= 2 &&
            done < total;

          return (
            <div key={week} className="progress-track-row">
              <div className="progress-track-label">{WEEK_TRACK_LABELS[week - 1]}</div>
              <div className="progress-track-middle">
                <div className="progress-track-meta">
                  {done}/{total} tasks complete
                </div>
                <div className="progress-bar-track" aria-hidden>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              {showAlarm ? (
                <span className="progress-track-alarm" title="Deadline soon">
                  ⚠️
                </span>
              ) : (
                <span className="progress-track-alarm-spacer" aria-hidden />
              )}
              <button
                type="button"
                className="manage-work-btn"
                onClick={() => setManageWeek(week)}
              >
                Manage Work
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
