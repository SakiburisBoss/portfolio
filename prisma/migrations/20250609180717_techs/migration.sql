-- CreateTable
CREATE TABLE "Techs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Techs_pkey" PRIMARY KEY ("id")
);
