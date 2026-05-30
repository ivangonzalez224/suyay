import { notFound } from "next/navigation";
import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";
import { StoryboardService } from "@/lib/services/storyboard.service";
import { StoryboardEditor } from "@/components/projects/storyboard-editor";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor de storyboard — Suyay",
};

interface Props {
  params: Promise<{ id: string }>;
}

async function getProjectAndStoryboard(id: string, userId: string) {
  try {
    const project = await ProjectService.getProjectById(id, userId);
    const storyboard = await StoryboardService.getByProjectId(id);
    return { project, storyboard };
  } catch {
    return null;
  }
}

const platformLabel: Record<string, string> = {
  TIKTOK: "TikTok",
  REELS: "Reels",
  SHORTS: "Shorts",
};

export default async function StoryboardPage({ params }: Props) {
  const { id } = await params;
  const userId = await requireUserId();
  const result = await getProjectAndStoryboard(id, userId);

  if (!result || !result.storyboard) notFound();

  const { project, storyboard } = result;

  return (
    <div className="space-y-6">
      {/* Nav */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${id}`} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al proyecto
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Editor de storyboard"
        description="Edita las escenas antes de generar el video."
      >
        <div className="flex items-center gap-2">
          {project.platform && (
            <Badge variant="outline">{platformLabel[project.platform]}</Badge>
          )}
          <Badge variant="secondary">{project.title}</Badge>
        </div>
      </PageHeader>

      <StoryboardEditor projectId={id} initialStoryboard={storyboard} />
    </div>
  );
}
