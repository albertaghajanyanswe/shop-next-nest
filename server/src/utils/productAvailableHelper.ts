import { BadRequestException } from '@nestjs/common';

export function buildUnavailableProductsMessage(
  products: {
    title?: string;
    requested: number;
    available: number;
  }[],
) {
  const details = products
    .map(
      (p) =>
        `${p.title ?? 'Unknown product'} - requested (${p.requested}), available (${p.available})`,
    )
    .join('; ');

  return `Some products are unavailable in requested quantity: ${details}`;
}

export function validateOrderItemsAvailability(
  items: {
    productId: string;
    quantity: number;
  }[],
  products: {
    id: string;
    title: string;
    description: string | null;
    images: string[] | null;
    price: number;
    quantity: number;
  }[],
) {
  const productMap = new Map(products.map((p) => [p.id, p]));

  const unavailable: {
    title: string | undefined;
    requested: number;
    available: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product || product.quantity < item.quantity) {
      unavailable.push({
        title: product?.title,
        requested: item.quantity,
        available: product?.quantity ?? 0,
      });
    }
  }

  if (unavailable.length) {
    const message = this.buildUnavailableProductsMessage(unavailable);

    throw new BadRequestException(message);
  }

  return productMap;
}
