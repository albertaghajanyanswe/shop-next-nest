'use client';
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  BookOpenIcon,
  HeartIcon,
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
import { cn } from '@/utils/common';
import type { ComponentProps } from 'react';
import { Logo } from '../logo/Logo';
import { SITE_NAME } from '@/utils/constants';
import { SearchInput } from '../searchInput/SearchInput';
import { DASHBOARD_URL, PUBLIC_URL, STORE_URL } from '@/config/url.config';
import Link from 'next/link';
import { Loader } from '@/components/ui/Loader';
import { useProfile } from '@/hooks/useProfile';
import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
import Image from 'next/image';
import { HeaderCart } from './headerCart/HeaderCart';
import { usePathname, useRouter } from 'next/navigation';
import { generateImgPath } from '@/utils/imageUtils';
import { GetUserDto } from '@/generated/orval/types';
import { HeaderLinkUnderline } from './headerMenuComponents/HeaderNavLinkUnderline';

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

const HEADER_DATA = (user?: GetUserDto) => {
  const storeId = user?.stores?.[0]?.id;

  return [
    {
      title: 'Catalog',
      href: PUBLIC_URL.shop(),
      show: true,
      type: 'link',
    },
    {
      title: 'Favorites',
      href: DASHBOARD_URL.favorites(),
      show: !!user,
      type: 'link',
    },
    {
      title: 'My stores',
      href: storeId ? STORE_URL.home(storeId) : null,
      show: !!storeId,
      type: 'link',
    },
    {
      title: 'Login',
      href: PUBLIC_URL.auth(),
      show: !user,
      type: 'link',
    },
    {
      title: '',
      href: DASHBOARD_URL.home(),
      show: !!user,
      type: 'userProfile',
    },
  ];
};

