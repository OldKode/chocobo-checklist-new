import Link from "next/link";
import { Star } from "lucide-react";

import { ProgressBar } from "@/components/ProgressBar";
import { ResetCountdown } from "@/components/ResetCountdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstimatedXp, getProgress, getRecommendedTasks } from "@/lib/task-utils";
import type { TrackerSnapshot } from "@/lib/types";

interface TrackerDashboardProps {
  snapshot: TrackerSnapshot;
}

export function TrackerDashboard({ snapshot }: TrackerDashboardProps) {
  const dailyProgress = getProgress(snapshot.tasks, "daily");
  const weeklyProgress = getProgress(snapshot.tasks, "weekly");
  const estimatedDailyXp = getEstimatedXp(snapshot.tasks, "daily");
  const recommended = getRecommendedTasks(snapshot.tasks, snapshot.settings, "daily").slice(0, 4);
  const formatter = new Intl.NumberFormat("pt-BR");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <Card className="border-primary/20 bg-card/85">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Dashboard</Badge>
              <Badge variant="secondary">Nivel {snapshot.settings.currentLevel}</Badge>
              <Badge variant="secondary">{snapshot.settings.currentJob}</Badge>
            </div>
            <CardTitle className="text-3xl">FF14 Daily / Weekly Tracker</CardTitle>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Checklist pessoal focada no seu Warrior 58, no fim de ARR e inicio de Heavensward, com resets oficiais do FF14 calculados em UTC e exibidos no seu horario local.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <ProgressBar
                label="Dailies concluidas"
                completed={dailyProgress.completed}
                total={dailyProgress.total}
                helper={`XP diaria marcada: ${formatter.format(estimatedDailyXp)} XP`}
              />
              <ProgressBar
                label="Weeklies concluidas"
                completed={weeklyProgress.completed}
                total={weeklyProgress.total}
                helper="As weeklies resetam antes das dailies nas tercas-feiras."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dailies">Abrir dailies</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/weeklies">Abrir weeklies</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <ResetCountdown reset={snapshot.resets.daily} />
          <ResetCountdown reset={snapshot.resets.weekly} />
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Job atual: {snapshot.settings.currentJob}</p>
            <p>Nivel atual: {snapshot.settings.currentLevel}</p>
            <p>Timezone salva: {snapshot.settings.timezone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo do dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{dailyProgress.completed} dailies ja foram concluídas neste periodo.</p>
            <p>{formatter.format(estimatedDailyXp)} XP ja esta garantida pelas tasks marcadas.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lembrete semanal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Se voce marcar tudo na segunda a noite em Brasilia, as weeklies resetam primeiro na terca as 05:00.</p>
            <p>As dailies so resetam depois, no mesmo dia, ao meio-dia de Brasilia.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Prioridades recomendadas agora</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {recommended.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">{task.name}</CardTitle>
                  <Badge variant={task.isCompleted ? "success" : "default"}>
                    {task.isCompleted ? "Concluida" : task.categoryLabel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{task.description}</p>
                <div className="flex gap-3">
                  <Button asChild size="sm">
                    <Link href="/dailies">Ver na lista</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={task.infoUrl}>Como fazer?</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
