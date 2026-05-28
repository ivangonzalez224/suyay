"use server";

import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";
import { createProjectSchema } from "@/lib/validations/project.schema";

export interface ProjectActionResult {
  success: boolean;
  error?: string;
  projectId?: string;
}

export async function createProjectAction(
  formData: FormData
): Promise<ProjectActionResult> {
  const userId = await requireUserId();

  const raw = {
    title: formData.get("title"),
    platform: formData.get("platform"),
    duration: Number(formData.get("duration")), // convertir a número aquí
  };

  const parsed = createProjectSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0].message;
    return { success: false, error: firstError };
  }

  try {
    const project = await ProjectService.createProject({
      ...parsed.data,
      userId,
    });

    return { success: true, projectId: project.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al crear el proyecto" };
  }
}

export async function deleteProjectAction(
  projectId: string
): Promise<ProjectActionResult> {
  const userId = await requireUserId();

  try {
    await ProjectService.deleteProject(projectId, userId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al eliminar el proyecto" };
  }
}
