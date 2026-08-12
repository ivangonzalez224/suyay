import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export class EmailService {
  static async sendPasswordReset(params: {
    to: string;
    name: string;
    token: string;
    locale: string;
  }): Promise<void> {
    const { to, name, token, locale } = params;
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;
    const isEs = locale === "es";

    const subject = isEs
      ? "Restablecer contraseña — Suyay"
      : "Reset your password — Suyay";

    const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090b; color: #fafafa; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background: #18181b; border-radius: 12px; border: 1px solid #27272a; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #27272a;">
              <p style="margin: 0; font-size: 20px; font-weight: 700; color: #fafafa; letter-spacing: -0.02em;">
                Suyay
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #fafafa; letter-spacing: -0.02em;">
                ${isEs ? `Hola, ${name}` : `Hi, ${name}`}
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; color: #a1a1aa; line-height: 1.6;">
                ${
                  isEs
                    ? "Recibimos una solicitud para restablecer la contraseña de tu cuenta en Suyay. Haz clic en el botón para continuar."
                    : "We received a request to reset the password for your Suyay account. Click the button below to continue."
                }
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: #7c3aed; border-radius: 8px;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 28px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; letter-spacing: -0.01em;">
                      ${isEs ? "Restablecer contraseña" : "Reset password"}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px; font-size: 13px; color: #71717a; line-height: 1.6;">
                ${
                  isEs
                    ? "Este enlace expira en 1 hora. Si no solicitaste este cambio, puedes ignorar este email."
                    : "This link expires in 1 hour. If you didn't request this, you can safely ignore this email."
                }
              </p>

              <!-- Fallback URL -->
              <p style="margin: 16px 0 0; font-size: 12px; color: #52525b;">
                ${isEs ? "O copia este enlace:" : "Or copy this link:"}
                <br>
                <a href="${resetUrl}" style="color: #a78bfa; word-break: break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #27272a;">
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                © ${new Date().getFullYear()} Suyay. 
                ${isEs ? "Todos los derechos reservados." : "All rights reserved."}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Error enviando email: ${error.message}`);
    }
  }
}
