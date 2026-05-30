"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, RefreshCw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateStoryboardAction } from "@/lib/actions/project.actions";

interface GenerateStoryboardButtonProps {
  projectId: string;
  hasContent: boolean;
  hasStoryboard: boolean;
  projectStatus: string;
}

export function GenerateStoryboardButton({
  projectId,
  hasContent,
  hasStoryboard,
  projectStatus,
}: GenerateStoryboardButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(
    projectStatus === "PROCESSING"
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const result = await generateStoryboardAction(projectId);

    if (!result.success) {
      setError(result.error ?? "Error al generar el storyboard");
      setIsGenerating(false);
      return;
    }

    router.push(`/projects/${projectId}/storyboard`);
    router.refresh();
  };

  const handleEdit = () => {
    router.push(`/projects/${projectId}/storyboard`);
  };

  // Sin contenido todavía
  if (!hasContent) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground text-sm">
            Primero agrega y guarda el contenido del paso anterior.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardContent className="py-4">
          <p className="text-muted-foreground text-sm">
            {hasStoryboard
              ? "Tu storyboard ya fue generado. Puedes editarlo o regenerarlo desde cero."
              : "La IA analizará tu contenido y generará un resumen, guion y escenas editables adaptados a la plataforma y duración que elegiste."}
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        {/* Botón principal: editar si existe, generar si no */}
        {hasStoryboard ? (
          <Button onClick={handleEdit} className="flex-1 gap-2" size="lg">
            <Pencil className="h-4 w-4" />
            Editar storyboard
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando storyboard...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generar storyboard con IA
              </>
            )}
          </Button>
        )}

        {/* Botón secundario: regenerar (solo si ya existe) */}
        {hasStoryboard && (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
