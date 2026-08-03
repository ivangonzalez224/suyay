import path from "path";
import { writeFile, rename } from "fs/promises";
import { existsSync } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import type { Scene } from "@/types";

const execFileAsync = promisify(execFile);

function getFfmpegPath(): string {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;

  const commonPaths = [
    "/usr/local/bin/ffmpeg",
    "/opt/homebrew/bin/ffmpeg",
    "/usr/bin/ffmpeg",
  ];

  for (const p of commonPaths) {
    if (existsSync(p)) return p;
  }

  return "ffmpeg";
}

const FFMPEG_BIN = getFfmpegPath();

export interface RenderVideoParams {
  projectId: string;
  scenes: Scene[];
  audioPaths: Record<string, string>;
  videoPaths: Record<string, string>; // nuevo — videos de fal.ai
  platform: "TIKTOK" | "REELS" | "SHORTS";
  outputPath: string;
}

export class FFmpegService {
  static async getAudioDuration(audioPath: string): Promise<number> {
    const ffprobeBin = FFMPEG_BIN.replace(/ffmpeg$/, "ffprobe");

    try {
      const { stdout } = await execFileAsync(ffprobeBin, [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        audioPath,
      ]);
      return parseFloat(stdout.trim()) || 5;
    } catch {
      return 5; // fallback
    }
  }

  /**
   * Combina un video de Kling (sin audio) con el audio de ElevenLabs.
   * Usa el audio como referencia de duración.
   */
  static async mergeVideoAndAudio(params: {
    videoPath: string;
    audioPath: string;
    outputPath: string;
  }): Promise<string> {
    const { videoPath, audioPath, outputPath } = params;
    const duration = await FFmpegService.getAudioDuration(audioPath);

    const args = [
      "-y",
      "-i",
      videoPath,
      "-i",
      audioPath,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-t",
      String(duration),
      outputPath,
    ];

    console.warn(
      "[FFmpeg] Merging:",
      path.basename(videoPath),
      "+",
      path.basename(audioPath)
    );

    try {
      await execFileAsync(FFMPEG_BIN, args);
    } catch (error) {
      if (!existsSync(outputPath)) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`FFmpeg merge error: ${msg.slice(-400)}`);
      }
    }

    return outputPath;
  }

  /**
   * Concatena múltiples clips en el video final.
   */
  static async concatenateScenes(
    scenePaths: string[],
    outputPath: string
  ): Promise<string> {
    if (scenePaths.length === 0) {
      throw new Error("No hay escenas para concatenar");
    }

    if (scenePaths.length === 1) {
      await rename(scenePaths[0], outputPath);
      return outputPath;
    }

    const listPath = outputPath.replace(".mp4", "_list.txt");
    const listContent = scenePaths.map((p) => `file '${p}'`).join("\n");
    await writeFile(listPath, listContent, "utf-8");

    const args = [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ];

    console.warn("[FFmpeg] Concatenating", scenePaths.length, "scenes");

    try {
      await execFileAsync(FFMPEG_BIN, args);
    } catch (error) {
      if (!existsSync(outputPath)) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`FFmpeg concat error: ${msg.slice(-400)}`);
      }
    }

    return outputPath;
  }

  /**
   * Pipeline completo: merge video+audio por escena, luego concatenar.
   */
  static async renderVideo(params: RenderVideoParams): Promise<string> {
    const { scenes, audioPaths, videoPaths, outputPath } = params;

    const renderDir = path.dirname(outputPath);
    const scenePaths: string[] = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const audioPath = audioPaths[scene.id];
      const videoPath = videoPaths[scene.id];

      if (!audioPath || !existsSync(audioPath)) {
        console.warn(`[FFmpeg] Sin audio para escena ${scene.id}, omitiendo`);
        continue;
      }

      if (!videoPath || !existsSync(videoPath)) {
        console.warn(`[FFmpeg] Sin video para escena ${scene.id}, omitiendo`);
        continue;
      }

      const mergedPath = path.join(renderDir, `merged_scene_${i}.mp4`);

      await FFmpegService.mergeVideoAndAudio({
        videoPath,
        audioPath,
        outputPath: mergedPath,
      });

      scenePaths.push(mergedPath);
    }

    if (scenePaths.length === 0) {
      throw new Error("No se pudo procesar ninguna escena.");
    }

    await FFmpegService.concatenateScenes(scenePaths, outputPath);
    return outputPath;
  }
}
