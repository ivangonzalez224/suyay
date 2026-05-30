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

export const contentInputSchema = z.discriminatedUnion("inputType", [
  z.object({
    inputType: z.literal("TEXT"),
    inputText: z
      .string()
      .min(50, "El texto debe tener al menos 50 caracteres")
      .max(10000, "Máximo 10.000 caracteres"),
  }),
  z.object({
    inputType: z.literal("URL"),
    inputUrl: z
      .string()
      .min(1, "La URL es requerida")
      .url("Ingresa una URL válida"),
  }),
  z.object({
    inputType: z.literal("PDF"),
    inputText: z
      .string()
      .min(50, "El PDF debe contener al menos 50 caracteres de texto"),
  }),
]);

export type ContentInputData = z.infer<typeof contentInputSchema>;
