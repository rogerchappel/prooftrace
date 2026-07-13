#!/usr/bin/env node
import process from "node:process";
import { classifyCommand } from "./command-kind.js";
import { sha256Text } from "./hash.js";
import { parseCommandLog } from "./log-parse.js";

type ParsedArgs = {
  command?: string;
  values: string[];
  help: boolean;
  version: boolean;
};

async function main(argv: string[]): Promise<number> {
  const args = parseArgs(argv);

  if (args.version) {
    process.stdout.write("prooftrace 0.1.0\n");
    return 0;
  }

  if (args.help || !args.command) {
    process.stdout.write(helpText());
    return args.help ? 0 : 1;
  }

  if (args.command === "kind") {
    const commandText = args.values.join(" ").trim();
    if (!commandText) {
      process.stderr.write("prooftrace kind requires a command string.\n");
      return 2;
    }
    process.stdout.write(`${classifyCommand(commandText)}\n`);
    return 0;
  }

  if (args.command === "hash") {
    const text = args.values.join(" ");
    process.stdout.write(`${sha256Text(text)}\n`);
    return 0;
  }

  if (args.command === "from-log") {
    const text = args.values.join(" ");
    if (!text) {
      process.stderr.write("prooftrace from-log requires copied log text.\n");
      return 2;
    }
    process.stdout.write(`${JSON.stringify(parseCommandLog(text), null, 2)}\n`);
    return 0;
  }

  process.stderr.write(`Unknown command: ${args.command}\n\n${helpText()}`);
  return 1;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    values: [],
    help: false,
    version: false
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--version" || arg === "-v") {
      parsed.version = true;
    } else if (!parsed.command) {
      parsed.command = arg;
    } else {
      parsed.values.push(arg);
    }
  }

  return parsed;
}

function helpText(): string {
  return `prooftrace

Local-first proof bundle utilities for agent-built changes.

Usage:
  prooftrace kind "npm test"
  prooftrace hash "text to hash"
  prooftrace from-log "$ npm test
  exit 0"
  prooftrace --help

Commands:
  kind      Classify a verification command as test, build, smoke, lint, package, or generic.
  hash      Print a SHA-256 hash for the provided text.
  from-log  Parse copied "$ command" log text into command evidence stubs.
`;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
