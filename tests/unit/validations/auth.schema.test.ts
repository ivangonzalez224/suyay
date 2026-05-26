import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({
      email: "test@suyay.com",
      password: "Password1",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-email",
      password: "Password1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email inválido");
    }
  });

  it("rechaza contraseña corta", () => {
    const result = loginSchema.safeParse({
      email: "test@suyay.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Juan García",
    email: "juan@suyay.com",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("acepta datos válidos", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza contraseñas que no coinciden", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "Diferente1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Las contraseñas no coinciden"
      );
    }
  });

  it("rechaza contraseña sin mayúscula", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "password1",
      confirmPassword: "password1",
    });

    expect(result.success).toBe(false);
  });
});
