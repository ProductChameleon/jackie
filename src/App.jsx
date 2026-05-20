import { useState } from "react";
import CohortTab from "./CohortTab.jsx";
import MyStuff from "./MyStuff.jsx";
import SignInPage from "./SignInPage.jsx";
import {
  clearStoredGitHubHandle,
  getStoredGitHubHandle,
  setStoredGitHubHandle,
} from "./authStorage.js";
import "./App.css";

export default function App() {
  const [githubHandle, setGithubHandle] = useState(() => getStoredGitHubHandle());
  const [topTab, setTopTab] = useState("myStuff");

  function handleAuthSuccess(handle) {
    setStoredGitHubHandle(handle);
    setGithubHandle(handle);
    setTopTab("myStuff");
  }

  function handleSignOut() {
    clearStoredGitHubHandle();
    setGithubHandle(null);
  }

  if (!githubHandle) {
    return <SignInPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-row">
          <div className="app-header-main">
            <h1 className="app-title">Jackie</h1>
            <p className="app-subtitle">
              Cursor Boston Summer Cohort 1: Mon, May 11 – Fri, Jun 19
            </p>
          </div>
          <div className="auth-session">
            <span className="auth-session-label">
              Signed in as @{githubHandle}
            </span>
            <button
              type="button"
              className="auth-session-signout"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="tabs app-main-tabs" aria-label="Primary">
          <button
            type="button"
            className={`tab ${topTab === "myStuff" ? "tab-active" : ""}`}
            onClick={() => setTopTab("myStuff")}
          >
            My Stuff
          </button>
          <button
            type="button"
            className={`tab ${topTab === "cohort" ? "tab-active" : ""}`}
            onClick={() => setTopTab("cohort")}
          >
            Cohort
          </button>
        </nav>
      </header>

      {topTab === "myStuff" ? <MyStuff /> : <CohortTab />}
    </div>
  );
}
