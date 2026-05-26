import type { Platform, ProjectStatus, InputType } from "@prisma/client";

export type { Platform, ProjectStatus, InputType };

export interface ProjectSummary {
  id: string;
  title: string;
  status: ProjectStatus;
  platform: Platform | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  script: string;
  visualPrompt: string;
  duration: number;
  caption: string;
}
