import { requireAuth } from "@/lib/auth/helpers";
import { UserService } from "@/lib/services/user.service";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración — Suyay",
};

export default async function SettingsPage() {
  const session = await requireAuth();
  const user = await UserService.getUserWithStats(session.user.id!);

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Configuración"
        description="Administra tu cuenta y preferencias."
      />

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
          <CardDescription>Tu información de cuenta en Suyay.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-lg font-bold text-violet-600">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-2">
            <div>
              <p className="text-muted-foreground mb-1 text-xs">Plan actual</p>
              <Badge variant="secondary">{user.plan}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                Créditos disponibles
              </p>
              <p className="text-sm font-medium">{user.credits}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                Proyectos totales
              </p>
              <p className="text-sm font-medium">{user._count.projects}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                Miembro desde
              </p>
              <p className="text-sm font-medium">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan y créditos</CardTitle>
          <CardDescription>
            Los créditos se usan para generar videos con IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Plan {user.plan}</p>
              <p className="text-muted-foreground text-sm">
                {user.credits} créditos disponibles
              </p>
            </div>
            <Badge
              variant={user.plan === "FREE" ? "secondary" : "default"}
              className="capitalize"
            >
              {user.plan === "FREE" ? "Gratis" : user.plan}
            </Badge>
          </div>
          {user.plan === "FREE" && (
            <p className="text-muted-foreground mt-3 text-xs">
              Actualiza a Pro para obtener más créditos y funciones avanzadas.
              Disponible en una próxima versión.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
