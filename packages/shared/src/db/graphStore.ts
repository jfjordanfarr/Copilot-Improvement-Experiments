import Database from "better-sqlite3";

import {
  AcknowledgementAction,
  ChangeEvent,
  DiagnosticRecord,
  DiagnosticStatus,
  DriftHistoryEntry,
  DriftHistoryStatus,
  KnowledgeArtifact,
  KnowledgeSnapshot,
  LinkRelationship,
  LinkRelationshipKind
} from "../domain/artifacts";

export interface GraphStoreOptions {
  /** Absolute path to the SQLite database file. */
  dbPath: string;
}

export interface LinkedArtifactSummary {
  artifact: KnowledgeArtifact;
  linkId: string;
  kind: LinkRelationshipKind;
  direction: "incoming" | "outgoing";
}

const JSON_SPACES = 0;

/**
 * Thin wrapper around better-sqlite3 that materialises our knowledge-graph projections. The
 * implementation deliberately keeps schema bootstrapping local so the store can be rebuilt after
 * cache deletion without bespoke tooling.
 */
export class GraphStore {
  private readonly db: Database.Database;

  constructor(private readonly options: GraphStoreOptions) {
    this.db = new Database(options.dbPath);
    this.configure();
    this.ensureSchema();
  }

  close(): void {
    this.db.close();
  }

  upsertArtifact(artifact: KnowledgeArtifact): void {
    const statement = this.db.prepare(`
      INSERT INTO artifacts (id, uri, layer, language, owner, last_synchronized_at, hash, metadata)
      VALUES (@id, @uri, @layer, @language, @owner, @lastSynchronizedAt, @hash, @metadata)
      ON CONFLICT(id) DO UPDATE SET
        uri = excluded.uri,
        layer = excluded.layer,
        language = excluded.language,
        owner = excluded.owner,
        last_synchronized_at = excluded.last_synchronized_at,
        hash = excluded.hash,
        metadata = excluded.metadata;
    `);

    statement.run({
      ...artifact,
      metadata: artifact.metadata ? JSON.stringify(artifact.metadata, null, JSON_SPACES) : null,
      lastSynchronizedAt: artifact.lastSynchronizedAt ?? null
    });
  }

  removeArtifact(id: string): void {
    this.db.prepare("DELETE FROM artifacts WHERE id = ?").run(id);
  }

  removeArtifactByUri(uri: string): void {
    this.db.prepare("DELETE FROM artifacts WHERE uri = ?").run(uri);
  }

  getArtifactById(id: string): KnowledgeArtifact | undefined {
    const row = this.db
      .prepare(
        `SELECT id, uri, layer, language, owner, last_synchronized_at, hash, metadata FROM artifacts WHERE id = ?`
      )
      .get(id);

    if (!row) {
      return undefined;
    }

    return this.mapArtifactRow(row as ArtifactRow);
  }

  getArtifactByUri(uri: string): KnowledgeArtifact | undefined {
    const row = this.db
      .prepare(
        `SELECT id, uri, layer, language, owner, last_synchronized_at, hash, metadata FROM artifacts WHERE uri = ?`
      )
      .get(uri);

    if (!row) {
      return undefined;
    }

    return this.mapArtifactRow(row as ArtifactRow);
  }

  listArtifacts(): KnowledgeArtifact[] {
    const rows = this.db
      .prepare(
        `SELECT id, uri, layer, language, owner, last_synchronized_at, hash, metadata FROM artifacts`
      )
      .all() as ArtifactRow[];

    return rows.map(row => this.mapArtifactRow(row));
  }

  listLinkedArtifacts(artifactId: string): LinkedArtifactSummary[] {
    const rows = this.db
      .prepare(
        `
        SELECT
          l.id AS link_id,
          l.kind AS link_kind,
          l.source_id AS source_id,
          l.target_id AS target_id,
          a.id AS artifact_id,
          a.uri AS artifact_uri,
          a.layer AS artifact_layer,
          a.language AS artifact_language,
          a.owner AS artifact_owner,
          a.last_synchronized_at AS artifact_last_synchronized_at,
          a.hash AS artifact_hash,
          a.metadata AS artifact_metadata
        FROM links l
        JOIN artifacts a ON a.id = CASE WHEN l.source_id = @artifactId THEN l.target_id ELSE l.source_id END
        WHERE l.source_id = @artifactId OR l.target_id = @artifactId
      `
      )
      .all({ artifactId }) as LinkedArtifactRow[];

    return rows.map(row => {
      const direction = row.source_id === artifactId ? "outgoing" : "incoming";

      const artifactRow: ArtifactRow = {
        id: row.artifact_id,
        uri: row.artifact_uri,
        layer: row.artifact_layer,
        language: row.artifact_language,
        owner: row.artifact_owner,
        last_synchronized_at: row.artifact_last_synchronized_at,
        hash: row.artifact_hash,
        metadata: row.artifact_metadata
      };

      return {
        linkId: row.link_id,
        kind: row.link_kind,
        direction,
        artifact: this.mapArtifactRow(artifactRow)
      };
    });
  }

