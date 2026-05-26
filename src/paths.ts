import path from "node:path";

export function resolveRepo(input: string | undefined): string {
  return path.resolve(input ?? process.cwd());
}

export function normalizePath(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

export function isInside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function resolveInside(root: string, input: string): string {
  const resolved = path.resolve(root, input);
  if (!isInside(root, resolved)) {
    throw new Error(`Path escapes repo root: ${input}`);
  }
  return resolved;
}
