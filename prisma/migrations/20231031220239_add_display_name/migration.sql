/*
  Warnings:

  - Added the required column `displayName` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "displayName" TEXT NOT NULL;
