"use server";

import { requireUserId } from "@/lib/auth/helpers";
import { ProjectService } from "@/lib/services/project.service";

export interface RenderActionResult {
  success: boolean;
  error?: string;
  audioCount?: number;
}

export async function generateVoiceAction(
  projectId: string,
  voiceId?: string
): Promise<RenderActionResult> {
  const userId = await requireUserId();

  try {
    await ProjectService.getProjectById(projectId, userId);
  } catch {
    return { success: false, error: "Proyecto no encontrado" };
  }

  try {
    const { RenderService } = await import("@/lib/services/render.service");
    const audioPaths = await RenderService.generateAudio({
      projectId,
      voiceId,
    });

    const audioCount = Object.keys(audioPaths).length;
    return { success: true, audioCount };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al generar la voz" };
  }
}

export interface RenderVideoResult {
  success: boolean;
  error?: string;
  videoUrl?: string;
}

export async function renderVideoAction(
  projectId: string
): Promise<RenderVideoResult> {
  const userId = await requireUserId();

  try {
    await ProjectService.getProjectById(projectId, userId);
  } catch {
    return { success: false, error: "Proyecto no encontrado" };
  }

  try {
    const { RenderService } = await import("@/lib/services/render.service");
    const videoUrl = await RenderService.renderVideo(projectId);
    return { success: true, videoUrl };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al renderizar el video" };
  }
}
