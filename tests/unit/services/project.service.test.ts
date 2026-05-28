import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("dotenv/config", () => ({}));

describe("ProjectService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("crea un proyecto correctamente", async () => {
    const { prisma } = await import("@/lib/db/client");
    const { ProjectService } = await import("@/lib/services/project.service");

    const mockProject = {
      id: "proj_1",
      title: "Test Video",
      platform: "TIKTOK" as const,
      duration: 60,
      userId: "user_1",
      status: "DRAFT" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.project.create).mockResolvedValueOnce(
      mockProject as never
    );

    const result = await ProjectService.createProject({
      title: "Test Video",
      platform: "TIKTOK",
      duration: 60,
      userId: "user_1",
    });

    expect(result.id).toBe("proj_1");
    expect(prisma.project.create).toHaveBeenCalledOnce();
  });

  it("lanza error si el proyecto no pertenece al usuario", async () => {
    const { prisma } = await import("@/lib/db/client");
    const { ProjectService } = await import("@/lib/services/project.service");

    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null);

    await expect(
      ProjectService.deleteProject("proj_1", "otro_user")
    ).rejects.toThrow("Proyecto no encontrado");
  });
});
