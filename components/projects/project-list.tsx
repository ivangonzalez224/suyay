import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/types";

const statusLabel: Record<
  string,
  {
    label: string;
    variant: "secondary" | "default" | "destructive" | "outline";
  }
> = {
  DRAFT: { label: "Borrador", variant: "secondary" },
  PROCESSING: { label: "Procesando", variant: "default" },
  READY_TO_EDIT: { label: "Listo", variant: "default" },
  RENDERING: { label: "Renderizando", variant: "default" },
  COMPLETED: { label: "Completado", variant: "default" },
  FAILED: { label: "Error", variant: "destructive" },
};

const platformLabel: Record<string, string> = {
  TIKTOK: "TikTok",
  REELS: "Reels",
  SHORTS: "Shorts",
};

interface ProjectListProps {
  projects: ProjectSummary[];
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
              <Video className="h-7 w-7 text-violet-500" />
            </div>
            <p className="font-medium">No tienes proyectos todavía</p>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Crea tu primer proyecto para empezar a generar videos con IA.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const status = statusLabel[project.status];
        return (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="h-full cursor-pointer transition-colors hover:border-violet-500/50">
              <CardContent className="pt-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm leading-snug font-medium">
                    {project.title}
                  </h3>
                  <ArrowRight className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                  {project.platform && (
                    <Badge variant="outline" className="text-xs">
                      {platformLabel[project.platform]}
                    </Badge>
                  )}
                  {project.duration && (
                    <Badge variant="outline" className="text-xs">
                      {formatDuration(project.duration)}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  {formatDate(project.updatedAt)}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
