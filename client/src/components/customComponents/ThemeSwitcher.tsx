'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ButtonGroup } from '@/components/ui/ButtonGroup';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // Using the translations previously placed in AccountSettings schema
  const t = useTranslations('AccountSettings');

  return (
    <div className='flex flex-col gap-2 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>{t('theme')}</h3>
          <p className='text-sm text-muted-foreground'>
            <span><b className='text-shop-primary-text'>{theme === 'dark' ? t('dark') : t('light')}</b>{t('theme_active')}</span>
          </p>
        </div>
        <ButtonGroup>
          <Button
            variant={theme !== 'dark' ? 'default' : 'outline'}
            size='icon'
            onClick={() => setTheme('light')}
          >
            <Sun className='h-[1.2rem] w-[1.2rem]' />
            <span className='sr-only'>{t('light')}</span>
          </Button>
          <Button
          disabled
            variant={theme === 'dark' ? 'default' : 'outline'}
            size='icon'
            onClick={() => setTheme('dark')}
          >
            <Moon className='h-[1.2rem] w-[1.2rem]' />
            <span className='sr-only'>{t('dark')}</span>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