  upsertLink(link: LinkRelationship): void {
    const statement = this.db.prepare(`
      INSERT INTO links (id, source_id, target_id, kind, confidence, created_at, created_by)
      VALUES (@id, @sourceId, @targetId, @kind, @confidence, @createdAt, @createdBy)
      ON CONFLICT(id) DO UPDATE SET
        source_id = excluded.source_id,
        target_id = excluded.target_id,
        kind = excluded.kind,
        confidence = excluded.confidence,
        created_at = excluded.created_at,
        created_by = excluded.created_by;
    `);

    statement.run({
      ...link,
      confidence: Math.max(0, Math.min(1, link.confidence))
    });
  }

  removeLink(id: string): void {
    this.db.prepare("DELETE FROM links WHERE id = ?").run(id);
  }

  recordChangeEvent(change: ChangeEvent): void {
    const statement = this.db.prepare(`
      INSERT INTO change_events (id, artifact_id, detected_at, summary, change_type, ranges, provenance)
      VALUES (@id, @artifactId, @detectedAt, @summary, @changeType, @ranges, @provenance)
      ON CONFLICT(id) DO UPDATE SET
        artifact_id = excluded.artifact_id,
        detected_at = excluded.detected_at,
        summary = excluded.summary,
        change_type = excluded.change_type,
        ranges = excluded.ranges,
        provenance = excluded.provenance;
    `);

    statement.run({
      ...change,
      ranges: JSON.stringify(change.ranges, null, JSON_SPACES)
    });
  }

  storeDiagnostic(diagnostic: DiagnosticRecord): void {
    const statement = this.db.prepare(`
      INSERT INTO diagnostics (
        id,
        artifact_id,
        trigger_artifact_id,
        change_event_id,
        message,
        severity,
        status,
        created_at,
        acknowledged_at,
        acknowledged_by,
        link_ids,
        llm_assessment
      ) VALUES (
        @id,
        @artifactId,
        @triggerArtifactId,
        @changeEventId,
        @message,
        @severity,
        @status,
        @createdAt,
        @acknowledgedAt,
        @acknowledgedBy,
        @linkIds,
        @llmAssessment
      )
      ON CONFLICT(id) DO UPDATE SET
        artifact_id = excluded.artifact_id,
        trigger_artifact_id = excluded.trigger_artifact_id,
        change_event_id = excluded.change_event_id,
        message = excluded.message,
        severity = excluded.severity,
        status = excluded.status,
        created_at = excluded.created_at,
        acknowledged_at = excluded.acknowledged_at,
        acknowledged_by = excluded.acknowledged_by,
        link_ids = excluded.link_ids,
        llm_assessment = excluded.llm_assessment;
    `);

    statement.run({
      ...diagnostic,
      acknowledgedAt: diagnostic.acknowledgedAt ?? null,
      acknowledgedBy: diagnostic.acknowledgedBy ?? null,
      linkIds: JSON.stringify(diagnostic.linkIds, null, JSON_SPACES),
      llmAssessment: diagnostic.llmAssessment
        ? JSON.stringify(diagnostic.llmAssessment, null, JSON_SPACES)
        : null
    });
  }

  logAcknowledgement(action: AcknowledgementAction): void {
    this.db.prepare(`
      INSERT INTO acknowledgements (id, diagnostic_id, actor, action, notes, timestamp)
      VALUES (@id, @diagnosticId, @actor, @action, @notes, @timestamp)
    `).run({
      ...action,
      notes: action.notes ?? null
    });
  }

  recordDriftHistory(entry: DriftHistoryEntry): void {
    this.db.prepare(`
      INSERT INTO drift_history (
        id,
        diagnostic_id,
        change_event_id,
        trigger_artifact_id,
        target_artifact_id,
        status,
        severity,
        recorded_at,
        actor,
        notes,
        metadata
      ) VALUES (
        @id,
        @diagnosticId,
        @changeEventId,
        @triggerArtifactId,
        @targetArtifactId,
        @status,
        @severity,
        @recordedAt,
        @actor,
        @notes,
        @metadata
      )
    `).run({
      ...entry,
      actor: entry.actor ?? null,
      notes: entry.notes ?? null,
      metadata: entry.metadata ? JSON.stringify(entry.metadata, null, JSON_SPACES) : null
    });
  }

