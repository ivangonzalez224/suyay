import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Agregado: utilidades de Suyay ─────────────────────

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
