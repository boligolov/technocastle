import { test, expect } from '@playwright/test';
import { hiddenBookSlugs } from '../src/config/books.mjs';
import { langs, loadCollection, inLang, chapterIds, translator, isReadable, type Entry } from './content';

// Expectations for content pages come from src/content, see ./content.ts
const stories = loadCollection('stories');
const projects = loadCollection('projects');
const books = loadCollection('books');
const latest = loadCollection('latest');

const isHidden = (book: Entry) => hiddenBookSlugs.includes(book.data.bookSlug);
const pageSize = 10;

test.describe('Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('sidebar is visible by default', async ({ page }) => {
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toBeVisible();
    const box = await sidebar.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
  });

  test('collapse button hides sidebar', async ({ page }) => {
    await expect(page.locator('#sidebar')).toBeVisible();
    await page.click('#sidebarToggle');
    await page.waitForTimeout(400);
    await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
  });

  test('toggle button restores sidebar after collapse', async ({ page }) => {
    const toggleBtn = page.locator('#sidebarToggle');
    await expect(toggleBtn).toBeVisible();

    await toggleBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
    await expect(toggleBtn).toBeVisible();

    await toggleBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('body')).not.toHaveClass(/sidebar-collapsed/);
  });

  test('sidebar state persists across reload', async ({ page }) => {
    await page.click('#sidebarToggle');
    await page.waitForTimeout(400);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
    await expect(page.locator('#sidebarToggle')).toBeVisible();
  });
});

test.describe('Theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('toggles between light and dark', async ({ page }) => {
    const html = page.locator('html');
    const initial = await html.getAttribute('data-theme');

    await page.click('#themeToggle');
    expect(await html.getAttribute('data-theme')).not.toBe(initial);

    await page.click('#themeToggle');
    expect(await html.getAttribute('data-theme')).toBe(initial);
  });

  test('theme persists across reload', async ({ page }) => {
    await page.click('#themeToggle');
    const after = await page.locator('html').getAttribute('data-theme');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    expect(await page.locator('html').getAttribute('data-theme')).toBe(after);
  });
});

test.describe('Accent color', () => {
  test('is #0080ff in light mode', async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    );
    expect(accent).toBe('#0080ff');
  });
});

test.describe('Navigation (i18n)', () => {
  const langs = ['en', 'ru', 'pl'];
  const pages = ['', '/books', '/stories', '/projects', '/contact'];

  for (const lang of langs) {
    for (const pg of pages) {
      test(`/${lang}${pg} loads with 200`, async ({ page }) => {
        const res = await page.goto(`/${lang}${pg}`);
        expect(res!.status()).toBe(200);
      });
    }
  }

  test('root / redirects to a supported language', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/(ru|pl|en)/);
  });

  test('root / respects browser language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'pl-PL' });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/pl');
    await context.close();
  });

  test('root / falls back to /ru for unsupported language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'ja-JP' });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/ru');
    await context.close();
  });

  test('nav links have correct lang prefix', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const bookLink = page.locator('.nav-link', { hasText: 'Books' });
    await expect(bookLink).toHaveAttribute('href', '/en/books/');
  });

  test('nav links work for Russian', async ({ page }) => {
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');

    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('TechnoCastle');

    const booksLink = page.locator('.nav-link', { hasText: 'Книги' });
    await expect(booksLink).toHaveAttribute('href', '/ru/books/');
  });

  test('nav links work for Polish', async ({ page }) => {
    await page.goto('/pl');
    await page.waitForLoadState('domcontentloaded');

    const booksLink = page.locator('.nav-link', { hasText: 'Książki' });
    await expect(booksLink).toHaveAttribute('href', '/pl/books/');
  });
});

test.describe('Language switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('shows all 3 language buttons inline', async ({ page }) => {
    const btns = page.locator('.lang-btn');
    await expect(btns).toHaveCount(3);
    await expect(btns.nth(0)).toBeVisible();
  });

  test('current language has active class', async ({ page }) => {
    const active = page.locator('.lang-btn.active');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText('EN');
  });

  test('switching to Russian navigates to /ru', async ({ page }) => {
    await page.click('.lang-btn:has-text("RU")');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/ru');
    const active = page.locator('.lang-btn.active');
    await expect(active).toHaveText('RU');
  });

  test('switching to Polish navigates to /pl', async ({ page }) => {
    await page.click('.lang-btn:has-text("PL")');
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/pl');
    const active = page.locator('.lang-btn.active');
    await expect(active).toHaveText('PL');
  });

  test('switching language preserves current page', async ({ page }) => {
    await page.goto('/en/books');
    await page.waitForLoadState('domcontentloaded');

    await page.click('.lang-btn:has-text("RU")');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/ru/books');
    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('Книги');
  });

  test('active lang button is bold with no background', async ({ page }) => {
    const activeBtn = page.locator('.lang-btn.active');
    const [bg, fw] = await activeBtn.evaluate(el => {
      const s = getComputedStyle(el);
      return [s.backgroundColor, s.fontWeight];
    });
    expect(bg).toBe('rgba(0, 0, 0, 0)');
    expect(fw).toBe('700');
  });

  test('Russian books page shows translated content', async ({ page }) => {
    await page.goto('/ru/books');
    await page.waitForLoadState('domcontentloaded');
    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('Книги');
  });

  test('Polish stories page shows translated content', async ({ page }) => {
    await page.goto('/pl/stories');
    await page.waitForLoadState('domcontentloaded');
    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('Opowiadania');
  });
});

