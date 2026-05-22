'use client';

import { useGetColorById } from '@/hooks/queries/colors/useGetColorById';
import { ColorForm } from '../ColorForm';
import { useTranslations } from 'next-intl';

export function ColorEdit() {
  const t = useTranslations('StorePages');
  const { color, isLoadingColor } = useGetColorById();
  if (isLoadingColor) return <div>{t('loading')}</div>;

  if (!color) return <div>{t('color_not_found')}</div>;

  return <ColorForm color={color} />;
}
