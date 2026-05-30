"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
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

    // Redirigir al editor de storyboard (Paso 4)
    router.push(`/projects/${projectId}/storyboard`);
    router.refresh();
  };

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
            La IA analizará tu contenido y generará un <strong>resumen</strong>,{" "}
            <strong>guion</strong> y <strong>escenas editables</strong>{" "}
            adaptados a la plataforma y duración que elegiste.
          </p>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando storyboard...
          </>
        ) : hasStoryboard ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerar storyboard
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generar storyboard con IA
          </>
        )}
      </Button>
    </div>
  );
}
