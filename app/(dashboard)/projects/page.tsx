import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos — Suyay",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Proyectos" description="Tus videos generados con IA.">
        <Button disabled className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo proyecto
        </Button>
      </PageHeader>

      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
              <Video className="h-7 w-7 text-violet-500" />
            </div>
            <p className="font-medium">No tienes proyectos todavía</p>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              En la Fase 2 podrás pegar texto, artículos o URLs y convertirlos
              en videos cortos editables.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
