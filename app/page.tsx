import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-lg space-y-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Suyay</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl leading-tight font-bold tracking-tight">
            Videos con IA,
            <br />
            control total tuyo
          </h1>
          <p className="text-muted-foreground">
            Convierte texto, artículos y PDFs en videos cortos editables para
            TikTok, Reels y YouTube Shorts.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register" className="gap-2">
              Empezar gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
