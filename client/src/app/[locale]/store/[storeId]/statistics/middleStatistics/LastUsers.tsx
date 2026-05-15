'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { generateImgPath } from '@/utils/imageUtils';
import { ILastUser } from '@/shared/types/statistics.interface';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ILastUsersProps {
  data: ILastUser[];
}

export function LastUsers({ data }: ILastUsersProps) {
  const t = useTranslations('MiddleStatistics');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className='gap-0! py-0!'>
      <CardHeader className='flex-col items-stretch justify-between space-y-0 border-b px-4 [.border-b]:pb-4 py-4'>
        <CardTitle className='text-xl font-medium tracking-[0.1px]'>
          {t('recent_buyers')}
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 py-0!'>
        {data.length ? (
          data.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 py-3 ${
                index !== data.length - 1 ? 'border-b' : ''
              }`}
            >
              {user.picture ? (
                <Image
                  src={generateImgPath(user.picture)}
                  alt={user.name}
                  width={36}
                  height={36}
                  className='rounded-full flex-shrink-0'
                />
              ) : (
                <div className='w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-semibold'>
                  {getInitials(user.name)}
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{user.name}</p>
                <p className='text-xs text-muted-foreground truncate'>
                  {user.email}
                </p>
              </div>
              <div className='text-right flex-shrink-0'>
                <p className='text-sm font-semibold'>
                  {formatPrice(user.total)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className='py-8 text-center text-muted-foreground text-sm'>
            {t('no_users')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
