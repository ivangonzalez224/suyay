import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de Prisma
vi.mock("@/lib/db/client", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

// Mock de dotenv
vi.mock("dotenv/config", () => ({}));

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna status ok cuando la DB responde", async () => {
    const { prisma } = await import("@/lib/db/client");
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ "?column?": 1 }]);

    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.services.database).toBe("ok");
    expect(data.timestamp).toBeDefined();
  });

  it("retorna status error cuando la DB falla", async () => {
    const { prisma } = await import("@/lib/db/client");
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(
      new Error("Connection refused")
    );

    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("error");
    expect(data.services.database).toBe("error");
  });
});
