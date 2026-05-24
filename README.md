# Chocobo Checklist

Tracker pessoal para tarefas diarias e semanais de Final Fantasy XIV, focado em ARR / patch 2.x com suporte a resets oficiais do jogo em UTC.

## Stack

- Next.js 14 + App Router + TypeScript
- Tailwind CSS com componentes estilo shadcn/ui
- Prisma ORM 7
- Neon Postgres
- date-fns + date-fns-tz
- Zustand

## Setup local

1. Clone o repo
2. Rode `npm install`
3. Crie um banco no Neon: https://neon.tech
4. Copie a connection string pooled e a direta para `.env.local`:

   ```bash
   DATABASE_URL="postgresql://...-pooler...?...sslmode=require"
   DIRECT_URL="postgresql://...?...sslmode=require"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

5. Rode `npm run db:migrate -- --name init` para criar/aplicar as tabelas no banco
6. Rode `npm run db:seed` para popular as tasks iniciais
7. Rode `npm run dev`

## Deploy na Vercel

1. Importe o repositório em https://vercel.com/new
2. Em **Environment Variables**, adicione:
   - `DATABASE_URL` - connection string pooled do Neon
   - `DIRECT_URL` - connection string direta do Neon para migrations
   - `NEXT_PUBLIC_APP_URL` - URL publica final do app
3. Faça o deploy inicial
4. A cada `git push` para a branch `main`, o deploy acontece automaticamente

## Banco de dados

- Provider: **Neon Postgres** (serverless, tier gratis)
- Migrations versionadas em `prisma/migrations/`
- Para criar uma nova migration: `npm run db:migrate -- --name nome_da_migration`
- Use a connection string com `-pooler` no host em `DATABASE_URL` para runtime serverless
- Use a connection string direta, sem `-pooler`, em `DIRECT_URL` para Prisma CLI, migrations e Studio

## Scripts uteis

- `npm run dev` - sobe o app localmente
- `npm run build` - gera o client Prisma, roda `prisma migrate deploy` e builda o app
- `npm run test` - roda os testes da logica de reset
- `npm run db:push` - sincroniza o schema com o banco configurado
- `npm run db:migrate -- --name nome_da_migration` - cria uma migration versionada
- `npm run db:seed` - popula tasks e settings sem duplicar dados
- `npm run db:studio` - abre o Prisma Studio

## Health check

Depois do deploy, valide rapidamente se a aplicacao e o banco responderam em:

```bash
GET /api/health
```

Resposta esperada:

```json
{ "status": "ok", "db": "connected" }
```

## Estrutura principal

- `app/` - paginas do dashboard, dailies, weeklies e API routes
- `components/` - cards, countdown, progress bars e primitives UI
- `lib/reset-logic.ts` - regras de reset diario e semanal
- `prisma/schema.prisma` - modelos Task, Completion, TaskStatus e UserSettings
- `prisma/seed.ts` - seed inicial com conteudo ARR / early HW
