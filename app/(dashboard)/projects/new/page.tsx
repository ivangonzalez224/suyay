import { PageHeader } from "@/components/shared/page-header";
import { NewProjectForm } from "@/components/projects/new-project-form";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo proyecto — Suyay",
};

export default function NewProjectPage() {
  return (
    <div className="max-w-xl space-y-8">
      <PageHeader
        title="Nuevo proyecto"
        description="Configura tu video antes de agregar el contenido."
      />
      <Card>
        <CardContent className="pt-6">
          <NewProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}
