import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta — Suyay",
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
