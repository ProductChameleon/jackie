function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FN = [
  "Marcus", "Priya", "Jordan", "Elena", "Sam", "Aisha", "Noah", "Riley",
  "Diego", "Mei", "Omar", "Hannah", "Viktor", "Amara", "Lucas", "Zoe",
  "Kenji", "Fatima", "Bridget", "Theo", "Nina", "Andre", "Sofia", "Malik",
];
const LN = [
  "Chen", "Sharma", "Okonkwo", "Vasquez", "Whitaker", "Mensah", "Bergstrom",
  "Nakamura", "Flores", "Lin", "Haddad", "Kerr", "Petrov", "Diallo", "Reyes",
  "Park", "Tanaka", "Hassan", "Marin", "Patel", "Ruiz", "Nguyen", "Brooks",
];

const W2_DATES = [
  "2026-05-18", "2026-05-19", "2026-05-18", "2026-05-20", "2026-05-21",
  "2026-05-19", "2026-05-20", "2026-05-21", "2026-05-22", "2026-05-18",
  "2026-05-22", "2026-05-20",
];

const W2_ROWS = [
  ["Relaycom", "Threaded announcements with per-channel quiet hours for global teams."],
  ["Statusline", "One link status pages that pull from Slack and Git without another login."],
  ["Townhall", "Live Q&A queues with upvotes so all-hands questions stay on-topic."],
  ["Bridgepost", "Cross-org comms templates so partner updates do not drift into email."],
  ["Signaldeck", "Incident comms timelines that sync to PagerDuty and customer updates."],
  ["Voiceprint", "Async voice memos transcribed into searchable decisions for remote PMs."],
  ["Commskit", "Stakeholder digest builder from threads, tickets, and calendar in one PDF."],
  ["Narrative", "Weekly narrative drafts from bullet notes so leads spend minutes not hours."],
  ["Pingtree", "Escalation trees with owner fallbacks when replies stall past SLA."],
  ["Roundtable", "Round-robin meeting notes with action owners pinned to each agenda item."],
  ["Clarify", "Ambiguity flags on specs that route to the right reviewer before build starts."],
  ["Openline", "Transparent roadmap comms with what shipped, what slipped, and why."],
];

const W2_WIN = [
  "Relaycom should win because distributed teams still lose nuance in Slack walls—we make announcements feel intentional without another heavyweight intranet.",
  "Statusline deserves the win: public-facing status is always stale until now because we auto-pull from where work already happens.",
  "Townhall should win—live Q&A chaos is why employees tune out; ranked queues keep leadership accountable to real questions.",
  "Bridgepost should win: partner comms die in forwarded threads; templates keep every org aligned on the same facts.",
  "Signaldeck should win—customers and engineers rarely see the same incident story; we stitch timelines so trust holds during outages.",
  "Voiceprint should win: async voice is faster than typing but unsearchable until we transcribe and pin decisions to tickets.",
  "Commskit should win because exec summaries should not take a PM half a day to assemble from five tools every Friday.",
  "Narrative should win—bullet notes hide the story; we turn fragments into a coherent weekly narrative on demand.",
];

const W3_DATES = [
  "2026-05-25", "2026-05-26", "2026-05-25", "2026-05-27", "2026-05-28",
  "2026-05-26", "2026-05-27", "2026-05-28", "2026-05-29", "2026-05-29",
];

const W3_ROWS = [
  ["Vibeboard", "Mood-based landing variants that A/B test tone without new copywriters."],
  ["Auraframe", "Brand vibe scores from social signals so campaigns match how fans feel."],
  ["Pulsewave", "Micro-surveys after content drops to measure emotional lift, not just clicks."],
  ["Glowpath", "Customer journey heatmaps weighted by sentiment from support and reviews."],
  ["Sparkline", "Launch-day vibe monitors that flag when messaging lands flat in real time."],
  ["Moodring", "Creative briefs translated into palette and voice constraints for designers."],
  ["Hypemeter", "Influencer match scores by audience vibe fit, not only follower counts."],
  ["Softsell", "Soft-touch nurture flows that back off when sentiment turns negative."],
  ["Colorstory", "Campaign narratives auto-tagged by emotional arc for retros and replays."],
  ["Echochamber", "Community listening that surfaces vibe shifts before churn shows up in NPS."],
];

