export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const { extractText } = await import("unpdf");
  const result = await extractText(new Uint8Array(arrayBuffer));

  const cleanText = result.text.join("\n").trim();

  if (cleanText.length === 0) {
    throw new Error(
      "No se pudo extraer texto del PDF. Verifica que no sea una imagen escaneada."
    );
  }

  return cleanText;
}
