import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads the site's Markdown content so tests derive their expectations from it
 * instead of hard-coding titles and counts that go stale as content changes.
 */

export const langs = ['en', 'ru', 'pl'] as const;
export type Lang = (typeof langs)[number];

export interface Entry {
  lang: Lang;
  /** Top-level scalar frontmatter fields, unquoted */
  data: Record<string, string>;
  /** Raw frontmatter, for nested fields */
  frontmatter: string;
  body: string;
}

function unquote(value: string): string {
  const v = value.trim();
  if (v.startsWith('"')) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  return v;
}

export function loadCollection(name: string): Entry[] {
  const dir = path.resolve('src/content', name);
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const source = fs.readFileSync(path.join(dir, file), 'utf-8').replace(/\r\n/g, '\n');
      const [, frontmatter = '', body = ''] = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) ?? [];
      const data: Record<string, string> = {};
      for (const line of frontmatter.split('\n')) {
        const field = line.match(/^(\w+):\s*(.*)$/);
        if (field) data[field[1]] = unquote(field[2]);
      }
      return { lang: data.lang as Lang, data, frontmatter, body };
    });
}

export function inLang(entries: Entry[], lang: Lang): Entry[] {
  return entries.filter(entry => entry.lang === lang);
}

/** The text of a nested block such as `translator:` or `chapters:`, up to the next top-level field. */
function block(entry: Entry, key: string): string {
  return entry.frontmatter.match(new RegExp(`^${key}:([\\s\\S]*?)(?=^\\w+:|(?![\\s\\S]))`, 'm'))?.[1] ?? '';
}

export function chapterIds(book: Entry): string[] {
  return [...block(book, 'chapters').matchAll(/id:\s*"([^"]*)"/g)].map(match => match[1]);
}

export function translator(story: Entry): { name: string; type: string; email?: string } | undefined {
  const text = block(story, 'translator');
  const get = (key: string) => text.match(new RegExp(`^\\s+${key}:\\s*(.*)$`, 'm'))?.[1];
  const name = get('name');
  const type = get('type');
  if (!name || !type) return undefined;
  const email = get('email');
  return { name: unquote(name), type: unquote(type), email: email && unquote(email) };
}

/** Mirrors isReadable() in src/utils/books.ts: the book has a reading page. */
export function isReadable(book: Entry): boolean {
  return !book.data.readMore && book.body.trim().length > 0;
}
