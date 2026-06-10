export { classifyCommand } from "./command-kind.js";
export { sha256File, sha256Text } from "./hash.js";
export { isInside, normalizePath, resolveInside, resolveRepo } from "./paths.js";
export { excerpt, stripAnsi, truncateMiddle } from "./text.js";
export type {
  CommandEvidence,
  CommandKind,
  FileEvidence,
  Finding,
  FindingLevel,
  GitSummary,
  LogEvidence,
  PackageSummary,
  ParsedCommand,
  ProofBundle,
  ProofSummary,
  RepoSummary
} from "./types.js";
