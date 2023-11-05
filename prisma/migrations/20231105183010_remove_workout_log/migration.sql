/*
  Warnings:

  - You are about to drop the `WorkoutLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutLog" DROP CONSTRAINT "WorkoutLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutLog" DROP CONSTRAINT "WorkoutLog_workoutId_fkey";

-- DropTable
DROP TABLE "WorkoutLog";
