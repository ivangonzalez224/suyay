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

    // Login automático después del registro
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
        <p className="text-muted-foreground text-sm">
          Empieza a crear videos con IA
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
            <p className="text-destructive text-sm">{serverError}</p>
          </div>
        )}

        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
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

        {/* Confirmar password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            className={cn(errors.confirmPassword && "border-destructive")}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
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

      {/* Link a login */}
      <p className="text-muted-foreground text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
