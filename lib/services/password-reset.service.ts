import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";

const TOKEN_EXPIRY_HOURS = 1;

export class PasswordResetService {
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static async createResetToken(email: string): Promise<string | null> {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) return null;

    // Eliminar tokens anteriores del mismo email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    const token = PasswordResetService.generateToken();
    const expiresAt = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    return token;
  }

  static async validateToken(
    token: string
  ): Promise<{ valid: boolean; email?: string }> {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record) return { valid: false };
    if (record.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return { valid: false };
    }

    return { valid: true, email: record.email };
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    const { valid, email } = await PasswordResetService.validateToken(token);

    if (!valid || !email) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Eliminar el token usado
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    return true;
  }
}
