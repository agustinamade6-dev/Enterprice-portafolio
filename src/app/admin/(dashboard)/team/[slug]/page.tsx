import { contentRepo } from "@/lib/content";
import { TeamForm } from "@/components/admin/TeamForm";
import { notFound } from "next/navigation";

export default async function EditTeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const member = await contentRepo.getMember(resolvedParams.slug);

  if (!member) {
    notFound();
  }

  return <TeamForm member={member} isNew={false} />;
}
