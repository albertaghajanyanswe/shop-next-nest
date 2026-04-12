'use client';
import { usePathname } from 'next/navigation';
import { IMenuItem } from './menu.interface';
import Link from 'next/link';
import { cn } from '@/utils/common';

interface MenuItemProps {
  route: IMenuItem;
  showOnlyIcon?: boolean;
  className?: string;
}

export function MenuItem({ route, showOnlyIcon, className }: MenuItemProps) {
  const pathName = usePathname();

  const lastSegment = (p: string) => p.split('/').filter(Boolean).at(-1) ?? '';
  const isActive = lastSegment(pathName) === lastSegment(route.link);

  return (
    <Link
      href={route.link}
      className={cn(
        'hover:bg-shop-primary text-shop-muted-text-7 flex items-center gap-x-3 rounded-lg bg-transparent px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:text-white',
        isActive &&
          'bg-shop-primary hover:bg-shop-primary text-white hover:text-white',
        className
      )}
    >
      <route.icon className='size-5' />
      {!showOnlyIcon && <span>{route.value}</span>}
    </Link>
  );
}
