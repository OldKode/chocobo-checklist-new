"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FiltersBar } from "@/components/FiltersBar";
import { ProgressBar } from "@/components/ProgressBar";
import { ResetCountdown } from "@/components/ResetCountdown";
import { TaskCard } from "@/components/TaskCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEstimatedXp, getProgress, getRecommendedTasks } from "@/lib/task-utils";
import { useTrackerStore } from "@/lib/store/tracker-store";
import type { TaskTypeValue, TrackerSnapshot, UserSettingsView } from "@/lib/types";

interface TrackerBoardProps {
  type: TaskTypeValue;
  snapshot: TrackerSnapshot;
}

const pageCopy = {
  daily: {
    title: "Dailies",
    description: "Rotina diaria de ARR/patch 2.x com foco em XP, reputacao e seals.",
  },
  weekly: {
    title: "Weeklies",
    description: "Itens que resetam toda terca as 08:00 UTC e merecem acompanhamento continuo.",
  },
} as const;

export function TrackerBoard({ type, snapshot }: TrackerBoardProps) {
  const router = useRouter();
  const hydrate = useTrackerStore((state) => state.hydrate);
  const tasks = useTrackerStore((state) => state.tasks);
  const settings = useTrackerStore((state) => state.settings);
  const setTaskCompletion = useTrackerStore((state) => state.setTaskCompletion);
  const updateSettings = useTrackerStore((state) => state.updateSettings);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    hydrate(snapshot);
  }, [hydrate, snapshot]);

  const scopedTasks = useMemo(
    () => getRecommendedTasks(tasks, settings, type),
    [settings, tasks, type],
  );
  const progress = useMemo(() => getProgress(tasks, type), [tasks, type]);
  const estimatedXp = useMemo(() => getEstimatedXp(tasks, type), [tasks, type]);

  async function persistSettings(patch: Partial<UserSettingsView>) {
    const previous = settings;
    setErrorMessage(null);
    setIsSavingSettings(true);
    updateSettings(patch);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar configuracoes.");
      }

      router.refresh();
    } catch (error) {
      updateSettings(previous);
      setErrorMessage(error instanceof Error ? error.message : "Falha ao salvar configuracoes.");
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function handleToggle(taskId: string, completed: boolean) {
    setErrorMessage(null);
    setPendingIds((current) => [...current, taskId]);
    setTaskCompletion(taskId, completed);

    try {
      const response = await fetch(`/api/tasks/${taskId}/completion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel atualizar a task.");
      }

      router.refresh();
    } catch (error) {
      setTaskCompletion(taskId, !completed);
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel atualizar a task.");
    } finally {
      setPendingIds((current) => current.filter((id) => id !== taskId));
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <Card className="border-primary/20 bg-card/85">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{pageCopy[type].title}</Badge>
              <Badge variant="secondary">Timezone {settings.timezone}</Badge>
            </div>
            <CardTitle className="text-3xl">{pageCopy[type].title}</CardTitle>
            <p className="max-w-2xl text-sm text-muted-foreground">{pageCopy[type].description}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs
              value={type}
              onValueChange={(value) => router.push(value === "daily" ? "/dailies" : "/weeklies")}
            >
              <TabsList>
                <TabsTrigger value="daily">Dailies</TabsTrigger>
                <TabsTrigger value="weekly">Weeklies</TabsTrigger>
              </TabsList>
            </Tabs>
            <FiltersBar
              settings={settings}
              isSaving={isSavingSettings}
              onLevelChange={(level) => persistSettings({ currentLevel: level })}
              onJobChange={(job) => persistSettings({ currentJob: job })}
            />
            <ProgressBar
              label={`Progresso de ${pageCopy[type].title.toLowerCase()}`}
              completed={progress.completed}
              total={progress.total}
              helper={`XP estimada ja garantida neste reset: ${new Intl.NumberFormat("pt-BR").format(estimatedXp)} XP`}
            />
            {errorMessage ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {errorMessage}
              </p>
            ) : null}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <ResetCountdown reset={snapshot.resets.daily} />
          <ResetCountdown reset={snapshot.resets.weekly} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {scopedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            settings={settings}
            isPending={pendingIds.includes(task.id)}
            onToggle={(completed) => handleToggle(task.id, completed)}
          />
        ))}
      </div>
    </div>
  );
}
