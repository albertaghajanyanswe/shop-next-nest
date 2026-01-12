import { Button } from '@/components/ui/Button';
import { useActions } from '@/hooks/queries/useActions';
import { useCart } from '@/hooks/queries/useCart';
import { cn } from '@/utils/common';
import { GetProductWithDetails } from '@/generated/orval/types';
import { ShoppingCart } from 'lucide-react';

interface AddToCardButtonProps {
  product: GetProductWithDetails;
  className?: string;
}
export default function AddToCardButton({
  product,
  className = '',
}: AddToCardButtonProps) {
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
    <Button
      variant='default'
      size='lg'
      className={cn('flex-1', className)}
      onClick={handleClick}
      disabled={product.quantity === 0}
    >
      <ShoppingCart />
      {currentElement ? 'Remove from card' : 'Add to card'}
    </Button>
  );
}
