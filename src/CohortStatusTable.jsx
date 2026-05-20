import { useMemo } from "react";
import { submissions } from "./data.js";
import { WEEK_DEADLINE_ISO } from "./myStuffConfig.js";

const W4_DEADLINE = WEEK_DEADLINE_ISO[3];

/** After sorting week-4 submissions, assign by index: 0–2 on time, 3 late, 4–5 in progress, 6–7 not started */
const W4_STATUS_BY_INDEX = [
  "complete_ontime",
  "complete_ontime",
  "complete_ontime",
  "complete_late",
  "in_progress",
  "in_progress",
  "not_started",
  "not_started",
];

const W5_ROWS = [
  { name: "Morgan Ellis", project: "Your App (working title)" },
  { name: "Jordan Patel", project: "TBD — concept phase" },
  { name: "Samira Okonkwo", project: "Startup idea — not yet named" },
  { name: "Chris Vaughn", project: "Week 5 build (planned)" },
  { name: "Riley Santos", project: "Demo app — scoping" },
  { name: "Alex Kim", project: "Product pitch draft" },
];

const W6_ROWS = [
  { name: "Jordan Patel", project: "OSS contribution — TBD repo" },
  { name: "Riley Santos", project: "First issue triage" },
  { name: "Taylor Brooks", project: "Docs PR (planned)" },
  { name: "Morgan Ellis", project: "Upstream merge goal" },
  { name: "Jamal Rivers", project: "OSS PR — not started" },
  { name: "Casey Nguyen", project: "Demo day deck outline" },
];

function sortWeek4(a, b) {
  return a.id.localeCompare(b.id, undefined, { numeric: true });
}

function buildWeek4Rows() {
  const w4 = submissions.filter((s) => s.week === 4).sort(sortWeek4);
  return w4.map((s, index) => ({
    id: s.id,
    photo: s.photo,
    builderName: s.builderName,
    projectName: s.projectName,
    status: W4_STATUS_BY_INDEX[index] ?? "not_started",
  }));
}

function statusCell(status) {
  if (status === "not_started") {
    return <span className="badge badge-no-submission">No Submission</span>;
  }
  if (status === "in_progress") {
    return <span className="badge badge-pr-open">PR Open</span>;
  }
  if (status === "complete_ontime") {
    return <span className="badge badge-merged">Merged</span>;
  }
  return <span className="badge badge-pr-open">PR Open</span>;
}

function submittedCell(status) {
  if (status === "complete_ontime") {
    return <span className="cohort-submitted-ok">On time</span>;
  }
  if (status === "complete_late") {
    return <span className="cohort-submitted-late">Late</span>;
  }
  return <span className="cohort-submitted-na">—</span>;
}

export default function CohortStatusTable({ week }) {
  const rows = useMemo(() => {
    if (week === 4) return buildWeek4Rows();
    if (week === 5) {
      return W5_ROWS.map((r, i) => ({
        id: `w5-${i}`,
        photo: `https://picsum.photos/seed/jackie-status-w5-${i}/200/200`,
        builderName: r.name,
        projectName: r.project,
        status: "not_started",
      }));
    }
    if (week === 6) {
      return W6_ROWS.map((r, i) => ({
        id: `w6-${i}`,
        photo: `https://picsum.photos/seed/jackie-status-w6-${i}/200/200`,
        builderName: r.name,
        projectName: r.project,
        status: "not_started",
      }));
    }
    return [];
  }, [week]);

  const caption =
    week === 4
      ? `Cohort status — Week 4 (deadline ${W4_DEADLINE})`
      : week === 5
        ? "Cohort status — Week 5"
        : "Cohort status — Week 6";

  return (
    <div className="cohort-status-wrap">
      <table className="cohort-status-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Project</th>
            <th scope="col">Status</th>
            <th scope="col">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="cohort-status-namecell">
                  <img
                    className="cohort-status-avatar"
                    src={r.photo}
                    alt=""
                    width={36}
                    height={36}
                  />
                  <span className="cohort-status-name">{r.builderName}</span>
                </div>
              </td>
              <td>
                <span className="cohort-status-project">{r.projectName}</span>
              </td>
              <td>{statusCell(r.status)}</td>
              <td>{submittedCell(r.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
