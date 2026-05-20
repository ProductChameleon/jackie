import { useState } from "react";
import { getWeekLink, setWeekLink } from "./weekLinksStorage.js";

/**
 * @param {{ weekNumber: number, repoUrl: string | null, liveUrl: string | null, onSaved: () => void }} props
 */
export default function WeekWhatYoullNeed({
  weekNumber,
  repoUrl,
  liveUrl,
  onSaved,
}) {
  const [editingRepo, setEditingRepo] = useState(false);
  const [editingLive, setEditingLive] = useState(false);
  const [repoInput, setRepoInput] = useState("");
  const [liveInput, setLiveInput] = useState("");

  function saveRepo(e) {
    e.preventDefault();
    const url = repoInput.trim();
    if (!url) return;
    setWeekLink(weekNumber, "repo", url);
    setEditingRepo(false);
    setRepoInput("");
    onSaved();
  }

  function saveLive(e) {
    e.preventDefault();
    const url = liveInput.trim();
    if (!url) return;
    setWeekLink(weekNumber, "live", url);
    setEditingLive(false);
    setLiveInput("");
    onSaved();
  }

  return (
    <div className="progress-what-youll-need">
      <h4 className="progress-what-youll-need-title">What you&apos;ll need</h4>
      <div className="progress-what-youll-need-field">
        <span className="progress-what-youll-need-label">Repo URL</span>
        <span className="progress-what-youll-need-hint">
          Link to what you&apos;re building
        </span>
        {repoUrl && !editingRepo ? (
          <div className="progress-what-youll-need-saved">
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
              {repoUrl}
            </a>
            <button
              type="button"
              className="progress-what-youll-need-edit"
              onClick={() => {
                setRepoInput(repoUrl);
                setEditingRepo(true);
              }}
            >
              Edit
            </button>
          </div>
        ) : (
          <form className="progress-what-youll-need-form" onSubmit={saveRepo}>
            <input
              type="url"
              className="progress-what-youll-need-input"
              placeholder="https://github.com/..."
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
            />
            <button type="submit" className="btn-secondary progress-what-youll-need-save">
              Save
            </button>
            {repoUrl && editingRepo ? (
              <button
                type="button"
                className="btn-secondary progress-what-youll-need-cancel"
                onClick={() => {
                  setEditingRepo(false);
                  setRepoInput("");
                }}
              >
                Cancel
              </button>
            ) : null}
          </form>
        )}
      </div>
      <div className="progress-what-youll-need-field">
        <span className="progress-what-youll-need-label">Live/PR URL</span>
        <span className="progress-what-youll-need-hint">
          Link to your deliverable
        </span>
        {liveUrl && !editingLive ? (
          <div className="progress-what-youll-need-saved">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              {liveUrl}
            </a>
            <button
              type="button"
              className="progress-what-youll-need-edit"
              onClick={() => {
                setLiveInput(liveUrl);
                setEditingLive(true);
              }}
            >
              Edit
            </button>
          </div>
        ) : (
          <form className="progress-what-youll-need-form" onSubmit={saveLive}>
            <input
              type="url"
              className="progress-what-youll-need-input"
              placeholder="https://..."
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
            />
            <button type="submit" className="btn-secondary progress-what-youll-need-save">
              Save
            </button>
            {liveUrl && editingLive ? (
              <button
                type="button"
                className="btn-secondary progress-what-youll-need-cancel"
                onClick={() => {
                  setEditingLive(false);
                  setLiveInput("");
                }}
              >
                Cancel
              </button>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
