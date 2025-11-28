import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { generateImgPath } from '@/utils/imageUtils';
import { cn } from '@/utils/common';
import { GetProductWithDetails } from '@/generated/orval/types';

export interface ProductGalleryProps {
  product: GetProductWithDetails;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className='w-full space-y-2 md:space-y-4'>
      <div className='group col-span-2 w-full place-items-center rounded-none bg-neutral-100 sm:rounded-2xl xl:col-span-1'>
        <Image
          src={generateImgPath(product.images[currentIndex])}
          alt={product.title}
          width={300}
          height={300}
          className='hoverEffect h-96 max-h-[550px] min-h-[500px] w-full rounded-md object-contain group-hover:scale-110'
          priority
        />
      </div>
      <div className='mt-6 flex gap-6'>
        {product.images.map((image, index) => (
          <Button
            key={index}
            variant='outline'
            className={cn(
              'group h-[100px] w-[100px] overflow-hidden rounded-lg border duration-300 hover:border-gray-200 hover:bg-inherit',
              currentIndex === index ? 'border-gray-300' : 'border-transparent'
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={generateImgPath(image)}
              alt={product.title}
              width={100}
              height={100}
              className='hoverEffect h-[100px] w-[100px] object-contain group-hover:scale-110'
              priority
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
