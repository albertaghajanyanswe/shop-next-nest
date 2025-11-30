'use client';
import { usePathname } from 'next/navigation';
import { IMenuItem } from './menu.interface';
import Link from 'next/link';
import { cn } from '@/utils/common';

interface MenuItemProps {
  route: IMenuItem;
  showOnlyIcon?: boolean;
}

export function MenuItem({ route, showOnlyIcon }: MenuItemProps) {
  const pathName = usePathname();
  const isActive = pathName === route.link;
  return (
    <Link
      href={route.link}
      className={cn(
        'flex items-center gap-x-3 rounded-lg bg-transparent px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-shop-dark-green hover:text-white ',
        isActive &&
          'text-white bg-shop-dark-green hover:bg-shop-dark-green hover:text-white'
      )}
    >
      <route.icon className='size-5' />
      {!showOnlyIcon && <span>{route.value}</span>}
    </Link>
  );
}