test.describe('Stories', () => {
  for (const lang of langs) {
    test(`/${lang}/stories lists every story`, async ({ page }) => {
      const res = await page.goto(`/${lang}/stories/`);
      expect(res!.status()).toBe(200);
      await expect(page.locator('.story-item')).toHaveCount(inLang(stories, lang).length);
    });
  }

  test('story item links to individual story page', async ({ page }) => {
    await page.goto('/en/stories/');
    await page.locator('.story-title-link').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/en\/stories\/[a-z-]+\/$/);
  });

  for (const story of stories) {
    const url = `/${story.lang}/stories/${story.data.storySlug}/`;

    test(`${url} shows title, text and footer`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.story-header h1')).toHaveText(story.data.title);
      await expect(page.locator('.story-content')).toBeVisible();
      await expect(page.locator('.story-footer')).toBeVisible();
      await expect(page.locator('.story-date')).toBeVisible();
      if (story.data.location) {
        await expect(page.locator('.story-location')).toHaveText(story.data.location);
      } else {
        await expect(page.locator('.story-location')).toHaveCount(0);
      }
    });

    test(`${url} shows epigraph and hero image only when set`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.story-epigraph')).toHaveCount(story.data.epigraph ? 1 : 0);
      await expect(page.locator('.story-hero-image')).toHaveCount(story.data.image ? 1 : 0);
    });

    test(`${url} credits the translator only when there is one`, async ({ page }) => {
      await page.goto(url);
      const credit = translator(story);
      if (!credit) {
        await expect(page.locator('.story-translator')).toHaveCount(0);
        return;
      }
      await expect(page.locator('.story-translator')).toBeVisible();
      await expect(page.locator('.translator-name')).toContainText(credit.name);
      await expect(page.locator('.translator-badge')).toHaveCount(credit.type === 'llm' ? 1 : 0);
      if (credit.type === 'human' && credit.email) {
        await expect(page.locator('a.translator-name')).toHaveAttribute('href', `mailto:${credit.email}`);
      }
    });
  }

  test('back link on story page goes to stories list', async ({ page }) => {
    const story = inLang(stories, 'pl')[0];
    await page.goto(`/pl/stories/${story.data.storySlug}/`);
    await page.locator('.story-back').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/pl\/stories\/$/);
  });
});

test.describe('Projects', () => {
  for (const lang of langs) {
    test(`/${lang}/projects lists every project`, async ({ page }) => {
      const res = await page.goto(`/${lang}/projects/`);
      expect(res!.status()).toBe(200);
      await expect(page.locator('.project-item')).toHaveCount(inLang(projects, lang).length);
    });
  }

  test('project item links to individual project page', async ({ page }) => {
    await page.goto('/en/projects/');
    await page.locator('.project-title-link').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/en\/projects\/[a-z-]+\/$/);
  });

  for (const project of projects) {
    const url = `/${project.lang}/projects/${project.data.projectSlug}/`;

    test(`${url} shows title, text and footer`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.project-header h1')).toHaveText(project.data.title);
      await expect(page.locator('.project-content')).toBeVisible();
      await expect(page.locator('.project-footer')).toBeVisible();
      await expect(page.locator('.project-date')).toBeVisible();
    });

    test(`${url} shows image, status and link only when set`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.project-hero-image')).toHaveCount(project.data.image ? 1 : 0);
      await expect(page.locator('.project-status')).toHaveCount(project.data.status ? 1 : 0);
      if (project.data.url) {
        await expect(page.locator('.project-url')).toHaveAttribute('href', project.data.url);
      } else {
        await expect(page.locator('.project-url')).toHaveCount(0);
      }
    });
  }

  test('back link goes to projects list', async ({ page }) => {
    const project = inLang(projects, 'pl')[0];
    await page.goto(`/pl/projects/${project.data.projectSlug}/`);
    await page.locator('.project-back').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/pl\/projects\/$/);
  });
});