  listDriftHistory(options: ListDriftHistoryOptions = {}): DriftHistoryEntry[] {
    const where: string[] = [];
    const parameters: Record<string, unknown> = {};

    if (options.changeEventId) {
      where.push("change_event_id = @changeEventId");
      parameters.changeEventId = options.changeEventId;
    }

    if (options.targetArtifactId) {
      where.push("target_artifact_id = @targetArtifactId");
      parameters.targetArtifactId = options.targetArtifactId;
    }

    if (options.diagnosticId) {
      where.push("diagnostic_id = @diagnosticId");
      parameters.diagnosticId = options.diagnosticId;
    }

    if (options.status) {
      where.push("status = @status");
      parameters.status = options.status;
    }

    const clause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
    const limitClause = typeof options.limit === "number" ? "LIMIT @limit" : "";
    if (limitClause) {
      parameters.limit = options.limit;
    }

    const rows = this.db
      .prepare(
        `
        SELECT
          id,
          diagnostic_id,
          change_event_id,
          trigger_artifact_id,
          target_artifact_id,
          status,
          severity,
          recorded_at,
          actor,
          notes,
          metadata
        FROM drift_history
        ${clause}
        ORDER BY datetime(recorded_at) DESC
        ${limitClause}
      `
      )
      .all(parameters) as DriftHistoryRow[];

    return rows.map(row => this.mapDriftHistoryRow(row));
  }

  summarizeDriftHistory(changeEventId: string): DriftHistorySummary {
    const totals = this.db
      .prepare(
        `
        SELECT status, COUNT(*) as count
        FROM drift_history
        WHERE change_event_id = @changeEventId
        GROUP BY status
      `
      )
      .all({ changeEventId }) as DriftHistoryCountRow[];

    const statusCounts: Record<DriftHistoryStatus, number> = {
      emitted: 0,
      acknowledged: 0
    };

    for (const row of totals) {
      const status = row.status as DriftHistoryStatus;
      if (statusCounts[status] !== undefined) {
        statusCounts[status] = row.count;
      }
    }

    const lastAck = this.db
      .prepare(
        `
        SELECT recorded_at, actor
        FROM drift_history
        WHERE change_event_id = @changeEventId AND status = 'acknowledged'
        ORDER BY datetime(recorded_at) DESC
        LIMIT 1
      `
      )
      .get({ changeEventId }) as DriftHistoryAckRow | undefined;

    return {
      changeEventId,
      totals: statusCounts,
      lastAcknowledgedAt: lastAck?.recorded_at ?? null,
      lastAcknowledgedBy: lastAck?.actor ?? null
    };
  }

  listDiagnosticsByStatus(status: DiagnosticStatus): DiagnosticRecord[] {
    const rows = this.db
      .prepare(`
        SELECT
          id,
          artifact_id,
          trigger_artifact_id,
          change_event_id,
          message,
          severity,
          status,
          created_at,
          acknowledged_at,
          acknowledged_by,
          link_ids,
          llm_assessment
        FROM diagnostics
        WHERE status = @status
        ORDER BY datetime(created_at) DESC
      `)
      .all({ status }) as DiagnosticRow[];

    return rows.map(row => this.mapDiagnosticRow(row));
  }

  getDiagnosticById(id: string): DiagnosticRecord | undefined {
    const row = this.db
      .prepare(`
        SELECT
          id,
          artifact_id,
          trigger_artifact_id,
          change_event_id,
          message,
          severity,
          status,
          created_at,
          acknowledged_at,
          acknowledged_by,
          link_ids,
          llm_assessment
        FROM diagnostics
        WHERE id = ?
      `)
      .get(id) as DiagnosticRow | undefined;

    if (!row) {
      return undefined;
    }

    return this.mapDiagnosticRow(row);
  }

  updateDiagnosticStatus(options: UpdateDiagnosticStatusOptions): void {
    this.db
      .prepare(`
        UPDATE diagnostics
        SET
          status = @status,
          acknowledged_at = @acknowledgedAt,
          acknowledged_by = @acknowledgedBy
        WHERE id = @id
      `)
      .run({
        id: options.id,
        status: options.status,
        acknowledgedAt: options.acknowledgedAt ?? null,
        acknowledgedBy: options.acknowledgedBy ?? null
      });
  }

