export type ResetType = "daily" | "weekly";
export type TaskTypeValue = "daily" | "weekly";
export type TaskPriorityValue = "high" | "medium" | "low";
export type RequiredJobGroupValue = "tank" | "crafter_gatherer" | null;

export interface TaskViewModel {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: TaskTypeValue;
  category: string;
  categoryLabel: string;
  minLevel: number;
  xpReward: number;
  goldReward: number;
  tomestones: number;
  seals: number;
  unlocked: boolean;
  unlockHint: string | null;
  infoUrl: string;
  priority: TaskPriorityValue;
  requiredJobGroup: RequiredJobGroupValue;
  adventurerInNeedBonus: boolean;
  isCompleted: boolean;
}

export interface UserSettingsView {
  currentLevel: number;
  currentJob: string;
  timezone: string;
}

export interface ResetDisplay {
  type: ResetType;
  currentPeriodKey: string;
  nextResetIso: string;
  nextResetLabel: string;
  countdownLabel: string;
  timezone: string;
}

export interface TrackerSnapshot {
  settings: UserSettingsView;
  tasks: TaskViewModel[];
  resets: Record<ResetType, ResetDisplay>;
}
