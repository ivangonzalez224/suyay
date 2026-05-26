import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),

  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres"),

    email: z.string().min(1, "El email es requerido").email("Email inválido"),

    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe contener mayúscula, minúscula y número"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
