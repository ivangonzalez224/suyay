"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileText, Link2, FileUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  saveTextContentAction,
  saveUrlContentAction,
  savePdfContentAction,
} from "@/lib/actions/project.actions";

type InputTab = "TEXT" | "URL" | "PDF";

const tabs: { value: InputTab; label: string; icon: React.ElementType }[] = [
  { value: "TEXT", label: "Texto", icon: FileText },
  { value: "URL", label: "URL", icon: Link2 },
  { value: "PDF", label: "PDF", icon: FileUp },
];

interface Project {
  id: string;
  inputType: string | null;
  inputText: string | null;
  inputUrl: string | null;
}

interface ContentInputProps {
  project: Project;
}

export function ContentInput({ project }: ContentInputProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<InputTab>(
    (project.inputType as InputTab) ?? "TEXT"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado local de cada tab
  const [text, setText] = useState(project.inputText ?? "");
  const [url, setUrl] = useState(project.inputUrl ?? "");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string>("");

  const charCount = text.length;
  const charLimit = 10000;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData();
    let result: { success: boolean; error?: string };

    try {
      if (activeTab === "TEXT") {
        formData.append("inputText", text);
        result = await saveTextContentAction(project.id, formData);
      } else if (activeTab === "URL") {
        formData.append("inputUrl", url);
        result = await saveUrlContentAction(project.id, formData);
      } else {
        if (!pdfFile) {
          setError("Selecciona un archivo PDF");
          setIsLoading(false);
          return;
        }
        formData.append("pdf", pdfFile);
        result = await savePdfContentAction(project.id, formData);
      }

      if (!result.success) {
        setError(result.error ?? "Error al guardar el contenido");
        return;
      }

      setSuccess(true);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfName(file.name);
    }
  };

  const isSubmitDisabled =
    isLoading ||
    (activeTab === "TEXT" && text.trim().length < 50) ||
    (activeTab === "URL" && url.trim().length === 0) ||
    (activeTab === "PDF" && !pdfFile);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-muted flex w-fit gap-1 rounded-lg p-1">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setActiveTab(value);
              setError(null);
              setSuccess(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              activeTab === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className="space-y-3">
        {activeTab === "TEXT" && (
          <div className="space-y-2">
            <Label htmlFor="text-input">
              Pega tu texto, artículo o transcript
            </Label>
            <Textarea
              id="text-input"
              placeholder="Pega aquí el contenido que quieres convertir en video. Puede ser un artículo, transcript, ensayo o cualquier texto..."
              className="min-h-56 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={charLimit}
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Mínimo 50 caracteres</span>
              <span
                className={cn(charCount > charLimit * 0.9 && "text-amber-500")}
              >
                {charCount.toLocaleString()} / {charLimit.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {activeTab === "URL" && (
          <div className="space-y-2">
            <Label htmlFor="url-input">URL del artículo o página web</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://ejemplo.com/articulo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Suyay extraerá el texto de la página automáticamente. Solo
              funciona con páginas públicas.
            </p>
          </div>
        )}

        {activeTab === "PDF" && (
          <div className="space-y-2">
            <Label htmlFor="pdf-input">Archivo PDF</Label>
            <div
              className={cn(
                "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                pdfFile
                  ? "border-violet-500/50 bg-violet-500/5"
                  : "border-border hover:border-violet-500/30"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type === "application/pdf") {
                  setPdfFile(file);
                  setPdfName(file.name);
                  setError(null);
                } else if (file) {
                  setError("Solo se aceptan archivos PDF");
                }
              }}
            >
              {pdfFile ? (
                <div className="space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-violet-500" />
                  <p className="text-sm font-medium">{pdfName}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFile(null);
                      setPdfName("");
                    }}
                    className="text-muted-foreground hover:text-foreground text-xs underline"
                  >
                    Cambiar archivo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileUp className="text-muted-foreground mx-auto h-8 w-8" />
                  <div>
                    <p className="text-sm font-medium">
                      Arrastra tu PDF aquí o{" "}
                      <label
                        htmlFor="pdf-input"
                        className="cursor-pointer text-violet-500 hover:underline"
                      >
                        selecciona un archivo
                      </label>
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Máximo 5MB · Solo texto (no imágenes escaneadas)
                    </p>
                  </div>
                </div>
              )}
              <input
                id="pdf-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-md border px-4 py-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-400">
            Contenido guardado. Listo para generar el storyboard.
          </p>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {activeTab === "URL" ? "Extrayendo texto..." : "Guardando..."}
          </>
        ) : (
          "Guardar contenido"
        )}
      </Button>
    </div>
  );
}
