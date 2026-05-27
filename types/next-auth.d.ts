import type { DefaultSession } from "next-auth";

// Extiende el tipo Session para incluir el id del usuario
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
