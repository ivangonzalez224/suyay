import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        services: {
          database: "ok",
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          database: "error",
        },
      },
      { status: 503 }
    );
  }
}
