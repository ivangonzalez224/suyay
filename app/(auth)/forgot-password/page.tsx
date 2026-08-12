import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olvidé mi contraseña — Suyay",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
