const MAX_CAPTURE_CHARS = 80_000;

export function truncateMiddle(input: string, maxChars = MAX_CAPTURE_CHARS): string {
  if (!Number.isSafeInteger(maxChars) || maxChars <= 0) {
    throw new RangeError("maxChars must be a positive safe integer");
  }

  if (input.length <= maxChars) {
    return input;
  }

  const compactMarker = "…";
  const initialOmitted = input.length - compactMarker.length;
  const marker = `\n[prooftrace omitted ${initialOmitted} characters]\n`;
  if (marker.length >= maxChars) {
    return `${input.slice(0, maxChars - compactMarker.length)}${compactMarker}`;
  }

  const retained = maxChars - marker.length;
  const prefixLength = Math.ceil(retained / 2);
  const suffixLength = Math.floor(retained / 2);
  const omitted = input.length - retained;
  const exactMarker = `\n[prooftrace omitted ${omitted} characters]\n`;
  return `${input.slice(0, prefixLength)}${exactMarker}${input.slice(-suffixLength)}`;
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
