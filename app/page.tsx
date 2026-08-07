import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock, Edit3 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Suyay entiende tu contenido",
    description:
      "Pega un artículo, transcript o PDF. Suyay genera el guion, escenas y narración automáticamente.",
  },
  {
    icon: Edit3,
    title: "Control creativo total",
    description:
      "Edita cada escena, caption y prompt visual antes de renderizar. El resultado final es tuyo.",
  },
  {
    icon: Clock,
    title: "De texto a video en minutos",
    description:
      "Lo que tomaría horas de edición manual, Suyay lo hace en segundos con calidad profesional.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-800/60 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="Suyay"
              width={120}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              <Link href="/register">Empezar gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        {/* Headline */}
        <h1 className="mb-6 text-5xl leading-[1.08] font-bold tracking-tight sm:text-6xl">
          De texto a video
          <br />
          <span className="text-violet-400">listo para publicar</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
          Convierte artículos, PDFs y transcripts en videos editables para
          TikTok, Reels y Shorts — con voz, escenas y captions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 gap-2 bg-violet-600 px-8 text-white hover:bg-violet-500"
          >
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 border-zinc-700 px-8 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Link href="/login">Ver demo</Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-zinc-600">
          Sin tarjeta de crédito · 10 créditos gratis al registrarte
        </p>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="border-t border-zinc-800/60" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                <Icon className="h-4 w-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow visual */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <p className="mb-6 text-center text-xs font-medium tracking-widest text-zinc-500 uppercase">
            Cómo funciona
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { step: "01", label: "Pega tu contenido" },
              { step: "02", label: "IA genera storyboard" },
              { step: "03", label: "Edita las escenas" },
              { step: "04", label: "Renderiza y descarga" },
            ].map(({ step, label }, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
                    <span className="text-xs font-bold text-violet-400">
                      {step}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-zinc-300">
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden h-px w-8 bg-zinc-700 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="Suyay"
              width={80}
              height={22}
              className="object-contain"
            />
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Suyay. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
