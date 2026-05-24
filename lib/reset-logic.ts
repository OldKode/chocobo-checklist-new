import { addDays, addWeeks } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import type { ResetDisplay, ResetType } from "@/lib/types";

export const DAILY_RESET_HOUR_UTC = 15;
export const WEEKLY_RESET_DAY_UTC = 2;
export const WEEKLY_RESET_HOUR_UTC = 8;

function createUtcDate(reference: Date, hour: number, minute = 0) {
  return new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
      hour,
      minute,
      0,
      0,
    ),
  );
}

export function getMostRecentDailyReset(reference = new Date()) {
  const todayReset = createUtcDate(reference, DAILY_RESET_HOUR_UTC);
  return reference.getTime() >= todayReset.getTime() ? todayReset : addDays(todayReset, -1);
}

export function getNextDailyReset(reference = new Date()) {
  const todayReset = createUtcDate(reference, DAILY_RESET_HOUR_UTC);
  return reference.getTime() < todayReset.getTime() ? todayReset : addDays(todayReset, 1);
}

export function getMostRecentWeeklyReset(reference = new Date()) {
  const dayDelta = (reference.getUTCDay() - WEEKLY_RESET_DAY_UTC + 7) % 7;
  const candidate = addDays(createUtcDate(reference, WEEKLY_RESET_HOUR_UTC), -dayDelta);
  return reference.getTime() >= candidate.getTime() ? candidate : addWeeks(candidate, -1);
}

export function getNextWeeklyReset(reference = new Date()) {
  const currentWeekReset = getMostRecentWeeklyReset(reference);
  return reference.getTime() < currentWeekReset.getTime() ? currentWeekReset : addWeeks(currentWeekReset, 1);
}

export function getMostRecentReset(type: ResetType, reference = new Date()) {
  return type === "daily" ? getMostRecentDailyReset(reference) : getMostRecentWeeklyReset(reference);
}

export function getNextReset(type: ResetType, reference = new Date()) {
  return type === "daily" ? getNextDailyReset(reference) : getNextWeeklyReset(reference);
}

export function getCurrentResetPeriodKey(type: ResetType, reference = new Date()) {
  const boundary = getMostRecentReset(type, reference);
  return `${type}-${formatInTimeZone(boundary, "UTC", "yyyy-MM-dd")}`;
}

export function getRemainingMilliseconds(type: ResetType, reference = new Date()) {
  return Math.max(0, getNextReset(type, reference).getTime() - reference.getTime());
}

export function formatCountdown(totalMilliseconds: number) {
  const safeMilliseconds = Math.max(0, totalMilliseconds);
  const totalSeconds = Math.floor(safeMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (safeMilliseconds === 0) {
    return "agora";
  }

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (minutes > 0) {
    return `${minutes}min ${seconds}s`;
  }

  return `${seconds}s`;
}

export function getResetDisplay(type: ResetType, timeZone: string, reference = new Date()): ResetDisplay {
  const nextReset = getNextReset(type, reference);
  const remaining = getRemainingMilliseconds(type, reference);

  return {
    type,
    currentPeriodKey: getCurrentResetPeriodKey(type, reference),
    nextResetIso: nextReset.toISOString(),
    nextResetLabel: formatInTimeZone(nextReset, timeZone, "dd/MM HH:mm zzz"),
    countdownLabel: formatCountdown(remaining),
    timezone: timeZone,
  };
}

export function getResetSchedule(timeZone: string, reference = new Date()) {
  return {
    daily: getResetDisplay("daily", timeZone, reference),
    weekly: getResetDisplay("weekly", timeZone, reference),
  };
}
