'use client';

import { DASHBOARD_URL } from '@/config/url.config';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function StoreNoteBlock() {
  const t = useTranslations('StoreNote');
  return (
    <div className='mt-16 flex items-start gap-2 rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-4 text-sm text-yellow-900'>
      <AlertTriangle className='mt-1 h-5 w-5 flex-shrink-0' />
      <div>
        <strong className='text-lg'>{t('title')}</strong>
        <p className='text-md spacing mt-2 font-medium tracking-wide'>
          {t('description')}
        </p>
      </div>
    </div>
  );
}
