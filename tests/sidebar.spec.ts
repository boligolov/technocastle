import { test, expect } from '@playwright/test';

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
    await expect(bookLink).toHaveAttribute('href', '/en/books');
  });

  test('nav links work for Russian', async ({ page }) => {
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');

    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('TechnoCastle');

    const booksLink = page.locator('.nav-link', { hasText: 'Книги' });
    await expect(booksLink).toHaveAttribute('href', '/ru/books');
  });

  test('nav links work for Polish', async ({ page }) => {
    await page.goto('/pl');
    await page.waitForLoadState('domcontentloaded');

    const booksLink = page.locator('.nav-link', { hasText: 'Książki' });
    await expect(booksLink).toHaveAttribute('href', '/pl/books');
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
  test('stories list page loads and shows story items', async ({ page }) => {
    await page.goto('/ru/stories');
    await page.waitForLoadState('domcontentloaded');
    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('Рассказы');
    const items = page.locator('.story-item');
    const count = await items.count();
    expect(count).toBe(5);
  });

  test('stories list shows for all languages', async ({ page }) => {
    for (const lang of ['en', 'pl']) {
      const res = await page.goto(`/${lang}/stories`);
      expect(res!.status()).toBe(200);
      const items = page.locator('.story-item');
      const count = await items.count();
      expect(count).toBe(5);
    }
  });

  test('story item links to individual story page', async ({ page }) => {
    await page.goto('/en/stories');
    await page.waitForLoadState('domcontentloaded');
    const firstLink = page.locator('.story-title-link').first();
    await firstLink.click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/en\/stories\/[a-z-]+/);
  });

  test('individual story page has title, content, and footer', async ({ page }) => {
    await page.goto('/ru/stories/signal-noise');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-header h1')).toHaveText('Сигнал/Шум');
    await expect(page.locator('.story-content')).toBeVisible();
    await expect(page.locator('.story-footer')).toBeVisible();
    await expect(page.locator('.story-date')).toBeVisible();
    await expect(page.locator('.story-location')).toBeVisible();
  });

  test('story with epigraph shows epigraph block', async ({ page }) => {
    await page.goto('/en/stories/signal-noise');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-epigraph')).toBeVisible();
    await expect(page.locator('.story-epigraph cite')).toContainText('TechnoCastle');
  });

  test('story without epigraph has no epigraph block', async ({ page }) => {
    await page.goto('/en/stories/cartographers-confession');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-epigraph')).toHaveCount(0);
  });

  test('story with image shows hero image', async ({ page }) => {
    await page.goto('/ru/stories/signal-noise');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-hero-image')).toBeVisible();
  });

  test('back link on story page goes to stories list', async ({ page }) => {
    await page.goto('/pl/stories/typed-words');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.story-back').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/pl\/stories\/?$/);
  });

  test('story footer shows date and location', async ({ page }) => {
    await page.goto('/en/stories/loop-condition');
    await page.waitForLoadState('domcontentloaded');
    const date = await page.locator('.story-date').textContent();
    expect(date).toBeTruthy();
    const location = await page.locator('.story-location').textContent();
    expect(location).toContain('Berlin');
  });

  test('translated story shows LLM translator with badge', async ({ page }) => {
    await page.goto('/en/stories/signal-noise');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-translator')).toBeVisible();
    await expect(page.locator('.translator-name')).toContainText('Claude');
    await expect(page.locator('.translator-badge')).toHaveText('LLM');
  });

  test('translated story shows human translator with email link', async ({ page }) => {
    await page.goto('/pl/stories/cartographers-confession');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-translator')).toBeVisible();
    const link = page.locator('a.translator-name');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^mailto:/);
  });

  test('original (ru) story has no translator block', async ({ page }) => {
    await page.goto('/ru/stories/signal-noise');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.story-translator')).toHaveCount(0);
  });
});

test.describe('Projects', () => {
  test('projects list page shows 4 projects', async ({ page }) => {
    await page.goto('/ru/projects');
    await page.waitForLoadState('domcontentloaded');
    const h1 = await page.locator('.page-content h1').textContent();
    expect(h1).toBe('Проекты');
    const items = page.locator('.project-item');
    await expect(items).toHaveCount(4);
  });

  test('projects list shows for all languages', async ({ page }) => {
    for (const lang of ['en', 'pl']) {
      const res = await page.goto(`/${lang}/projects`);
      expect(res!.status()).toBe(200);
      await expect(page.locator('.project-item')).toHaveCount(4);
    }
  });

  test('project item links to individual project page', async ({ page }) => {
    await page.goto('/en/projects');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.project-title-link').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/en\/projects\/[a-z-]+$/);
  });

  test('individual project page has title, content, and footer', async ({ page }) => {
    await page.goto('/ru/projects/worldbuilding-engine');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.project-header h1')).toContainText('Движок миростроения');
    await expect(page.locator('.project-content')).toBeVisible();
    await expect(page.locator('.project-footer')).toBeVisible();
  });

  test('project with image shows hero image', async ({ page }) => {
    await page.goto('/en/projects/syntax-garden');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.project-hero-image')).toBeVisible();
  });

  test('project without image has no hero image', async ({ page }) => {
    await page.goto('/en/projects/marginalia');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.project-hero-image')).toHaveCount(0);
  });

  test('back link goes to projects list', async ({ page }) => {
    await page.goto('/pl/projects/dialogue-machine');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.project-back').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/pl\/projects\/?$/);
  });

  test('project footer shows date and status', async ({ page }) => {
    await page.goto('/en/projects/worldbuilding-engine');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.project-date')).toBeVisible();
    await expect(page.locator('.project-status')).toBeVisible();
  });

  test('project with URL shows link', async ({ page }) => {
    await page.goto('/en/projects/worldbuilding-engine');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.project-url')).toBeVisible();
  });
});

