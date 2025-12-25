import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { useCart } from '@/hooks/queries/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { CartItem } from './CartItem';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/hooks/queries/useCheckout';
import { useProfile } from '@/hooks/useProfile';
import { PUBLIC_URL } from '@/config/url.config';
import { useCheckoutStripeMultipleItems } from '@/hooks/queries/useCheckoutStripeMultipleItems';
import { ShoppingCartIcon, X } from 'lucide-react';
import { Separator } from '@/components/ui/Separator';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

interface HeaderCartProps {
  triggerBtnClass?: string;
}
export function HeaderCart({ triggerBtnClass }: HeaderCartProps) {
  const router = useRouter();

  // const { createPayment, isLoadingCreate } = useCheckout();
  const { createPaymentMultiple, isLoadingCreateMultiple } =
    useCheckoutStripeMultipleItems();
  const { user } = useProfile();

  const { orderItems, total } = useCart();
  console.log('orderItems = ', orderItems)
  const handleClickCheckout = () => {
    if (user) {
      createPaymentMultiple();
    } else {
      router.push(PUBLIC_URL.auth());
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          className={`${triggerBtnClass} icon-btn hover:text-shop-light-green hoverEffect group relative justify-center`}
        >
          <ShoppingCartIcon className='text-shop-light-green' />
          <span className='bg-shop-light-green absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-xs font-semibold text-white'>
            {orderItems.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className='flex max-h-[100dvh] w-full flex-col bg-white p-4'>
        <SheetHeader className='sticky top-0 z-20 flex w-full flex-row items-center justify-between border-b bg-white/95 px-4 py-3 backdrop-blur-sm'>
          <SheetTitle className='p-0'>
            <Heading
              title='Basket of products'
              className='text-xl'
              showBackButton={false}
            />
          </SheetTitle>
          <div className='flex items-center gap-2'>
            <SheetClose asChild>
              <Button variant='ghost' size='icon' aria-label='Close'>
                <X className='h-4 w-4' />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className='flex w-full flex-1 flex-col gap-y-4 overflow-auto'>
          {orderItems?.length ? (
            orderItems.map((orderItem, i) => (
              <div key={orderItem.id}>
                <CartItem key={orderItem.id} orderItem={orderItem} />
                {i !== orderItems.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className='text-muted-foreground text-sm'>Basket is empty</div>
          )}
        </div>
        {orderItems?.length ? (
          <>
            <div className='text-lg font-medium'>
              <span className='text-muted-foreground'>Total amount:</span>
              <span className='text-shop-red ml-2'>{formatPrice(total)}</span>
            </div>
            <Button
              onClick={handleClickCheckout}
              variant='primary'
              disabled={isLoadingCreateMultiple}
              className='w-full'
            >
              Checkout
            </Button>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
