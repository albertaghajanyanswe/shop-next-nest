'use client';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DialogDescription } from '@/components/ui/Dialog';
import { useTranslations } from 'next-intl';

export function MobileSidebar() {
  const t = useTranslations('SidebarUI');
  return (
    <Sheet>
      <SheetTrigger className='hover-opacity-75 pr-4 transition lg:hidden'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='bg-shop-white p-0'>
        <VisuallyHidden>
          <SheetTitle />
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>{t('mobile_sidebar')}</DialogDescription>
        </VisuallyHidden>

        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
