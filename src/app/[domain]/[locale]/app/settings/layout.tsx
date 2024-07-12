'use client';
import { useI18n } from '@/locales/client';
import Link from 'next/link';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = useI18n();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row w-full gap-6 justify-center">
        <div className="flex flex-col gap-4">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">{t('settings.title')}</h1>
          </div>
          <nav className="flex flex-col gap-4 text-sm text-muted-foreground">
            <Link href="/settings" className="font-semibold text-primary">
              {t('settings.general')}
            </Link>
            <Link href="/settings/security" className="hover:text-primary">
              {t('settings.security')}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-6 w-3/5">{children}</div>
      </div>
    </div>
  );
}
