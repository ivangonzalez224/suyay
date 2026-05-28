import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .min(3, "Mínimo 3 caracteres")
    .max(80, "Máximo 80 caracteres"),
  platform: z.enum(["TIKTOK", "REELS", "SHORTS"] as const, {
    error: "Selecciona una plataforma",
  }),
  duration: z
    .number({ error: "Selecciona una duración" })
    .int()
    .min(15, "Mínimo 15 segundos")
    .max(180, "Máximo 180 segundos"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
