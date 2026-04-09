import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Badge } from '@/components/ui/Badge';
import { GetOrderWithItemsDto } from '@/generated/orval/types';

interface OrderCardProps {
  order: GetOrderWithItemsDto;
}

export default function OrderCard({ order }: OrderCardProps) {
  const total = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Card className='w-full max-w-md rounded-xl border bg-shop-white p-3'>
      {/* Header */}
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex flex-col'>
          <span className='text-xs font-medium text-shop-muted-text-5'>Order</span>
          <span className='max-w-[180px] truncate text-sm font-semibold'>
            {order.id}
          </span>
        </div>

        <Badge
          variant='outline'
          className='max-w-[120px] truncate px-2 py-0.5 text-[11px]'
        >
          {order.user.email}
        </Badge>
      </div>

      {/* Compact horizontal tiles (like marketplace) */}
      <div className='flex gap-2 overflow-x-auto py-1'>
        {(order.orderItems || []).map((item) => (
          <div
            key={item.id}
            className='flex min-w-[72px] flex-1 flex-col items-center rounded-md border bg-shop-white p-1 shadow-sm'
            aria-label={`Order item ${item.cachedProductTitle}`}
          >
            <div className='relative h-12 w-12 overflow-hidden rounded-md border bg-gray-50'>
              {/* next/image with fixed parent size works with fill */}
              <Image
                src={item.cachedProductImages[0]}
                alt={item.cachedProductTitle as string}
                fill
                sizes='48px'
                className='object-cover'
              />
            </div>

            <span className='mt-1 w-full truncate text-center text-[10px] font-medium'>
              {item.cachedProductTitle}
            </span>

            <span className='text-[10px] text-shop-muted-text-5'>${item.price}</span>
            <span className='text-[9px] text-shop-muted-text-5'>
              ID: {String(item.id).slice(0, 8)}
            </span>
          </div>
        ))}
      </div>

      <Separator className='my-2' />

      {/* Footer: totals and quick actions */}
      <div className='flex items-center justify-between text-sm font-semibold'>
        <div className='flex items-baseline gap-2'>
          <span className='text-xs text-shop-muted-text-5'>Items:</span>
          <span className='text-sm'>{(order.orderItems || []).length}</span>
        </div>

        <div className='flex items-center gap-3'>
          <span className='text-sm'>Total</span>
          <span className='text-sm'>${total}</span>
        </div>
      </div>
    </Card>
  );
}
