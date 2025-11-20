import { PUBLIC_URL } from '@/config/url.config';
import { ICartItem } from '@/shared/types/cart.interface';
import { formatPrice } from '@/utils/string/formatPrice';
import Image from 'next/image';
import Link from 'next/link';
import { CartActions } from './CartActions';
import { CartBuyAction } from './CartBuyAction';
import { generateImgPath } from '@/lib/imageUtils';

interface CartItemsProps {
  orderItem: ICartItem;
}

export function CartItem({ orderItem }: CartItemsProps) {
  console.log('orderItem = ', orderItem)
  return (
    <div className='d-flex flex-col'>
      <div className='mb-5 flex items-center'>
        <Link href={PUBLIC_URL.product(orderItem.product.id)} className='image'>
          <Image
            src={generateImgPath(orderItem.product.images[0])}
            alt={orderItem.product.title}
            className='fill h-28 w-28 overflow-hidden rounded-md object-contain'
            width={112}
            height={112}
          />
        </Link>
        <div className='ml-6'>
          <h2 className='line-clamp-1 font-medium'>
            {orderItem.product.title}
          </h2>
          <p className='text-muted-foreground text-sm'>
            {formatPrice(orderItem.product.price)}
          </p>
          <CartActions orderItem={orderItem} />
        </div>
      </div>
      <CartBuyAction orderItem={orderItem} />
    </div>
  );
}
