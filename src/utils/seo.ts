import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const entities: Record<string, string> = {
  '&mdash;': '—',
  '&ndash;': '–',
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&laquo;': '«',
  '&raquo;': '»',
  '&hellip;': '…',
};

/** Strips HTML tags and basic Markdown markup, collapsing whitespace. */
export function toPlainText(source: string): string {
  return source
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>)\s*/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/&[a-z]+;/g, e => entities[e] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds a meta description from HTML or Markdown: plain text cut at a word
 * boundary. Returns undefined for empty or placeholder text ("...").
 */
export function metaDescription(source: string | undefined, max = 160): string | undefined {
  const text = toPlainText(source ?? '');
  if (text.length < 10) return undefined;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > max / 2 ? lastSpace : max).replace(/[\s.,;:—–-]+$/, '') + '…';
}

/** URL of a JPEG version of the image for social previews (og:image). */
export async function socialImage(image: ImageMetadata | undefined): Promise<string | undefined> {
  if (!image) return undefined;
  const result = await getImage({
    src: image,
    // Portrait covers get a smaller width to keep the file light for messengers
    width: Math.min(image.width, image.height > image.width ? 800 : 1200),
    format: 'jpeg',
    quality: 75,
  });
  return result.src;
}
