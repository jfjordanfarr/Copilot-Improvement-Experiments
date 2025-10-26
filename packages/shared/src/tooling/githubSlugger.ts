/**
 * GitHub-compatible slug generation.
 *
 * This implementation is adapted from the `github-slugger` package (ISC license).
 * We vendor the algorithm here so we can reference it in both runtime code and tests
 * without introducing a new ESM dependency. See https://github.com/Flet/github-slugger.
 */

import { GITHUB_SLUG_REMOVE_PATTERN } from "./githubSluggerRegex";

export interface SlugContext {
  slug: string;
  base: string;
  index: number;
}

export class GitHubSlugger {
  private occurrences: Record<string, number>;

  constructor() {
    this.occurrences = createOccurrences();
  }

  slug(value: string, maintainCase = false): string {
    return this.slugWithContext(value, maintainCase).slug;
  }

  slugWithContext(value: string, maintainCase = false): SlugContext {
    const original = slug(value, maintainCase);
    let result = original;

    while (hasOwn(this.occurrences, result)) {
      const next = (this.occurrences[original] ?? 0) + 1;
      this.occurrences[original] = next;
      result = `${original}-${next}`;
    }

    if (!hasOwn(this.occurrences, original)) {
      this.occurrences[original] = 0;
    }

    this.occurrences[result] = 0;

    const index = result === original ? 0 : this.occurrences[original];

    return { slug: result, base: original, index };
  }

  reset(): void {
    this.occurrences = createOccurrences();
  }
}

export function slug(value: string, maintainCase = false): string {
  if (typeof value !== "string") {
    return "";
  }

  const source = maintainCase ? value : value.toLowerCase();
  return source.replace(GITHUB_SLUG_REMOVE_PATTERN, "").replace(/ /g, "-");
}

export function createSlugger(): GitHubSlugger {
  return new GitHubSlugger();
}

function createOccurrences(): Record<string, number> {
  return Object.create(null) as Record<string, number>;
}

function hasOwn<T extends Record<string, unknown>>(object: T, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}
