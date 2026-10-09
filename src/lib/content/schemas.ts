import { z } from "zod";

export const SiteDataSchema = z.object({
  name: z.string(),
  owner: z.string(),
  tagline: z.string(),
  description: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  instagram: z.string(),
  photo: z.string().optional(),
  github: z.string(),
  url: z.string(),
});

export type SiteData = z.infer<typeof SiteDataSchema>;

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  sector: z.string(),
  kind: z.enum(["real", "desarrollo", "facultad", "concepto"]),
  summary: z.string(),
  result: z.string(),
  tags: z.array(z.string()),
  href: z.string().optional(),
  accent: z.string(),
  image: z.string().optional(),
  modules: z.array(z.string()).optional(),
  chat: z
    .array(
      z.object({
        from: z.enum(["bot", "user"]),
        text: z.string(),
      })
    )
    .optional(),
  by: z.array(z.string()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ChapterSchema = z.object({
  label: z.string(),
  title: z.string(),
  text: z.string(),
  href: z.string().optional(),
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const MemberSchema = z.object({
  slug: z.string(),
  name: z.string(),
  fullName: z.string(),
  role: z.string(),
  photo: z.string().optional(),
  href: z.string().optional(),
  network: z.enum(["Instagram", "LinkedIn"]).optional(),
  bio: z.string(),
  skills: z.array(z.string()),
  story: z.object({
    intro: z.string(),
    chapters: z.array(ChapterSchema),
    pending: z.string().optional(),
  }),
});

export type Member = z.infer<typeof MemberSchema>;

export const BudgetTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  forWho: z.string(),
  options: z.array(z.string()),
});

export type BudgetType = z.infer<typeof BudgetTypeSchema>;

export const ProcessStepSchema = z.object({
  title: z.string(),
  text: z.string(),
  details: z.array(z.string()),
});

export type ProcessStep = z.infer<typeof ProcessStepSchema>;

export const FaqSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export type Faq = z.infer<typeof FaqSchema>;
