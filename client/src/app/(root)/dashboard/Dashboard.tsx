'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { saveTokenStorage } from '@/services/auth/auth-token.service';
import { authService } from '@/services/auth/auth.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { IOrderColumns, orderColumns } from './OrderColumns';
import { useProfile } from '@/hooks/useProfile';
import { EnumOrderStatus } from '@/shared/types/order.interface';
import { formatPrice } from '@/utils/string/formatPrice';
import { formateDate } from '@/utils/date/formateDate';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { DataTable } from '@/components/ui/data-loading/DataTable';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    if (accessToken) {
      saveTokenStorage(accessToken);
    }
  }, [searchParams]);

  const { user } = useProfile();

  const { mutate: logout } = useMutation({
    mutationKey: QUERY_KEYS.logout,
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push('/auth');
    },
  });

  if (!user) return null;

  const formattedOrders: IOrderColumns[] = user.orders.map((order) => ({
    createdAt: formateDate(order.createdAt as unknown as string),
    status: order.status === EnumOrderStatus.PENDING ? 'Pending' : 'Paid',
    total: formatPrice(order.totalPrice),
  }));

  return (
    <div className='my-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>My orders</h1>
        <Button variant='ghost' onClick={() => logout()}>
          <LogOut className='mr-2 size-4' />
          Logout
        </Button>
      </div>
      <DataTable columns={orderColumns} data={formattedOrders} />
    </div>
  );
}
