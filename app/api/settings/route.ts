import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { JOB_OPTIONS } from "@/lib/jobs";

const validJobs = new Set(JOB_OPTIONS as readonly string[]);

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 });
  }

  const data: { currentLevel?: number; currentJob?: string } = {};

  if (body.currentLevel !== undefined) {
    if (!Number.isInteger(body.currentLevel) || body.currentLevel < 1 || body.currentLevel > 100) {
      return NextResponse.json({ error: "Nivel invalido." }, { status: 400 });
    }

    data.currentLevel = body.currentLevel;
  }

  if (body.currentJob !== undefined) {
    if (typeof body.currentJob !== "string" || !validJobs.has(body.currentJob)) {
      return NextResponse.json({ error: "Job invalido." }, { status: 400 });
    }

    data.currentJob = body.currentJob;
  }

  const settings = await prisma.userSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: {
      id: "singleton",
      currentLevel: data.currentLevel ?? 58,
      currentJob: data.currentJob ?? "Warrior",
      timezone: "America/Sao_Paulo",
    },
  });

  revalidatePath("/");
  revalidatePath("/dailies");
  revalidatePath("/weeklies");

  return NextResponse.json(settings);
}
