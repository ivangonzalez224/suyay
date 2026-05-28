"use client";

import { cn } from "@/lib/utils";

interface Platform {
  value: "TIKTOK" | "REELS" | "SHORTS";
  label: string;
  ratio: string;
  description: string;
}

const platforms: Platform[] = [
  {
    value: "TIKTOK",
    label: "TikTok",
    ratio: "9:16",
    description: "Vertical · hasta 3 min",
  },
  {
    value: "REELS",
    label: "Instagram Reels",
    ratio: "9:16",
    description: "Vertical · hasta 90s",
  },
  {
    value: "SHORTS",
    label: "YouTube Shorts",
    ratio: "9:16",
    description: "Vertical · hasta 60s",
  },
];

interface PlatformSelectorProps {
  value: string;
  onChange: (value: "TIKTOK" | "REELS" | "SHORTS") => void;
  error?: string;
}

export function PlatformSelector({
  value,
  onChange,
  error,
}: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.value}
            type="button"
            onClick={() => onChange(platform.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:border-violet-500/50",
              value === platform.value
                ? "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500"
                : "border-border bg-card"
            )}
          >
            {/* Aspect ratio visual */}
            <div
              className={cn(
                "w-8 rounded-sm border-2 transition-colors",
                value === platform.value
                  ? "border-violet-500 bg-violet-500/20"
                  : "border-muted-foreground/30"
              )}
              style={{ height: "calc(8 * 16 / 9 * 1px + 24px)" }}
            />
            <div>
              <p className="text-xs font-semibold">{platform.label}</p>
              <p className="text-muted-foreground text-xs">
                {platform.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
