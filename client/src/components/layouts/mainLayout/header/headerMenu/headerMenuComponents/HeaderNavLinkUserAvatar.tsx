import { GetUserDto } from '@/generated/orval/types';
import { generateImgPath } from '@/utils/imageUtils';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface UserAvatarProps {
  user: GetUserDto;
  url: string;
}
const UserAvatarComponent = ({ user, url }: UserAvatarProps) => (
  <Link
    href={url}
    className='group bg-shop-bg relative min-w-8 rounded-full sm:min-w-10'
  >
    <Image
      src={generateImgPath(user?.picture || '') || '/images/no-user-image.png'}
      alt={user?.name || 'User img'}
      width={42}
      height={42}
      className='w-9 rounded-full transition-transform duration-500 group-hover:scale-105 sm:w-10'
      priority={false}
    />
  </Link>
);

export const HeaderNavLinkUserAvatar = memo(UserAvatarComponent);
HeaderNavLinkUserAvatar.displayName = 'HeaderNavLinkUserAvatar';
