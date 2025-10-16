'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { getTranslations, type Locale, defaultLocale } from '../lib/i18n';

export function useTranslation() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // 从 params 中获取 locale，如果没有则使用默认值
  const locale = (params?.locale as Locale) || defaultLocale;
  const t = getTranslations(locale);

  return {
    t,
    locale,
    push: router.push,
    pathname,
  };
}