export const HeaderMenuV3 = React.forwardRef<HTMLElement, HeaderMenuProps>(
  (props, ref) => {
    const pathName = usePathname();
    const router = useRouter();
    const { user, isLoading } = useProfile();
    console.log('1111 USER = ', user);
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

    const renderNavigationMenuDesktop = () => {
      const showDesktop = 'hidden md:inline-flex';
      const inactiveClass =
        'hover:text-shop-light-green hoverEffect group relative';
      const activeClass = `text-shop-light-green ${inactiveClass}`;
      return (
        <div className='text-shop-light-color flex flex-row items-center gap-2 text-sm font-semibold capitalize md:gap-4'>
          <Link
            href={PUBLIC_URL.home()}
            className={`${showDesktop} ${
              currentPath === PUBLIC_URL.home() ? activeClass : inactiveClass
            }`}
          >
            Home
            <HeaderLinkUnderline isActive={currentPath === PUBLIC_URL.home()} />
          </Link>
          <Link
            href={PUBLIC_URL.shop()}
            className={`${showDesktop} ${
              currentPath === PUBLIC_URL.shop() ? activeClass : inactiveClass
            }`}
          >
            Catalog
            <HeaderLinkUnderline
              isActive={currentPath.includes(PUBLIC_URL.shop())}
            />
          </Link>

          <>
            {user?.stores?.length ? (
              <Link
                href={STORE_URL.home(user.stores[0].id)}
                className={`${showDesktop} ${
                  currentPath === STORE_URL.home(user.stores[0].id)
                    ? activeClass
                    : inactiveClass
                }`}
              >
                My stores
                <HeaderLinkUnderline
                  isActive={currentPath.includes(STORE_URL.home())}
                />
              </Link>
            ) : (
              user && (
                <CreateStoreModal>
                  <div
                    role='button'
                    className='hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium'
                  >
                    Create store 1
                  </div>
                </CreateStoreModal>
              )
            )}
            {user && (
              <Button
                variant='outline'
                className={`hover:text-shop-light-green hoverEffect group relative ${
                  currentPath === DASHBOARD_URL.favorites()
                    ? 'bg-primary-50 border-primary-300'
                    : ''
                }`}
                onClick={() => router.push(DASHBOARD_URL.favorites())}
              >
                <HeartIcon className='text-shop-light-green' />
                <span className='bg-shop-light-green absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-xs font-semibold text-white'>
                  {user.favorites?.length || 0}
                </span>
              </Button>
            )}

            <HeaderCart triggerBtnClass='w-full md:w-auto justify-start md:justify-center' />

            {user && (
              <Link
                href={DASHBOARD_URL.home()}
                className={
                  currentPath === DASHBOARD_URL.home()
                    ? `${activeClass}`
                    : inactiveClass
                }
              >
                <Image
                  src={
                    generateImgPath(user?.picture || '') ||
                    '/images/no-user-image.png'
                  }
                  alt={user?.name || 'User img'}
                  width={42}
                  height={42}
                  className='rounded-full'
                />
              </Link>
            )}
          </>
          {!user && (
            <Link href={PUBLIC_URL.auth()}>
              <Button variant='default' className='w-full'>
                <LogOut className='mr-2 size-4 text-white' />
                Login
              </Button>
            </Link>
          )}
        </div>
      );
    };

    const renderNavigationMenuMobile = () => {
      const showMobile = 'inline-flex md:hidden w-auto justify-center p-2';
      const inactiveClass =
        'hover:text-shop-light-green hoverEffect group relative';
      const activeClass = `text-shop-light-green ${inactiveClass}`;
      return (
        <div className='text-shop-light-color flex flex-col items-center gap-2 text-sm font-semibold capitalize md:flex-row md:gap-4'>
          <Link
            href={PUBLIC_URL.home()}
            className={`${showMobile} ${
              currentPath === PUBLIC_URL.home() ? activeClass : inactiveClass
            }`}
          >
            Home
            <HeaderLinkUnderline isActive={currentPath === PUBLIC_URL.home()} />
          </Link>
          <Link
            href={PUBLIC_URL.shop()}
            className={`${showMobile} ${
              currentPath === PUBLIC_URL.shop() ? activeClass : inactiveClass
            }`}
          >
            Catalog
            <HeaderLinkUnderline
              isActive={currentPath.includes(PUBLIC_URL.shop())}
            />
          </Link>

          <>
            {user?.stores?.length ? (
              <Link
                href={STORE_URL.home(user.stores[0].id)}
                className={`${showMobile} ${
                  currentPath === STORE_URL.home(user.stores[0].id)
                    ? activeClass
                    : inactiveClass
                }`}
              >
                My stores
                <HeaderLinkUnderline
                  isActive={currentPath.includes(STORE_URL.home())}
                />
              </Link>
            ) : (
              user && (
                <CreateStoreModal>
                  <div
                    role='button'
                    className='hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium'
                  >
                    Create store 1
                  </div>
                </CreateStoreModal>
              )
            )}
          </>

          {!user && (
            <Link
              href={PUBLIC_URL.auth()}
              className={`items-center ${showMobile} ${
                currentPath === PUBLIC_URL.auth() ? activeClass : inactiveClass
              }`}
            >
              <LogOut
                className={`mr-2 size-4 ${
                  currentPath === PUBLIC_URL.auth()
                    ? activeClass
                    : inactiveClass
                }`}
              />
              Login
              <HeaderLinkUnderline
                isActive={currentPath === PUBLIC_URL.auth()}
              />
            </Link>
          )}
        </div>
      );
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-2 backdrop-blur-md md:px-6 [&_*]:no-underline'
        )}
        {...props}
      >
        <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4'>
          {/* Left side */}
          <div className='flex w-full items-center gap-2 lg:gap-6'>
            {/* MOBILE — Popper (только < md) */}
            <div className='order-1 inline-flex flex-none md:hidden'>
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
                <PopoverContent align='start' className='w-64 p-4'>
                  {renderNavigationMenuMobile()}
                </PopoverContent>
              </Popover>
            </div>

            <button
              onClick={(e) => e.preventDefault()}
              className='text-primary hover:text-primary/90 order-2 flex flex-none items-center space-x-2 md:order-1'
            >
              <div className='text-2xl'>
                <Logo />
              </div>
            </button>

            <div className='order-2 hidden w-full flex-1 px-4 md:flex'>
              <SearchInput />
            </div>

            <div className='order-3 ml-auto flex flex-none items-center gap-6'>
              {renderNavigationMenuDesktop()}
            </div>
          </div>
        </div>
      </header>
    );
  }
);
HeaderMenuV3.displayName = 'HeaderMenu';

// 'use client';
// import * as React from 'react';
// import { useEffect, useState, useRef } from 'react';
// import {
//   BookOpenIcon,
//   InfoIcon,
//   LifeBuoyIcon,
//   LogOut,
//   Menu,
// } from 'lucide-react';
// import { Button } from '@/components/ui/Button';
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
// } from '@/components/ui/NavigationMenu';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/Popover';
// import { cn } from '@/utils/common';
// import type { ComponentProps } from 'react';
// import { Logo } from '../logo/Logo';
// import { SITE_NAME } from '@/utils/constants';
// import { SearchInput } from '../searchInput/SearchInput';
// import { DASHBOARD_URL, PUBLIC_URL, STORE_URL } from '@/config/url.config';
// import Link from 'next/link';
// import { Loader } from '@/components/ui/Loader';
// import { useProfile } from '@/hooks/useProfile';
// import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
// import Image from 'next/image';
// import { HeaderCart } from './headerCart/HeaderCart';
// import { usePathname } from 'next/navigation';
// import { generateImgPath } from '@/utils/imageUtils';
// import { GetUserDto } from '@/generated/orval/types';