test.describe('Books', () => {
  for (const lang of langs) {
    test(`/${lang}/books lists every book that is not hidden, with covers`, async ({ page }) => {
      const res = await page.goto(`/${lang}/books/`);
      expect(res!.status()).toBe(200);
      const visible = inLang(books, lang).filter(book => !isHidden(book));
      await expect(page.locator('.book-item')).toHaveCount(visible.length);
      await expect(page.locator('.book-cover')).toHaveCount(visible.length);
    });
  }

  test('book list item links to book info page', async ({ page }) => {
    await page.goto('/en/books/');
    await page.locator('.book-title-link').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/en\/books\/[a-z-]+\/$/);
  });

  test('in-progress book shows correct status', async ({ page }) => {
    const inProgress = inLang(books, 'ru').filter(book => !isHidden(book) && book.data.status === 'in-progress');
    await page.goto('/ru/books/');
    await expect(page.locator('.book-status.in-progress')).toHaveCount(inProgress.length);
  });

  for (const book of books) {
    const url = `/${book.lang}/books/${book.data.bookSlug}/`;
    const chapters = chapterIds(book);

    test(`${url} shows cover, title, rating and description`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.book-cover')).toBeVisible();
      await expect(page.locator('.book-right h1')).toHaveText(book.data.title);
      await expect(page.locator('.book-description')).toBeVisible();
      if (book.data.ageRating) {
        await expect(page.locator('.book-rating')).toHaveText(book.data.ageRating);
      } else {
        await expect(page.locator('.book-rating')).toHaveCount(0);
      }
    });

    test(`${url} is noindex only when the book is hidden`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(isHidden(book) ? 1 : 0);
    });

    if (isReadable(book)) {
      test(`${url} links every chapter to the reading page`, async ({ page }) => {
        await page.goto(url);
        await expect(page.locator('.book-read-btn')).toHaveAttribute('href', `${url}read/`);
        const links = page.locator('.chapter-list li a');
        await expect(links).toHaveCount(chapters.length);
        for (const [idx, id] of chapters.entries()) {
          await expect(links.nth(idx)).toHaveAttribute('href', `${url}read/#${id}`);
        }
      });

      test(`${url}read/ has a heading for every chapter anchor`, async ({ page }) => {
        const res = await page.goto(`${url}read/`);
        expect(res!.status()).toBe(200);
        for (const id of chapters) {
          await expect(page.locator(`.book-text [id="${id}"]`), `chapter anchor #${id}`).toHaveCount(1);
        }
      });
    } else {
      test(`${url} has no reading page while the text is missing`, async ({ page }) => {
        await page.goto(url);
        await expect(page.locator('.book-read-btn')).toHaveCount(0);
        await expect(page.locator('.chapter-list')).toHaveCount(0);
        if (book.data.readMore) {
          await expect(page.locator('.book-read-more')).toHaveText(book.data.readMore);
        }
        const res = await page.goto(`${url}read/`);
        expect(res!.status()).toBe(404);
      });
    }
  }

  test('back link on book info page goes to books list', async ({ page }) => {
    const book = inLang(books, 'pl')[0];
    await page.goto(`/pl/books/${book.data.bookSlug}/`);
    await page.locator('.book-back').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/pl\/books\/$/);
  });
});

test.describe('Latest and pagination', () => {
  for (const lang of langs) {
    const items = inLang(latest, lang);
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

    test(`/${lang} shows the first page of cards under the hero`, async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.card')).toHaveCount(Math.min(items.length, pageSize));
    });

    test(`/${lang} cards are sorted by date (newest first)`, async ({ page }) => {
      const newestDate = items.map(item => item.data.date).sort().at(-1);
      // Several items may share the newest date, any of them may come first
      const newestTitles = items.filter(item => item.data.date === newestDate).map(item => item.data.title);
      await page.goto(`/${lang}/`);
      const firstTitle = await page.locator('.card h3').first().textContent();
      expect(newestTitles).toContain(firstTitle);
    });

    if (pageCount > 1) {
      test(`/${lang} next link goes to page 2 and prev link comes back`, async ({ page }) => {
        await page.goto(`/${lang}/`);
        await expect(page.locator('.pagination')).toBeVisible();
        await page.locator('a.pagination-link.next').click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch(new RegExp(`/${lang}/2/$`));

        await page.locator('a.pagination-link.prev').click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch(new RegExp(`/${lang}/$`));
      });

      test(`/${lang}/2 shows the next cards without the hero`, async ({ page }) => {
        const res = await page.goto(`/${lang}/2/`);
        expect(res!.status()).toBe(200);
        await expect(page.locator('.hero')).toHaveCount(0);
        await expect(page.locator('.card')).toHaveCount(Math.min(items.length - pageSize, pageSize));
      });
    } else {
      test(`/${lang} has no pagination while everything fits on one page`, async ({ page }) => {
        await page.goto(`/${lang}/`);
        await expect(page.locator('.pagination')).toHaveCount(0);
        const res = await page.goto(`/${lang}/2/`);
        expect(res!.status()).toBe(404);
      });
    }
  }

  test('card image appears on the right', async ({ page }) => {
    const withImage = latest.find(item => item.data.image);
    test.skip(!withImage, 'no news item has an image');
    await page.goto(`/${withImage!.lang}/`);
    const order = await page.locator('.card-image').first().evaluate(el => getComputedStyle(el).order);
    expect(order).toBe('1');
  });
});
