'use client';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  BookOpenIcon,
  InfoIcon,
  LifeBuoyIcon,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/NavigationMenu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { Logo } from '../logo/Logo';
import { SITE_NAME } from '@/meta/constants';
import { SearchInput } from '../searchInput/SearchInput';
import { DASHBOARD_URL, PUBLIC_URL, STORE_URL } from '@/config/url.config';
import Link from 'next/link';
import { Loader } from '@/components/ui/Loader';
import { useProfile } from '@/hooks/useProfile';
import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
import Image from 'next/image';
import { HeaderCart } from './headerCart/HeaderCart';
import { usePathname } from 'next/navigation';

// Types
export interface HeaderMenuNavItem {
  href?: string;
  label: string;
  submenu?: boolean;
  type?: 'description' | 'simple' | 'icon';
  items?: Array<{
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
}
export interface HeaderMenuProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: HeaderMenuNavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

export const HeaderMenu = React.forwardRef<HTMLElement, HeaderMenuProps>(
  (props, ref) => {
    const pathName = usePathname();

    const { user, isLoading } = useProfile();
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const [currentPath, setCurrentPath] = useState(pathName);
    useEffect(() => {
      setCurrentPath(pathName);
    }, [pathName]);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };
      checkWidth();
      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const renderNavigationMenuListItems = () => {
      const activeClass =
        'text-sm text-blue-500 hover:bg-blue-200/20 hover:text-blue-500';

      return (
        <>
          <NavigationMenuItem className='w-full md:w-auto'>
            <HeaderCart triggerBtnClass='w-full md:w-auto justify-start md:justify-center' />
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`w-full md:w-auto ${currentPath === PUBLIC_URL.explorer() ? activeClass : ''}`}
          >
            <NavigationMenuLink
              asChild
              className={
                navigationMenuTriggerStyle() +
                ' w-full items-start md:w-auto md:items-center'
              }
            >
              <Link
                href={PUBLIC_URL.explorer()}
                className={
                  currentPath === PUBLIC_URL.explorer() ? activeClass : ''
                }
              >
                Catalog
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {isLoading ? (
            <Loader size='sm' className={isMobile ? 'ml-6' : ''} />
          ) : user ? (
            <>
              <NavigationMenuItem className='w-full md:w-auto'>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ' w-full items-start md:w-auto md:items-center'
                  }
                >
                  <Link
                    href={DASHBOARD_URL.favorites()}
                    className={
                      currentPath === DASHBOARD_URL.favorites()
                        ? activeClass
                        : ''
                    }
                  >
                    Favorites
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {user.stores.length ? (
                <NavigationMenuItem className='w-full md:w-auto'>
                  <NavigationMenuLink
                    asChild
                    className={
                      navigationMenuTriggerStyle() +
                      ' w-full items-start md:w-auto md:items-center'
                    }
                  >
                    <Link
                      href={STORE_URL.home(user.stores[0].id)}
                      className={
                        currentPath === STORE_URL.home(user.stores[0].id)
                          ? activeClass
                          : ''
                      }
                    >
                      My stores
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <CreateStoreModal>
                  <div role='button' className='hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium'>
                    Create store
                  </div>
                </CreateStoreModal>
              )}
              <NavigationMenuItem className='flex w-full min-w-fit md:w-auto'>
                <NavigationMenuLink
                  asChild
                  className={
                    navigationMenuTriggerStyle() +
                    ' w-full items-start md:w-auto md:items-center'
                  }
                >
                  <Link
                    href={DASHBOARD_URL.home()}
                    className={
                      currentPath === DASHBOARD_URL.home()
                        ? `${activeClass} bg-inherit`
                        : 'bg-inherit'
                    }
                  >
                    {isMobile ? (
                      'Orders'
                    ) : (
                      <Image
                        src={user.picture || '/images/no-user-image.png'}
                        alt={user.name}
                        width={42}
                        height={42}
                        className='rounded-full'
                      />
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem className={isMobile ? 'mt-4 w-full' : 'ml-6'}>
              <Link href={PUBLIC_URL.auth()}>
                <Button variant='primary' className='w-full'>
                  <LogOut className='mr-2 size-4 text-white' />
                  Login
                </Button>
              </Link>
            </NavigationMenuItem>
          )}
        </>
      );
    };
    return (
      <header
        ref={combinedRef}
        className={cn(
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur md:px-6 [&_*]:no-underline'
        )}
        {...props}
      >
        <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4'>
          {/* Left side */}
          <div className='flex w-full items-center gap-2'>
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className='group hover:bg-accent hover:text-accent-foreground h-9 w-9'
                    variant='ghost'
                    size='icon'
                  >
                    <Menu />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-64 p-1'>
                  <NavigationMenu className='min-w-full' viewport={false}>
                    <div className='CCC w-full'>
                      <NavigationMenuList className='flex-col items-start gap-1 md:gap-0'>
                        {renderNavigationMenuListItems()}
                      </NavigationMenuList>
                    </div>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className='flex w-full items-center justify-center gap-6 md:justify-between'>
              <button
                onClick={(e) => e.preventDefault()}
                className='text-primary hover:text-primary/90 flex cursor-pointer items-center space-x-2 transition-colors'
              >
                <div className='text-2xl'>
                  <Logo />
                </div>
              </button>
              <div className='ml-auto hidden w-[40%] lg:block'>
                <SearchInput />
              </div>
              {!isMobile && (
                <NavigationMenu viewport={false}>
                  <NavigationMenuList className='whitespace-nowrap'>
                    {renderNavigationMenuListItems()}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
);
HeaderMenu.displayName = 'HeaderMenu';
