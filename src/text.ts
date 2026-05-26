const MAX_CAPTURE_CHARS = 80_000;

export function truncateMiddle(input: string, maxChars = MAX_CAPTURE_CHARS): string {
  if (input.length <= maxChars) {
    return input;
  }

  const half = Math.floor((maxChars - 80) / 2);
  const omitted = input.length - half * 2;
  return `${input.slice(0, half)}\n[prooftrace omitted ${omitted} characters]\n${input.slice(-half)}`;
}

export function excerpt(input: string, maxChars = 1_200): string {
  const clean = input.trim();
  if (clean.length <= maxChars) {
    return clean;
  }
  return `${clean.slice(0, maxChars - 1)}…`;
}

export function stripAnsi(input: string): string {
  return input.replace(/\u001b\[[0-9;]*m/g, "");
}
