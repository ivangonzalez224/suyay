export async function extractTextFromUrl(url: string): Promise<string> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Suyay/1.0)",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
  } catch {
    throw new Error(
      "No se pudo acceder a la URL. Verifica que sea pública y esté disponible."
    );
  }

  if (!response.ok) {
    throw new Error(`La URL retornó error ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (
    !contentType.includes("text/html") &&
    !contentType.includes("text/plain")
  ) {
    throw new Error(
      "La URL no contiene texto legible. Solo se aceptan páginas web o texto plano."
    );
  }

  const html = await response.text();

  // Extracción básica: remover tags HTML
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (text.length < 50) {
    throw new Error("No se pudo extraer suficiente texto de la URL.");
  }

  // Limitar a 8000 caracteres para no exceder el contexto de OpenAI
  return text.slice(0, 8000);
}
