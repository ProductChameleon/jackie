// SET TO true FOR LOCAL TESTING ONLY — flip to false before deploy
export const MOCK_MODE = false;

/** @type {Record<number, Array<{
 *   id: string;
 *   builderName: string;
 *   displayName: string;
 *   photo: string;
 *   repoUrl: string;
 *   liveUrl: string;
 *   loomUrl: string | null;
 *   pitch: string;
 *   week: number;
 *   submissionTimestamp: string;
 *   submissionDate: string;
 *   competeForWin: boolean;
 * }>>} */
const MOCK_BY_WEEK = {
  4: [
    {
      id: "w4-mock-1",
      builderName: "hult-edu-alpha",
      displayName: "Jordan Lee",
      photo: "https://avatars.githubusercontent.com/u/121152?v=4",
      repoUrl: "https://github.com/hult-edu-alpha/ludwitt-flashcards",
      liveUrl: "https://ludwitt-flashcards.vercel.app",
      loomUrl: "https://www.loom.com/share/mock-w4-alpha",
      pitch:
        "Spaced-repetition flashcards merged into Ludwitt with credit tracking hooks for every study session.",
      week: 4,
      submissionTimestamp: "2026-06-02T18:15:00Z",
      submissionDate: "2026-06-02T18:15:00Z",
      competeForWin: false,
    },
    {
      id: "w4-mock-2",
      builderName: "cohort-edu-beta",
      displayName: "Samira Okonkwo",
      photo: "https://avatars.githubusercontent.com/u/8396108?v=4",
      repoUrl: "https://github.com/cohort-edu-beta/reading-companion",
      liveUrl: "https://reading-companion.netlify.app",
      loomUrl: null,
      pitch:
        "Guided reading companion that surfaces comprehension checks and logs Ludwitt usage for instructors.",
      week: 4,
      submissionTimestamp: "2026-06-04T21:40:00Z",
      submissionDate: "2026-06-04T21:40:00Z",
      competeForWin: false,
    },
  ],
  5: [
    {
      id: "w5-mock-1",
      builderName: "startup-demo-ace",
      displayName: "Morgan Ellis",
      photo: "https://avatars.githubusercontent.com/u/251370?v=4",
      repoUrl: "https://github.com/startup-demo-ace/ship-log",
      liveUrl: "https://ship-log.app",
      loomUrl: "https://www.loom.com/share/mock-w5-demo",
      pitch:
        "Ship Log — a founder dashboard for weekly goals, deployed alpha with real signups ahead of Friday show-and-tell.",
      week: 5,
      submissionTimestamp: "2026-06-10T14:05:00Z",
      submissionDate: "2026-06-10T14:05:00Z",
      competeForWin: true,
    },
    {
      id: "w5-mock-2",
      builderName: "side-project-sam",
      displayName: "Chris Vaughn",
      photo: "https://avatars.githubusercontent.com/u/359430?v=4",
      repoUrl: "https://github.com/side-project-sam/week5-prototype",
      liveUrl: "https://week5-prototype.pages.dev",
      loomUrl: null,
      pitch:
        "Landing page prototype for a scheduling tool — shipping for demo day but not competing for the win.",
      week: 5,
      submissionTimestamp: "2026-06-11T19:30:00Z",
      submissionDate: "2026-06-11T19:30:00Z",
      competeForWin: false,
    },
  ],
  6: [
    {
      id: "w6-mock-1",
      builderName: "oss-contributor-1",
      displayName: "Riley Santos",
      photo: "https://avatars.githubusercontent.com/u/692303?v=4",
      repoUrl: "https://github.com/vercel/next.js",
      liveUrl: "https://github.com/vercel/next.js/pull/71234",
      loomUrl: null,
      pitch:
        "Docs fix merged upstream to Next.js — clarified App Router caching behavior with examples.",
      week: 6,
      submissionTimestamp: "2026-06-16T15:22:00Z",
      submissionDate: "2026-06-16T15:22:00Z",
      competeForWin: false,
    },
    {
      id: "w6-mock-2",
      builderName: "oss-contributor-2",
      displayName: "Taylor Brooks",
      photo: "https://avatars.githubusercontent.com/u/928625?v=4",
      repoUrl: "https://github.com/facebook/react",
      liveUrl: "https://github.com/facebook/react/pull/28901",
      loomUrl: "https://www.loom.com/share/mock-w6-react",
      pitch:
        "Small accessibility patch merged into React core — improved focus ring visibility in Strict Mode devtools.",
      week: 6,
      submissionTimestamp: "2026-06-18T22:08:00Z",
      submissionDate: "2026-06-18T22:08:00Z",
      competeForWin: false,
    },
  ],
};

/**
 * @param {number} week 4–6
 */
export function getMockWeekSubmissions(week) {
  const rows = MOCK_BY_WEEK[week];
  if (!rows) return [];
  return rows.map((s) => ({ ...s }));
}
