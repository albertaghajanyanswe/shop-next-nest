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
      title={showOnlyIcon ? route.value : undefined}
      className={cn(
        'group relative flex items-center rounded-xl border-l-[3px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
        showOnlyIcon ? 'justify-center px-2' : 'gap-x-3',
        // Active: light tinted background + primary text + curved left border
        isActive && 'bg-primary-100 text-shop-primary border-shop-primary',
        // Not active: muted text + hover goes to light primary tint
        !isActive &&
          'text-shop-muted-text-7 hover:bg-primary-100 hover:text-shop-primary border-transparent',
        className
      )}
    >
      <route.icon
        className={cn(
          'shrink-0 transition-transform duration-200',
          showOnlyIcon ? 'size-5' : 'size-[18px]',
          !isActive && 'group-hover:scale-110'
        )}
      />

      {!showOnlyIcon && (
        <>
          <span className='flex-1 truncate'>{route.value}</span>
          {/* Active dot indicator */}
          {isActive && (
            <span className='bg-shop-primary ml-auto size-1.5 shrink-0 rounded-full' />
          )}
        </>
      )}
    </Link>
  );
}
