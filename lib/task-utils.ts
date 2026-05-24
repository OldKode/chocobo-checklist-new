import type { TaskTypeValue, TaskViewModel, UserSettingsView } from "@/lib/types";
import { isCrafterGatherer, isTankJob } from "@/lib/jobs";

const numberFormatter = new Intl.NumberFormat("pt-BR");
const priorityRank = { high: 0, medium: 1, low: 2 } as const;

export function getTaskLockReason(task: TaskViewModel, settings: UserSettingsView) {
  if (!task.unlocked) {
    return task.unlockHint ?? "Ainda nao desbloqueado.";
  }

  if (settings.currentLevel < task.minLevel) {
    return `Desbloqueia no nivel ${task.minLevel}.`;
  }

  if (task.requiredJobGroup === "tank" && !isTankJob(settings.currentJob)) {
    return "Requer um job tank para este foco.";
  }

  if (task.requiredJobGroup === "crafter_gatherer" && !isCrafterGatherer(settings.currentJob)) {
    return "Requer um crafter ou gatherer para completar.";
  }

  return null;
}

export function isTaskAvailable(task: TaskViewModel, settings: UserSettingsView) {
  return getTaskLockReason(task, settings) === null;
}

export function formatReward(value: number, suffix: string) {
  if (!value) {
    return null;
  }

  return `${numberFormatter.format(value)} ${suffix}`;
}

export function getProgress(tasks: TaskViewModel[], type: TaskTypeValue) {
  const scoped = tasks.filter((task) => task.type === type);
  const completed = scoped.filter((task) => task.isCompleted).length;
  const total = scoped.length;

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getEstimatedXp(tasks: TaskViewModel[], type: TaskTypeValue) {
  return tasks
    .filter((task) => task.type === type && task.isCompleted)
    .reduce((sum, task) => sum + task.xpReward, 0);
}

export function getRecommendedTasks(tasks: TaskViewModel[], settings: UserSettingsView, type: TaskTypeValue) {
  return tasks
    .filter((task) => task.type === type)
    .sort((left, right) => {
      const leftAvailable = isTaskAvailable(left, settings) ? 0 : 1;
      const rightAvailable = isTaskAvailable(right, settings) ? 0 : 1;

      if (leftAvailable !== rightAvailable) {
        return leftAvailable - rightAvailable;
      }

      if (left.isCompleted !== right.isCompleted) {
        return Number(left.isCompleted) - Number(right.isCompleted);
      }

      const priorityDiff = priorityRank[left.priority] - priorityRank[right.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return left.minLevel - right.minLevel || left.name.localeCompare(right.name);
    });
}
