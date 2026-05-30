import OpenAI from "openai";
import type { StoryboardData, Scene } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateStoryboardParams {
  content: string;
  platform: "TIKTOK" | "REELS" | "SHORTS";
  duration: number;
  projectTitle: string;
}

const platformContext = {
  TIKTOK: "TikTok (audiencia joven, ritmo rápido, muy visual)",
  REELS: "Instagram Reels (estético, inspirador, lifestyle)",
  SHORTS: "YouTube Shorts (informativo, educativo, directo)",
};

export class OpenAIService {
  static async generateStoryboard(
    params: GenerateStoryboardParams
  ): Promise<StoryboardData> {
    const { content, platform, duration, projectTitle } = params;

    // Calcular número de escenas según duración
    // Cada escena dura entre 5-10 segundos
    const sceneCount = Math.max(3, Math.min(12, Math.round(duration / 8)));

    const prompt = `Eres un experto en creación de videos cortos para redes sociales.

Analiza el siguiente contenido y genera un storyboard completo para un video de ${duration} segundos para ${platformContext[platform]}.

TÍTULO DEL PROYECTO: ${projectTitle}

CONTENIDO A TRANSFORMAR:
${content.slice(0, 4000)}

INSTRUCCIONES:
- Genera exactamente ${sceneCount} escenas
- Cada escena debe durar aproximadamente ${Math.round(duration / sceneCount)} segundos
- El guion debe ser natural, conversacional y adecuado para narración en voz
- Los captions deben ser cortos (máximo 8 palabras) e impactantes
- Los prompts visuales deben describir imágenes o clips concretos y filmables
- Adapta el tono y ritmo a la plataforma: ${platformContext[platform]}

RESPONDE ÚNICAMENTE con un objeto JSON válido con esta estructura exacta, sin texto adicional, sin markdown, sin backticks:
{
  "summary": "resumen de 2-3 oraciones del video",
  "script": "guion completo de narración del video entero",
  "scenes": [
    {
      "id": "scene_1",
      "order": 1,
      "title": "título corto de la escena",
      "script": "texto que se narra en esta escena",
      "visualPrompt": "descripción visual concreta de qué se muestra",
      "duration": ${Math.round(duration / sceneCount)},
      "caption": "caption corto e impactante"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const rawText = response.choices[0]?.message?.content;

    if (!rawText) {
      throw new Error("OpenAI no retornó contenido");
    }

    return OpenAIService.parseStoryboardResponse(rawText);
  }

  private static parseStoryboardResponse(raw: string): StoryboardData {
    // Limpiar posibles backticks o prefijos de markdown
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: unknown;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(
        "La respuesta de OpenAI no es un JSON válido. Intenta de nuevo."
      );
    }

    // Validar estructura mínima
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("summary" in parsed) ||
      !("script" in parsed) ||
      !("scenes" in parsed) ||
      !Array.isArray((parsed as Record<string, unknown>).scenes)
    ) {
      throw new Error(
        "La respuesta de OpenAI no tiene la estructura esperada."
      );
    }

    const data = parsed as StoryboardData;

    // Normalizar escenas — garantizar que todos los campos existen
    data.scenes = data.scenes.map((scene: Partial<Scene>, index: number) => ({
      id: scene.id ?? `scene_${index + 1}`,
      order: scene.order ?? index + 1,
      title: scene.title ?? `Escena ${index + 1}`,
      script: scene.script ?? "",
      visualPrompt: scene.visualPrompt ?? "",
      duration: scene.duration ?? 8,
      caption: scene.caption ?? "",
    }));

    return data;
  }
}
