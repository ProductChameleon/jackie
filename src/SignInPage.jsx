import { useState } from "react";
import { normalizeGitHubHandle } from "./authStorage.js";
import { validateGitHubHandle } from "./githubAuth.js";

const AUTH_ERROR =
  "No submissions found. Submit a PR to the Cursor Boston repo first.";

/**
 * @param {{ onSuccess: (handle: string) => void }} props
 */
export default function SignInPage({ onSuccess }) {
  const [handleInput, setHandleInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const handle = normalizeGitHubHandle(handleInput);
    if (!handle) {
      setError("Enter your GitHub handle.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const valid = await validateGitHubHandle(handle);
      if (valid) {
        onSuccess(handle);
      } else {
        setError(AUTH_ERROR);
      }
    } catch {
      setError(
        "Could not verify your handle right now. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sign-in-page">
      <div className="sign-in-card">
        <h1 className="sign-in-wordmark">Jackie</h1>
        <p className="sign-in-subtext">Cursor Boston Summer Cohort</p>

        <form className="sign-in-form" onSubmit={handleSubmit}>
          <label className="sign-in-label" htmlFor="github-handle">
            GitHub handle
          </label>
          <input
            id="github-handle"
            className="sign-in-input"
            type="text"
            name="githubHandle"
            autoComplete="username"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="your-handle"
            value={handleInput}
            onChange={(e) => {
              setHandleInput(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          {error ? (
            <p className="sign-in-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="sign-in-submit" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
