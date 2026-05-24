"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isTankJob } from "@/lib/jobs";
import { formatReward, getTaskLockReason } from "@/lib/task-utils";
import type { TaskViewModel, UserSettingsView } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskViewModel;
  settings: UserSettingsView;
  isPending: boolean;
  onToggle: (completed: boolean) => void;
}

export function TaskCard({ task, settings, isPending, onToggle }: TaskCardProps) {
  const lockReason = getTaskLockReason(task, settings);
  const rewards = [
    formatReward(task.xpReward, "XP"),
    formatReward(task.goldReward, "gil"),
    formatReward(task.tomestones, "tomes"),
    formatReward(task.seals, "seals"),
  ].filter(Boolean) as string[];
  const showTankBonus = task.adventurerInNeedBonus && isTankJob(settings.currentJob);

  return (
    <Card className={cn("transition-all", lockReason ? "opacity-60" : "hover:border-primary/40")}> 
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.isCompleted}
            disabled={Boolean(lockReason) || isPending}
            onCheckedChange={(checked) => onToggle(Boolean(checked))}
            aria-label={`Marcar ${task.name}`}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base sm:text-lg">{task.name}</CardTitle>
              <Badge variant="secondary">{task.categoryLabel}</Badge>
              <Badge variant={task.priority === "high" ? "warning" : "outline"}>
                {task.priority === "high" ? "Prioridade alta" : `Nivel ${task.minLevel}+`}
              </Badge>
              {task.isCompleted ? <Badge variant="success">Concluida</Badge> : null}
              {showTankBonus ? <Badge>Adventurer in Need</Badge> : null}
            </div>
            <p className="text-sm text-muted-foreground">{task.description}</p>
            {lockReason ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help">
                      Bloqueada
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{lockReason}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {rewards.map((reward) => (
            <Badge key={reward} variant="outline">
              {reward}
            </Badge>
          ))}
          {task.requiredJobGroup === "crafter_gatherer" ? (
            <Badge variant="secondary">Requer DoH/DoL</Badge>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {lockReason ? lockReason : "Disponivel neste reset atual."}
          </p>
          <Button asChild variant="link" size="sm">
            <a href={task.infoUrl}>Como fazer?</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
