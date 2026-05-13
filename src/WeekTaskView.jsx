import { useCallback, useState } from "react";
import { REQUIRED_TASKS_BY_WEEK } from "./myStuffConfig.js";
import {
  readCustomTasks,
  readRequiredChecked,
  setAllRequiredChecked,
  writeCustomTasks,
  writeRequiredChecked,
} from "./weekTaskStorage.js";

export default function WeekTaskView({ week, onBack, onTasksUpdated }) {
  const requiredLabels = REQUIRED_TASKS_BY_WEEK[week - 1] ?? [];
  const taskCount = requiredLabels.length;

  const [requiredDone, setRequiredDone] = useState(() =>
    readRequiredChecked(week, taskCount)
  );
  const [customTasks, setCustomTasks] = useState(() => readCustomTasks(week));
  const [customInput, setCustomInput] = useState("");

  const bump = useCallback(() => {
    onTasksUpdated?.();
  }, [onTasksUpdated]);

  const setRequiredAt = useCallback(
    (index, checked) => {
      writeRequiredChecked(week, index, checked);
      setRequiredDone((prev) => {
        const next = [...prev];
        next[index] = checked;
        return next;
      });
      bump();
    },
    [week, bump]
  );

  const onCheckAll = useCallback(() => {
    setAllRequiredChecked(week, taskCount, true);
    setRequiredDone(Array(taskCount).fill(true));
    bump();
  }, [week, taskCount, bump]);

  const onToggleCustom = useCallback(
    (index) => {
      const next = customTasks.map((t, i) =>
        i === index ? { ...t, done: !t.done } : t
      );
      writeCustomTasks(
        week,
        next.map(({ label, done }) => ({ label, done }))
      );
      setCustomTasks(readCustomTasks(week));
      bump();
    },
    [week, customTasks, bump]
  );

  const onAddCustom = useCallback(() => {
    const label = customInput.trim();
    if (!label) return;
    const next = [
      ...customTasks.map(({ label: l, done }) => ({ label: l, done })),
      { label, done: false },
    ];
    writeCustomTasks(week, next);
    setCustomTasks(readCustomTasks(week));
    setCustomInput("");
    bump();
  }, [week, customInput, customTasks, bump]);

  const onDeleteCustom = useCallback(
    (index) => {
      const next = customTasks
        .filter((_, i) => i !== index)
        .map(({ label, done }) => ({ label, done }));
      writeCustomTasks(week, next);
      setCustomTasks(readCustomTasks(week));
      bump();
    },
    [week, customTasks, bump]
  );

  return (
    <div className="week-task-view">
      <div className="week-task-view-header">
        <button type="button" className="week-task-back" onClick={onBack}>
          ← Back
        </button>
        <h2 className="week-task-view-title">Week {week}</h2>
      </div>

      <section className="week-task-section">
        <div className="week-task-section-head">
          <h3 className="week-task-section-label">Required Tasks</h3>
          <button type="button" className="week-task-checkall" onClick={onCheckAll}>
            Check All
          </button>
        </div>
        <ul className="week-task-list">
          {requiredLabels.map((label, index) => (
            <li key={`req-${week}-${index}`} className="week-task-row">
              <label className="week-task-check-label">
                <input
                  type="checkbox"
                  checked={Boolean(requiredDone[index])}
                  onChange={(e) => setRequiredAt(index, e.target.checked)}
                />
                <span>{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <hr className="week-task-sep" />

      <section className="week-task-section">
        <h3 className="week-task-section-label">My Tasks</h3>
        <div className="week-task-add-row">
          <input
            type="text"
            className="week-task-add-input"
            placeholder="Add a task"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddCustom();
            }}
          />
          <button type="button" className="week-task-add-btn" onClick={onAddCustom}>
            Add
          </button>
        </div>
        <ul className="week-task-list">
          {customTasks.map((t, index) => (
            <li key={t.id} className="week-task-row week-task-row-custom">
              <label className="week-task-check-label">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => onToggleCustom(index)}
                />
                <span>{t.label}</span>
              </label>
              <button
                type="button"
                className="week-task-delete"
                onClick={() => onDeleteCustom(index)}
                aria-label="Delete task"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