const W3_WIN = [
  "Vibeboard should win—A/B testing layout is solved; testing emotional tone is the next frontier for conversion.",
  "Auraframe deserves the win because brand teams still guess at vibes from spreadsheets of mentions—we quantify feeling.",
  "Pulsewave should win: clicks lie after launches; emotional lift is the earlier signal PMs actually need.",
  "Glowpath should win—journeys are drawn as funnels, but sentiment-weighted paths show where trust breaks.",
  "Sparkline should win: launch day is noisy; we surface when the vibe goes wrong while there is still time to react.",
  "Moodring should win—briefs stay abstract until we turn vibe goals into concrete palette and voice rules.",
];

const W4_DATES = [
  "2026-06-02", "2026-06-03", "2026-06-02", "2026-06-04", "2026-06-03",
  "2026-06-04", "2026-06-05", "2026-06-05",
];

const W4_ROWS = [
  ["Lessonloop", "Spaced-repetition cards generated from any article for self-paced learners."],
  ["Proofwork", "Step-by-step proofs with hints that unlock only after a genuine attempt."],
  ["Conceptmap", "Interactive concept graphs students can fork and annotate for group study."],
  ["Quizforge", "Open-text quizzes auto-graded with rubrics teachers can tweak per cohort."],
  ["Studyorbit", "Study streaks that respect breaks so burnout-aware nudges replace guilt."],
  ["Tutorlink", "Office-hour matching that pairs struggling learners with available TAs fast."],
  ["Skilltree", "Skill trees for curricula so learners see prerequisites before they get stuck."],
  ["Readalong", "Side-by-side reading with vocabulary scaffolding for ESL-heavy classrooms."],
];

const W4_WIN = [
  "Lessonloop should win—spaced repetition works but content prep is brutal; we generate cards from real readings instantly.",
  "Proofwork deserves the win because math education tools either give answers or frustrate; hints after honest tries teach better.",
  "Conceptmap should win: static syllabi do not show dependencies; living graphs keep cohorts from skipping foundations.",
  "Quizforge should win—open responses are how humans think, but grading scale breaks without rubric-aware automation.",
  "Studyorbit should win: streak apps ignore mental health; we prove kind nudges beat guilt for completion.",
  "Tutorlink should win—office hours queues are unfair by default; fair matching fixes equity in cohort help.",
  "Skilltree should win—learners quit when prerequisites are invisible; we show the climb before the climb breaks them.",
  "Readalong should win—ESL students need scaffolding beside the text, not a separate workbook nobody opens.",
];

function row(week, id, i, projectName, description, submissionDate, competeForWin, pitch) {
  const slug = slugify(projectName);
  return {
    id,
    builderName: `${FN[i % FN.length]} ${LN[(i + week) % LN.length]}`,
    photo: `https://picsum.photos/seed/jackie-w${week}-${id}/200/200`,
    description,
    pitch: competeForWin ? pitch : null,
    projectName,
    loomUrl: `https://www.loom.com/share/placeholder-${slug}`,
    liveUrl: `https://${slug}-demo.example.com`,
    repoUrl: `https://github.com/cohort-demo/${slug}`,
    week,
    submissionDate,
    competeForWin,
  };
}

export function buildWeeks234Submissions() {
  const out = [];
  W2_ROWS.forEach(([projectName, description], i) => {
    const compete = i < 8;
    out.push(
      row(
        2,
        `w2-${i + 1}`,
        i + 20,
        projectName,
        description,
        W2_DATES[i],
        compete,
        compete ? W2_WIN[i] : null
      )
    );
  });
  W3_ROWS.forEach(([projectName, description], i) => {
    const compete = i < 6;
    out.push(
      row(
        3,
        `w3-${i + 1}`,
        i + 5,
        projectName,
        description,
        W3_DATES[i],
        compete,
        compete ? W3_WIN[i] : null
      )
    );
  });
  W4_ROWS.forEach(([projectName, description], i) => {
    out.push(
      row(
        4,
        `w4-${i + 1}`,
        i + 12,
        projectName,
        description,
        W4_DATES[i],
        true,
        W4_WIN[i]
      )
    );
  });
  return out;
}
