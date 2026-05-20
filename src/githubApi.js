/**
 * Headers for every request to api.github.com.
 * @param {string} [accept]
 */
export function githubHeaders(accept = "application/vnd.github+json") {
  return {
    Accept: accept,
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  };
}

/**
 * @param {string | URL} url
 * @param {RequestInit} [init]
 */
export function githubFetch(url, init = {}) {
  const headers = new Headers(init.headers);
  const defaults = githubHeaders(headers.get("Accept") ?? undefined);

  if (!headers.has("Accept")) {
    headers.set("Accept", defaults.Accept);
  }
  headers.set("Authorization", defaults.Authorization);

  return fetch(url, { ...init, headers });
}
