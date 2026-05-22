'use client';

import { GetUserDto } from '@/generated/orval/types';
import { generateImgPath } from '@/utils/imageUtils';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslations } from 'next-intl';

interface UserAvatarProps {
  user: GetUserDto;
  url: string;
}
const UserAvatarComponent = ({ user, url }: UserAvatarProps) => {
  const t = useTranslations('HeaderNavLinkUserAvatar');
  return (
    <Link
      href={url}
      className='group bg-shop-bg relative min-w-8 rounded-full sm:min-w-10'
    >
      <Image
        src={generateImgPath(user?.picture || '') || '/images/no-user.jpg'}
        alt={user?.name || t('user_img_alt')}
        width={42}
        height={42}
        className='max-h-10 w-10 max-w-10 rounded-full border p-0.5 transition-transform duration-500 group-hover:scale-105'
        priority={false}
      />
    </Link>
  );
};

export const HeaderNavLinkUserAvatar = memo(UserAvatarComponent);
HeaderNavLinkUserAvatar.displayName = 'HeaderNavLinkUserAvatar';
