import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const latest = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/latest' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    link: z.string(),
    lang: z.enum(['ru', 'pl', 'en']),
    date: z.coerce.date(),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    epigraph: z.string().optional(),
    epigraphAuthor: z.string().optional(),
    lang: z.enum(['ru', 'pl', 'en']),
    date: z.coerce.date(),
    location: z.string().optional(),
    storySlug: z.string(),
    translator: z.object({
      name: z.string(),
      type: z.enum(['human', 'llm']),
      email: z.email().optional(),
    }).optional(),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    readMore: z.string().optional(),
    genre: z.string(),
    cover: z.string(),
    ageRating: z.string().optional(),
    status: z.enum(['published', 'in-progress']),
    year: z.number(),
    lang: z.enum(['ru', 'pl', 'en']),
    bookSlug: z.string(),
    chapters: z.array(z.object({
      id: z.string(),
      title: z.string(),
    })),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    lang: z.enum(['ru', 'pl', 'en']),
    date: z.coerce.date(),
    projectSlug: z.string(),
    status: z.enum(['active', 'archived', 'planned']).optional(),
    url: z.string().optional(),
  }),
});

export const collections = { latest, stories, books, projects };
