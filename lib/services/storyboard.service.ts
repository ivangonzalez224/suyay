import { prisma } from "@/lib/db/client";
import { OpenAIService } from "./openai.service";
import type { StoryboardData } from "@/types";

export class StoryboardService {
  static async generateAndSave(projectId: string): Promise<StoryboardData> {
    // Obtener proyecto con datos necesarios
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        platform: true,
        duration: true,
        inputText: true,
        inputType: true,
        status: true,
      },
    });

    if (!project) throw new Error("Proyecto no encontrado");

    if (!project.inputText) {
      throw new Error(
        "El proyecto no tiene contenido. Agrega texto, URL o PDF primero."
      );
    }

    if (!project.platform || !project.duration) {
      throw new Error("El proyecto no tiene plataforma o duración definida.");
    }

    // Marcar como procesando
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "PROCESSING" },
    });

    try {
      // Generar con OpenAI
      const storyboardData = await OpenAIService.generateStoryboard({
        content: project.inputText,
        platform: project.platform,
        duration: project.duration,
        projectTitle: project.title,
      });

      // Guardar o actualizar storyboard
      await prisma.storyboard.upsert({
        where: { projectId },
        create: {
          projectId,
          summary: storyboardData.summary,
          script: storyboardData.script,
          scenes: storyboardData.scenes as unknown as object[],
        },
        update: {
          summary: storyboardData.summary,
          script: storyboardData.script,
          scenes: storyboardData.scenes as unknown as object[],
        },
      });

      // Marcar como listo para editar
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "READY_TO_EDIT" },
      });

      return storyboardData;
    } catch (error) {
      // Revertir status si falla
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "DRAFT" },
      });
      throw error;
    }
  }

  static async getByProjectId(
    projectId: string
  ): Promise<StoryboardData | null> {
    const storyboard = await prisma.storyboard.findUnique({
      where: { projectId },
    });

    if (!storyboard) return null;

    return {
      summary: storyboard.summary ?? "",
      script: storyboard.script ?? "",
      scenes: storyboard.scenes as unknown as StoryboardData["scenes"],
    };
  }

  static async updateScenes(
    projectId: string,
    scenes: StoryboardData["scenes"]
  ): Promise<void> {
    await prisma.storyboard.update({
      where: { projectId },
      data: {
        scenes: scenes as unknown as object[],
      },
    });
  }
}
