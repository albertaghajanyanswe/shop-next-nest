import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { useCart } from '@/hooks/queries/useCart';
import { formatPrice } from '@/utils/string/formatPrice';
import { CartItem } from './CartItem';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/hooks/queries/useCheckout';
import { useProfile } from '@/hooks/useProfile';
import { PUBLIC_URL } from '@/config/url.config';

interface HeaderCartProps {
  triggerBtnClass?: string;
}
export function HeaderCart({ triggerBtnClass }: HeaderCartProps) {
  const router = useRouter();

  const { createPayment, isLoadingCreate } = useCheckout();
  const { user } = useProfile();

  const { orderItems, total } = useCart();

  const handleClick = () => {
    if (user) {
      createPayment();
    } else {
      router.push(PUBLIC_URL.auth());
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className={triggerBtnClass}>
          Basket
        </Button>
      </SheetTrigger>
      <SheetContent className='flex h-full flex-col p-4'>
        <SheetHeader>
          <SheetTitle className='p-0'>
            <Heading
              title='Basket of products'
              className='text-xl'
              showBackButton={false}
            />
          </SheetTitle>
        </SheetHeader>
        <div className='flex w-full flex-1 flex-col'>
          {orderItems?.length ? (
            orderItems.map((orderItem) => (
              <CartItem key={orderItem.id} orderItem={orderItem} />
            ))
          ) : (
            <div className='text-muted-foreground text-sm'>Basket is empty</div>
          )}
        </div>
        {orderItems?.length ? (
          <>
            <div className='text-lg font-medium'>
              <span className='text-muted-foreground'>Total amount:</span>
              <span className='text-primary ml-2'>{formatPrice(total)}</span>
            </div>
            <Button
              onClick={handleClick}
              variant='primary'
              disabled={isLoadingCreate}
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
