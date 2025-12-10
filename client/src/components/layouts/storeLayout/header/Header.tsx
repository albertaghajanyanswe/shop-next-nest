'use client';

import { useProfile } from '@/hooks/useProfile';
import { MobileSidebar } from '../sidebar/MobileSidebar';
import Link from 'next/link';
import { DASHBOARD_URL } from '@/config/url.config';
import Image from 'next/image';
import { Loader } from '@/components/ui/Loader';
import { StoreSwitcher } from './StoreSwitcher';
import { generateImgPath } from '@/utils/imageUtils';
import { GetStoreDto } from '@/generated/orval/types';

export function Header() {
  const { user, isLoading } = useProfile();
  return (
    <div className='flex h-full items-center gap-x-4 border-b bg-white p-6'>
      <MobileSidebar />
      <div className='ml-auto flex items-center gap-x-4'>
        {isLoading ? (
          <Loader size='sm' />
        ) : (
          user && (
            <>
              <StoreSwitcher items={user.stores as GetStoreDto[]} />
              <Link
                href={DASHBOARD_URL.home()}
                className='flex items-center gap-x-2'
              >
                <Image
                  src={
                    generateImgPath(user.picture as string) ||
                    `/images/no-user-image.png`
                  }
                  alt={user.name}
                  width={42}
                  height={42}
                  className='rounded-full'
                  priority
                />
              </Link>
            </>
          )
        )}
      </div>
    </div>
  );
}
