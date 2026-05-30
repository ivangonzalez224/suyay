import { notFound } from "next/navigation";
import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";
import { StoryboardService } from "@/lib/services/storyboard.service";
import { PageHeader } from "@/components/shared/page-header";
import { ContentInput } from "@/components/projects/content-input";
import { GenerateStoryboardButton } from "@/components/projects/generate-storyboard-button";
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

const statusLabel: Record<string, string> = {
  DRAFT: "Borrador",
  PROCESSING: "Procesando...",
  READY_TO_EDIT: "Listo para editar",
  RENDERING: "Renderizando",
  COMPLETED: "Completado",
  FAILED: "Error",
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const userId = await requireUserId();
  const project = await getProject(id, userId);

  if (!project) notFound();

  const storyboard = await StoryboardService.getByProjectId(id);
  const hasContent = !!project.inputText;
  const hasStoryboard = !!storyboard;

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title={project.title}
        description="Agrega contenido y genera tu storyboard con IA."
      >
        <div className="flex items-center gap-2">
          {project.platform && (
            <Badge variant="outline">{platformLabel[project.platform]}</Badge>
          )}
          {project.duration && (
            <Badge variant="outline">{formatDuration(project.duration)}</Badge>
          )}
          <Badge variant="secondary">{statusLabel[project.status]}</Badge>
        </div>
      </PageHeader>

      {/* Paso 1: Contenido */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
            1
          </div>
          <h2 className="font-semibold">Contenido</h2>
          {hasContent && (
            <Badge
              variant="outline"
              className="border-green-500/30 text-xs text-green-600"
            >
              ✓ Guardado
            </Badge>
          )}
        </div>
        <ContentInput project={project} />
      </div>

      {/* Paso 2: Generar storyboard */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              hasContent
                ? "bg-violet-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <h2
            className={`font-semibold ${!hasContent && "text-muted-foreground"}`}
          >
            Generar storyboard con IA
          </h2>
          {hasStoryboard && (
            <Badge
              variant="outline"
              className="border-green-500/30 text-xs text-green-600"
            >
              ✓ Generado
            </Badge>
          )}
        </div>

        <GenerateStoryboardButton
          projectId={project.id}
          hasContent={hasContent}
          hasStoryboard={hasStoryboard}
          projectStatus={project.status}
        />
      </div>
    </div>
  );
}
