import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

function run(...args) {
  const result = spawnSync(process.execPath, ["dist/cli.js", ...args], {
    encoding: "utf8"
  });

  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

test("top-level metadata flags print help and version", () => {
  const help = run("--help");
  assert.equal(help.status, 0);
  assert.match(help.stdout, /^prooftrace\n/);
  assert.equal(help.stderr, "");

  const version = run("--version");
  assert.equal(version.status, 0);
  assert.match(version.stdout, /^prooftrace \d+\.\d+\.\d+\n$/);
  assert.equal(version.stderr, "");
});

test("metadata-looking tokens after commands remain command payload", () => {
  assert.deepEqual(run("kind", "--version"), {
    status: 0,
    stdout: "generic\n",
    stderr: ""
  });
  assert.deepEqual(run("hash", "--help"), {
    status: 0,
    stdout: "0bdbc8fb00a40fb6f7bcaa79eeb92a5b6599b7588577bba6e853296fa5ea6af9\n",
    stderr: ""
  });
  assert.deepEqual(run("from-log", "--version"), {
    status: 2,
    stdout: "",
    stderr: "prooftrace from-log found no copied commands.\n"
  });
});

test("kind, hash, and from-log accept valid payloads", () => {
  assert.deepEqual(run("kind", "npm", "test"), {
    status: 0,
    stdout: "test\n",
    stderr: ""
  });
  assert.deepEqual(run("hash", "abc"), {
    status: 0,
    stdout: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\n",
    stderr: ""
  });
  const parsed = run("from-log", "$ npm test\nexit 0");
  assert.equal(parsed.status, 0);
  assert.equal(parsed.stderr, "");
  assert.deepEqual(JSON.parse(parsed.stdout), [
    {
      command: "npm test",
      kind: "test",
      passed: true,
      exitCode: 0,
      excerpt: ""
    }
  ]);

  const colored = run(
    "from-log",
    "\u001b[32m$ npm test\u001b[0m\n\u001b[36mok\u001b[0m\n\u001b[32mexit 0\u001b[0m"
  );
  assert.equal(colored.status, 0);
  assert.equal(colored.stderr, "");
  assert.deepEqual(JSON.parse(colored.stdout), [
    {
      command: "npm test",
      kind: "test",
      passed: true,
      exitCode: 0,
      excerpt: "ok"
    }
  ]);
});

test("commands reject missing payloads with usage exit status", () => {
  assert.deepEqual(run("kind"), {
    status: 2,
    stdout: "",
    stderr: "prooftrace kind requires a command string.\n"
  });
  assert.deepEqual(run("hash"), {
    status: 2,
    stdout: "",
    stderr: "prooftrace hash requires evidence text.\n"
  });
  assert.deepEqual(run("from-log"), {
    status: 2,
    stdout: "",
    stderr: "prooftrace from-log requires copied log text.\n"
  });
});

test("unknown commands fail on stderr and include help", () => {
  const result = run("unknown", "--version");
  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /^Unknown command: unknown\n\nprooftrace\n/);
});
