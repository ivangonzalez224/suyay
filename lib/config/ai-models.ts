/**
 * Configuración centralizada de modelos de IA.
 * Cambiar el modelo aquí afecta todo el pipeline.
 */

export const VIDEO_GENERATION = {
  // Modelo activo — cambiar aquí para usar otro proveedor
  endpoint: "fal-ai/kling-video/v3/standard/text-to-video" as const,

  // Configuración del modelo
  defaults: {
    duration: "5" as const, // "5" o "10" segundos
    aspectRatio: "9:16" as const, // vertical para TikTok/Reels/Shorts
    cfgScale: 0.5, // creatividad (0-1)
  },

  // Timeouts y reintentos
  polling: {
    intervalMs: 3000, // cada 3s verificar estado
    maxAttempts: 60, // máximo 3 minutos de espera
    timeoutMs: 180000, // 3 minutos total
  },

  retries: {
    maxAttempts: 2,
    delayMs: 5000,
  },
} as const;

export const VOICE_GENERATION = {
  defaultVoiceId: "pNInz6obpgDQGcFmaJgB", // Adam — español neutro
  model: "eleven_multilingual_v2" as const,
} as const;

export const TEXT_GENERATION = {
  model: "gpt-4o-mini" as const,
  temperature: 0.7,
  maxTokens: 3000,
} as const;
