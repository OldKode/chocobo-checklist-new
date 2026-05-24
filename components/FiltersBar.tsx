"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JOB_OPTIONS } from "@/lib/jobs";
import type { UserSettingsView } from "@/lib/types";

interface FiltersBarProps {
  settings: UserSettingsView;
  onLevelChange: (level: number) => void;
  onJobChange: (job: string) => void;
  isSaving: boolean;
}

export function FiltersBar({ settings, onLevelChange, onJobChange, isSaving }: FiltersBarProps) {
  const levels = Array.from({ length: 90 }, (_, index) => index + 1);

  return (
    <div className="grid gap-3 rounded-xl border border-border/60 bg-card/70 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Nivel atual</p>
        <Select value={String(settings.currentLevel)} onValueChange={(value) => onLevelChange(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nivel" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={String(level)}>
                Nivel {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Job atual</p>
        <Select value={settings.currentJob} onValueChange={onJobChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o job" />
          </SelectTrigger>
          <SelectContent>
            {JOB_OPTIONS.map((job) => (
              <SelectItem key={job} value={job}>
                {job}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">{isSaving ? "Salvando preferencias..." : "Preferencias salvas no SQLite."}</p>
    </div>
  );
}
