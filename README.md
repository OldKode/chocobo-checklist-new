# Chocobo Checklist

Tracker pessoal para tarefas diarias e semanais de Final Fantasy XIV, focado em ARR / patch 2.x com suporte a resets oficiais do jogo em UTC.

## Stack

- Next.js 14 + App Router + TypeScript
- Tailwind CSS com componentes estilo shadcn/ui
- Prisma + SQLite
- date-fns + date-fns-tz
- Zustand

## Como rodar

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Scripts uteis

- `npm run dev` - sobe o app localmente
- `npm run build` - gera o client do Prisma e builda o app
- `npm run test` - roda os testes da logica de reset
- `npm run db:push` - aplica o schema no SQLite local
- `npm run db:seed` - popula as tasks iniciais do MVP

## Estrutura principal

- `app/` - paginas do dashboard, dailies, weeklies e API routes
- `components/` - cards, countdown, progress bars e primitives UI
- `lib/reset-logic.ts` - regras de reset diario e semanal
- `prisma/schema.prisma` - modelos Task, Completion, TaskStatus e UserSettings
- `prisma/seed.ts` - seed inicial com conteudo ARR / early HW
