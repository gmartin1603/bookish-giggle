import { describe, expect, it, vi, afterEach } from "vitest";
import { cancelNextFrame, getStoredItem, printPage, requestNextFrame, setStoredItem } from "./browser";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("browser utils", () => {
  it("reads storage safely when available", () => {
    const getItem = vi.fn(() => "dark");

    vi.stubGlobal("window", {
      localStorage: { getItem }
    });

    expect(getStoredItem("theme")).toBe("dark");
    expect(getItem).toHaveBeenCalledWith("theme");
  });

  it("returns null when storage access throws", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("blocked");
        }
      }
    });

    expect(getStoredItem("theme")).toBeNull();
  });

  it("writes storage safely when available", () => {
    const setItem = vi.fn();

    vi.stubGlobal("window", {
      localStorage: { setItem }
    });

    setStoredItem("theme", "light");

    expect(setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("falls back to timeout when requestAnimationFrame is missing", () => {
    const setTimeoutSpy = vi.fn(() => 99);

    vi.stubGlobal("window", {
      setTimeout: setTimeoutSpy,
      clearTimeout: vi.fn()
    });

    const callback = vi.fn();
    const handle = requestNextFrame(callback);

    expect(handle).toBe(99);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it("falls back to clearTimeout when cancelAnimationFrame is missing", () => {
    const clearTimeoutSpy = vi.fn();

    vi.stubGlobal("window", {
      setTimeout: vi.fn(),
      clearTimeout: clearTimeoutSpy
    });

    cancelNextFrame(55);

    expect(clearTimeoutSpy).toHaveBeenCalledWith(55);
  });

  it("prints only when supported", () => {
    const print = vi.fn();

    vi.stubGlobal("window", { print });

    printPage();

    expect(print).toHaveBeenCalledTimes(1);
  });
});
