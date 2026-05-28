"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const presets = [
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
];

interface DurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function DurationSelector({
  value,
  onChange,
  error,
}: DurationSelectorProps) {
  const [isCustom, setIsCustom] = useState(
    !presets.some((p) => p.value === value)
  );

  const handlePreset = (preset: number) => {
    setIsCustom(false);
    onChange(preset);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    onChange(45); // valor inicial personalizado
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => handlePreset(preset.value)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              !isCustom && value === preset.value
                ? "border-violet-500 bg-violet-500/10 text-violet-600 ring-1 ring-violet-500"
                : "border-border hover:border-violet-500/50"
            )}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleCustomToggle}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
            isCustom
              ? "border-violet-500 bg-violet-500/10 text-violet-600 ring-1 ring-violet-500"
              : "border-border hover:border-violet-500/50"
          )}
        >
          Personalizada
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center gap-3">
          <div className="w-32">
            <Input
              type="number"
              min={15}
              max={180}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="text-center"
            />
          </div>
          <Label className="text-muted-foreground text-sm">
            segundos (15–180)
          </Label>
        </div>
      )}

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
