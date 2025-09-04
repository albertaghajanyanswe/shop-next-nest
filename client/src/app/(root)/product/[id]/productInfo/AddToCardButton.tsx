import { Button } from '@/components/ui/Button';
import { useActions } from '@/hooks/queries/useActions';
import { useCart } from '@/hooks/queries/useCart';
import { cn } from '@/lib/utils';
import { IProduct } from '@/shared/types/product.interface';

interface AddToCardButtonProps {
  product: IProduct;
  className?: string;
}
export default function AddToCardButton({ product, className = '' }: AddToCardButtonProps) {
  const { addToCard, removeFromCard } = useActions();
  const { orderItems } = useCart();

  const currentElement = orderItems?.find(
    (item) => item.product.id === product.id
  );

  const handleClick = () => {
    if (currentElement) {
      removeFromCard({ id: currentElement.id });
    } else {
      addToCard({ product, quantity: 1, price: product.price });
    }
  };
  return (
    <Button variant='primary' size='lg' className={cn('w-full', className)} onClick={handleClick}>
      {currentElement ? 'Remove from card' : 'Add to card'}
    </Button>
  );
}
