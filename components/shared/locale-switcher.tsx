"use client";

import { useTransition } from "react";
import { setLocale } from "@/i18n/navigation";
import { type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const labels: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

const flags: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
};

interface LocaleSwitcherProps {
  currentLocale: Locale;
  variant?: "light" | "dark";
}

export function LocaleSwitcher({
  currentLocale,
  variant = "light",
}: LocaleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (locale: Locale) => {
    startTransition(async () => {
      await setLocale(locale);
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={
            variant === "dark"
              ? "gap-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              : "text-muted-foreground hover:text-foreground gap-1.5"
          }
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="text-xs font-medium uppercase">{currentLocale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {(["es", "en"] as Locale[]).map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleChange(locale)}
            className={`cursor-pointer gap-2 ${
              currentLocale === locale ? "font-medium" : ""
            }`}
          >
            <span>{flags[locale]}</span>
            <span>{labels[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
