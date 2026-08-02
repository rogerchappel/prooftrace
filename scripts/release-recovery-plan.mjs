#!/usr/bin/env node

export function recoveryPlan({ npmPublished, githubRelease }) {
  if (typeof npmPublished !== "boolean" || typeof githubRelease !== "boolean") {
    throw new TypeError("npmPublished and githubRelease must be booleans");
  }

  return {
    publishNpm: !npmPublished,
    createGithubRelease: !githubRelease,
    outcome:
      npmPublished && githubRelease
        ? "complete"
        : npmPublished
          ? "create-github-release"
          : githubRelease
            ? "publish-npm"
            : "publish-both",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const plan = recoveryPlan({
    npmPublished: process.argv[2] === "true",
    githubRelease: process.argv[3] === "true",
  });
  process.stdout.write(`${JSON.stringify(plan)}\n`);
}
