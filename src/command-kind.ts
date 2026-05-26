import type { CommandKind } from "./types.js";

export function classifyCommand(command: string): CommandKind {
  const value = command.toLowerCase();

  if (/\b(test|vitest|jest|node --test|pytest|cargo test|go test)\b/.test(value)) {
    return "test";
  }

  if (/\b(build|tsc|vite build|cargo build|go build)\b/.test(value)) {
    return "build";
  }

  if (/\b(smoke|validate|e2e)\b/.test(value)) {
    return "smoke";
  }

  if (/\b(lint|eslint|ruff|clippy)\b/.test(value)) {
    return "lint";
  }

  if (/\b(npm pack|pnpm pack|yarn pack|package:smoke)\b/.test(value)) {
    return "package";
  }

  return "generic";
}
