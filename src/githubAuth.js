import { githubFetch } from "./githubApi.js";

const GITHUB_OWNER = "rogerSuperBuilderAlpha";
const GITHUB_REPO = "cursor-boston";

export const AUTH_SUBMISSION_BRANCHES = [
  "c1w1pm-submission",
  "c1w2comms-submission",
  "c1w3mkt-submission",
  "c1w4edu-submission",
  "c1w5startup-submission",
  "c1w6oss-submission",
];

/**
 * @param {string} base
 * @param {string} loginLower
 */
async function branchHasPrFromUser(base, loginLower) {
  let page = 1;

  while (page <= 10) {
    const url = new URL(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`
    );
    url.searchParams.set("state", "all");
    url.searchParams.set("base", base);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const res = await githubFetch(url);
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(
        `GitHub API error (${res.status}): ${detail.slice(0, 120)}`
      );
    }

    const prs = await res.json();
    if (!Array.isArray(prs) || prs.length === 0) return false;

    if (
      prs.some(
        (pr) => String(pr.user?.login ?? "").toLowerCase() === loginLower
      )
    ) {
      return true;
    }

    if (prs.length < 100) return false;
    page += 1;
  }

  return false;
}

/**
 * @param {string} handle
 * @returns {Promise<boolean>}
 */
export async function validateGitHubHandle(handle) {
  const trimmed = handle.trim().replace(/^@/, "");
  if (!trimmed) return false;

  const loginLower = trimmed.toLowerCase();
  const checks = await Promise.all(
    AUTH_SUBMISSION_BRANCHES.map((base) =>
      branchHasPrFromUser(base, loginLower)
    )
  );

  return checks.some(Boolean);
}
