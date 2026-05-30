import { describe, it, expect } from "vitest";
import { contentInputSchema } from "@/lib/validations/project.schema";

describe("contentInputSchema", () => {
  it("acepta texto válido", () => {
    const result = contentInputSchema.safeParse({
      inputType: "TEXT",
      inputText: "A".repeat(50),
    });
    expect(result.success).toBe(true);
  });

  it("rechaza texto menor a 50 caracteres", () => {
    const result = contentInputSchema.safeParse({
      inputType: "TEXT",
      inputText: "Texto corto",
    });
    expect(result.success).toBe(false);
  });

  it("acepta URL válida", () => {
    const result = contentInputSchema.safeParse({
      inputType: "URL",
      inputUrl: "https://ejemplo.com/articulo",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza URL inválida", () => {
    const result = contentInputSchema.safeParse({
      inputType: "URL",
      inputUrl: "no-es-una-url",
    });
    expect(result.success).toBe(false);
  });
});
