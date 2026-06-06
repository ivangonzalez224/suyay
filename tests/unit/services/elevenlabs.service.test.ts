import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import path from "path";
import os from "os";

vi.mock("dotenv/config", () => ({}));

const mockConvert = vi.fn();

vi.mock("elevenlabs", () => {
  class MockElevenLabsClient {
    textToSpeech = { convert: mockConvert };
    voices = { getAll: vi.fn().mockResolvedValue({ voices: [] }) };
    constructor(_config: unknown) {}
  }
  return { ElevenLabsClient: MockElevenLabsClient };
});

import { ElevenLabsService } from "@/lib/services/elevenlabs.service";

const tmpDir = path.join(os.tmpdir(), "suyay-test-audio");
const testOutputPath = path.join(tmpDir, "test_audio.mp3");

describe("ElevenLabsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Limpiar archivos temporales
    if (existsSync(tmpDir)) {
      await rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("genera audio y lo guarda en disco", async () => {
    async function* mockStream() {
      yield Buffer.from("fake-audio-data");
    }
    mockConvert.mockResolvedValueOnce(mockStream());

    const result = await ElevenLabsService.generateVoice({
      text: "Hola mundo, este es un test de voz.",
      outputPath: testOutputPath,
    });

    // Verificar que el archivo se creó en disco
    expect(existsSync(testOutputPath)).toBe(true);
    expect(result).toBe(testOutputPath);
    expect(mockConvert).toHaveBeenCalledOnce();
  });

  it("lanza error si el texto está vacío", async () => {
    await expect(
      ElevenLabsService.generateVoice({
        text: "   ",
        outputPath: testOutputPath,
      })
    ).rejects.toThrow("no puede estar vacío");
  });
});
