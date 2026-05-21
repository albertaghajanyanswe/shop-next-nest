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
      <CardHeader className='flex-col items-stretch justify-between space-y-0 border-b px-4 py-4 [.border-b]:pb-4'>
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
                  className='flex-shrink-0 rounded-full'
                />
              ) : (
                <div className='bg-primary text-primary-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                  {getInitials(user.name)}
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{user.name}</p>
                <p className='text-muted-foreground truncate text-xs'>
                  {user.email}
                </p>
              </div>
              <div className='flex-shrink-0 text-right'>
                <p className='text-sm font-semibold'>
                  {formatPrice(user.total)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className='text-muted-foreground py-8 text-center text-sm'>
            {t('no_users')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
