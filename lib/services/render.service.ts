import path from "path";
import fs from "fs/promises";
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

  static async prepareRenderDir(projectId: string): Promise<string> {
    const dir = RenderService.getRenderDir(projectId);
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }

  static async cleanRenderDir(projectId: string): Promise<void> {
    const dir = RenderService.getRenderDir(projectId);
    if (existsSync(dir)) {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  static async generateAudio(
    options: RenderOptions
  ): Promise<Record<string, string>> {
    const { projectId, voiceId } = options;

    // Obtener escenas del storyboard
    const storyboard = await prisma.storyboard.findUnique({
      where: { projectId },
    });

    if (!storyboard) {
      throw new Error("No existe storyboard para este proyecto");
    }

    const scenes = storyboard.scenes as unknown as Scene[];

    if (!scenes || scenes.length === 0) {
      throw new Error("El storyboard no tiene escenas");
    }

    // Actualizar status
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
}
