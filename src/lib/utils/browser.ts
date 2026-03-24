export function getStoredItem(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStoredItem(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures on restricted browsers/webviews.
  }
}

export function requestNextFrame(callback: FrameRequestCallback) {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(() => callback(Date.now()), 16);
}

export function cancelNextFrame(handle: number) {
  if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(handle);
    return;
  }

  window.clearTimeout(handle);
}

export function printPage() {
  if (typeof window === "undefined" || typeof window.print !== "function") {
    return;
  }

  window.print();
}
