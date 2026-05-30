import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Archivo PDF requerido" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "El archivo debe ser un PDF" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El PDF no puede superar 5MB" },
        { status: 400 }
      );
    }

    const { extractTextFromPdf } = await import("@/lib/utils/pdf");
    const text = await extractTextFromPdf(file);

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al procesar el PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
