import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db/client";
import type { RegisterInput } from "@/lib/validations/auth.schema";

export class UserService {
  static async createUser(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("Este email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  static async getUserWithStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        credits: true,
        createdAt: true,

        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }
}
