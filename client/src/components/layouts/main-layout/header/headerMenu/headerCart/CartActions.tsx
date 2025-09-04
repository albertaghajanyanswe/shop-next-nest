import { Button } from '@/components/ui/Button';
import { useActions } from '@/hooks/queries/useActions';
import { useCart } from '@/hooks/queries/useCart';
import { ICartItem } from '@/shared/types/cart.interface';
import { Minus, Plus, Trash, Trash2 } from 'lucide-react';

interface CartActionsProps {
  orderItem: ICartItem;
}

export function CartActions({ orderItem }: CartActionsProps) {
  const { changeQuantity, removeFromCard } = useActions();
  const { orderItems } = useCart();
  const quantity = orderItems.find((i) => i.id === orderItem.id)?.quantity;

  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='mt-1 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() =>
            changeQuantity({
              id: orderItem.id,
              type: 'minus',
            })
          }
          disabled={orderItem.quantity === 1}
          className='size-7'
        >
          <Minus className='size-4' />
        </Button>
        <input
          disabled
          readOnly
          value={quantity}
          className='w-10 text-center text-sm'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() =>
            changeQuantity({
              id: orderItem.id,
              type: 'plus',
            })
          }
          className='size-7'
        >
          <Plus className='size-4' />
        </Button>
      </div>
      <Button
        variant='ghost'
        size='icon'
        onClick={() =>
          removeFromCard({
            id: orderItem.id,
          })
        }
        className='size-7 ml-[32px]'
      >
        <Trash2 className='size-4 text-red-500' />
      </Button>
    </div>
  );
}
