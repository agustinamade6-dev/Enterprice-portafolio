import fs from "fs/promises";
import path from "path";
import { ContentRepository } from "../repository";
import {
  SiteData,
  Project,
  Member,
  BudgetType,
  ProcessStep,
  Faq,
  PageTexts,
} from "../schemas";

// Using process.cwd() ensures we look at the root of the project
const dataDir = path.join(process.cwd(), "src", "content", "data");

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Ignore if exists
  }
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(dataDir, filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    // Si no existe el archivo, devolvemos el fallback que vendrá de site.ts
    return fallback;
  }
}

// Guardado seguro: antes de pisar un archivo se copia la versión anterior a data/respaldos/
// (se guardan las últimas 20 de cada uno), y el archivo nuevo se escribe aparte y después se renombra.
// Así, si algo se corta a mitad de camino, nunca queda un archivo roto.
const KEEP_BACKUPS = 20;
async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);
  const backups = path.join(dataDir, "respaldos");
  try {
    await fs.mkdir(backups, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.copyFile(filePath, path.join(backups, `${stamp}__${filename}`));
    const mine = (await fs.readdir(backups)).filter((f) => f.endsWith(`__${filename}`)).sort();
    await Promise.all(mine.slice(0, -KEEP_BACKUPS).map((f) => fs.unlink(path.join(backups, f))));
  } catch {
    // Primera vez: todavía no hay archivo que respaldar
  }
  const tmp = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, filePath);
}

export class JsonAdapter implements ContentRepository {
  // Para los fallbacks, vamos a requerir site.ts dinámicamente para no ensuciar el adaptador
  // y permitir que site.ts siga siendo la fuente de la verdad por defecto.
  private async getFallbacks() {
    return await import("@/content/site");
  }

  async getSiteData(): Promise<SiteData> {
    const fallback = await this.getFallbacks();
    return readJson<SiteData>("site.json", fallback.site);
  }
  async updateSiteData(data: SiteData): Promise<void> {
    await writeJson("site.json", data);
  }

  async getProjects(): Promise<Project[]> {
    const fallback = await this.getFallbacks();
    return readJson<Project[]>("projects.json", fallback.projects);
  }
  async getProject(slug: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find((p) => p.slug === slug) || null;
  }
  async createProject(project: Project): Promise<void> {
    const projects = await this.getProjects();
    if (projects.some(p => p.slug === project.slug)) throw new Error("Project slug already exists");
    projects.push(project);
    await writeJson("projects.json", projects);
  }
  async updateProject(slug: string, project: Project): Promise<void> {
    const projects = await this.getProjects();
    const index = projects.findIndex((p) => p.slug === slug);
    if (index === -1) throw new Error("Project not found");
    projects[index] = project;
    await writeJson("projects.json", projects);
  }
  async deleteProject(slug: string): Promise<void> {
    const projects = await this.getProjects();
    const updated = projects.filter((p) => p.slug !== slug);
    await writeJson("projects.json", updated);
  }

  async getTeam(): Promise<Member[]> {
    const fallback = await this.getFallbacks();
    return readJson<Member[]>("team.json", fallback.team);
  }
  async getMember(slug: string): Promise<Member | null> {
    const team = await this.getTeam();
    return team.find((m) => m.slug === slug) || null;
  }
  async createMember(member: Member): Promise<void> {
    const team = await this.getTeam();
    if (team.some(m => m.slug === member.slug)) throw new Error("Member slug already exists");
    team.push(member);
    await writeJson("team.json", team);
  }
  async updateMember(slug: string, member: Member): Promise<void> {
    const team = await this.getTeam();
    const index = team.findIndex((m) => m.slug === slug);
    if (index === -1) throw new Error("Member not found");
    team[index] = member;
    await writeJson("team.json", team);
  }
  async deleteMember(slug: string): Promise<void> {
    const team = await this.getTeam();
    const updated = team.filter((m) => m.slug !== slug);
    await writeJson("team.json", updated);
  }

  async getBudgetTypes(): Promise<BudgetType[]> {
    const fallback = await this.getFallbacks();
    return readJson<BudgetType[]>("budgetTypes.json", fallback.budgetTypes);
  }
  async updateBudgetTypes(budgetTypes: BudgetType[]): Promise<void> {
    await writeJson("budgetTypes.json", budgetTypes);
  }

  async getBudgetExtras(): Promise<string[]> {
    const fallback = await this.getFallbacks();
    return readJson<string[]>("budgetExtras.json", fallback.budgetExtras);
  }
  async updateBudgetExtras(extras: string[]): Promise<void> {
    await writeJson("budgetExtras.json", extras);
  }

  async getBudgetSectors(): Promise<string[]> {
    const fallback = await this.getFallbacks();
    return readJson<string[]>("budgetSectors.json", fallback.budgetSectors);
  }
  async updateBudgetSectors(sectors: string[]): Promise<void> {
    await writeJson("budgetSectors.json", sectors);
  }

  async getBudgetTimes(): Promise<string[]> {
    const fallback = await this.getFallbacks();
    return readJson<string[]>("budgetTimes.json", fallback.budgetTimes);
  }
  async updateBudgetTimes(times: string[]): Promise<void> {
    await writeJson("budgetTimes.json", times);
  }

  async getProcessSteps(): Promise<ProcessStep[]> {
    const fallback = await this.getFallbacks();
    return readJson<ProcessStep[]>("process.json", fallback.process);
  }
  async updateProcessSteps(steps: ProcessStep[]): Promise<void> {
    await writeJson("process.json", steps);
  }

  async getSprintLoop(): Promise<string[]> {
    const fallback = await this.getFallbacks();
    return readJson<string[]>("sprintLoop.json", fallback.sprintLoop);
  }
  async updateSprintLoop(loop: string[]): Promise<void> {
    await writeJson("sprintLoop.json", loop);
  }

  async getFaqs(): Promise<Faq[]> {
    const fallback = await this.getFallbacks();
    return readJson<Faq[]>("faqs.json", fallback.faqs);
  }
  async updateFaqs(faqs: Faq[]): Promise<void> {
    await writeJson("faqs.json", faqs);
  }

  async getPageTexts(): Promise<PageTexts> {
    const { pageTexts } = await this.getFallbacks();
    const saved = await readJson<Partial<PageTexts>>("pageTexts.json", {});
    // Se completa con los textos por defecto: si más adelante se agrega un texto nuevo, aparece solo
    const merged = { ...pageTexts } as Record<string, unknown>;
    for (const [key, value] of Object.entries(saved)) {
      const base = merged[key];
      merged[key] =
        base && typeof base === "object" && !Array.isArray(base) && value && typeof value === "object" && !Array.isArray(value)
          ? { ...base, ...value }
          : value;
    }
    return merged as PageTexts;
  }
  async updatePageTexts(texts: PageTexts): Promise<void> {
    await writeJson("pageTexts.json", texts);
  }

  async reorderProjects(slugs: string[]): Promise<void> {
    await writeJson("projects.json", reorder(await this.getProjects(), slugs));
  }
  async reorderTeam(slugs: string[]): Promise<void> {
    await writeJson("team.json", reorder(await this.getTeam(), slugs));
  }
}

// Ordena según la lista de slugs; si falta alguno (o sobra), no se toca nada y se avisa
function reorder<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  const bySlug = new Map(items.map((i) => [i.slug, i]));
  if (slugs.length !== items.length || new Set(slugs).size !== slugs.length || slugs.some((s) => !bySlug.has(s))) {
    throw new Error("El orden no coincide con la lista actual");
  }
  return slugs.map((s) => bySlug.get(s)!);
}
