const GITHUB_OWNER = "rogerSuperBuilderAlpha";
const GITHUB_REPO = "cursor-boston";

/** @type {Record<number, string>} */
export const WEEK_SUBMISSION_BRANCHES = {
  1: "c1w1pm-submission",
  2: "c1w2comms-submission",
  3: "c1w3mkt-submission",
};

/** @type {Record<number, string>} submission JSON directory on each week branch */
const WEEK_SUBMISSION_JSON_DIRS = {
  1: "content/summer-cohort/c1/w1-pm/submissions",
  2: "content/summer-cohort/c1/w2-comms/submissions",
  3: "content/summer-cohort/c1/w3-mkt/submissions",
};

const EXCLUDED_AUTHOR = "rogerSuperBuilderAlpha";
const TEST_TITLE_RE = /\b(placeholder|test|fixture)\b/i;
const URL_IN_TEXT = /https?:\/\/[^\s\n<>)"]+/gi;

/** @type {Map<string, string | null>} */
const displayNameCache = new Map();

/**
 * @type {Map<string, { pitch: string | null, repoUrl: string | null, liveUrl: string | null, loomUrl: string | null } | null>}
 */
const submissionJsonCache = new Map();

function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
  };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** @param {Record<string, unknown>} pr */
export function isExcludedPr(pr) {
  if (pr.user?.login === EXCLUDED_AUTHOR) return true;
  const title = String(pr.title ?? "");
  if (TEST_TITLE_RE.test(title)) return true;
  return false;
}

/**
 * @param {string} text
 * @returns {string}
 */
export function stripMarkdown(text) {
  if (!text?.trim()) return "";

  let out = text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\r\n/g, "\n");

  return out.replace(/\s+/g, " ").trim();
}

function cleanUrl(url) {
  return url.trim().replace(/[)>.,;]+$/, "");
}

function findUrlsInBody(body) {
  return [...body.matchAll(URL_IN_TEXT)].map((m) => cleanUrl(m[0]));
}

function pickLabeledUrl(body, label) {
  const re = new RegExp(
    `\\*\\*${label}:?\\*\\*\\s*(https?:\\/\\/[^\\s\\n<>)\\]]+)`,
    "i"
  );
  const m = body.match(re);
  return m?.[1] ? cleanUrl(m[1]) : null;
}

function isCursorBostonRepoUrl(url) {
  return /github\.com\/rogerSuperBuilderAlpha\/cursor-boston\b/i.test(url);
}

function isGitHubUrl(url) {
  return /github\.com/i.test(url) && !/api\.github\.com/i.test(url);
}

function isNonGitHubUrl(url) {
  return /^https?:\/\//i.test(url) && !isGitHubUrl(url);
}

function isMarkdownHeaderLine(line) {
  return /^#{1,6}\s/.test(line.trim());
}

function isLabeledFieldLine(line) {
  return /^\s*\*\*(Live|Repo|Loom|Pitch)\b/i.test(line.trim());
}

function lineIsOnlyUrl(line) {
  const stripped = stripMarkdown(line.trim());
  return /^https?:\/\/\S+$/i.test(stripped);
}

function isMetaInstructionLine(line) {
  const t = stripMarkdown(line).toLowerCase();
  return (
    /please\s+(include|fill|add|provide|complete|describe)/i.test(t) ||
    /fill\s+out/i.test(t) ||
    /do not edit/i.test(t) ||
    /submission\s+(template|checklist|form)/i.test(t) ||
    /^(repo|live|loom|pitch)\s*:/i.test(t)
  );
}

/** @param {string} line */
function parsePitchLabelLine(line) {
  const trimmed = line.trim();
  const m =
    trimmed.match(/^\*\*Pitch:\*\*\s*(.*)$/i) ||
    trimmed.match(/^\*\*Pitch\*\*\s*:?\s*(.*)$/i);
  return m ? m[1].trim() : null;
}

function splitSentences(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const parts = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return (parts ?? [normalized]).map((s) => s.trim()).filter(Boolean);
}

