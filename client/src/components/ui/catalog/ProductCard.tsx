'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/Carousel';
import AddToCardButton from '@/app/(root)/product/[id]/productInfo/AddToCardButton';
import FavoriteButton from '@/app/(root)/product/[id]/productInfo/FavoriteButton';
import { PUBLIC_URL } from '@/config/url.config';
import { generateImgPath } from '@/utils/imageUtils';
import { ProductCardInfo } from './ProductCardInfo';
import { GetProductWithDetails } from '@/generated/orval/types';
import { useCart } from '@/hooks/queries/useCart';
import CartActions from '@/components/layouts/mainLayout/header/headerMenu/headerCart/CartActions';

interface ProductCardProps {
  product: GetProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { orderItems } = useCart();
  const isProductInCard = orderItems.find((p) => p.product.id === product.id);

  useEffect(() => {
    if (!carouselApi) return;

    const updateIndex = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    updateIndex();
    carouselApi.on('select', updateIndex);

    return () => {
      carouselApi.off('select', updateIndex);
    };
  }, [carouselApi]);

  return (
    <div className='group border-shop-dark-green/15 relative flex flex-col rounded-md border bg-white text-xs xs:text-sm'>
      <div className='group bg-shop_light_bg relative overflow-hidden'>
        <Carousel setApi={setCarouselApi}>
          <CarouselContent>
            {product.images.map((image) => (
              <CarouselItem key={image}>
                <Link href={PUBLIC_URL.product(product.id)}>
                  <Image
                    src={generateImgPath(image)}
                    alt={product.title}
                    width={300}
                    height={300}
                    className='bg-shop-light-bg h-40 w-full object-contain p-1 transition-transform duration-500 group-hover:scale-105 xs:h-32 sm:h-64 xs:p-2'
                    loading='lazy'
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Контент */}
      <div className='flex flex-1 flex-col gap-0 p-2 xs:p-3'>
        <div className='mb-1 xs:mb-2'>
          <ProductCardInfo
            product={product}
            carouselApi={carouselApi}
            activeIndex={activeIndex}
          />
        </div>

        {/* CTA у дна карточки */}
        <div className='mt-auto flex items-start gap-x-1 xs:gap-x-2'>
          {isProductInCard ? (
            <CartActions orderItem={isProductInCard} />
          ) : (
            <AddToCardButton product={product} className='flex-10' />
          )}
        </div>
      </div>

      {/* Favorite */}
      <FavoriteButton
        product={product}
        className='absolute top-1 right-1 xs:top-2 xs:right-2'
        btnVariant='outline'
      />
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   Carousel,
//   CarouselApi,
//   CarouselContent,
//   CarouselItem,
// } from '@/components/ui/Carousel';
// import AddToCardButton from '@/app/(root)/product/[id]/productInfo/AddToCardButton';
// import FavoriteButton from '@/app/(root)/product/[id]/productInfo/FavoriteButton';
// import { PUBLIC_URL } from '@/config/url.config';
// import { generateImgPath } from '@/utils/imageUtils';
// import { ProductCardInfo } from './ProductCardInfo';
// import { GetProductWithDetails } from '@/generated/orval/types';
// import { useCart } from '@/hooks/queries/useCart';
// import CartActions from '@/components/layouts/mainLayout/header/headerMenu/headerCart/CartActions';

// interface ProductCardProps {
//   product: GetProductWithDetails;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const { orderItems, total } = useCart();
//   const isProductInCard = orderItems.find((p) => p.product.id === product.id);

//   useEffect(() => {
//     if (!carouselApi) return;

//     const updateIndex = () => {
//       setActiveIndex(carouselApi.selectedScrollSnap());
//     };

//     updateIndex();

//     carouselApi.on('select', updateIndex);

//     return () => {
//       carouselApi.off('select', updateIndex);
//     };
//   }, [carouselApi]);

//   return (
//     <div className='group border-shop-dark-green/15 relative flex flex-col rounded-md border bg-white text-sm'>
//       <div className='group bg-shop_light_bg relative overflow-hidden'>
//         <Carousel setApi={setCarouselApi}>
//           <CarouselContent>
//             {product.images.map((image) => (
//               <CarouselItem key={image}>
//                 <Link href={PUBLIC_URL.product(product.id)}>
//                   <Image
//                     src={generateImgPath(image)}
//                     alt={product.title}
//                     width={300}
//                     height={300}
//                     className='bg-shop-light-bg h-64 w-full overflow-hidden rounded-t-[6px] object-contain p-2 transition-transform duration-500 group-hover:scale-105'
//                     priority
//                   />
//                 </Link>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//         </Carousel>
//       </div>
//       <div className='flex flex-1 flex-col gap-0 p-3'>
//         <div className='mb-2'>
//           <ProductCardInfo
//             product={product}
//             carouselApi={carouselApi}
//             activeIndex={activeIndex}
//           />
//         </div>
//         <div className='mt-auto flex items-start gap-x-2'>
//           {isProductInCard ? (
//             <CartActions orderItem={isProductInCard} />
//           ) : (
//             <AddToCardButton product={product} className='flex-10' />
//           )}
//         </div>
//       </div>
//       <FavoriteButton product={product} className='absolute top-2 right-2' btnVariant='outline' />
//     </div>
//   );
// }
