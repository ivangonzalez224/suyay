import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("settings");

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title={t("title")} description={t("description")} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile")}</CardTitle>
          <CardDescription>{t("profileDesc")}</CardDescription>
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
              <p className="text-muted-foreground mb-1 text-xs">{t("plan")}</p>
              <Badge variant="secondary">{user.plan}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                {t("credits")}
              </p>
              <p className="text-sm font-medium">{user.credits}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                {t("totalProjects")}
              </p>
              <p className="text-sm font-medium">{user._count.projects}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs">
                {t("memberSince")}
              </p>
              <p className="text-sm font-medium">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("planSection")}</CardTitle>
          <CardDescription>{t("planDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Plan {user.plan}</p>
              <p className="text-muted-foreground text-sm">
                {user.credits} {t("credits").toLowerCase()}
              </p>
            </div>
            <Badge variant={user.plan === "FREE" ? "secondary" : "default"}>
              {user.plan === "FREE" ? t("free") : user.plan}
            </Badge>
          </div>
          {user.plan === "FREE" && (
            <p className="text-muted-foreground mt-3 text-xs">
              {t("upgradeDesc")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
