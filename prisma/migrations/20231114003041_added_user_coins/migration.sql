-- CreateTable
CREATE TABLE "UserCoins" (
    "user_id" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCoins_user_id_key" ON "UserCoins"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_coins" ON "UserCoins"("user_id");

-- AddForeignKey
ALTER TABLE "UserCoins" ADD CONSTRAINT "UserCoins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