  findDiagnosticByChangeEvent(options: FindDiagnosticByChangeEventOptions): DiagnosticRecord | undefined {
    const row = this.db
      .prepare(`
        SELECT
          id,
          artifact_id,
          trigger_artifact_id,
          change_event_id,
          message,
          severity,
          status,
          created_at,
          acknowledged_at,
          acknowledged_by,
          link_ids,
          llm_assessment
        FROM diagnostics
        WHERE change_event_id = @changeEventId
          AND artifact_id = @artifactId
          AND trigger_artifact_id = @triggerArtifactId
      `)
      .get(options) as DiagnosticRow | undefined;

    if (!row) {
      return undefined;
    }

    return this.mapDiagnosticRow(row);
  }

  storeSnapshot(snapshot: KnowledgeSnapshot): void {
    this.db.prepare(`
      INSERT INTO snapshots (id, label, created_at, artifact_count, edge_count, payload_hash, metadata)
      VALUES (@id, @label, @createdAt, @artifactCount, @edgeCount, @payloadHash, @metadata)
      ON CONFLICT(id) DO UPDATE SET
        label = excluded.label,
        created_at = excluded.created_at,
        artifact_count = excluded.artifact_count,
        edge_count = excluded.edge_count,
        payload_hash = excluded.payload_hash,
        metadata = excluded.metadata;
    `).run({
      ...snapshot,
      metadata: snapshot.metadata ? JSON.stringify(snapshot.metadata, null, JSON_SPACES) : null
    });
  }

  private configure(): void {
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
  }

