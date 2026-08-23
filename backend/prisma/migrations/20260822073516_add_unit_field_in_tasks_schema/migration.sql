/*
  Warnings:

  - Added the required column `unit` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "unit" TEXT NOT NULL;
