import { describe, it, expect } from "vitest";
import { createProjectSchema } from "@/lib/validations/project.schema";

describe("createProjectSchema", () => {
  const valid = {
    title: "Mi primer video",
    platform: "TIKTOK",
    duration: 60,
  };

  it("acepta datos válidos", () => {
    expect(createProjectSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza título muy corto", () => {
    const result = createProjectSchema.safeParse({ ...valid, title: "ab" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Mínimo 3 caracteres");
  });

  it("rechaza plataforma inválida", () => {
    const result = createProjectSchema.safeParse({
      ...valid,
      platform: "YOUTUBE",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza duración menor a 15", () => {
    const result = createProjectSchema.safeParse({ ...valid, duration: 10 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Mínimo 15 segundos");
  });

  it("rechaza duración mayor a 180", () => {
    const result = createProjectSchema.safeParse({ ...valid, duration: 200 });
    expect(result.success).toBe(false);
  });
});
