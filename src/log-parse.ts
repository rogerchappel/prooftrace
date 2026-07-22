import { classifyCommand } from "./command-kind.js";
import { excerpt } from "./text.js";
import type { ParsedCommand } from "./types.js";

const PROMPT_RE = /^\$\s+(.+)$/;
const EXIT_RE = /^exit(?: code)?(?::|\s+)\s*(-?\d+)$/i;

export function parseCommandLog(text: string): ParsedCommand[] {
  const commands: ParsedCommand[] = [];
  let current: { command: string; output: string[]; exitCode: number | null } | undefined;

  for (const line of text.split(/\r?\n/)) {
    const promptMatch = line.match(PROMPT_RE);
    if (promptMatch) {
      pushCurrent(commands, current);
      current = { command: promptMatch[1]!.trim(), output: [], exitCode: null };
      continue;
    }

    if (!current) {
      continue;
    }

    const exitMatch = line.match(EXIT_RE);
    if (exitMatch) {
      current.exitCode = Number(exitMatch[1]!);
      continue;
    }

    current.output.push(line);
  }

  pushCurrent(commands, current);
  return commands;
}

function pushCurrent(commands: ParsedCommand[], current: { command: string; output: string[]; exitCode: number | null } | undefined): void {
  if (!current || current.command.length === 0) {
    return;
  }

  commands.push({
    command: current.command,
    kind: classifyCommand(current.command),
    passed: current.exitCode === 0,
    exitCode: current.exitCode,
    excerpt: excerpt(current.output.join("\n"), 240)
  });
}
