'use client';

import { STORE_URL } from '@/config/url.config';
import {
  Album,
  BarChart,
  FolderKanban,
  PaintBucket,
  Settings,
  Sparkles,
  Star,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { MenuItem } from './MenuItem';
import { IMenuItem } from './menu.interface';
import { useTranslations } from 'next-intl';

export function Navigation() {
  const params = useParams<{ storeId: string }>();
  const t = useTranslations('Navigation');

  const routes: IMenuItem[] = [
    {
      icon: BarChart,
      link: STORE_URL.home(params.storeId),
      value: t('Statistics'),
    },
    {
      icon: FolderKanban,
      link: STORE_URL.products(params.storeId),
      value: t('Products'),
    },
    {
      icon: Album,
      link: STORE_URL.categories(params.storeId),
      value: t('Categories'),
    },
    {
      icon: Sparkles,
      link: STORE_URL.brands(params.storeId),
      value: t('Brands'),
    },
    {
      icon: PaintBucket,
      link: STORE_URL.colors(params.storeId),
      value: t('Colors'),
    },
    {
      icon: Star,
      link: STORE_URL.reviews(params.storeId),
      value: t('Reviews'),
    },
    {
      icon: Settings,
      link: STORE_URL.settings(params.storeId),
      value: t('Store Settings'),
    },
  ];
  return (
    <div className='mt-6 flex w-full flex-1 flex-col'>
      <div className='flex w-full flex-col space-y-1'>
        {routes.map((route) => (
          <MenuItem key={route.value} route={route} />
        ))}
      </div>
    </div>
  );
}
