"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Email o contraseña incorrectos");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido</h1>
        <p className="text-muted-foreground text-sm">
          Inicia sesión en tu cuenta
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error del servidor */}
        {serverError && (
          <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
            <p className="text-destructive text-sm">{serverError}</p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={cn(errors.password && "border-destructive", "pr-10")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
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
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      {/* Link a registro */}
      <p className="text-muted-foreground text-center text-sm">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-foreground font-medium hover:underline"
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
