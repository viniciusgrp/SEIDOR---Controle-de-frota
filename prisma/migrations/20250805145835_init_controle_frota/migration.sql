-- CreateTable
CREATE TABLE "automoveis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "motoristas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "utilizacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataTermino" DATETIME,
    "motivo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "automovelId" TEXT NOT NULL,
    CONSTRAINT "utilizacoes_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "motoristas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "utilizacoes_automovelId_fkey" FOREIGN KEY ("automovelId") REFERENCES "automoveis" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "automoveis_placa_key" ON "automoveis"("placa");
