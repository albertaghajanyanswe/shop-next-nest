import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { useActions } from '@/hooks/queries/useActions';
import { useCart } from '@/hooks/queries/useCart';
import { ICartItem } from '@/shared/types/cart.interface';
import { formatPrice } from '@/utils/formatPrice';
import { Minus, Plus, Trash, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { useTranslations } from 'next-intl';

interface CartActionsProps {
  orderItem: ICartItem;
}

function CartActions({ orderItem }: CartActionsProps) {
  const { changeQuantity, removeFromCard } = useActions();
  const { orderItems } = useCart();
  const tCart = useTranslations('HeaderCart');
  const quantity = orderItems.find((i) => i.id === orderItem.id)?.quantity;

  console.log('orderItem = ', orderItem);
  const handleMinus = () => {
    if (orderItem.quantity <= 1) {
      removeFromCard({
        id: orderItem.id,
      });
      return;
    }
    changeQuantity({
      id: orderItem.id,
      type: 'minus',
    });
  };
  return (
    <div className='mt-3 flex w-full flex-col'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-4'>
          <p className='text-shop-light-color text-xs font-semibold'>
            {tCart('quantity')}
          </p>
          <div className='flex items-center'>
            <Button
              aria-label='Minus quantity'
              variant='ghost'
              size='icon'
              onClick={handleMinus}
              className='size-6'
            >
              <Minus className='size-4' />
            </Button>
            <input
              aria-label='Quantity'
              disabled
              readOnly
              value={quantity}
              className='text-foreground w-10 bg-transparent text-center text-sm'
            />
            <Button
              aria-label='Plus quantity'
              variant='ghost'
              size='icon'
              disabled={orderItem.quantity >= orderItem.product.quantity}
              onClick={() =>
                changeQuantity({
                  id: orderItem.id,
                  type: 'plus',
                })
              }
              className='size-6'
            >
              <Plus className='size-4' />
            </Button>
          </div>
        </div>
        <Button
          aria-label='Delete cart item'
          variant='ghost'
          size='icon'
          onClick={() =>
            removeFromCard({
              id: orderItem.id,
            })
          }
          className='size-6'
        >
          <Trash2 className='size-4 text-red-500' />
        </Button>
      </div>

      <Separator orientation='horizontal' className='my-1' />
      <div className='flex items-center justify-between'>
        <p className='text-xs font-semibold'>{tCart('subtotal')}</p>
        <p className='mr-2 text-xs font-semibold'>
          {formatPrice(orderItem.price * orderItem.quantity)}
        </p>
      </div>
    </div>
  );
}

export default memo(CartActions);
