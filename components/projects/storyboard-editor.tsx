"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle2, Clock, Film } from "lucide-react";
import { SceneCard } from "./scene-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { saveScenesAction } from "@/lib/actions/project.actions";
import type { StoryboardData, Scene } from "@/types";
import { Mic } from "lucide-react";
import {
  generateVoiceAction,
  renderVideoAction,
} from "@/lib/actions/render.actions";

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
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceSuccess, setVoiceSuccess] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);

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

  const handleGenerateVoice = async () => {
    // Primero guardar los cambios actuales
    await handleSave();

    setIsGeneratingVoice(true);
    setVoiceSuccess(false);

    const result = await generateVoiceAction(projectId);

    setIsGeneratingVoice(false);

    if (!result.success) {
      setError(result.error ?? "Error al generar la voz");
      return;
    }

    setVoiceSuccess(true);
  };

  const handleRender = async () => {
    setIsRendering(true);
    setError(null);

    const result = await renderVideoAction(projectId);

    setIsRendering(false);

    if (!result.success) {
      setError(result.error ?? "Error al renderizar");
      return;
    }

    setRenderUrl(result.videoUrl ?? null);
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
      <div className="bg-background sticky bottom-0 space-y-3 border-t pt-4 pb-2">
        {/* Mensajes de estado */}
        <div className="flex min-h-5 items-center gap-2 text-xs">
          {savedAt && !voiceSuccess && !renderUrl && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                Guardado a las{" "}
                {savedAt.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
          {voiceSuccess && !renderUrl && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                Voz generada — ahora puedes renderizar el video
              </span>
            </>
          )}
          {renderUrl && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                Video listo —{" "}
                <a
                  href={renderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  previsualizar
                </a>
              </span>
            </>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Guardar */}
          <Button
            onClick={handleSave}
            disabled={isSaving || isGeneratingVoice || isRendering}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Guardar
          </Button>

          {/* Generar voz */}
          <Button
            onClick={handleGenerateVoice}
            disabled={isSaving || isGeneratingVoice || isRendering}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isGeneratingVoice ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Mic className="h-3.5 w-3.5" />
            )}
            {isGeneratingVoice ? "Generando voz..." : "Generar voz"}
          </Button>

          {/* Renderizar */}
          <Button
            onClick={handleRender}
            disabled={isSaving || isGeneratingVoice || isRendering}
            size="sm"
            className="gap-2"
          >
            {isRendering ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Film className="h-3.5 w-3.5" />
            )}
            {isRendering
              ? "Renderizando..."
              : renderUrl
                ? "Re-renderizar"
                : "Renderizar video"}
          </Button>
        </div>
      </div>
    </div>
  );
}
