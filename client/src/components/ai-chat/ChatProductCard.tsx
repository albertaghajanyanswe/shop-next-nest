'use client';

import { ExternalLink, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface ChatProductCardData {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  currency: string;
  description: string;
  productDetails: Record<string, string>;
  store: string;
  category?: string;
  brand?: string;
  color?: string;
  url: string;
  quantity: number;
}

interface ChatProductCardProps {
  product: ChatProductCardData;
}

export function ChatProductCard({ product }: ChatProductCardProps) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        (((product.oldPrice || 0) - product.price) / (product.oldPrice || 0)) *
          100
      )
    : 0;

  return (
    <div className='flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md'>
      {/* Image - 64px */}
      <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100'>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className='object-cover'
          sizes='64px'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.png';
          }}
        />
        {hasDiscount && (
          <div className='bg-shop-red absolute top-0 right-0 rounded-bl px-1 text-[10px] font-bold text-white'>
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex min-w-0 flex-1 flex-col'>
        {/* Title */}
        <h3 className='text-shop-dark-color mb-1 line-clamp-1 text-sm font-semibold'>
          {product.title}
        </h3>

        {/* Price */}
        <div className='mb-1 flex items-center gap-2'>
          <span className='text-shop-primary text-base font-bold'>
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className='text-shop-light-color text-xs line-through'>
              ${product.oldPrice?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className='mb-2 flex flex-wrap gap-1'>
          {product.brand && (
            <span className='bg-primary-50 text-primary-700 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium'>
              {product.brand}
            </span>
          )}
          {product.category && (
            <span className='inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700'>
              {product.category}
            </span>
          )}
          {product.quantity === 0 && (
            <span className='bg-shop-red/10 text-shop-red inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium'>
              Out of Stock
            </span>
          )}
        </div>

        {/* TODO - make in one line */}
        {Object.keys(product.productDetails).length > 0 && (
          <div className='text-shop-light-color mb-2 space-y-0.5 text-[11px]'>
            {Object.entries(product.productDetails)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className='flex gap-1'>
                  <span className='font-medium'>{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className='mt-auto flex gap-2'>
          <Link
            href={product.url}
            className='bg-shop-primary hover:bg-shop-btn-primary flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors'
          >
            <ExternalLink className='h-3 w-3' />
            View
          </Link>
          {product.quantity > 0 && (
            <button
              className='bg-shop-light-primary flex items-center justify-center rounded-md px-2 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90'
              onClick={() => {
                console.log('Add to cart:', product.id);
              }}
            >
              <ShoppingCart className='h-3 w-3' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
