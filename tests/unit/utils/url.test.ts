import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("extractTextFromUrl()", () => {
  beforeEach(() => vi.clearAllMocks());

  it("extrae texto de una página HTML", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "text/html" },
      text: async () =>
        "<html><body><p>Este es el contenido del artículo con suficiente texto para pasar la validación mínima requerida.</p></body></html>",
    });

    const { extractTextFromUrl } = await import("@/lib/utils/url");
    const result = await extractTextFromUrl("https://ejemplo.com");

    expect(result).toContain("contenido del artículo");
  });

  it("lanza error si la URL no es accesible", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { extractTextFromUrl } = await import("@/lib/utils/url");

    await expect(extractTextFromUrl("https://no-existe.xyz")).rejects.toThrow(
      "No se pudo acceder a la URL"
    );
  });

  it("lanza error si el servidor retorna 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: { get: () => "text/html" },
    });

    const { extractTextFromUrl } = await import("@/lib/utils/url");

    await expect(
      extractTextFromUrl("https://ejemplo.com/no-existe")
    ).rejects.toThrow("error 404");
  });
});
