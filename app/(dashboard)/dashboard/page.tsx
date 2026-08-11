import { getTranslations } from "next-intl/server";
import { requireAuth } from "@/lib/auth/helpers";
import { UserService } from "@/lib/services/user.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Zap, Video, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Suyay",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const user = await UserService.getUserWithStats(session.user.id!);
  const t = await getTranslations("dashboard");

  const stats = [
    {
      title: t("stats.projects"),
      value: user._count.projects,
      description: t("stats.projectsDesc"),
      icon: FolderOpen,
    },
    {
      title: t("stats.credits"),
      value: user.credits,
      description: `Plan ${user.plan}`,
      icon: Zap,
    },
    {
      title: t("stats.videos"),
      value: 0,
      description: t("stats.videosDesc"),
      icon: Video,
    },
    {
      title: t("stats.timeSaved"),
      value: "0h",
      description: t("stats.timeSavedDesc"),
      icon: Clock,
    },
  ];

  const firstName = user.name?.split(" ")[0] ?? "Usuario";

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("greeting", { name: firstName })}
        description={t("greetingDesc")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {title}
              </CardTitle>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("recentProjects")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
              <Video className="h-6 w-6 text-violet-500" />
            </div>
            <p className="text-sm font-medium">{t("noProjects")}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("noProjectsDesc")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
