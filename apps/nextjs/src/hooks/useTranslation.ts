import { useRouter } from 'next/router';
import { getTranslations, type Locale, defaultLocale } from '../lib/i18n.ts';

export function useTranslation() {
  const router = useRouter();
  const locale = (router.locale as Locale) || defaultLocale;
  const t = getTranslations(locale);

  return {
    t,
    locale,
    locales: router.locales,
    push: router.push,
    pathname: router.pathname,
    query: router.query,
  };
}