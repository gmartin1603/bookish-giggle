function fallbackRandomSegment() {
  return Math.random().toString(36).slice(2, 10);
}

export function createId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now().toString(36)}-${fallbackRandomSegment()}${fallbackRandomSegment()}`;
}
