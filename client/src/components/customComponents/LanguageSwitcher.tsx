'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // router.replace automatically handles the locale prefix
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className='flex flex-col items-start gap-8'>
      <ButtonGroup>
        <Button
          variant={locale === 'en' ? 'default' : 'outline'}
          onClick={() => switchLocale('en')}
          className={`w-12 rounded-sm px-3 py-1 text-xs font-semibold transition-colors`}
        >
          EN
        </Button>
        <Button
          // disabled
          variant={locale === 'ru' ? 'default' : 'outline'}
          onClick={() => switchLocale('ru')}
          className={`w-12 rounded-sm px-3 py-1 text-xs font-semibold transition-colors`}
        >
          RU
        </Button>
      </ButtonGroup>
    </div>
  );
}
