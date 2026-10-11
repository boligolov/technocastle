import { t, type Lang } from '../i18n/utils';

type Node = Record<string, unknown>;

const authorName = 'TechnoCastle';
const authorProfiles = [
  'https://author.today/u/technomagian/works',
  'https://github.com/boligolov',
  'https://www.instagram.com/technomagian',
  'https://t.me/turbofox',
];

/** Drops empty values so optional frontmatter fields don't produce empty properties. */
function compact(node: Node): Node {
  return Object.fromEntries(
    Object.entries(node).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)),
  );
}

/** Builders for schema.org JSON-LD nodes; pass the result to BaseLayout's `jsonLd`. */
export function schema(site: URL | undefined, lang: Lang) {
  const abs = (path: string) => new URL(path, site).href;
  const authorRef = { '@id': abs('/#author') };

  return {
    author: (): Node => ({
      '@type': 'Person',
      '@id': abs('/#author'),
      name: authorName,
      url: abs(`/${lang}/contact/`),
      image: abs('/images/author.jpg'),
      sameAs: authorProfiles,
    }),

    website: (): Node => ({
      '@type': 'WebSite',
      '@id': abs('/#website'),
      name: 'TechnoCastle',
      url: abs(`/${lang}/`),
      description: t(lang).home.tagline,
      inLanguage: lang,
      author: authorRef,
    }),

    /** `trail` is the path from the section down to the current page; Home is added automatically. */
    breadcrumbs: (trail: { name: string; path: string }[]): Node => ({
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: t(lang).nav.home, path: `/${lang}/` }, ...trail].map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: abs(item.path),
      })),
    }),

    book: (book: {
      path: string; title: string; description?: string; genre: string;
      year: number; image?: string; ageRating?: string;
    }): Node => compact({
      '@type': 'Book',
      name: book.title,
      url: abs(book.path),
      description: book.description,
      genre: book.genre,
      inLanguage: lang,
      copyrightYear: book.year,
      image: book.image && abs(book.image),
      contentRating: book.ageRating,
      author: authorRef,
    }),

    story: (story: {
      path: string; title: string; description?: string; tags: string[];
      date: Date; image?: string; translator?: string;
    }): Node => compact({
      '@type': 'ShortStory',
      name: story.title,
      url: abs(story.path),
      description: story.description,
      genre: story.tags,
      inLanguage: lang,
      datePublished: story.date.toISOString().slice(0, 10),
      image: story.image && abs(story.image),
      author: authorRef,
      translator: story.translator && { '@type': 'Person', name: story.translator },
    }),

    project: (project: {
      path: string; title: string; description: string; tags: string[];
      date: Date; image?: string; url?: string;
    }): Node => compact({
      '@type': 'SoftwareSourceCode',
      name: project.title,
      url: abs(project.path),
      description: project.description,
      keywords: project.tags.join(', '),
      inLanguage: lang,
      dateCreated: project.date.toISOString().slice(0, 10),
      image: project.image && abs(project.image),
      sameAs: project.url,
      author: authorRef,
    }),

    profilePage: (path: string): Node => ({
      '@type': 'ProfilePage',
      url: abs(path),
      inLanguage: lang,
      mainEntity: authorRef,
    }),
  };
}
