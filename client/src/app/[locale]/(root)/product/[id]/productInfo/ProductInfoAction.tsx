import AddToCardButton from './AddToCardButton';
import { GetProductWithDetails } from '@/generated/orval/types';
import { useCart } from '@/hooks/queries/useCart';
import CartActions from '@/components/layouts/mainLayout/header/headerMenu/headerCart/CartActions';
import { memo } from 'react';

export interface ProductInfoActionProps {
  product: GetProductWithDetails;
}

function ProductInfoAction({ product }: ProductInfoActionProps) {
  const { orderItems } = useCart();
  const isProductInCard = orderItems.find((p) => p.product.id === product.id);
  return (
    <>
      {isProductInCard ? (
        <CartActions orderItem={isProductInCard} />
      ) : (
        <AddToCardButton product={product} className='flex-10' />
      )}
    </>
  );
}

export default memo(ProductInfoAction);
