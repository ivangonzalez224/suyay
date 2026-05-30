"use client";

import { useState } from "react";
import { GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Scene } from "@/types";

interface SceneCardProps {
  scene: Scene;
  index: number;
  onChange: (updated: Scene) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function SceneCard({
  scene,
  index,
  onChange,
  dragHandleProps,
}: SceneCardProps) {
  const [expanded, setExpanded] = useState(index === 0);

  const update = (field: keyof Scene, value: string | number) => {
    onChange({ ...scene, [field]: value });
  };

  return (
    <Card
      className={cn(
        "transition-shadow",
        expanded && "border-violet-500/30 shadow-md"
      )}
    >
      {/* Header de la escena */}
      <div
        className="flex cursor-pointer items-center gap-3 p-4 select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Número de escena */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-600">
          {scene.order}
        </div>

        {/* Título */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{scene.title}</p>
          {!expanded && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              {scene.script}
            </p>
          )}
        </div>

        {/* Duración */}
        <Badge variant="outline" className="shrink-0 text-xs">
          {scene.duration}s
        </Badge>

        {/* Toggle */}
        <div className="text-muted-foreground">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Contenido editable */}
      {expanded && (
        <CardContent className="space-y-4 border-t pt-0 pb-4">
          {/* Título */}
          <div className="space-y-1.5 pt-4">
            <Label className="text-xs">Título de la escena</Label>
            <Input
              value={scene.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Título corto descriptivo"
            />
          </div>

          {/* Guion */}
          <div className="space-y-1.5">
            <Label className="text-xs">
              Guion / Narración
              <span className="text-muted-foreground ml-1">
                (lo que se dice)
              </span>
            </Label>
            <Textarea
              value={scene.script}
              onChange={(e) => update("script", e.target.value)}
              placeholder="Texto que se narra en esta escena..."
              className="min-h-20 resize-none text-sm"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <Label className="text-xs">
              Caption
              <span className="text-muted-foreground ml-1">
                (texto en pantalla, máx. 8 palabras)
              </span>
            </Label>
            <Input
              value={scene.caption}
              onChange={(e) => update("caption", e.target.value)}
              placeholder="Caption corto e impactante"
              maxLength={60}
            />
          </div>

          {/* Prompt visual */}
          <div className="space-y-1.5">
            <Label className="text-xs">
              Prompt visual
              <span className="text-muted-foreground ml-1">
                (qué se muestra en pantalla)
              </span>
            </Label>
            <Textarea
              value={scene.visualPrompt}
              onChange={(e) => update("visualPrompt", e.target.value)}
              placeholder="Describe el visual: qué imagen, clip o animación aparece..."
              className="min-h-16 resize-none text-sm"
            />
          </div>

          {/* Duración */}
          <div className="space-y-1.5">
            <Label className="text-xs">Duración (segundos)</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={2}
                max={30}
                value={scene.duration}
                onChange={(e) => update("duration", Number(e.target.value))}
                className="w-24 text-center"
              />
              <span className="text-muted-foreground text-xs">
                segundos (2–30)
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
