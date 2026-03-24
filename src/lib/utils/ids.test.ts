import { describe, expect, it, vi } from "vitest";
import { createId } from "./ids";

describe("createId", () => {
  it("uses crypto.randomUUID when available", () => {
    const randomUUID = vi.fn(() => "uuid-from-crypto");

    vi.stubGlobal("crypto", { randomUUID });

    expect(createId()).toBe("uuid-from-crypto");
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });

  it("falls back when crypto.randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {});

    const id = createId();

    expect(id).toMatch(/^id-/);
    expect(id.length).toBeGreaterThan(10);
  });
});
