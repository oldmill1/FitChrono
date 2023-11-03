/*
  Warnings:

  - A unique constraint covering the columns `[userId,workoutId]` on the table `WorkoutDefaults` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkoutDefaults_userId_workoutId_key" ON "WorkoutDefaults"("userId", "workoutId");
