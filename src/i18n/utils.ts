import { ui, defaultLocale, type Locale, type UIKey } from './ui';

export function getLocaleFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  if (maybeLocale === 'en') return 'en';
  return 'de';
}

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'de') return clean === '/' ? '/' : clean;
  return clean === '/' ? '/en/' : `/en${clean}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'de' ? 'en' : 'de';
}

export function switchLocalePath(currentPath: string, target: Locale): string {
  const stripped = currentPath.replace(/^\/en(\/|$)/, '/');
  return localizePath(stripped, target);
}

export function statusLabel(
  status: 'live' | 'archived' | 'in-development',
  locale: Locale,
): string {
  const key = `status.${status}` as UIKey;
  return ui[locale][key] ?? status;
}
