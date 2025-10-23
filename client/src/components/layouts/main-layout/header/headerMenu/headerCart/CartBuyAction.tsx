import { Button } from '@/components/ui/Button';
import { PUBLIC_URL } from '@/config/url.config';
import { useCheckoutStripe } from '@/hooks/queries/useCheckoutStripe';
import { useProfile } from '@/hooks/useProfile';
import { ICartItem } from '@/shared/types/cart.interface';
import { useRouter } from 'next/navigation';

interface CartActionsProps {
  orderItem: ICartItem;
}

export function CartBuyAction({ orderItem }: CartActionsProps) {
  const router = useRouter();
  const { user } = useProfile();

  const { createPayment, isLoadingCreate } = useCheckoutStripe();

  const handleClickBuy = () => {
    if (user) {
      createPayment(orderItem);
    } else {
      router.push(PUBLIC_URL.auth());
    }
  };
  return (
    <div className='flex items-center justify-between gap-2'>
      <Button
        onClick={handleClickBuy}
        variant='primary'
        disabled={isLoadingCreate}
        className='w-full'
      >
        Buy product
      </Button>
    </div>
  );
}