  private ensureSchema(): void {
    // Keeping the schema bootstrap here avoids complicated external migration orchestration while we
    // stand up the initial prototype. Later migrations can layer on top of this foundation.
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        uri TEXT NOT NULL UNIQUE,
        layer TEXT NOT NULL,
        language TEXT,
        owner TEXT,
        last_synchronized_at TEXT,
        hash TEXT,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        kind TEXT NOT NULL,
        confidence REAL NOT NULL,
        created_at TEXT NOT NULL,
        created_by TEXT NOT NULL,
        FOREIGN KEY (source_id) REFERENCES artifacts (id) ON DELETE CASCADE,
        FOREIGN KEY (target_id) REFERENCES artifacts (id) ON DELETE CASCADE
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_links_unique ON links (source_id, target_id, kind);

      CREATE TABLE IF NOT EXISTS change_events (
        id TEXT PRIMARY KEY,
        artifact_id TEXT NOT NULL,
        detected_at TEXT NOT NULL,
        summary TEXT NOT NULL,
        change_type TEXT NOT NULL,
        ranges TEXT NOT NULL,
        provenance TEXT NOT NULL,
        FOREIGN KEY (artifact_id) REFERENCES artifacts (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS diagnostics (
        id TEXT PRIMARY KEY,
        artifact_id TEXT NOT NULL,
        trigger_artifact_id TEXT NOT NULL,
        change_event_id TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        acknowledged_at TEXT,
        acknowledged_by TEXT,
        link_ids TEXT NOT NULL,
        llm_assessment TEXT,
        FOREIGN KEY (artifact_id) REFERENCES artifacts (id) ON DELETE CASCADE,
        FOREIGN KEY (trigger_artifact_id) REFERENCES artifacts (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS acknowledgements (
        id TEXT PRIMARY KEY,
        diagnostic_id TEXT NOT NULL,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        notes TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (diagnostic_id) REFERENCES diagnostics (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS snapshots (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        created_at TEXT NOT NULL,
        artifact_count INTEGER NOT NULL,
        edge_count INTEGER NOT NULL,
        payload_hash TEXT NOT NULL,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS drift_history (
        id TEXT PRIMARY KEY,
        diagnostic_id TEXT NOT NULL,
        change_event_id TEXT NOT NULL,
        trigger_artifact_id TEXT NOT NULL,
        target_artifact_id TEXT NOT NULL,
        status TEXT NOT NULL,
        severity TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        actor TEXT,
        notes TEXT,
        metadata TEXT,
        FOREIGN KEY (diagnostic_id) REFERENCES diagnostics (id) ON DELETE CASCADE,
        FOREIGN KEY (change_event_id) REFERENCES change_events (id) ON DELETE CASCADE,
        FOREIGN KEY (trigger_artifact_id) REFERENCES artifacts (id) ON DELETE CASCADE,
        FOREIGN KEY (target_artifact_id) REFERENCES artifacts (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_drift_history_change_target ON drift_history (change_event_id, target_artifact_id);
      CREATE INDEX IF NOT EXISTS idx_drift_history_diagnostic ON drift_history (diagnostic_id, recorded_at DESC);
    `);

    try {
      this.db.prepare(`ALTER TABLE diagnostics ADD COLUMN change_event_id TEXT`).run();
    } catch (error) {
      // Ignore if column already exists.
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate column name/i.test(message)) {
        throw error;
      }
    }
  }

  private mapArtifactRow(row: ArtifactRow): KnowledgeArtifact {
    return {
      id: row.id,
      uri: row.uri,
      layer: row.layer as KnowledgeArtifact["layer"],
      language: row.language ?? undefined,
      owner: row.owner ?? undefined,
      lastSynchronizedAt: row.last_synchronized_at ?? undefined,
      hash: row.hash ?? undefined,
      metadata: this.parseMetadata(row.metadata)
    };
  }

  private parseMetadata(value: string | null): Record<string, unknown> | undefined {
    if (!value) {
      return undefined;
    }

    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return undefined;
    }
  }

  private mapDiagnosticRow(row: DiagnosticRow): DiagnosticRecord {
    return {
      id: row.id,
      artifactId: row.artifact_id,
      triggerArtifactId: row.trigger_artifact_id,
      changeEventId: row.change_event_id ?? "",
      message: row.message,
      severity: row.severity as DiagnosticRecord["severity"],
      status: row.status as DiagnosticStatus,
      createdAt: row.created_at,
      acknowledgedAt: row.acknowledged_at ?? undefined,
      acknowledgedBy: row.acknowledged_by ?? undefined,
      linkIds: this.parseLinkIds(row.link_ids),
      llmAssessment: this.parseMetadata(row.llm_assessment)
    };
  }

  private mapDriftHistoryRow(row: DriftHistoryRow): DriftHistoryEntry {
    return {
      id: row.id,
      diagnosticId: row.diagnostic_id,
      changeEventId: row.change_event_id,
      triggerArtifactId: row.trigger_artifact_id,
      targetArtifactId: row.target_artifact_id,
      status: row.status as DriftHistoryStatus,
      severity: row.severity as DriftHistoryEntry["severity"],
      recordedAt: row.recorded_at,
      actor: row.actor ?? undefined,
      notes: row.notes ?? undefined,
      metadata: this.parseMetadata(row.metadata)
    };
  }

  private parseLinkIds(value: string | null): string[] {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === "string") : [];
    } catch {
      return [];
    }
  }
}

interface ArtifactRow {
  id: string;
  uri: string;
  layer: string;
  language: string | null;
  owner: string | null;
  last_synchronized_at: string | null;
  hash: string | null;
  metadata: string | null;
}

interface LinkedArtifactRow {
  link_id: string;
  link_kind: LinkRelationshipKind;
  source_id: string;
  target_id: string;
  artifact_id: string;
  artifact_uri: string;
  artifact_layer: string;
  artifact_language: string | null;
  artifact_owner: string | null;
  artifact_last_synchronized_at: string | null;
  artifact_hash: string | null;
  artifact_metadata: string | null;
}

interface DiagnosticRow {
  id: string;
  artifact_id: string;
  trigger_artifact_id: string;
  change_event_id: string | null;
  message: string;
  severity: string;
  status: string;
  created_at: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  link_ids: string | null;
  llm_assessment: string | null;
}

interface DriftHistoryRow {
  id: string;
  diagnostic_id: string;
  change_event_id: string;
  trigger_artifact_id: string;
  target_artifact_id: string;
  status: string;
  severity: string;
  recorded_at: string;
  actor: string | null;
  notes: string | null;
  metadata: string | null;
}

interface DriftHistoryCountRow {
  status: string;
  count: number;
}

interface DriftHistoryAckRow {
  recorded_at: string;
  actor: string | null;
}

export interface DriftHistorySummary {
  changeEventId: string;
  totals: Record<DriftHistoryStatus, number>;
  lastAcknowledgedAt: string | null;
  lastAcknowledgedBy: string | null;
}

interface UpdateDiagnosticStatusOptions {
  id: string;
  status: DiagnosticStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

interface FindDiagnosticByChangeEventOptions {
  changeEventId: string;
  artifactId: string;
  triggerArtifactId: string;
}

export interface ListDriftHistoryOptions {
  changeEventId?: string;
  targetArtifactId?: string;
  diagnosticId?: string;
  status?: DriftHistoryStatus;
  limit?: number;
}
