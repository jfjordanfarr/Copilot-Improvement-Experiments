import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { GraphStore } from "./graphStore";

describe("GraphStore", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  function createStore(): GraphStore {
    const dir = mkdtempSync(path.join(tmpdir(), "graph-store-test-"));
    tempDirs.push(dir);
    const dbPath = path.join(dir, "graph.db");
    return new GraphStore({ dbPath });
  }

  it("reuses existing artifact ids when upserting by uri", () => {
    const store = createStore();
    const uri = "file:///tmp/doc.md";

    try {
      const first = store.upsertArtifact({
        id: randomUUID(),
        uri,
        layer: "requirements"
      });

      const second = store.upsertArtifact({
        id: randomUUID(),
        uri,
        layer: "requirements",
        language: "markdown"
      });

      expect(second.id).toBe(first.id);
      expect(second.language).toBe("markdown");
    } finally {
      store.close();
    }
  });
});
