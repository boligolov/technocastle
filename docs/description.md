# TechnoCastle — Site Structure

## Overview

A multilingual (RU/PL/EN) static writer's website built with **Astro v6**. Russian is the default language. Language detection on `/` uses client-side `Accept-Language` sniffing with RU fallback.

## Tech Stack

- **Astro 6.3** — static site generator (SSG)
- **@astrojs/sitemap** — auto-generated sitemap
- **Playwright** — end-to-end tests
- **Zod 4** (via `astro/zod`) — content schema validation

## File Structure

```
technocastle/
├── docs/
│   └── description.md          # this file
├── tests/
│   └── sidebar.spec.ts         # Playwright e2e tests
├── public/
│   └── images/                 # static assets (covers, illustrations)
├── src/
│   ├── content.config.ts       # content collection schemas + glob loaders
│   ├── styles/
│   │   └── global.css          # CSS variables, theme, typography, layout
│   ├── i18n/
│   │   ├── translations.ts     # all UI strings for RU/PL/EN
│   │   └── utils.ts            # getLangFromUrl, t(), localizedPath, switchLangPath
│   ├── layouts/
│   │   └── BaseLayout.astro    # shell: <head>, sidebar, content area
│   ├── components/
│   │   └── Sidebar.astro       # fixed sidebar: nav, lang switcher, theme toggle, collapse
│   ├── content/
│   │   ├── latest/             # 39 md files — homepage "Latest" feed entries
│   │   ├── stories/            # 15 md files — short fiction (5 stories × 3 langs)
│   │   ├── books/              #  9 md files — books with chapters (3 books × 3 langs)
│   │   └── projects/           # 12 md files — projects (4 projects × 3 langs)
│   └── pages/
│       ├── index.astro                     # root redirect (client-side lang detection)
│       └── [lang]/
│           ├── [...page].astro             # homepage with paginated "Latest" (10/page)
│           ├── contact.astro               # about + contact links
│           ├── stories/
│           │   ├── [...page].astro         # paginated story list (10/page, numbered from 00)
│           │   └── [slug].astro            # individual story (full text, epigraph, translator)
│           ├── books/
│           │   ├── index.astro             # book list (cover, status, genre)
│           │   ├── [slug].astro            # book detail (cover, meta, chapter list)
│           │   └── [slug]/
│           │       └── read.astro          # book reading page (full text, TOC, chapter anchors)
│           └── projects/
│               ├── [...page].astro         # paginated project list (10/page)
│               └── [slug].astro            # individual project page
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Routing

All routes are path-prefixed with language: `/{lang}/...`

| Route                           | Page                        |
|---------------------------------|-----------------------------|
| `/`                             | Client-side redirect to `/{detected_lang}` |
| `/{lang}`                       | Homepage — hero + paginated "Latest" feed |
| `/{lang}/2`, `/{lang}/3`, ...   | Latest feed pagination |
| `/{lang}/stories`               | Story list (paginated) |
| `/{lang}/stories/{storySlug}`   | Individual story |
| `/{lang}/books`                 | Book list |
| `/{lang}/books/{bookSlug}`      | Book detail (info + chapters) |
| `/{lang}/books/{bookSlug}/read` | Book reading (full text with anchor navigation) |
| `/{lang}/projects`              | Project list (paginated) |
| `/{lang}/projects/{projectSlug}`| Individual project |
| `/{lang}/contact`               | About / contact page |

## Content Collections

Defined in `src/content.config.ts`. All use `glob` loader pointing at `src/content/{collection}/`.

### latest
Homepage feed items. Each links to an existing page (story/book/project).

| Field       | Type              | Required |
|-------------|-------------------|----------|
| title       | string            | yes      |
| description | string            | yes      |
| tags        | string[]          | yes      |
| image       | string            | no       |
| link        | string            | yes      |
| lang        | ru \| pl \| en    | yes      |
| date        | date              | yes      |

### stories
Short fiction with optional epigraph and translator metadata.

| Field          | Type                            | Required |
|----------------|---------------------------------|----------|
| title          | string                          | yes      |
| description    | string                          | yes      |
| tags           | string[]                        | yes      |
| image          | string                          | no       |
| epigraph       | string                          | no       |
| epigraphAuthor | string                          | no       |
| lang           | ru \| pl \| en                  | yes      |
| date           | date                            | yes      |
| location       | string                          | no       |
| storySlug      | string                          | yes      |
| translator     | { name, type, email? }          | no       |

`translator.type`: `human` or `llm`. If human — email is a mailto link. If llm — shows "LLM" badge.

### books
Books with structured chapters. Chapter navigation uses HTML anchor IDs (`<h2 id="ch-N">`).

| Field     | Type                         | Required |
|-----------|------------------------------|----------|
| title     | string                       | yes      |
| description | string                     | yes      |
| genre     | string                       | yes      |
| cover     | string                       | yes      |
| ageRating | string                       | no       |
| status    | published \| in-progress     | yes      |
| year      | number                       | yes      |
| lang      | ru \| pl \| en               | yes      |
| bookSlug  | string                       | yes      |
| chapters  | { id: string, title: string }[] | yes   |

### projects
Projects with optional status and external URL.

| Field       | Type                              | Required |
|-------------|-----------------------------------|----------|
| title       | string                            | yes      |
| description | string                            | yes      |
| tags        | string[]                          | yes      |
| image       | string                            | no       |
| lang        | ru \| pl \| en                    | yes      |
| date        | date                              | yes      |
| projectSlug | string                            | yes      |
| status      | active \| archived \| planned     | no       |
| url         | string                            | no       |

## i18n

- 3 languages: **RU** (default), **PL**, **EN**
- All UI strings in `src/i18n/translations.ts`
- Helper functions in `src/i18n/utils.ts`:
  - `getLangFromUrl(url)` — extract lang from pathname
  - `t(lang)` — get translation object
  - `localizedPath(lang, path)` — prefix path with lang
  - `switchLangPath(currentPath, newLang)` — swap lang in existing path

## UI Components

### Sidebar (`src/components/Sidebar.astro`)
- Fixed left sidebar, collapsible (state persisted in `localStorage`)
- Navigation: 5 items with hex labels (0x0–0x4): Home, Books, Stories, Projects, Contact
- Active item: bold, inherited text color
- Language switcher: inline `RU | PL | EN`, active lang is bold
- Theme toggle: light/dark (persisted in `localStorage`)
- Collapse button: fixed position, vertically centered on sidebar's right edge; shows collapse arrows when open, expand arrows when collapsed
- Mobile: hidden by default, hamburger menu opens it as overlay

### BaseLayout (`src/layouts/BaseLayout.astro`)
- Wraps all pages: `<head>` (meta, fonts, global CSS) + sidebar + `<main>` content slot
- Content area shifts with `margin-left: var(--sidebar-width)` on desktop

## Theming

CSS custom properties in `src/styles/global.css`:
- Light/dark themes via `[data-theme]` attribute on `<html>`
- Accent color: `#0080ff`
- Typography: system font stack + `Georgia` for headings, monospace for UI elements
- No border-radius anywhere (sharp aesthetic)