// // Types
// export interface HeaderMenuNavItem {
//   href?: string;
//   label: string;
//   submenu?: boolean;
//   type?: 'description' | 'simple' | 'icon';
//   items?: Array<{
//     href: string;
//     label: string;
//     description?: string;
//     icon?: string;
//   }>;
// }
// export interface HeaderMenuProps extends React.HTMLAttributes<HTMLElement> {
//   logo?: React.ReactNode;
//   logoHref?: string;
//   navigationLinks?: HeaderMenuNavItem[];
//   signInText?: string;
//   signInHref?: string;
//   ctaText?: string;
//   ctaHref?: string;
//   onSignInClick?: () => void;
//   onCtaClick?: () => void;
// }

// const HEADER_DATA = (user?: GetUserDto) => {
//   const storeId = user?.stores?.[0]?.id;

//   return [
//     {
//       title: 'Catalog',
//       href: PUBLIC_URL.shop(),
//       show: true,
//       type: 'link',
//     },
//     {
//       title: 'Favorites',
//       href: DASHBOARD_URL.favorites(),
//       show: !!user,
//       type: 'link',
//     },
//     {
//       title: 'My stores',
//       href: storeId ? STORE_URL.home(storeId) : null,
//       show: !!storeId,
//       type: 'link',
//     },
//     {
//       title: 'Login',
//       href: PUBLIC_URL.auth(),
//       show: !user,
//       type: 'link',
//     },
//     {
//       title: '',
//       href: DASHBOARD_URL.home(),
//       show: !!user,
//       type: 'userProfile',
//     },
//   ];
// };

// export const HeaderMenuV2 = React.forwardRef<HTMLElement, HeaderMenuProps>(
//   (props, ref) => {
//     const pathName = usePathname();

//     const { user, isLoading } = useProfile();
//     const [isMobile, setIsMobile] = useState(false);
//     const containerRef = useRef<HTMLElement>(null);
//     const [currentPath, setCurrentPath] = useState(pathName);
//     useEffect(() => {
//       setCurrentPath(pathName);
//     }, [pathName]);

//     useEffect(() => {
//       const checkWidth = () => {
//         if (containerRef.current) {
//           const width = containerRef.current.offsetWidth;
//           setIsMobile(width < 768); // 768px is md breakpoint
//         }
//       };
//       checkWidth();
//       const resizeObserver = new ResizeObserver(checkWidth);
//       if (containerRef.current) {
//         resizeObserver.observe(containerRef.current);
//       }
//       return () => {
//         resizeObserver.disconnect();
//       };
//     }, []);

//     // Combine refs
//     const combinedRef = React.useCallback(
//       (node: HTMLElement | null) => {
//         containerRef.current = node;
//         if (typeof ref === 'function') {
//           ref(node);
//         } else if (ref) {
//           ref.current = node;
//         }
//       },
//       [ref]
//     );

//     const navItems = HEADER_DATA(user).filter((item) => item.show);

//     const renderNavigationMenuListItems = () => {
//       const inactiveClass =
//         'hover:text-shop-light-green hoverEffect group relative';
//       const activeClass = `text-shop-light-green ${inactiveClass}`;
//       const spanLeft =
//         'absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop-light-green group-hover:w-1/2 hoverEffect group-hover:left-0';
//       const spanRight =
//         'absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop-light-green group-hover:w-1/2 hoverEffect group-hover:right-0';

//       return (
//         <div className='text-shop-light-color flex items-center gap-7 text-sm font-semibold capitalize'>
//           {navItems.map(({ title, href, type }) => {
//             const isActive = currentPath === href;

