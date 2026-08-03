import { fal } from "@fal-ai/client";
import { VIDEO_GENERATION } from "@/lib/config/ai-models";

// Configurar API key
fal.config({
  credentials: process.env.FAL_KEY,
});

export interface GenerateVideoParams {
  prompt: string;
  duration?: "5" | "10";
  aspectRatio?: "9:16" | "16:9" | "1:1";
}

export interface GeneratedVideo {
  url: string;
  duration: number;
}

export interface FalQueueStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  requestId: string;
  logs?: string[];
}

export class FalService {
  /**
   * Genera un video con el modelo configurado.
   * Usa submit → polling → resultado para manejar
   * el proceso asíncrono de fal.ai correctamente.
   */
  static async generateVideo(
    params: GenerateVideoParams
  ): Promise<GeneratedVideo> {
    const {
      prompt,
      duration = VIDEO_GENERATION.defaults.duration,
      aspectRatio = VIDEO_GENERATION.defaults.aspectRatio,
    } = params;

    console.warn(
      `[FalService] Generando video con ${VIDEO_GENERATION.endpoint}`,
      { prompt: prompt.slice(0, 80), duration, aspectRatio }
    );

    // Submit del request a la cola
    const { request_id } = await fal.queue.submit(VIDEO_GENERATION.endpoint, {
      input: {
        prompt,
        duration,
        aspect_ratio: aspectRatio,
        cfg_scale: VIDEO_GENERATION.defaults.cfgScale,
      },
    });

    console.warn(`[FalService] Request enviado: ${request_id}`);

    // Polling del estado
    const result = await FalService.pollUntilComplete(request_id);

    return result;
  }

  /* Polling con reintentos y timeout */
  private static async pollUntilComplete(
    requestId: string
  ): Promise<GeneratedVideo> {
    const { intervalMs, maxAttempts } = VIDEO_GENERATION.polling;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;

      const status = await fal.queue.status(VIDEO_GENERATION.endpoint, {
        requestId,
        logs: true,
      });

      const statusStr = String(status.status);

      console.warn(
        `[FalService] Polling ${attempts}/${maxAttempts}: ${statusStr}`
      );

      if (statusStr === "COMPLETED") {
        const result = await fal.queue.result(VIDEO_GENERATION.endpoint, {
          requestId,
        });

        return FalService.extractVideoFromResult(result.data);
      }

      if (statusStr === "FAILED") {
        throw new Error(
          `Generación de video fallida para request ${requestId}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(
      `Timeout: el video no se generó en ${maxAttempts} intentos`
    );
  }

  /* Extrae la URL del video del resultado de fal.ai.
     Kling retorna: { video: { url, duration } } */
  private static extractVideoFromResult(data: unknown): GeneratedVideo {
    const result = data as Record<string, unknown>;

    // Estructura de Kling 3.0
    if (result.video && typeof result.video === "object") {
      const video = result.video as Record<string, unknown>;
      if (typeof video.url === "string") {
        return {
          url: video.url,
          duration: typeof video.duration === "number" ? video.duration : 5,
        };
      }
    }

    // Fallback: buscar cualquier URL de video en el resultado
    if (Array.isArray(result.videos) && result.videos.length > 0) {
      const first = result.videos[0] as Record<string, unknown>;
      if (typeof first.url === "string") {
        return { url: first.url, duration: 5 };
      }
    }

    throw new Error(
      `No se encontró URL de video en la respuesta de fal.ai: ${JSON.stringify(data).slice(0, 200)}`
    );
  }

  /**
   * Genera video con reintentos automáticos.
   */
  static async generateVideoWithRetry(
    params: GenerateVideoParams
  ): Promise<GeneratedVideo> {
    const { maxAttempts, delayMs } = VIDEO_GENERATION.retries;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.warn(`[FalService] Intento ${attempt}/${maxAttempts}`);
        return await FalService.generateVideo(params);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        console.warn(
          `[FalService] Intento ${attempt} fallido: ${lastError.message}`
        );

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError ?? new Error("Error desconocido en generación de video");
  }

  /**
   * Descarga un video desde una URL y lo guarda en disco.
   */
  static async downloadVideo(url: string, outputPath: string): Promise<void> {
    const { mkdir, writeFile } = await import("fs/promises");
    const { existsSync } = await import("fs");
    const path = await import("path");

    const dir = path.dirname(outputPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(60000), // 60s para descargar
    });

    if (!response.ok) {
      throw new Error(`Error descargando video: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(outputPath, buffer);

    console.warn(
      `[FalService] Video descargado: ${outputPath} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`
    );
  }
}
