import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Chocobo Checklist",
  description: "FFXIV daily and weekly tracker with automatic UTC reset handling.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-border/60 bg-card/60 backdrop-blur">
            <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/" className="text-2xl font-semibold tracking-tight text-foreground">
                    Chocobo Checklist
                  </Link>
                  <Badge>FFXIV MVP</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Resets oficiais do FF14, checklist de ARR/patch 2.x e progresso do seu Warrior.
                </p>
              </div>
              <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
                <Link href="/dailies" className="transition-colors hover:text-foreground">
                  Dailies
                </Link>
                <Link href="/weeklies" className="transition-colors hover:text-foreground">
                  Weeklies
                </Link>
              </nav>
            </div>
          </header>
          <main className="container py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
