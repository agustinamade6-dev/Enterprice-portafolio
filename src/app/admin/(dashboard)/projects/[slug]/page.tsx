import { contentRepo } from "@/lib/content";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await contentRepo.getProject(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} isNew={false} />;
}
