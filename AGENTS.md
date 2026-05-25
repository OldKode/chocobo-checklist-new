# Chocobo Checklist

FFXIV daily/weekly task tracker built with Next.js 14 + Prisma + SQLite.

## Cursor Cloud specific instructions

### Environment setup

A `.env` file is required at the workspace root with `DATABASE_URL="file:./prisma/dev.db"`. The Prisma config (`prisma.config.ts`) reads this variable at generation time; without it, `prisma generate` and `npm install` (which triggers postinstall → prisma generate) will fail.

If the database does not exist or is empty after `npm run db:push`, seed it with `npm run db:seed`.

### Running services

- **Dev server:** `npm run dev` → http://localhost:3000
- No external services (databases, Docker, Redis, etc.) are needed — SQLite is file-based.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Lint | `npm run lint` |
| Test | `npm run test` |
| Dev server | `npm run dev` |
| Apply schema | `npm run db:push` |
| Seed data | `npm run db:seed` |

### Gotchas

- The `DATABASE_URL` in `.env` must be `file:./prisma/dev.db` (relative to workspace root). Prisma CLI resolves the path relative to CWD, so this creates the DB at `/workspace/prisma/dev.db`. The runtime code in `lib/db.ts` also defaults to `file:./prisma/dev.db` when no env var is set.
- The `postinstall` script runs `prisma generate`, which requires `DATABASE_URL` to be set. Create the `.env` file before running `npm install`.
- After `npm run db:push`, always verify the DB has tables before running the app. If tables are missing, re-run `npm run db:push`.
