import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock OpenAI antes de cualquier import que lo use
const mockCreate = vi.fn();
vi.mock("openai", () => {
  class MockOpenAI {
    chat = { completions: { create: mockCreate } };
    constructor(_config: unknown) {}
  }
  return { default: MockOpenAI };
});

vi.mock("@/lib/db/client", () => ({
  prisma: {
    project: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    storyboard: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("dotenv/config", () => ({}));

const mockScene = {
  id: "scene_1",
  order: 1,
  title: "Intro",
  script: "Texto de prueba",
  visualPrompt: "Visual de prueba",
  duration: 8,
  caption: "Caption",
};

describe("StoryboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("retorna null si no existe storyboard", async () => {
    const { prisma } = await import("@/lib/db/client");
    vi.mocked(prisma.storyboard.findUnique).mockResolvedValueOnce(null);

    const { StoryboardService } =
      await import("@/lib/services/storyboard.service");

    const result = await StoryboardService.getByProjectId("proj_1");
    expect(result).toBeNull();
  });

  it("retorna el storyboard si existe", async () => {
    const { prisma } = await import("@/lib/db/client");
    vi.mocked(prisma.storyboard.findUnique).mockResolvedValueOnce({
      id: "sb_1",
      projectId: "proj_1",
      summary: "Resumen de prueba",
      script: "Guion completo",
      scenes: [mockScene],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const { StoryboardService } =
      await import("@/lib/services/storyboard.service");

    const result = await StoryboardService.getByProjectId("proj_1");
    expect(result).not.toBeNull();
    expect(result?.summary).toBe("Resumen de prueba");
    expect(result?.scenes).toHaveLength(1);
  });

  it("lanza error si el proyecto no tiene contenido", async () => {
    const { prisma } = await import("@/lib/db/client");
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
      id: "proj_1",
      title: "Test",
      platform: "TIKTOK",
      duration: 60,
      inputText: null,
      inputType: null,
      status: "DRAFT",
    } as never);

    const { StoryboardService } =
      await import("@/lib/services/storyboard.service");

    await expect(StoryboardService.generateAndSave("proj_1")).rejects.toThrow(
      "no tiene contenido"
    );
  });
});
