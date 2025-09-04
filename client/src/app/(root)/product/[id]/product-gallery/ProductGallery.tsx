import { Button } from '@/components/ui/Button';
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
      <Image
        src={product.images[currentIndex]}
        alt={product.title}
        width={500}
        height={500}
        className='rounded-lg w-[500px] h-[500px]'
      />
      <div className='mt-6 flex gap-6'>
        {product.images.map((image, index) => (
          <Button
            key={index}
            variant='outline'
            className={cn(
              'overflow-hidden rounded-lg border duration-300 w-[100px] h-[100px] hover:bg-inherit hover:border-gray-200',
              currentIndex === index ? 'border-gray-300' : 'border-transparent'
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={image}
              alt={product.title}
              width={100}
              height={100}
              className='w-[100px] h-[100px] object-contain'
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
