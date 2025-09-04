// TODO
export function formatPrice(price: number) {
  return price.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  });
}

export function formatPriceEN(price: number) {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  });
}