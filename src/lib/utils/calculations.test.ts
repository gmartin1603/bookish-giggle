import { describe, expect, it } from "vitest";
import { calculateReportTotal } from "./calculations";
import type { ReportDraft } from "../../types/domain";

describe("calculateReportTotal", () => {
  it("adds line item totals across categories", () => {
    const draft: ReportDraft = {
      id: "1",
      landLord: "Test Farm",
      crop: "Corn",
      year: "2026",
      itemsByCategory: {
        seedList: [
          { id: "a", name: "Hybrid", price: 12.5, qty: 10, unit: "Bag", arr: "seedList" }
        ],
        fuelList: [
          { id: "b", name: "Diesel", price: 4, qty: 50, unit: "Gal", arr: "fuelList" }
        ]
      }
    };

    expect(calculateReportTotal(draft)).toBe(325);
  });
});