function sentenceIsPitchCandidate(sentence) {
  const text = stripMarkdown(sentence).replace(/\s+/g, " ").trim();
  if (!text) return false;
  if (/^https?:\/\/\S+$/i.test(text)) return false;
  const withoutUrls = text.replace(/https?:\/\/\S+/gi, "").trim();
  if (/^https?:\/\//i.test(text) || (withoutUrls.length < 12 && /https?:\/\//i.test(text))) {
    return false;
  }
  if (isMarkdownHeaderLine(sentence)) return false;
  if (isLabeledFieldLine(sentence)) return false;
  if (isMetaInstructionLine(sentence)) return false;
  return true;
}

/** @param {string} body */
export function parseRepoUrl(body) {
  const labeled = pickLabeledUrl(body, "Repo");
  if (labeled && !isCursorBostonRepoUrl(labeled)) return labeled;

  return (
    findUrlsInBody(body).find(
      (u) =>
        isGitHubUrl(u) &&
        !isCursorBostonRepoUrl(u) &&
        !/\/pull\//i.test(u)
    ) ?? null
  );
}

/** @param {string} body */
export function parseLiveUrl(body) {
  const labeled = pickLabeledUrl(body, "Live");
  if (labeled) return labeled;

  const urls = findUrlsInBody(body);
  const hosted = urls.find((u) =>
    /\.(vercel\.app|netlify\.app|vercel\.com|netlify\.com)(\/|$)/i.test(u)
  );
  if (hosted) return hosted;

  return (
    urls.find((u) => isNonGitHubUrl(u) && !/loom\.com/i.test(u)) ?? null
  );
}

/** @param {string} body */
export function parseLoomUrl(body) {
  const labeled = pickLabeledUrl(body, "Loom");
  if (labeled) return labeled;

  return findUrlsInBody(body).find((u) => /loom\.com/i.test(u)) ?? null;
}

/** @param {string} body @returns {string | null} */
export function parsePitch(body) {
  const lines = body.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const onLine = parsePitchLabelLine(lines[i]);
    if (onLine === null) continue;

    if (onLine) {
      const text = stripMarkdown(onLine).replace(/\s+/g, " ").trim();
      if (text) return text;
    }

    const continuation = [];
    for (let j = i + 1; j < lines.length; j += 1) {
      const next = lines[j].trim();
      if (!next) break;
      if (isMarkdownHeaderLine(next)) break;
      if (isLabeledFieldLine(next)) break;
      continuation.push(next);
    }
    if (continuation.length) {
      const text = stripMarkdown(continuation.join(" "))
        .replace(/\s+/g, " ")
        .trim();
      if (text) return text;
    }
  }

  const proseLines = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (isMarkdownHeaderLine(trimmed)) continue;
    if (isLabeledFieldLine(trimmed)) continue;
    if (lineIsOnlyUrl(trimmed)) continue;
    if (isMetaInstructionLine(trimmed)) continue;
    proseLines.push(stripMarkdown(trimmed));
  }

  for (const sentence of splitSentences(proseLines.join(" "))) {
    if (sentenceIsPitchCandidate(sentence)) {
      return sentence.replace(/\s+/g, " ").trim();
    }
  }

  return null;
}

/** @param {string} body */
function isCompetingForWin(body) {
  return !/not competing/i.test(body);
}

