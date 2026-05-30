import { notFound } from "next/navigation";
import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";
import { PageHeader } from "@/components/shared/page-header";
import { ContentInput } from "@/components/projects/content-input";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyecto — Suyay",
};

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: string, userId: string) {
  try {
    return await ProjectService.getProjectById(id, userId);
  } catch {
    return null;
  }
}

const platformLabel: Record<string, string> = {
  TIKTOK: "TikTok",
  REELS: "Reels",
  SHORTS: "Shorts",
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const userId = await requireUserId();
  const project = await getProject(id, userId);

  if (!project) notFound();

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title={project.title}
        description="Agrega el contenido que quieres convertir en video."
      >
        <div className="flex items-center gap-2">
          {project.platform && (
            <Badge variant="outline">{platformLabel[project.platform]}</Badge>
          )}
          {project.duration && (
            <Badge variant="outline">{formatDuration(project.duration)}</Badge>
          )}
        </div>
      </PageHeader>

      <ContentInput project={project} />
    </div>
  );
}
