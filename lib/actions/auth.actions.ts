"use server";

import { registerSchema } from "@/lib/validations/auth.schema";
import { UserService } from "@/lib/services/user.service";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function registerAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0].message;
    return { success: false, error: firstError };
  }

  try {
    await UserService.createUser(parsed.data);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error inesperado al crear la cuenta" };
  }
}
