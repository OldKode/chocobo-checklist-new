-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('ROULETTE', 'BEAST_TRIBE', 'HUNT', 'GRAND_COMPANY', 'CHALLENGE_LOG', 'CRAFTING', 'OTHER');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "JobGroup" AS ENUM ('TANK', 'CRAFTER_GATHERER');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "minLevel" INTEGER NOT NULL DEFAULT 1,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "goldReward" INTEGER NOT NULL DEFAULT 0,
    "tomestones" INTEGER NOT NULL DEFAULT 0,
    "seals" INTEGER NOT NULL DEFAULT 0,
    "unlocked" BOOLEAN NOT NULL DEFAULT true,
    "unlockHint" TEXT,
    "infoUrl" TEXT NOT NULL DEFAULT '#',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "requiredJobGroup" "JobGroup",
    "adventurerInNeedBonus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Completion" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetPeriod" TEXT NOT NULL,

    CONSTRAINT "Completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStatus" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "resetPeriod" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "currentLevel" INTEGER NOT NULL DEFAULT 58,
    "currentJob" TEXT NOT NULL DEFAULT 'Warrior',
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_slug_key" ON "Task"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Completion_taskId_resetPeriod_key" ON "Completion"("taskId", "resetPeriod");

-- CreateIndex
CREATE UNIQUE INDEX "TaskStatus_taskId_resetPeriod_key" ON "TaskStatus"("taskId", "resetPeriod");

-- AddForeignKey
ALTER TABLE "Completion" ADD CONSTRAINT "Completion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStatus" ADD CONSTRAINT "TaskStatus_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

