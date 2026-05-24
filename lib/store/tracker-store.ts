"use client";

import { create } from "zustand";

import type { TaskViewModel, TrackerSnapshot, UserSettingsView } from "@/lib/types";

interface TrackerState {
  tasks: TaskViewModel[];
  settings: UserSettingsView;
  hydrate: (snapshot: TrackerSnapshot) => void;
  setTaskCompletion: (taskId: string, completed: boolean) => void;
  updateSettings: (patch: Partial<UserSettingsView>) => void;
}

const defaultSettings: UserSettingsView = {
  currentLevel: 58,
  currentJob: "Warrior",
  timezone: "America/Sao_Paulo",
};

export const useTrackerStore = create<TrackerState>((set) => ({
  tasks: [],
  settings: defaultSettings,
  hydrate: (snapshot) =>
    set({
      tasks: snapshot.tasks,
      settings: snapshot.settings,
    }),
  setTaskCompletion: (taskId, completed) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: completed } : task,
      ),
    })),
  updateSettings: (patch) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...patch,
      },
    })),
}));
