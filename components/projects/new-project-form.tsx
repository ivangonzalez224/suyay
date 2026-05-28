"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validations/project.schema";
import { createProjectAction } from "@/lib/actions/project.actions";
import { PlatformSelector } from "./platform-selector";
import { DurationSelector } from "./duration-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function NewProjectForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      platform: "TIKTOK",
      duration: 60,
    },
  });

  const onSubmit = async (data: CreateProjectInput) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("platform", data.platform);
    formData.append("duration", String(data.duration));

    const result = await createProjectAction(formData);

    if (!result.success) {
      setServerError(result.error ?? "Error al crear el proyecto");
      return;
    }

    router.push(`/projects/${result.projectId}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm">{serverError}</p>
        </div>
      )}

      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título del proyecto</Label>
        <Input
          id="title"
          placeholder="Ej: Cómo funciona la fotosíntesis"
          className={cn(errors.title && "border-destructive")}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* Plataforma */}
      <div className="space-y-2">
        <Label>Plataforma objetivo</Label>
        <Controller
          name="platform"
          control={control}
          render={({ field }) => (
            <PlatformSelector
              value={field.value}
              onChange={field.onChange}
              error={errors.platform?.message}
            />
          )}
        />
      </div>

      {/* Duración */}
      <div className="space-y-2">
        <Label>Duración objetivo</Label>
        <Controller
          name="duration"
          control={control}
          render={({ field }) => (
            <DurationSelector
              value={field.value}
              onChange={(val) => field.onChange(val)}
              error={errors.duration?.message}
            />
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando proyecto...
          </>
        ) : (
          "Crear proyecto"
        )}
      </Button>
    </form>
  );
}
