import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.userSettings.findFirst({
      select: { id: true },
    });

    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Health check failed", error);
    return NextResponse.json({ status: "error", db: "disconnected" }, { status: 500 });
  }
}
