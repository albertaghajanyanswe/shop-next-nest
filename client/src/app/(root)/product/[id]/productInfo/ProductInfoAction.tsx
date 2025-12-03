import Link from 'next/link';
import { PUBLIC_URL } from '@/config/url.config';
import { formatPrice } from '@/utils/formatPrice';
import AddToCardButton from './AddToCardButton';
import FavoriteButton from './FavoriteButton';
import { GetProductWithDetails } from '@/generated/orval/types';
import QueryString from 'qs';
import { ShowMoreText } from '@/components/customComponents/ShowMoreText';
import { useCart } from '@/hooks/queries/useCart';
import CartActions from '@/components/layouts/mainLayout/header/headerMenu/headerCart/CartActions';

export interface ProductInfoActionProps {
  product: GetProductWithDetails;
}

export default function ProductInfoAction({ product }: ProductInfoActionProps) {
  const { orderItems } = useCart();
  const isProductInCard = orderItems.find((p) => p.product.id === product.id);
  return (
    <>
      {isProductInCard ? (
        <CartActions orderItem={isProductInCard} />
      ) : (
        <AddToCardButton product={product} className='flex-10' />
      )}
      <FavoriteButton
        product={product}
        className='xs:top-2 xs:right-2 absolute top-1 right-1'
        btnVariant='outline'
      />
    </>
  );
}
