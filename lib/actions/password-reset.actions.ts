"use server";

import { PasswordResetService } from "@/lib/services/password-reset.service";
import { EmailService } from "@/lib/services/email.service";
import { getLocale } from "@/i18n/navigation";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function requestPasswordResetAction(
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const locale = await getLocale();

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return {
      success: false,
      error: locale === "es" ? "Email inválido" : "Invalid email",
    };
  }

  try {
    const token = await PasswordResetService.createResetToken(email);

    // Si el usuario no existe, retornamos éxito igualmente
    // para no revelar qué emails están registrados
    if (!token) return { success: true };

    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true },
    });

    await EmailService.sendPasswordReset({
      to: email,
      name: user?.name ?? "Usuario",
      token,
      locale,
    });

    return { success: true };
  } catch (error) {
    console.error("[PasswordReset] Error:", error);
    return {
      success: false,
      error:
        locale === "es"
          ? "Error al enviar el email. Intenta de nuevo."
          : "Error sending email. Please try again.",
    };
  }
}

export async function resetPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const locale = await getLocale();

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return {
      success: false,
      error:
        locale === "es"
          ? "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
          : "Password must have at least 8 characters, one uppercase, one lowercase and one number",
    };
  }

  try {
    const success = await PasswordResetService.resetPassword(token, password);

    if (!success) {
      return {
        success: false,
        error:
          locale === "es"
            ? "El enlace es inválido o ha expirado"
            : "The link is invalid or has expired",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error:
        locale === "es"
          ? "Error al restablecer la contraseña"
          : "Error resetting password",
    };
  }
}
