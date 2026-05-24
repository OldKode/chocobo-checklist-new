"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResetDisplay } from "@/lib/reset-logic";
import type { ResetDisplay } from "@/lib/types";

interface ResetCountdownProps {
  reset: ResetDisplay;
}

const labels = {
  daily: "Daily reset",
  weekly: "Weekly reset",
} as const;

export function ResetCountdown({ reset }: ResetCountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const liveReset = useMemo(
    () => getResetDisplay(reset.type, reset.timezone, now),
    [now, reset.timezone, reset.type],
  );

  return (
    <Card className="border-primary/20 bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">{labels[reset.type]}</CardTitle>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {liveReset.timezone}
          </p>
        </div>
        <CalendarClock className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">em {liveReset.countdownLabel}</p>
        <p className="mt-2 text-sm text-muted-foreground">Proximo reset local: {liveReset.nextResetLabel}</p>
      </CardContent>
    </Card>
  );
}
