'use client';
import { usePathname } from 'next/navigation';
import { IMenuItem } from './menu.interface';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  route: IMenuItem;
}

export function MenuItem({ route }: MenuItemProps) {
  const pathName = usePathname();
  const isActive = pathName === route.link;
  return (
    <Link
      href={route.link}
      className={cn(
        'flex items-center gap-x-3 rounded-lg bg-transparent px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-blue-200/20 hover:text-blue-500 hover:drop-shadow-sm',
        isActive &&
          'bg-blue-200/20 text-sm text-blue-500 hover:bg-blue-200/20 hover:text-blue-500'
      )}
    >
      <route.icon className='size-5' />
      <span>{route.value}</span>
    </Link>
  );
}
