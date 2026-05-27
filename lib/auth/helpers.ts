import { auth } from "./config";
import { redirect } from "next/navigation";

/**
 * Retorna la sesión actual o redirige a /login.
 * Usar en Server Components protegidos.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Retorna la sesión sin redirigir.
 * Útil para páginas que funcionan con o sin auth.
 */
export async function getSession() {
  return auth();
}

/**
 * Retorna solo el ID del usuario autenticado o redirige.
 */
export async function requireUserId(): Promise<string> {
  const session = await requireAuth();
  return session.user.id!;
}
