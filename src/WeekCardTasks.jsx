import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  addWeekTask,
  deleteWeekTask,
  readWeekTasks,
} from "./weekTasksStorage.js";
import { parseLocalDate, startOfDay } from "./weeksProgressConfig.js";

/** @param {string} iso */
function formatDueLabel(iso) {
  const date = parseLocalDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `Due ${date}`;
}

/** @param {string} dueIso */
function taskDueIndicator(dueIso) {
  const today = startOfDay(new Date());
  const due = startOfDay(parseLocalDate(dueIso));
  const diffMs = due - today;
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays < 0) {
    return (
      <span className="week-card-task-indicator week-card-task-overdue" title="Overdue">
        ●
      </span>
    );
  }
  if (diffDays <= 2) {
    return (
      <span
        className="week-card-task-indicator week-card-task-soon"
        title="Due within 2 days"
      >
        ●
      </span>
    );
  }
  return null;
}

/**
 * @param {{ weekNumber: number, tasks: import("./weekTasksStorage.js").WeekTask[], onChange: () => void }} props
 */
export default function WeekCardTasks({ weekNumber, tasks, onChange }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || !dueDate) return;
      addWeekTask(weekNumber, trimmed, dueDate);
      setText("");
      setDueDate("");
      setAdding(false);
      onChange();
    },
    [weekNumber, text, dueDate, onChange]
  );

  const handleDelete = useCallback(
    (id) => {
      deleteWeekTask(weekNumber, id);
      onChange();
    },
    [weekNumber, onChange]
  );

  return (
    <div className="week-card-tasks">
      {tasks.length > 0 ? (
        <ul className="week-card-task-list">
          {tasks.map((t) => (
            <li key={t.id} className="week-card-task-row">
              {taskDueIndicator(t.dueDate)}
              <span className="week-card-task-text">{t.text}</span>
              <span className="week-card-task-due">{formatDueLabel(t.dueDate)}</span>
              <button
                type="button"
                className="week-card-task-delete"
                onClick={() => handleDelete(t.id)}
                aria-label={`Delete task: ${t.text}`}
              >
                <Trash2 size={16} strokeWidth={2} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {adding ? (
        <form className="week-card-task-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="week-card-task-text-input"
            placeholder="Task"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <label className="week-card-task-date-field">
            <span className="week-card-task-date-label">Due Date</span>
            <span className="week-card-task-date-control">
              {dueDate ? (
                <span className="week-card-task-date-prefix" aria-hidden>
                  Due Date{" "}
                </span>
              ) : null}
              <input
                type="date"
                className={`week-card-task-date-input${dueDate ? " week-card-task-date-input--has-value" : ""}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                aria-label="Due Date"
              />
            </span>
          </label>
          <button type="submit" className="btn-primary week-card-task-add-btn">
            Add
          </button>
          <button
            type="button"
            className="btn-secondary week-card-task-cancel-btn"
            onClick={() => {
              setAdding(false);
              setText("");
              setDueDate("");
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="week-card-task-add-link"
          onClick={() => setAdding(true)}
        >
          Add task
        </button>
      )}
    </div>
  );
}