test.describe('Books', () => {
  test('books list page shows 3 books with covers', async ({ page }) => {
    await page.goto('/ru/books');
    await page.waitForLoadState('domcontentloaded');
    const items = page.locator('.book-item');
    await expect(items).toHaveCount(3);
    const covers = page.locator('.book-cover');
    await expect(covers).toHaveCount(3);
  });

  test('books list shows for all languages', async ({ page }) => {
    for (const lang of ['en', 'pl']) {
      const res = await page.goto(`/${lang}/books`);
      expect(res!.status()).toBe(200);
      await expect(page.locator('.book-item')).toHaveCount(3);
    }
  });

  test('book list item links to book info page', async ({ page }) => {
    await page.goto('/en/books');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.book-title-link').first().click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/en\/books\/[a-z-]+$/);
  });

  test('book info page has cover, title, rating, description, chapters', async ({ page }) => {
    await page.goto('/ru/books/obsidian-gate');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.book-cover')).toBeVisible();
    await expect(page.locator('.book-right h1')).toContainText('Обсидиановые врата');
    await expect(page.locator('.book-rating')).toHaveText('16+');
    await expect(page.locator('.book-description')).toBeVisible();
    await expect(page.locator('.chapter-list li')).toHaveCount(5);
  });

  test('chapter links point to read page with anchors', async ({ page }) => {
    await page.goto('/en/books/cartography-of-silence');
    await page.waitForLoadState('domcontentloaded');
    const firstChapterLink = page.locator('.chapter-list li a').first();
    const href = await firstChapterLink.getAttribute('href');
    expect(href).toMatch(/\/en\/books\/cartography-of-silence\/read#ch-1$/);
  });

  test('book read page loads and has chapter headings with IDs', async ({ page }) => {
    await page.goto('/en/books/cartography-of-silence/read');
    await page.waitForLoadState('domcontentloaded');
    const h2s = page.locator('.book-text h2[id^="ch-"]');
    const count = await h2s.count();
    expect(count).toBe(4);
  });

  test('anchor navigation works on read page', async ({ page }) => {
    await page.goto('/en/books/obsidian-gate/read#ch-3');
    await page.waitForLoadState('domcontentloaded');
    const ch3 = page.locator('#ch-3');
    await expect(ch3).toBeVisible();
  });

  test('in-progress book shows correct status', async ({ page }) => {
    await page.goto('/ru/books');
    await page.waitForLoadState('domcontentloaded');
    const inProgressStatus = page.locator('.book-status.in-progress');
    await expect(inProgressStatus.first()).toBeVisible();
  });

  test('back link on book info page goes to books list', async ({ page }) => {
    await page.goto('/pl/books/recursion-protocol');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.book-back').click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/pl\/books\/?$/);
  });
});

test.describe('Pagination', () => {
  test('page 1 shows 10 cards', async ({ page }) => {
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(10);
  });

  test('page 2 exists and shows remaining cards', async ({ page }) => {
    const res = await page.goto('/ru/2');
    expect(res!.status()).toBe(200);
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('pagination nav is visible', async ({ page }) => {
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.pagination')).toBeVisible();
  });

  test('next link on page 1 goes to page 2', async ({ page }) => {
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');
    const next = page.locator('.pagination-link.next');
    await expect(next).not.toHaveClass(/disabled/);
    await next.click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/ru/2');
  });

  test('prev link on page 2 goes back to page 1', async ({ page }) => {
    await page.goto('/ru/2');
    await page.waitForLoadState('domcontentloaded');
    const prev = page.locator('.pagination-link.prev');
    await expect(prev).not.toHaveClass(/disabled/);
    await prev.click();
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toMatch(/\/ru\/?$/);
  });

  test('hero section only on page 1', async ({ page }) => {
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.hero')).toBeVisible();

    await page.goto('/ru/2');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.hero')).toHaveCount(0);
  });

  test('cards are sorted by date (newest first)', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');
    const firstTitle = await page.locator('.card h3').first().textContent();
    expect(firstTitle).toBe('The Obsidian Gate');
  });

  test('pagination works for all languages', async ({ page }) => {
    for (const lang of ['en', 'pl']) {
      const res = await page.goto(`/${lang}/2`);
      expect(res!.status()).toBe(200);
      const cards = await page.locator('.card').count();
      expect(cards).toBeGreaterThan(0);
    }
  });

  test('card image appears on the right', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');
    const img = page.locator('.card-image').first();
    if (await img.count() > 0) {
      const order = await img.evaluate(el => getComputedStyle(el).order);
      expect(order).toBe('1');
    }
  });
});
