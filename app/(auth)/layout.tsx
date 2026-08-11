import { getTranslations } from "next-intl/server";
import { getLocale } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import Image from "next/image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("auth");
  const locale = await getLocale();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Panel izquierdo */}
      <div className="relative hidden w-[480px] shrink-0 flex-col overflow-hidden border-r border-zinc-800/60 p-10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          <Image
            src="/logo-white.png"
            alt="Suyay"
            width={160}
            height={45}
            style={{ width: "auto" }}
            className="object-contain"
            priority
          />
        </div>

        <div className="relative z-10 mt-auto space-y-6">
          <div className="space-y-4">
            <p className="text-2xl leading-snug font-bold tracking-tight text-white">
              {t("brandingQuote")}
              <br />
              <span className="text-violet-400">{t("brandingQuote2")}</span>
              <br />
              {t("brandingQuote3")}
            </p>
            <p className="text-sm leading-relaxed text-zinc-500">
              {t("brandingDesc")}
            </p>
          </div>

          <div className="flex items-center gap-6 border-t border-zinc-800/60 pt-2">
            {[
              { value: t("stat1Value"), label: t("stat1Label") },
              { value: t("stat2Value"), label: t("stat2Label") },
              { value: t("stat3Value"), label: t("stat3Label") },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-end p-4">
          <LocaleSwitcher currentLocale={locale} variant="dark" />
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Image
                src="/logo-white.png"
                alt="Suyay"
                width={140}
                height={39}
                style={{ width: "auto" }}
                className="object-contain"
                priority
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
