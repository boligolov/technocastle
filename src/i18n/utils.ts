import { translations, defaultLang, type Lang, languages } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return defaultLang;
}

export function t(lang: Lang) {
  return translations[lang];
}

// Internal URLs always end with a slash, matching the built directory layout,
// the canonical URLs and the sitemap.
export function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : path + '/';
}

/** Adds the trailing slash to site-relative links, leaving external URLs untouched. */
export function internalHref(href: string): string {
  return href.startsWith('/') && !/[?#]/.test(href) ? withTrailingSlash(href) : href;
}

export function localizedPath(lang: Lang, path: string): string {
  const clean = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return withTrailingSlash(`/${lang}${clean}`);
}

export function switchLangPath(currentPath: string, newLang: Lang): string {
  const stripped = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return withTrailingSlash(`/${newLang}${stripped}`);
}

export { translations, defaultLang, languages, type Lang };
