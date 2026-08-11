import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("the CLI version follows package.json", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "prooftrace-version-"));

  try {
    await cp("dist", path.join(fixtureRoot, "dist"), { recursive: true });
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    packageJson.version = "9.8.7-test";
    await writeFile(
      path.join(fixtureRoot, "package.json"),
      `${JSON.stringify(packageJson, null, 2)}\n`
    );

    const result = spawnSync(process.execPath, ["dist/cli.js", "--version"], {
      cwd: fixtureRoot,
      encoding: "utf8"
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "prooftrace 9.8.7-test\n");
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
