import { Button } from '@/components/ui/Button';
import { generateImgPath } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';
import { IProduct } from '@/shared/types/product.interface';
import Image from 'next/image';
import { useState } from 'react';

export interface ProductGalleryProps {
  product: IProduct;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className=''>
      <div className='col-span-2 w-full place-items-center rounded-none bg-neutral-100 sm:rounded-2xl xl:col-span-1'>
        <Image
          src={generateImgPath(product.images[currentIndex])}
          alt={product.title}
          width={300}
          height={300}
          className='h-auto w-auto'
          // priority
          loading='lazy'
        />
      </div>
      <div className='mt-6 flex gap-6'>
        {product.images.map((image, index) => (
          <Button
            key={index}
            variant='outline'
            className={cn(
              'h-[100px] w-[100px] overflow-hidden rounded-lg border duration-300 hover:border-gray-200 hover:bg-inherit',
              currentIndex === index ? 'border-gray-300' : 'border-transparent'
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={generateImgPath(image)}
              alt={product.title}
              width={100}
              height={100}
              className='h-[100px] w-[100px] object-contain'
              // priority
              loading='lazy'
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