//             return (
//               <Link
//                 key={href!}
//                 href={href!}
//                 className={isActive ? activeClass : inactiveClass}
//               >
//                 {type === 'link' ? (
//                   <>
//                     {title}
//                     <span className={`${spanLeft} ${isActive && 'w-1/2'}`} />
//                     <span className={`${spanRight} ${isActive && 'w-1/2'}`} />
//                   </>
//                 ) : (
//                   <Image
//                     src={
//                       generateImgPath(user?.picture || '') ||
//                       '/images/no-user-image.png'
//                     }
//                     alt={user?.name || ''}
//                     width={42}
//                     height={42}
//                     className='rounded-full'
//                   />
//                 )}
//               </Link>
//             );
//           })}
//           {/* <Link
//             href={PUBLIC_URL.shop()}
//             className={
//               currentPath === PUBLIC_URL.shop()
//                 ? activeClass
//                 : inactiveClass
//             }
//           >
//             Catalog
//             <span
//               className={`${spanLeft} ${currentPath === PUBLIC_URL.shop() && 'w-1/2'}`}
//             ></span>
//             <span
//               className={`${spanRight} ${currentPath === PUBLIC_URL.shop() && 'w-1/2'}`}
//             ></span>
//           </Link> */}

//           {/* {isLoading ? (
//             <Loader size='sm' className={isMobile ? 'ml-6' : ''} />
//           ) : user ? (
//             <>
//               <Link
//                 href={DASHBOARD_URL.favorites()}
//                 className={
//                   currentPath === DASHBOARD_URL.favorites()
//                     ? activeClass
//                     : inactiveClass
//                 }
//               >
//                 Favorites
//                 <span
//                   className={`${spanLeft} ${currentPath === DASHBOARD_URL.favorites() && 'w-1/2'}`}
//                 ></span>
//                 <span
//                   className={`${spanRight} ${currentPath === DASHBOARD_URL.favorites() && 'w-1/2'}`}
//                 ></span>
//               </Link>

//               {user.stores.length ? (
//                 <Link
//                   href={STORE_URL.home(user.stores[0].id)}
//                   className={
//                     currentPath === STORE_URL.home(user.stores[0].id)
//                       ? activeClass
//                       : inactiveClass
//                   }
//                 >
//                   My stores
//                   <span
//                     className={`${spanLeft} ${currentPath === STORE_URL.home(user.stores[0].id) && 'w-1/2'}`}
//                   ></span>
//                   <span
//                     className={`${spanRight} ${currentPath === STORE_URL.home(user.stores[0].id) && 'w-1/2'}`}
//                   ></span>
//                 </Link>
//               ) : (
//                 <CreateStoreModal>
//                   <div
//                     role='button'
//                     className='hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium'
//                   >
//                     Create store
//                   </div>
//                 </CreateStoreModal>
//               )}
//               <HeaderCart triggerBtnClass='w-full md:w-auto justify-start md:justify-center' />

//               <Link
//                 href={DASHBOARD_URL.home()}
//                 className={
//                   currentPath === DASHBOARD_URL.home()
//                     ? `${activeClass}`
//                     : inactiveClass
//                 }
//               >
//                 {isMobile ? (
//                   'Orders'
//                 ) : (
//                   <Image
//                     src={
//                       generateImgPath(user.picture) ||
//                       '/images/no-user-image.png'
//                     }
//                     alt={user.name}
//                     width={42}
//                     height={42}
//                     className='rounded-full'
//                   />
//                 )}
//               </Link>
//             </>
//           ) : (
//             <Link href={PUBLIC_URL.auth()}>
//               <Button variant='default' className='w-full'>
//                 <LogOut className='mr-2 size-4 text-white' />
//                 Login
//               </Button>
//             </Link>
//           )}
//         </div>
//       ); */}
//         </div>
//       );
//     };
//     return (
//       <header
//         ref={combinedRef}
//         className={cn(
//           'bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur-md md:px-6 [&_*]:no-underline'
//         )}
//         {...props}
//       >
//         <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4'>
//           {/* Left side */}
//           <div className='flex w-full items-center gap-2'>
//             {/* Mobile menu trigger */}
//             <div className='inline-flex sm:hidden'>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     className='group hover:bg-accent hover:text-accent-foreground h-9 w-9'
//                     variant='ghost'
//                     size='icon'
//                   >
//                     <Menu />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent align='start' className='w-64 p-1'>
//                   <div className='w-full'>
//                     {renderNavigationMenuListItems()}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* Main nav */}
//             <div className='flex w-full items-center justify-center gap-6 md:justify-between'>
//               <button
//                 onClick={(e) => e.preventDefault()}
//                 className='text-primary hover:text-primary/90 flex cursor-pointer items-center space-x-2 transition-colors'
//               >
//                 <div className='text-2xl'>
//                   <Logo />
//                 </div>
//               </button>
//               <div className='ml-auto hidden w-[40%] lg:block'>
//                 <SearchInput />
//               </div>
//               <div className='hidden sm:inline-flex'>
//                 {renderNavigationMenuListItems()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }
// );
// HeaderMenuV2.displayName = 'HeaderMenu';
