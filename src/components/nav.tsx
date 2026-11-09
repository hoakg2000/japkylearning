'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const items = [
  { href: '/home', key: 'today', icon: '☀' },
  { href: '/learn', key: 'learn', icon: '📖' },
  { href: '/review', key: 'review', icon: '🔁' },
  { href: '/me', key: 'me', icon: '👤' },
] as const;

/** 4-tab bottom bar on mobile, inline links on desktop (docs/06-UI-UX.md §6). */
export function MainNav({ variant }: { variant: 'top' | 'bottom' }) {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  if (variant === 'top') {
    return (
      <nav aria-label={t('label')} className="hidden gap-1 md:flex">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            aria-current={pathname.startsWith(i.href) ? 'page' : undefined}
            className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface-2 aria-[current=page]:bg-surface-2 aria-[current=page]:text-ink"
          >
            {t(i.key)}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label={t('label')} className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={pathname.startsWith(i.href) ? 'page' : undefined}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs text-muted aria-[current=page]:text-brand"
            >
              <span aria-hidden className="text-lg">{i.icon}</span>
              {t(i.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
