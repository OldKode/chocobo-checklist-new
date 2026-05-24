"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  label: string;
  completed: number;
  total: number;
  helper?: string;
}

export function ProgressBar({ label, completed, total, helper }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <p className="text-sm font-semibold text-foreground">
          {completed} de {total}
        </p>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
