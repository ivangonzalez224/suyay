export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel izquierdo — branding */}
      <div className="relative hidden flex-col overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        {/* Fondos decorativos */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-zinc-950" />
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Suyay</span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-3">
            <p className="text-2xl leading-snug font-semibold">
              &ldquo;Videos generados con IA,
              <br />
              totalmente editables
              <br />
              antes del render final.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">
              Control creativo completo — Suyay
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
