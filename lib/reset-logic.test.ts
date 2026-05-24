import { describe, expect, it } from "vitest";

import {
  formatCountdown,
  getCurrentResetPeriodKey,
  getNextReset,
  getResetSchedule,
} from "@/lib/reset-logic";

describe("FFXIV reset logic", () => {
  it("uses the previous daily reset before 15:00 UTC", () => {
    const reference = new Date("2026-05-26T14:59:59.000Z");

    expect(getCurrentResetPeriodKey("daily", reference)).toBe("daily-2026-05-25");
  });

  it("switches the daily period exactly at 15:00 UTC", () => {
    const reference = new Date("2026-05-26T15:00:00.000Z");

    expect(getCurrentResetPeriodKey("daily", reference)).toBe("daily-2026-05-26");
  });

  it("switches the weekly period exactly at Tuesday 08:00 UTC", () => {
    const beforeWeekly = new Date("2026-05-26T02:00:00.000Z");
    const afterWeekly = new Date("2026-05-26T08:00:00.000Z");

    expect(getCurrentResetPeriodKey("weekly", beforeWeekly)).toBe("weekly-2026-05-19");
    expect(getCurrentResetPeriodKey("weekly", afterWeekly)).toBe("weekly-2026-05-26");
  });

  it("keeps Monday 23:00 BRT progress until the Tuesday 05:00 BRT weekly reset", () => {
    const reference = new Date("2026-05-26T02:00:00.000Z");
    const schedule = getResetSchedule("America/Sao_Paulo", reference);

    expect(schedule.weekly.nextResetIso).toBe("2026-05-26T08:00:00.000Z");
    expect(schedule.daily.nextResetIso).toBe("2026-05-26T15:00:00.000Z");
  });

  it("formats countdowns without going negative", () => {
    expect(formatCountdown(-500)).toBe("agora");
    expect(formatCountdown((4 * 60 + 23) * 60 * 1000)).toBe("4h 23min");
  });

  it("computes the next weekly reset after the boundary", () => {
    const reference = new Date("2026-05-26T08:00:00.000Z");

    expect(getNextReset("weekly", reference).toISOString()).toBe("2026-06-02T08:00:00.000Z");
  });
});
