import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // En Prisma 6+, cuando prisma.config.ts omite el .env,
  // pasamos la URL directamente para garantizar la conexión
  const datasourceUrl = process.env.DATABASE_URL;

  if (!datasourceUrl) {
    throw new Error("DATABASE_URL no está definida. Verifica tu archivo .env");
  }

  return new PrismaClient({
    datasourceUrl,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
