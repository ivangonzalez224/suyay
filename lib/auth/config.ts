import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { loginSchema } from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validar con Zod antes de tocar la DB
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
          },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // En el primer login, `user` existe y guardamos el id
      if (user) {
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Pasamos el id del JWT a la sesión
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
