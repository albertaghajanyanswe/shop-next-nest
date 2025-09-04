import { useTypedSelector } from './useTypedSelector';

export const useCart = () => {
  const cartState = useTypedSelector((state) => state.cart);
  console.log('cartState ', cartState);
  const orderItems = cartState.orderItems;
  const total = orderItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return {
    orderItems,
    total,
  };
};
