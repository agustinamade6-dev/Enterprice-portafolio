import { contentRepo } from "@/lib/content";
import Link from "next/link";
import { FolderGit2, Users, MessageCircleQuestion, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch stats concurrently
  const [projects, team, faqs] = await Promise.all([
    contentRepo.getProjects(),
    contentRepo.getTeam(),
    contentRepo.getFaqs(),
  ]);

  const stats = [
    {
      name: "Proyectos",
      value: projects.length,
      icon: FolderGit2,
      href: "/admin/projects",
      description: "Trabajos y conceptos",
    },
    {
      name: "Equipo",
      value: team.length,
      icon: Users,
      href: "/admin/team",
      description: "Miembros y roles",
    },
    {
      name: "FAQs",
      value: faqs.length,
      icon: MessageCircleQuestion,
      href: "/admin/faqs",
      description: "Preguntas frecuentes",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 text-paper/70">Resumen del contenido de tu portafolio.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-brand" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-paper/60">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 px-6 py-3">
                <div className="text-sm">
                  <Link
                    href={stat.href}
                    className="flex items-center font-medium text-brand hover:text-brand-dark"
                  >
                    Gestionar {stat.name.toLowerCase()}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
