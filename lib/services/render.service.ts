import path from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { prisma } from "@/lib/db/client";
import { ElevenLabsService } from "./elevenlabs.service";
import type { Scene } from "@/types";

export interface RenderOptions {
  projectId: string;
  voiceId?: string;
}

export class RenderService {
  static getRenderDir(projectId: string): string {
    return path.join(process.cwd(), "public", "renders", projectId);
  }

  static async generateAudio(
    options: RenderOptions
  ): Promise<Record<string, string>> {
    const { projectId, voiceId } = options;

    const storyboard = await prisma.storyboard.findUnique({
      where: { projectId },
    });

    if (!storyboard) throw new Error("No existe storyboard para este proyecto");

    const scenes = storyboard.scenes as unknown as Scene[];
    if (!scenes?.length) throw new Error("El storyboard no tiene escenas");

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "PROCESSING" },
    });

    try {
      const audioPaths = await ElevenLabsService.generateVoiceForScenes(
        scenes,
        projectId,
        voiceId
      );
      return audioPaths;
    } catch (error) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "READY_TO_EDIT" },
      });
      throw error;
    }
  }

  /**
   * Genera videos con fal.ai para cada escena.
   * Descarga los MP4 resultantes al directorio del proyecto.
   */
  static async generateSceneVideos(
    projectId: string
  ): Promise<Record<string, string>> {
    const storyboard = await prisma.storyboard.findUnique({
      where: { projectId },
    });

    if (!storyboard) throw new Error("No existe storyboard");

    const scenes = storyboard.scenes as unknown as Scene[];
    const renderDir = RenderService.getRenderDir(projectId);
    await mkdir(renderDir, { recursive: true });

    const { FalService } = await import("./fal.service");
    const videoPaths: Record<string, string> = {};

    for (const scene of scenes) {
      if (!scene.visualPrompt?.trim()) {
        console.warn(
          `[RenderService] Sin visualPrompt para escena ${scene.id}`
        );
        continue;
      }

      const outputPath = path.join(renderDir, `video_${scene.id}.mp4`);

      // Si ya existe, reusar para no gastar créditos
      if (existsSync(outputPath)) {
        console.warn(
          `[RenderService] Reutilizando video existente: ${scene.id}`
        );
        videoPaths[scene.id] = outputPath;
        continue;
      }

      console.warn(`[RenderService] Generando video para escena: ${scene.id}`);

      const generated = await FalService.generateVideoWithRetry({
        prompt: scene.visualPrompt,
        duration: "5",
        aspectRatio: "9:16",
      });

      await FalService.downloadVideo(generated.url, outputPath);
      videoPaths[scene.id] = outputPath;
    }

    return videoPaths;
  }

  /**
   * Pipeline completo de renderizado.
   */
  static async renderVideo(projectId: string): Promise<string> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, platform: true, title: true },
    });

    if (!project) throw new Error("Proyecto no encontrado");
    if (!project.platform) throw new Error("El proyecto no tiene plataforma");

    const storyboard = await prisma.storyboard.findUnique({
      where: { projectId },
    });

    if (!storyboard) throw new Error("No existe storyboard");

    const scenes = storyboard.scenes as unknown as Scene[];
    const renderDir = RenderService.getRenderDir(projectId);

    // Verificar audios existentes
    const audioPaths: Record<string, string> = {};
    for (const scene of scenes) {
      const audioPath = path.join(renderDir, `scene_${scene.id}.mp3`);
      if (existsSync(audioPath)) {
        audioPaths[scene.id] = audioPath;
      }
    }

    if (Object.keys(audioPaths).length === 0) {
      throw new Error("No se encontraron audios. Genera la voz primero.");
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "RENDERING" },
    });

    const outputPath = path.join(renderDir, "final.mp4");

    try {
      // 1. Generar videos con fal.ai
      console.warn("[RenderService] Generando videos con fal.ai...");
      const videoPaths = await RenderService.generateSceneVideos(projectId);

      if (Object.keys(videoPaths).length === 0) {
        throw new Error(
          "No se generó ningún video. Verifica los visualPrompts."
        );
      }

      // 2. Merge video + audio con FFmpeg
      console.warn("[RenderService] Mergeando video y audio...");
      const { FFmpegService } = await import("./ffmpeg.service");

      await FFmpegService.renderVideo({
        projectId,
        scenes,
        audioPaths,
        videoPaths,
        platform: project.platform,
        outputPath,
      });

      // 3. Guardar resultado
      const videoUrl = `/renders/${projectId}/final.mp4`;

      await prisma.video.upsert({
        where: { projectId },
        create: {
          projectId,
          status: "COMPLETED",
          fileUrl: videoUrl,
          renderPath: outputPath,
        },
        update: {
          status: "COMPLETED",
          fileUrl: videoUrl,
          renderPath: outputPath,
        },
      });

      await prisma.project.update({
        where: { id: projectId },
        data: { status: "COMPLETED", renderPath: outputPath },
      });

      return videoUrl;
    } catch (error) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "READY_TO_EDIT" },
      });

      await prisma.video.upsert({
        where: { projectId },
        create: {
          projectId,
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Error desconocido",
        },
        update: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Error desconocido",
        },
      });

      throw error;
    }
  }
}
