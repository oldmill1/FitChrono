-- CreateTable
CREATE TABLE "WorkoutEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL,

    CONSTRAINT "WorkoutEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_workout_entry_user" ON "WorkoutEntry"("userId");

-- CreateIndex
CREATE INDEX "idx_workout_entry_workout" ON "WorkoutEntry"("workoutId");

-- AddForeignKey
ALTER TABLE "WorkoutEntry" ADD CONSTRAINT "WorkoutEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutEntry" ADD CONSTRAINT "WorkoutEntry_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
