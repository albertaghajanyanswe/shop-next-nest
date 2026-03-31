'use client';
import * as React from 'react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { HeartIcon, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { cn } from '@/utils/common';
import { Logo } from '../logo/Logo';
import { SearchInput } from '../searchInput/SearchInput';
import { DASHBOARD_URL, PUBLIC_URL, STORE_URL } from '@/config/url.config';
import Link from 'next/link';
import { useProfile } from '@/hooks/useProfile';
import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
import { HeaderCart } from './headerCart/HeaderCart';
import { usePathname, useRouter } from 'next/navigation';
import { HeaderNavLink } from './headerMenuComponents/HeaderNavLink';
import { HeaderNavLinkBtn } from './headerMenuComponents/HeaderNavLinkBtn';
import { HeaderNavLinkUserAvatar } from './headerMenuComponents/HeaderNavLinkUserAvatar';

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

export const HeaderMenuV2 = React.forwardRef<HTMLElement, HeaderMenuProps>(
  (props, ref) => {
    const pathName = usePathname();
    const router = useRouter();
    const { user, isLoading: isLoadingUser } = useProfile();
    const containerRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    const combinedRef = useCallback(
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

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768);
        }
      };

      const resizeObserver = new ResizeObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkWidth, 150);
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      checkWidth();

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
      };
    }, []);

    // MOBILE NAV BAR
    const renderNavigationMenuMobile = useCallback(() => {
      const showMobile = 'inline-flex md:hidden w-auto justify-center p-1';
      return (
        <div className='text-shop-light-color flex flex-col items-center gap-1 text-sm font-semibold capitalize md:flex-row md:gap-4'>
          <HeaderNavLink
            href={PUBLIC_URL.home()}
            isActive={pathName === PUBLIC_URL.home()}
            label='Home'
            linkClass={showMobile}
          />
          <HeaderNavLink
            href={PUBLIC_URL.shop()}
            isActive={pathName === PUBLIC_URL.shop()}
            label='Shop'
            linkClass={showMobile}
          />
          <HeaderNavLink
            href={PUBLIC_URL.stores()}
            isActive={pathName === PUBLIC_URL.stores()}
            label='Stores'
            linkClass={showMobile}
          />
          {/* {user?.role === 'SUPER_ADMIN' && (
            <HeaderNavLink
              href={PUBLIC_URL.manageOrders()}
              isActive={pathName === PUBLIC_URL.manageOrders()}
              label='Manage Orders'
              linkClass={showMobile}
            />
          )} */}
          {!isLoadingUser && user?.stores?.length ? (
            <HeaderNavLink
              href={STORE_URL.home(user.stores[0].id)}
              isActive={pathName.includes(STORE_URL.home())}
              label='My stores'
              linkClass={showMobile}
            />
          ) : (
            !isLoadingUser &&
            user && (
              <CreateStoreModal>
                <div
                  role='button'
                  className='hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium'
                >
                  Create store
                </div>
              </CreateStoreModal>
            )
          )}
          {!isLoadingUser && !user && (
            <HeaderNavLink
              href={PUBLIC_URL.auth()}
              isActive={pathName === PUBLIC_URL.auth()}
              label='Login'
              linkClass='flex items-center whitespace-nowrap'
            >
              <LogOut className='mr-2 size-4' />
              Login Test
            </HeaderNavLink>
          )}
        </div>
      );
    }, [user, isLoadingUser, pathName]);

    // DESKTOP NAV BAR
    const renderNavigationMenuDesktop = useCallback(() => {
      const showDesktop = 'hidden md:inline-flex';

      return (
        <div className='text-shop-light-color flex flex-row items-center gap-2 text-sm font-semibold capitalize md:gap-4'>
          <HeaderNavLink
            href={PUBLIC_URL.home()}
            isActive={pathName === PUBLIC_URL.home()}
            label='Home'
            linkClass={showDesktop}
          />
          <HeaderNavLink
            href={PUBLIC_URL.shop()}
            isActive={pathName === PUBLIC_URL.shop()}
            label='Shop'
            linkClass={showDesktop}
          />
          <HeaderNavLink
            href={PUBLIC_URL.stores()}
            isActive={pathName === PUBLIC_URL.stores()}
            label='Stores'
            linkClass={showDesktop}
          />
          {/* {user?.role === 'SUPER_ADMIN' && (
            <HeaderNavLink
              href={PUBLIC_URL.manageOrders()}
              isActive={pathName === PUBLIC_URL.manageOrders()}
              label='Manage Orders'
              linkClass={showDesktop}
            />
          )} */}
          {user?.stores?.length ? (
            <HeaderNavLink
              href={STORE_URL.home(user.stores[0].id)}
              isActive={pathName.includes(STORE_URL.home())}
              label='My stores'
              linkClass={showDesktop}
            />
          ) : (
            !isLoadingUser &&
            user && (
              <CreateStoreModal>
                <div
                  role='button'
                  className='hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-0 py-2 text-sm font-medium'
                >
                  Create store
                </div>
              </CreateStoreModal>
            )
          )}

          {!isLoadingUser && user && (
            <HeaderNavLinkBtn
              onClick={() => router.push(DASHBOARD_URL.favorites())}
              badge={user?.favorites?.length}
              isActive={pathName === DASHBOARD_URL.favorites()}
              Icon={HeartIcon}
            />
          )}

          <HeaderCart triggerBtnClass='' />

          {user && (
            <HeaderNavLinkUserAvatar
              user={user}
              url={DASHBOARD_URL.settings()}
            />
          )}

          {!isLoadingUser && !user && (
            <Link href={PUBLIC_URL.auth()}>
              <Button variant='default' className='w-full'>
                <LogOut className='mr-2 size-4 text-white' />
                Login Test
              </Button>
            </Link>
          )}
        </div>
      );
    }, [user, isLoadingUser, pathName, router]);

    return (
      <header
        ref={combinedRef}
        className={cn(
          'global-container bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md [&_*]:no-underline'
        )}
        {...props}
      >
        <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4'>
          <div className='flex w-full items-center gap-2 lg:gap-6'>
            {/* MOBILE Nav Bar */}
            <div className='order-1 inline-flex flex-none md:hidden'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className='group hover:bg-accent hover:text-accent-foreground h-9 w-9'
                    variant='ghost'
                    size='icon'
                    aria-label='Open Menu'
                  >
                    <Menu />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-64 p-4'>
                  {renderNavigationMenuMobile()}
                </PopoverContent>
              </Popover>
            </div>

            {/* Logo */}
            <button
              onClick={(e) => e.preventDefault()}
              className='text-primary hover:text-primary/90 order-2 flex flex-none items-center space-x-2 md:order-1'
            >
              <div className='text-2xl'>
                <Logo />
              </div>
            </button>

            {/* Search */}
            {pathName !== PUBLIC_URL.shop() && (
              <div className='order-2 hidden w-full flex-1 px-4 md:flex'>
                <SearchInput searchFields={['id', 'title', 'description']} />
              </div>
            )}

            {/* DESKTOP Nav Bar */}
            <div className='order-3 ml-auto flex flex-none items-center gap-6'>
              {renderNavigationMenuDesktop()}
            </div>
          </div>
        </div>
      </header>
    );
  }
);

HeaderMenuV2.displayName = 'HeaderMenu';
