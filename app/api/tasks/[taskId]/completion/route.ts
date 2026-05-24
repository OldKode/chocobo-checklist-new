import { TaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentResetPeriodKey } from "@/lib/reset-logic";

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } },
) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.completed !== "boolean") {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: params.taskId },
    select: { id: true, type: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Task nao encontrada." }, { status: 404 });
  }

  const resetType = task.type === TaskType.DAILY ? "daily" : "weekly";
  const resetPeriod = getCurrentResetPeriodKey(resetType, new Date());
  const now = new Date();

  await prisma.taskStatus.upsert({
    where: {
      taskId_resetPeriod: {
        taskId: task.id,
        resetPeriod,
      },
    },
    update: {
      completed: body.completed,
      completedAt: body.completed ? now : null,
    },
    create: {
      taskId: task.id,
      resetPeriod,
      completed: body.completed,
      completedAt: body.completed ? now : null,
    },
  });

  if (body.completed) {
    await prisma.completion.upsert({
      where: {
        taskId_resetPeriod: {
          taskId: task.id,
          resetPeriod,
        },
      },
      update: {
        completedAt: now,
      },
      create: {
        taskId: task.id,
        resetPeriod,
        completedAt: now,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/dailies");
  revalidatePath("/weeklies");

  return NextResponse.json({ ok: true, resetPeriod, completed: body.completed });
}
