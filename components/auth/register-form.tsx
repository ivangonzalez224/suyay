"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth.schema";
import { registerAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const darkInput =
  "bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500 focus-visible:border-violet-500";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    const result = await registerAction(formData);

    if (!result.success) {
      setServerError(result.error ?? "Error al crear la cuenta");
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full space-y-7">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Crear cuenta
        </h1>
        <p className="text-sm text-zinc-500">Empieza a crear videos con IA</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{serverError}</p>
          </div>
        )}

        {/* Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-zinc-400">
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
            className={cn(
              darkInput,
              errors.name && "border-red-500/50 focus-visible:border-red-500"
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-zinc-400">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            className={cn(
              darkInput,
              errors.email && "border-red-500/50 focus-visible:border-red-500"
            )}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-zinc-400"
          >
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className={cn(
                darkInput,
                "pr-10",
                errors.password &&
                  "border-red-500/50 focus-visible:border-red-500"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmar password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-medium text-zinc-400"
          >
            Confirmar contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            className={cn(
              darkInput,
              errors.confirmPassword &&
                "border-red-500/50 focus-visible:border-red-500"
            )}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-10 w-full bg-violet-600 text-white hover:bg-violet-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta gratis"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-zinc-950 px-3 text-xs text-zinc-600">
            ¿Ya tienes cuenta?
          </span>
        </div>
      </div>

      <Link
        href="/login"
        className="flex h-10 w-full items-center justify-center rounded-lg border border-zinc-800 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}
