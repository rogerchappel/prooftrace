export type FindingLevel = "info" | "warn" | "fail";

export type CommandKind = "test" | "build" | "smoke" | "lint" | "package" | "generic";

export interface Finding {
  level: FindingLevel;
  code: string;
  message: string;
}

export interface CommandEvidence {
  id: string;
  command: string;
  cwd: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  kind: CommandKind;
  passed: boolean;
}

export interface LogEvidence {
  path: string;
  bytes: number;
  sha256: string;
  parsedCommands: ParsedCommand[];
}

export interface ParsedCommand {
  command: string;
  kind: CommandKind;
  passed: boolean;
  exitCode: number | null;
  excerpt: string;
}

export interface GitFile {
  path: string;
  status: string;
}

export interface GitSummary {
  available: boolean;
  branch: string | null;
  head: string | null;
  dirty: boolean;
  files: GitFile[];
  recentCommits: string[];
}

export interface PackageSummary {
  path: string | null;
  name: string | null;
  version: string | null;
  packageManager: string | null;
  scripts: Record<string, string>;
}

export interface FileEvidence {
  path: string;
  kind: "source" | "test" | "fixture" | "doc" | "config" | "script" | "other";
  size: number;
  sha256: string;
  gitStatus: string | null;
}

export interface RepoSummary {
  root: string;
  generatedAt: string;
}

export interface ProofSummary {
  commandCount: number;
  passedCommands: number;
  failedCommands: number;
  findingCount: number;
  failFindingCount: number;
  warnFindingCount: number;
  dirtyWorktree: boolean;
}

export interface ProofBundle {
  schemaVersion: 1;
  tool: {
    name: "prooftrace";
    version: string;
  };
  repo: RepoSummary;
  git: GitSummary;
  package: PackageSummary;
  commands: CommandEvidence[];
  logs: LogEvidence[];
  files: FileEvidence[];
  findings: Finding[];
  summary: ProofSummary;
}
