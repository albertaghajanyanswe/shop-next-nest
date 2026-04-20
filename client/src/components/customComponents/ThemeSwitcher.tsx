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
    <ButtonGroup>
      <Button
        variant={theme !== 'dark' ? 'default' : 'outline'}
        size='icon'
        onClick={() => setTheme('light')}
        className='w-12'
      >
        <Sun className='h-[1.2rem] w-[1.2rem]' />
        <span className='sr-only'>{t('light')}</span>
      </Button>
      <Button
        // disabled
        variant={theme === 'dark' ? 'default' : 'outline'}
        size='icon'
        onClick={() => setTheme('dark')}
        className='w-12'
      >
        <Moon className='h-[1.2rem] w-[1.2rem]' />
        <span className='sr-only'>{t('dark')}</span>
      </Button>
    </ButtonGroup>
  );
}
