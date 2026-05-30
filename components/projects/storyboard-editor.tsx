"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle2, Clock } from "lucide-react";
import { SceneCard } from "./scene-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { saveScenesAction } from "@/lib/actions/project.actions";
import type { StoryboardData, Scene } from "@/types";

interface StoryboardEditorProps {
  projectId: string;
  initialStoryboard: StoryboardData;
}

export function StoryboardEditor({
  projectId,
  initialStoryboard,
}: StoryboardEditorProps) {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>(initialStoryboard.scenes);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calcular duración total
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const handleSceneChange = useCallback((index: number, updated: Scene) => {
    setScenes((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    // Limpiar estado de guardado al editar
    setSavedAt(null);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const result = await saveScenesAction(projectId, scenes);

    setIsSaving(false);

    if (!result.success) {
      setError(result.error ?? "Error al guardar");
      return;
    }

    setSavedAt(new Date());
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {initialStoryboard.summary}
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="text-muted-foreground flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>
            {totalDuration}s total · {scenes.length} escenas
          </span>
        </div>
      </div>

      {/* Lista de escenas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Escenas</h3>
          <p className="text-muted-foreground text-xs">
            Edita cada escena antes de generar el video
          </p>
        </div>

        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            onChange={(updated) => handleSceneChange(index, updated)}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Footer fijo */}
      <div className="bg-background sticky bottom-0 flex items-center justify-between gap-4 border-t pt-4 pb-2">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          {savedAt && (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                Guardado a las{" "}
                {savedAt.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
