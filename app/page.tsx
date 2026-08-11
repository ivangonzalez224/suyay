import { getTranslations } from "next-intl/server";
import { getLocale } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Edit3, Clock } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-800/60 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Image
            src="/logo-white.png"
            alt="Suyay"
            width={120}
            height={34}
            style={{ width: "auto" }}
            className="object-contain"
            priority
          />
          <div className="flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} variant="dark" />
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <Link href="/login">{t("nav.signIn")}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              <Link href="/register">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        <h1 className="mb-6 text-5xl leading-[1.08] font-bold tracking-tight sm:text-6xl">
          {t("landing.headline")}
          <br />
          <span className="text-violet-400">{t("landing.headlineAccent")}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
          {t("landing.description")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 gap-2 bg-violet-600 px-8 text-white hover:bg-violet-500"
          >
            <Link href="/register">
              {t("landing.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 border-zinc-700 px-8 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Link href="/login">{t("landing.demo")}</Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-zinc-600">{t("landing.socialProof")}</p>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="border-t border-zinc-800/60" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: t("landing.features.f1Title"),
              desc: t("landing.features.f1Desc"),
            },
            {
              icon: Edit3,
              title: t("landing.features.f2Title"),
              desc: t("landing.features.f2Desc"),
            },
            {
              icon: Clock,
              title: t("landing.features.f3Title"),
              desc: t("landing.features.f3Desc"),
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                <Icon className="h-4 w-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <p className="mb-6 text-center text-xs font-medium tracking-widest text-zinc-500 uppercase">
            {t("landing.howItWorks")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(["01", "02", "03", "04"] as const).map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
                    <span className="text-xs font-bold text-violet-400">
                      {step}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-zinc-300">
                    {t(`landing.steps.${step}`)}
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
          <Image
            src="/logo-white.png"
            alt="Suyay"
            width={80}
            height={22}
            style={{ width: "auto" }}
            className="object-contain"
          />
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Suyay. {t("landing.footer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
