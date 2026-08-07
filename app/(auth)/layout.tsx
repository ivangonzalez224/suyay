import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Panel izquierdo — branding */}
      <div className="relative hidden w-[480px] shrink-0 flex-col overflow-hidden border-r border-zinc-800/60 p-10 lg:flex">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />

        {/* Grid decorativo */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/logo-white.png"
            alt="Suyay"
            width={180}
            height={51}
            className="object-contain"
            priority
          />
        </div>

        {/* Quote */}
        <div className="relative z-10 mt-auto space-y-6">
          <div className="space-y-4">
            <p className="text-2xl leading-snug font-bold tracking-tight text-white">
              Videos generados con IA,
              <br />
              <span className="text-violet-400">totalmente editables</span>
              <br />
              antes del render final.
            </p>
            <p className="text-sm leading-relaxed text-zinc-500">
              Control creativo completo sobre cada escena, caption y prompt
              visual. Tú decides el resultado final.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 border-t border-zinc-800/60 pt-2">
            {[
              { value: "5min", label: "De texto a video" },
              { value: "9:16", label: "Formato nativo" },
              { value: "3", label: "Plataformas" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="mb-8 lg:hidden">
            <Image
              src="/logo-white.png"
              alt="Suyay"
              width={140}
              height={39}
              className="object-contain"
              priority
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
