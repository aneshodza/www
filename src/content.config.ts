import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localeEnum = z.enum(['de', 'en']);

/**
 * Use the full path (e.g. "de/localmate") as the entry id so DE and EN
 * files with the same filename do not collapse onto the same id.
 */
const pathId = ({ entry }: { entry: string }) =>
  entry.replace(/\.[^.]+$/, '');

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    generateId: pathId,
  }),
  schema: z.object({
    slug: z.string(),
    locale: localeEnum,
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    status: z.enum(['live', 'archived', 'in-development']),
    statusLabel: z.string(),
    year: z.string(),
    tech: z.array(z.string()),
    links: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const experience = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/experience',
    generateId: pathId,
  }),
  schema: z.object({
    locale: localeEnum,
    company: z.string(),
    role: z.string(),
    location: z.string(),
    period: z.string(),
    order: z.number(),
    tech: z.array(z.string()).default([]),
  }),
});

const education = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/education',
    generateId: pathId,
  }),
  schema: z.object({
    locale: localeEnum,
    institution: z.string(),
    qualification: z.string(),
    period: z.string(),
    grade: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { projects, experience, education };