/** @param {unknown} value */
function stringOrNull(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

/** @param {unknown} data */
function parseSubmissionJsonFields(data) {
  if (!data || typeof data !== "object") return null;

  const repoUrl = stringOrNull(data.repoUrl);
  const liveUrl = stringOrNull(data.liveUrl);
  const loomUrl = stringOrNull(data.loomUrl);
  const pitch = stringOrNull(data.pitch);

  return {
    pitch,
    repoUrl: repoUrl ? cleanUrl(repoUrl) : null,
    liveUrl: liveUrl ? cleanUrl(liveUrl) : null,
    loomUrl: loomUrl ? cleanUrl(loomUrl) : null,
  };
}

/**
 * @param {number} week
 * @param {string} login GitHub handle
 * @returns {Promise<{ pitch: string | null, repoUrl: string | null, liveUrl: string | null, loomUrl: string | null } | null>}
 */
async function fetchSubmissionJson(week, login) {
  const dir = WEEK_SUBMISSION_JSON_DIRS[week];
  const branch = WEEK_SUBMISSION_BRANCHES[week];
  if (!dir || !branch || !login || login === "unknown") return null;

  const cacheKey = `${week}:${login}`;
  if (submissionJsonCache.has(cacheKey)) {
    return submissionJsonCache.get(cacheKey) ?? null;
  }

  const path = `${dir}/${login}.json`;
  const url = new URL(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`
  );
  url.searchParams.set("ref", branch);

  try {
    const res = await fetch(url, {
      headers: {
        ...githubHeaders(),
        Accept: "application/vnd.github.raw+json",
      },
    });

    if (!res.ok) {
      submissionJsonCache.set(cacheKey, null);
      return null;
    }

    const data = JSON.parse(await res.text());
    const fields = parseSubmissionJsonFields(data);
    submissionJsonCache.set(cacheKey, fields);
    return fields;
  } catch {
    submissionJsonCache.set(cacheKey, null);
    return null;
  }
}

/** @param {string} body */
function fieldsFromPrBody(body) {
  return {
    repoUrl: parseRepoUrl(body),
    liveUrl: parseLiveUrl(body),
    loomUrl: parseLoomUrl(body),
    pitch: parsePitch(body),
  };
}

/** @param {string} login */
async function fetchGitHubDisplayName(login) {
  if (!login || login === "unknown") return null;
  if (displayNameCache.has(login)) return displayNameCache.get(login) ?? null;

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers: githubHeaders(),
    });
    if (!res.ok) {
      displayNameCache.set(login, null);
      return null;
    }
    const data = await res.json();
    const name =
      typeof data.name === "string" && data.name.trim()
        ? data.name.trim()
        : null;
    displayNameCache.set(login, name);
    return name;
  } catch {
    displayNameCache.set(login, null);
    return null;
  }
}

/** @param {Array<ReturnType<typeof mapPullRequestToSubmission>>} submissions */
async function enrichWithDisplayNames(submissions) {
  const logins = [...new Set(submissions.map((s) => s.builderName))];
  await Promise.all(logins.map((login) => fetchGitHubDisplayName(login)));

  return submissions.map((s) => ({
    ...s,
    displayName: displayNameCache.get(s.builderName) ?? null,
  }));
}

/** @param {Record<string, unknown>} pr @param {number} week */
async function mapPullRequestToSubmission(pr, week) {
  const body = String(pr.body ?? "");
  const login = pr.user?.login ?? "unknown";
  const json = await fetchSubmissionJson(week, login);
  const { repoUrl, liveUrl, loomUrl, pitch } = json
    ? json
    : fieldsFromPrBody(body);

  return {
    id: `w${week}-pr-${pr.number}`,
    builderName: login,
    displayName: null,
    photo:
      pr.user?.avatar_url ??
      `https://avatars.githubusercontent.com/u/0?v=4`,
    repoUrl,
    liveUrl,
    loomUrl,
    pitch,
    week,
    submissionDate: String(pr.merged_at).slice(0, 10),
    competeForWin: isCompetingForWin(body),
  };
}

/**
 * @param {number} week 1–3
 */
export async function fetchWeekSubmissions(week) {
  const base = WEEK_SUBMISSION_BRANCHES[week];
  if (!base) return [];

  const merged = [];
  let page = 1;

  while (page <= 10) {
    const url = new URL(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`
    );
    url.searchParams.set("state", "closed");
    url.searchParams.set("base", base);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");

    const res = await fetch(url, { headers: githubHeaders() });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(
        `GitHub API error (${res.status}): ${detail.slice(0, 120)}`
      );
    }

    const prs = await res.json();
    if (!Array.isArray(prs) || prs.length === 0) break;

    const candidates = prs.filter(
      (pr) => pr.merged_at && !isExcludedPr(pr)
    );

    const pageSubmissions = await Promise.all(
      candidates.map((pr) => mapPullRequestToSubmission(pr, week))
    );
    merged.push(...pageSubmissions);

    if (prs.length < 100) break;
    page += 1;
  }

  return enrichWithDisplayNames(merged);
}
