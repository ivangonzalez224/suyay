"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { requestPasswordResetAction } from "@/lib/actions/password-reset.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
});

const darkInput =
  "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500 focus-visible:border-violet-500";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: { email: string }) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", data.email);

    const result = await requestPasswordResetAction(formData);

    if (!result.success) {
      setServerError(result.error ?? "Error");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10">
            <CheckCircle2 className="h-7 w-7 text-violet-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t("checkEmail")}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            {t("checkEmailDesc", { email: getValues("email") })}
          </p>
        </div>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t("forgotTitle")}
        </h1>
        <p className="text-sm text-zinc-500">{t("forgotSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{serverError}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-zinc-400">
            {t("email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            className={cn(darkInput, errors.email && "border-red-500/50")}
            {...register("email")}
          />
        </div>

        <Button
          type="submit"
          className="h-10 w-full bg-violet-600 text-white hover:bg-violet-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("sending")}
            </>
          ) : (
            t("sendResetLink")
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToLogin")}
      </Link>
    </div>
  );
}
