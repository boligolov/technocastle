import type { CollectionEntry } from 'astro:content';
import { hiddenBookSlugs } from '../config/books.mjs';

type Book = CollectionEntry<'books'>;

export function isHiddenBook(book: Book): boolean {
  return hiddenBookSlugs.includes(book.data.bookSlug);
}

/** A book gets a reading page only when its text is there, not a "translation pending" stub. */
export function isReadable(book: Book): boolean {
  return !book.data.readMore && (book.body ?? '').trim().length > 0;
}
