import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { generateImgPath } from '@/utils/imageUtils';
import { ILastUser } from '@/shared/types/statistics.interface';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';

interface ILastUsersProps {
  data: ILastUser[];
}

export function LastUsers({ data }: ILastUsersProps) {
  return (
    <>
      <Card className='py-4'>
        <CardHeader className='flex-col items-stretch justify-between space-y-0 border-b px-4 [.border-b]:pb-2'>
          <CardTitle className='text-xl font-medium tracking-[0.1px]'>
            Last Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length ? (
            data.map((user) => (
              <div key={user.id} className='mt-2 flex items-center'>
                <Image
                  src={
                    generateImgPath(user.picture) || '/images/no-user-image.png'
                  }
                  alt={user.name}
                  width={40}
                  height={40}
                  className='rounded-full'
                />
                <div className='text-muted-foreground ml-4 space-y-1 text-sm break-all'>
                  <p className='leading-none font-medium text-black'>
                    {user.name}
                  </p>
                  <p className=''>{user.email}</p>
                </div>
                <div className='ml-auto font-medium'>
                  +{formatPrice(user.total)}
                </div>
              </div>
            ))
          ) : (
            <div>This store has no users</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
