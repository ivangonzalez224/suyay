import { getTranslations } from "next-intl/server";
import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectList } from "@/components/projects/project-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos — Suyay",
};

export default async function ProjectsPage() {
  const userId = await requireUserId();
  const projects = await ProjectService.getProjectsByUser(userId);
  const t = await getTranslations("projects");

  return (
    <div className="space-y-8">
      <PageHeader title={t("title")} description={t("description")}>
        <Button asChild className="gap-2">
          <Link href="/projects/new">
            <Plus className="h-4 w-4" />
            {t("newProject")}
          </Link>
        </Button>
      </PageHeader>

      <ProjectList projects={projects} />
    </div>
  );
}
