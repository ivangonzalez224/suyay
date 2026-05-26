import { describe, expect, it } from "vitest";

import { cn, formatDuration, getInitials, truncate } from "@/lib/utils";

describe("cn()", () => {
  it("combina clases sin conflictos de Tailwind", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("maneja clases condicionales", () => {
    expect(cn("base", false && "excluded", "included")).toBe("base included");
  });
});

describe("formatDuration()", () => {
  it("formatea segundos menores a 60", () => {
    expect(formatDuration(30)).toBe("30s");
  });

  it("formatea minutos exactos", () => {
    expect(formatDuration(60)).toBe("1m");
  });

  it("formatea minutos y segundos", () => {
    expect(formatDuration(90)).toBe("1m 30s");
  });
});

describe("truncate()", () => {
  it("no trunca textos cortos", () => {
    expect(truncate("Hola", 10)).toBe("Hola");
  });

  it("trunca y agrega puntos suspensivos", () => {
    expect(truncate("Texto largo de prueba", 10)).toBe("Texto larg...");
  });
});

describe("getInitials()", () => {
  it("obtiene iniciales de nombre completo", () => {
    expect(getInitials("Juan García")).toBe("JG");
  });

  it("retorna máximo 2 caracteres", () => {
    expect(getInitials("Juan Carlos García López")).toBe("JC");
  });
});
