import { JobGroup, TaskCategory, TaskPriority, TaskType } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";
import { getResetSchedule } from "@/lib/reset-logic";
import type { TaskViewModel, TrackerSnapshot } from "@/lib/types";

const categoryLabels: Record<TaskCategory, string> = {
  [TaskCategory.ROULETTE]: "Roulette",
  [TaskCategory.BEAST_TRIBE]: "Beast Tribe",
  [TaskCategory.HUNT]: "Hunt",
  [TaskCategory.GRAND_COMPANY]: "Grand Company",
  [TaskCategory.CHALLENGE_LOG]: "Challenge Log",
  [TaskCategory.CRAFTING]: "Crafting / Gathering",
  [TaskCategory.OTHER]: "Outro",
};

const priorityMap: Record<TaskPriority, TaskViewModel["priority"]> = {
  [TaskPriority.HIGH]: "high",
  [TaskPriority.MEDIUM]: "medium",
  [TaskPriority.LOW]: "low",
};

const requiredJobMap: Record<JobGroup, NonNullable<TaskViewModel["requiredJobGroup"]>> = {
  [JobGroup.TANK]: "tank",
  [JobGroup.CRAFTER_GATHERER]: "crafter_gatherer",
};

const typeMap: Record<TaskType, TaskViewModel["type"]> = {
  [TaskType.DAILY]: "daily",
  [TaskType.WEEKLY]: "weekly",
};

function sortTasks(tasks: TaskViewModel[]) {
  const priorityRank = { high: 0, medium: 1, low: 2 } as const;

  return [...tasks].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type.localeCompare(right.type);
    }

    const priorityDiff = priorityRank[left.priority] - priorityRank[right.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return left.minLevel - right.minLevel || left.name.localeCompare(right.name);
  });
}

export async function ensureUserSettings() {
  return prisma.userSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      currentLevel: 58,
      currentJob: "Warrior",
      timezone: "America/Sao_Paulo",
    },
  });
}

export async function getTrackerSnapshot(reference = new Date()): Promise<TrackerSnapshot> {
  noStore();

  const settings = await ensureUserSettings();
  const resets = getResetSchedule(settings.timezone, reference);
  const periodByType: Record<TaskType, string> = {
    [TaskType.DAILY]: resets.daily.currentPeriodKey,
    [TaskType.WEEKLY]: resets.weekly.currentPeriodKey,
  };

  const [tasks, statusEntries] = await Promise.all([
    prisma.task.findMany(),
    prisma.taskStatus.findMany({
      where: {
        resetPeriod: {
          in: [resets.daily.currentPeriodKey, resets.weekly.currentPeriodKey],
        },
      },
    }),
  ]);

  const statusMap = new Map(
    statusEntries.map((entry) => [entry.taskId + ":" + entry.resetPeriod, entry]),
  );

  const serializedTasks = sortTasks(
    tasks.map((task) => {
      const resetPeriod = periodByType[task.type];
      const status = statusMap.get(task.id + ":" + resetPeriod);

      return {
        id: task.id,
        slug: task.slug,
        name: task.name,
        description: task.description,
        type: typeMap[task.type],
        category: task.category,
        categoryLabel: categoryLabels[task.category],
        minLevel: task.minLevel,
        xpReward: task.xpReward,
        goldReward: task.goldReward,
        tomestones: task.tomestones,
        seals: task.seals,
        unlocked: task.unlocked,
        unlockHint: task.unlockHint,
        infoUrl: task.infoUrl,
        priority: priorityMap[task.priority],
        requiredJobGroup: task.requiredJobGroup ? requiredJobMap[task.requiredJobGroup] : null,
        adventurerInNeedBonus: task.adventurerInNeedBonus,
        isCompleted: Boolean(status?.completed),
      } satisfies TaskViewModel;
    }),
  );

  return {
    settings: {
      currentLevel: settings.currentLevel,
      currentJob: settings.currentJob,
      timezone: settings.timezone,
    },
    tasks: serializedTasks,
    resets,
  };
}
