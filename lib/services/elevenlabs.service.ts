import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";

const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

export interface GenerateVoiceParams {
  text: string;
  voiceId?: string;
  outputPath: string;
}

export class ElevenLabsService {
  static async generateVoice(params: GenerateVoiceParams): Promise<string> {
    const { text, voiceId = DEFAULT_VOICE_ID, outputPath } = params;

    if (!text.trim()) {
      throw new Error("El texto para la voz no puede estar vacío");
    }

    const dir = path.dirname(outputPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    // Import dinámico para que el mock de Vitest funcione correctamente
    const { ElevenLabsClient } = await import("elevenlabs");
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    const audioBuffer = Buffer.concat(chunks);
    await writeFile(outputPath, audioBuffer);

    return outputPath;
  }

  static async generateVoiceForScenes(
    scenes: Array<{ id: string; script: string }>,
    projectId: string,
    voiceId?: string
  ): Promise<Record<string, string>> {
    const outputDir = path.join(process.cwd(), "public", "renders", projectId);

    await mkdir(outputDir, { recursive: true });

    const audioPaths: Record<string, string> = {};

    for (const scene of scenes) {
      if (!scene.script.trim()) continue;

      const outputPath = path.join(outputDir, `scene_${scene.id}.mp3`);

      await ElevenLabsService.generateVoice({
        text: scene.script,
        voiceId,
        outputPath,
      });

      audioPaths[scene.id] = outputPath;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return audioPaths;
  }

  static async getAvailableVoices() {
    const { ElevenLabsClient } = await import("elevenlabs");
    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    const voices = await client.voices.getAll();
    return voices.voices.map((v) => ({
      id: v.voice_id,
      name: v.name ?? "Sin nombre",
      category: v.category ?? "general",
    }));
  }
}
