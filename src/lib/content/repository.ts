import {
  SiteData,
  Project,
  Member,
  BudgetType,
  ProcessStep,
  Faq,
  PageTexts,
} from "./schemas";

export interface ContentRepository {
  getSiteData(): Promise<SiteData>;
  updateSiteData(data: SiteData): Promise<void>;

  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  createProject(project: Project): Promise<void>;
  updateProject(slug: string, project: Project): Promise<void>;
  deleteProject(slug: string): Promise<void>;

  getTeam(): Promise<Member[]>;
  getMember(slug: string): Promise<Member | null>;
  createMember(member: Member): Promise<void>;
  updateMember(slug: string, member: Member): Promise<void>;
  deleteMember(slug: string): Promise<void>;

  getBudgetTypes(): Promise<BudgetType[]>;
  updateBudgetTypes(budgetTypes: BudgetType[]): Promise<void>;
  getBudgetExtras(): Promise<string[]>;
  updateBudgetExtras(extras: string[]): Promise<void>;
  getBudgetSectors(): Promise<string[]>;
  updateBudgetSectors(sectors: string[]): Promise<void>;
  getBudgetTimes(): Promise<string[]>;
  updateBudgetTimes(times: string[]): Promise<void>;

  getProcessSteps(): Promise<ProcessStep[]>;
  updateProcessSteps(steps: ProcessStep[]): Promise<void>;
  getSprintLoop(): Promise<string[]>;
  updateSprintLoop(loop: string[]): Promise<void>;

  getFaqs(): Promise<Faq[]>;
  updateFaqs(faqs: Faq[]): Promise<void>;

  getPageTexts(): Promise<PageTexts>;
  updatePageTexts(texts: PageTexts): Promise<void>;

  // Cambia el orden guardado de proyectos o del equipo (recibe los slugs en el orden nuevo)
  reorderProjects(slugs: string[]): Promise<void>;
  reorderTeam(slugs: string[]): Promise<void>;
}
