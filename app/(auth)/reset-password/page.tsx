import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { PasswordResetService } from "@/lib/services/password-reset.service";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva contraseña — Suyay",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) redirect("/forgot-password");

  const { valid } = await PasswordResetService.validateToken(token);
  if (!valid) redirect("/forgot-password?expired=1");

  return <ResetPasswordForm token={token} />;
}
