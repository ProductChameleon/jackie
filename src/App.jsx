import { useState } from "react";
import CohortTab from "./CohortTab.jsx";
import MyStuff from "./MyStuff.jsx";
import "./App.css";

export default function App() {
  const [topTab, setTopTab] = useState("myStuff");

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Jackie</h1>
        <p className="app-subtitle">
          Cursor Boston Summer Cohort 1: Mon, May 11 – Fri, Jun 19
        </p>
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
