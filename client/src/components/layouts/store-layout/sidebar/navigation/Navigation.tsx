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

export function Navigation() {
  const params = useParams<{ storeId: string }>();

  const routes: IMenuItem[] = [
    {
      icon: BarChart,
      link: STORE_URL.home(params.storeId),
      value: 'Statistics',
    },
    {
      icon: FolderKanban,
      link: STORE_URL.products(params.storeId),
      value: 'Products',
    },
    {
      icon: Album,
      link: STORE_URL.categories(params.storeId),
      value: 'Categories',
    },
    {
      icon: Sparkles,
      link: STORE_URL.brands(params.storeId),
      value: 'Brands',
    },
    {
      icon: PaintBucket,
      link: STORE_URL.colors(params.storeId),
      value: 'Colors',
    },
    {
      icon: Star,
      link: STORE_URL.reviews(params.storeId),
      value: 'Reviews',
    },
    {
      icon: Settings,
      link: STORE_URL.settings(params.storeId),
      value: 'Store Settings',
    },
  ];
  return (
    <div className='mt-6 flex w-full flex-1 flex-col'>
      <div className='flex w-full flex-col space-y-3'>
        {routes.map((route) => (
          <MenuItem key={route.value} route={route} />
        ))}
      </div>
    </div>
  );
}
