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

async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
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
}
