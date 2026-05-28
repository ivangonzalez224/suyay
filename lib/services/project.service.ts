import { prisma } from "@/lib/db/client";
import type { Platform, ProjectStatus } from "@prisma/client";

export interface CreateProjectInput {
  title: string;
  platform: Platform;
  duration: number;
  userId: string;
}

export interface UpdateProjectInput {
  title?: string;
  platform?: Platform;
  duration?: number;
  status?: ProjectStatus;
  inputType?: "TEXT" | "URL" | "PDF" | "TRANSCRIPT";
  inputText?: string;
  inputUrl?: string;
  inputFileKey?: string;
}

export class ProjectService {
  static async createProject(data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        title: data.title,
        platform: data.platform,
        duration: data.duration,
        userId: data.userId,
        status: "DRAFT",
      },
    });
  }

  static async getProjectsByUser(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        platform: true,
        duration: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getProjectById(id: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        storyboard: true,
      },
    });

    if (!project) throw new Error("Proyecto no encontrado");
    return project;
  }

  static async updateProject(
    id: string,
    userId: string,
    data: UpdateProjectInput
  ) {
    // Verificar que el proyecto pertenece al usuario
    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) throw new Error("Proyecto no encontrado");

    return prisma.project.update({
      where: { id },
      data,
    });
  }

  static async deleteProject(id: string, userId: string) {
    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) throw new Error("Proyecto no encontrado");

    return prisma.project.delete({ where: { id } });
  }
}
