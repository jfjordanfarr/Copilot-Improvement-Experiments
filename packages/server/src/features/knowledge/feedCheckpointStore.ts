import { promises as fs } from "node:fs";
import path from "node:path";

import { StreamCheckpoint } from "@copilot-improvement/shared";

export interface FeedCheckpointStore {
  read(feedId: string): Promise<StreamCheckpoint | null>;
  write(feedId: string, checkpoint: StreamCheckpoint): Promise<void>;
  clear(feedId: string): Promise<void>;
}

export class FileFeedCheckpointStore implements FeedCheckpointStore {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async read(feedId: string): Promise<StreamCheckpoint | null> {
    const filePath = this.resolvePath(feedId);
    try {
      const contents = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(contents) as StreamCheckpoint;
      if (isValidCheckpoint(parsed)) {
        return parsed;
      }
      return null;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async write(feedId: string, checkpoint: StreamCheckpoint): Promise<void> {
    const filePath = this.resolvePath(feedId);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const payload = JSON.stringify(checkpoint, null, 2);
    await fs.writeFile(filePath, payload, "utf8");
  }

  async clear(feedId: string): Promise<void> {
    const filePath = this.resolvePath(feedId);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return;
      }
      throw error;
    }
  }

  private resolvePath(feedId: string): string {
    const safeName = feedId.replace(/[^a-z0-9-_]/gi, "_");
    return path.join(this.directory, `${safeName}.json`);
  }
}

function isValidCheckpoint(candidate: StreamCheckpoint | null | undefined): candidate is StreamCheckpoint {
  if (!candidate) {
    return false;
  }

  if (typeof candidate.lastSequenceId !== "string" || candidate.lastSequenceId.length === 0) {
    return false;
  }

  if (typeof candidate.updatedAt !== "string" || candidate.updatedAt.length === 0) {
    return false;
  }

  return true;
}
