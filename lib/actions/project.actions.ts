"use server";

import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";
import { createProjectSchema } from "@/lib/validations/project.schema";
import type { StoryboardData } from "@/types";
import type { Scene } from "@/types";

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

export interface ContentActionResult {
  success: boolean;
  error?: string;
}

export async function saveTextContentAction(
  projectId: string,
  formData: FormData
): Promise<ContentActionResult> {
  const userId = await requireUserId();

  const inputText = formData.get("inputText") as string;

  if (!inputText || inputText.trim().length < 50) {
    return {
      success: false,
      error: "El texto debe tener al menos 50 caracteres",
    };
  }

  try {
    await ProjectService.updateProject(projectId, userId, {
      inputType: "TEXT",
      inputText: inputText.trim(),
      status: "DRAFT",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al guardar el contenido" };
  }
}

export async function saveUrlContentAction(
  projectId: string,
  formData: FormData
): Promise<ContentActionResult> {
  const userId = await requireUserId();

  const inputUrl = formData.get("inputUrl") as string;

  if (!inputUrl) {
    return { success: false, error: "La URL es requerida" };
  }

  try {
    const { extractTextFromUrl } = await import("@/lib/utils/url");
    const extractedText = await extractTextFromUrl(inputUrl);

    await ProjectService.updateProject(projectId, userId, {
      inputType: "URL",
      inputUrl,
      inputText: extractedText,
      status: "DRAFT",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al procesar la URL" };
  }
}

export async function savePdfContentAction(
  projectId: string,
  formData: FormData
): Promise<ContentActionResult> {
  const userId = await requireUserId();

  const file = formData.get("pdf") as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: "Selecciona un archivo PDF" };
  }

  if (file.type !== "application/pdf") {
    return { success: false, error: "El archivo debe ser un PDF" };
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: "El PDF no puede superar 5MB" };
  }

  try {
    // Llamar al Route Handler para extraer texto
    // (aísla pdfjs-dist del bundle del cliente)
    const extractFormData = new FormData();
    extractFormData.append("pdf", file);

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/extract-pdf`, {
      method: "POST",
      body: extractFormData,
      headers: {
        // Pasar la cookie de sesión para autenticación
        cookie: (await (await import("next/headers")).cookies()).toString(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "Error al procesar el PDF",
      };
    }

    await ProjectService.updateProject(projectId, userId, {
      inputType: "PDF",
      inputText: data.text,
      status: "DRAFT",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al procesar el PDF" };
  }
}

export interface StoryboardActionResult {
  success: boolean;
  error?: string;
  data?: StoryboardData;
}

export async function generateStoryboardAction(
  projectId: string
): Promise<StoryboardActionResult> {
  const userId = await requireUserId();

  // Verificar que el proyecto pertenece al usuario
  try {
    await ProjectService.getProjectById(projectId, userId);
  } catch {
    return { success: false, error: "Proyecto no encontrado" };
  }

  try {
    const { StoryboardService } =
      await import("@/lib/services/storyboard.service");
    const data = await StoryboardService.generateAndSave(projectId);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al generar el storyboard" };
  }
}

export interface SaveScenesResult {
  success: boolean;
  error?: string;
}

export async function saveScenesAction(
  projectId: string,
  scenes: Scene[]
): Promise<SaveScenesResult> {
  const userId = await requireUserId();

  try {
    await ProjectService.getProjectById(projectId, userId);
  } catch {
    return { success: false, error: "Proyecto no encontrado" };
  }

  try {
    const { StoryboardService } =
      await import("@/lib/services/storyboard.service");
    await StoryboardService.updateScenes(projectId, scenes);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al guardar las escenas" };
  }
}
