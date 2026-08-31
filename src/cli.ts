#!/usr/bin/env node
import process from "node:process";
import { readFile } from "node:fs/promises";
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
    process.stdout.write(`prooftrace ${await packageVersion()}\n`);
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
    if (!text) {
      process.stderr.write("prooftrace hash requires evidence text.\n");
      return 2;
    }
    process.stdout.write(`${sha256Text(text)}\n`);
    return 0;
  }

  if (args.command === "from-log") {
    const text = args.values.join(" ");
    if (!text) {
      process.stderr.write("prooftrace from-log requires copied log text.\n");
      return 2;
    }
    const commands = parseCommandLog(text);
    if (commands.length === 0) {
      process.stderr.write("prooftrace from-log found no copied commands.\n");
      return 2;
    }
    process.stdout.write(`${JSON.stringify(commands, null, 2)}\n`);
    return 0;
  }

  process.stderr.write(`Unknown command: ${args.command}\n\n${helpText()}`);
  return 1;
}

async function packageVersion(): Promise<string> {
  const packageJsonUrl = new URL("../package.json", import.meta.url);
  const packageJson = JSON.parse(await readFile(packageJsonUrl, "utf8")) as { version?: unknown };

  if (typeof packageJson.version !== "string" || packageJson.version.length === 0) {
    throw new Error("package.json does not contain a valid version");
  }

  return packageJson.version;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    values: [],
    help: false,
    version: false
  };

  const [first, ...values] = argv;

  if (first === "--help" || first === "-h") {
    parsed.help = true;
  } else if (first === "--version" || first === "-v") {
    parsed.version = true;
  } else if (first) {
    parsed.command = first;
    parsed.values = values;
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

Options:
  -h, --help     Show this help when used before a command.
  -v, --version  Show the version when used before a command.

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
