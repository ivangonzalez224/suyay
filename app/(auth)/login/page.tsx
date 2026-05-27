import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión — Suyay",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
