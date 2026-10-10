import { z } from "zod";

// Reglas comunes. Los textos tienen largo máximo y los enlaces solo pueden ser páginas propias
// ("/..."), https, mailto o tel: así nadie puede guardar un "javascript:..." que ejecute código al hacer clic.
const text = (max = 300) => z.string().trim().max(max);
const longText = (max = 3000) => z.string().trim().max(max);
const SAFE_LINK = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;
const link = () =>
  z.string().trim().max(500).refine((v) => v === "" || SAFE_LINK.test(v), {
    message: "El enlace tiene que empezar con https://, / o mailto:",
  });
const imagePath = () =>
  z.string().trim().max(300).refine((v) => v === "" || /^\/[\w\-./%]+$/.test(v) || /^https:\/\//.test(v), {
    message: "La imagen tiene que ser una ruta de la página (/...) o un enlace https",
  });
const slug = () =>
  z.string().trim().min(1).max(60).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: "Solo letras minúsculas, números y guiones (ej: akros-cafe)",
  });

export const SiteDataSchema = z.object({
  name: text(80),
  owner: text(120),
  tagline: text(300),
  description: longText(600),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, { message: "Solo números, con código de país (ej: 5493815100710)" }),
  email: z.string().trim().email().max(200),
  instagram: link(),
  photo: imagePath().optional(),
  github: link(),
  url: link(),
});

export type SiteData = z.infer<typeof SiteDataSchema>;

export const ProjectSchema = z.object({
  slug: slug(),
  title: text(120),
  sector: text(120),
  kind: z.enum(["real", "desarrollo", "facultad", "concepto"]),
  summary: longText(1000),
  result: longText(600),
  tags: z.array(text(40)).max(20),
  href: link().optional(),
  // Clases de color de Tailwind (ej: "from-amber-500 to-orange-600")
  accent: z.string().trim().max(120).regex(/^[\w\-\[\]#: .]*$/),
  image: imagePath().optional(),
  modules: z.array(text(120)).max(30).optional(),
  chat: z
    .array(
      z.object({
        from: z.enum(["bot", "user"]),
        text: longText(600),
      })
    )
    .max(30)
    .optional(),
  by: z.array(text(60)).max(10).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ChapterSchema = z.object({
  label: text(60),
  title: text(160),
  text: longText(2000),
  href: link().optional(),
});

export type Chapter = z.infer<typeof ChapterSchema>;

export const MemberSchema = z.object({
  slug: slug(),
  name: text(60),
  fullName: text(120),
  role: text(120),
  photo: imagePath().optional(),
  href: link().optional(),
  network: z.enum(["Instagram", "LinkedIn"]).optional(),
  bio: longText(1000),
  skills: z.array(text(60)).max(30),
  story: z.object({
    intro: longText(2000),
    chapters: z.array(ChapterSchema).max(30),
    pending: longText(1000).optional(),
  }),
});

export type Member = z.infer<typeof MemberSchema>;

export const BudgetTypeSchema = z.object({
  id: slug(),
  name: text(80),
  forWho: text(200),
  options: z.array(text(120)).max(30),
});

export type BudgetType = z.infer<typeof BudgetTypeSchema>;

export const ProcessStepSchema = z.object({
  title: text(120),
  text: longText(600),
  details: z.array(text(200)).max(20),
});

export type ProcessStep = z.infer<typeof ProcessStepSchema>;

export const FaqSchema = z.object({
  q: text(200),
  a: longText(1500),
});

export type Faq = z.infer<typeof FaqSchema>;

// Textos fijos de la página de inicio (títulos, botones, frases de Bit, pie y SEO).
// Lo que está entre llaves, como {nombre}, se reemplaza solo por el dato del sitio.
const BIT_POSES = ["saludando", "principal", "programando", "pensando", "festejando"] as const;
const BitLineSchema = z.object({ pose: z.enum(BIT_POSES), text: text(120) });
const SectionHeadSchema = z.object({ eyebrow: text(60), title: text(160), text: longText(1200) });

export const PageTextsSchema = z.object({
  hero: z.object({
    badge: text(80),
    titleStart: text(120),
    titleHighlight: text(80),
    titleEnd: text(160),
    subtitleExtra: text(300),
    buttonProjects: text(40),
    buttonWhatsapp: text(60),
    whatsappMessage: text(300),
    cardLabel: text(60),
    cardTitle: text(100),
  }),
  projects: SectionHeadSchema,
  services: SectionHeadSchema.extend({ note: longText(600) }),
  process: SectionHeadSchema.extend({ sprintTitle: text(60), sprintRepeat: text(160) }),
  team: SectionHeadSchema,
  faqs: SectionHeadSchema,
  contact: SectionHeadSchema.extend({ whatsappLabel: text(40), whatsappMessage: text(300) }),
  footer: z.object({ note: text(160) }),
  seo: z.object({ titleSuffix: text(120) }),
  bit: z.object({
    hero: BitLineSchema,
    projects: BitLineSchema,
    services: BitLineSchema,
    process: BitLineSchema,
    team: BitLineSchema,
    faqs: BitLineSchema,
    contact: BitLineSchema,
    click: z.array(text(120)).min(1).max(20),
  }),
});

export type PageTexts = z.infer<typeof PageTextsSchema>;
