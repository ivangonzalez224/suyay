import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("dotenv/config", () => ({}));

// Crear el mock de create fuera para poder accederlo
const mockCreate = vi.fn();

vi.mock("openai", () => {
  class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
    constructor(_config: unknown) {}
  }

  return { default: MockOpenAI };
});

const validScene = {
  id: "scene_1",
  order: 1,
  title: "Introducción",
  script: "Las plantas usan la luz del sol",
  visualPrompt: "Planta verde con luz solar",
  duration: 8,
  caption: "¿Cómo comen las plantas?",
};

const validResponse = {
  summary: "Un video sobre fotosíntesis",
  script: "La fotosíntesis es el proceso...",
  scenes: [validScene],
};

describe("OpenAIService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpiar caché del módulo para que use el mock fresco
    vi.resetModules();
  });

  it("parsea una respuesta JSON válida", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(validResponse) } }],
    });

    const { OpenAIService } = await import("@/lib/services/openai.service");

    const result = await OpenAIService.generateStoryboard({
      content:
        "La fotosíntesis es el proceso por el cual las plantas producen alimento usando la luz solar.",
      platform: "TIKTOK",
      duration: 60,
      projectTitle: "Fotosíntesis",
    });

    expect(result.summary).toBe("Un video sobre fotosíntesis");
    expect(result.scenes).toHaveLength(1);
    expect(result.scenes[0].title).toBe("Introducción");
  });

  it("limpia backticks de markdown en la respuesta", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: `\`\`\`json\n${JSON.stringify(validResponse)}\n\`\`\``,
          },
        },
      ],
    });

    const { OpenAIService } = await import("@/lib/services/openai.service");

    const result = await OpenAIService.generateStoryboard({
      content: "Contenido de prueba con suficiente texto para el test.",
      platform: "REELS",
      duration: 30,
      projectTitle: "Test",
    });

    expect(result.summary).toBe("Un video sobre fotosíntesis");
    expect(result.scenes[0].id).toBe("scene_1");
  });

  it("lanza error si OpenAI no retorna contenido", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    const { OpenAIService } = await import("@/lib/services/openai.service");

    await expect(
      OpenAIService.generateStoryboard({
        content: "Contenido de prueba.",
        platform: "SHORTS",
        duration: 30,
        projectTitle: "Test",
      })
    ).rejects.toThrow("OpenAI no retornó contenido");
  });
});
