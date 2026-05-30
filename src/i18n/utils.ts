import { translations, defaultLang, type Lang, languages } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return defaultLang;
}

export function t(lang: Lang) {
  return translations[lang];
}

export function localizedPath(lang: Lang, path: string): string {
  const clean = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return `/${lang}${clean === '/' ? '' : clean}`;
}

export function switchLangPath(currentPath: string, newLang: Lang): string {
  const stripped = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return `/${newLang}${stripped === '/' ? '' : stripped}`;
}

export { translations, defaultLang, languages, type Lang };
